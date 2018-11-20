const Knex = require("knex");
const express = require('express');
const app = express();
const Model = require("objection").Model;
const knexConfig = require("./knexfile");
const bodyParser = require('body-parser');

/*
const router = express.Router();
const userRoutes = require('./routes/user');
userRoutes.userRoutes(app);
*/
//TODO : fix routing

var onlineUsersList = [];

const session = require('express-session')
app.use(session({
    secret: 'alleycat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'))
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


// use the driver and connect locally to mysql
const knex = Knex(knexConfig.development);
Model.knex(knex);
const db = {
    "knex": knex,
    "users": require("./models/Users"),
    "messages": require("./models/Messages")
};


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index/index.html")
});

app.get("/freshfruit", function (req,res){
    //console.log("Inside freshfruit endpoint")
    //console.log(req.session.isLoggedIn)
    if(req.session.isLoggedIn){
        //console.log(__dirname + "/public/freshFruit/freshFruit.html")
        res.sendFile(__dirname + "/public/freshFruit/freshFruit.html");
    }else{
        res.send('not logged in redirect');
    }
});
/*
app.get("/bananachat", function (req,res){
    res.sendFile(__dirname + "/public/bananachat/bananachat.html");
});

app.get("/bunchofgrapes", function (req,res){
    res.sendFile(__dirname + "/public/bunchofgrapes/bunchofgrapes.html");
});
*/
io.on('connect', socket => {

    db.messages.query().select().where({"room_id": 1}).then(messageArray => {
        //console.log(messageArray);
        
        messageArray.forEach(element => {
            db.users.query().select({"username": "username"}).where({"id": element.user_id}).then(userArray => {
                //console.log(userArray);
                //socket.emit('fruit-chat',{"user_name": userName, "message": $("#text-input").val()}) 
                socket.emit('fruit-chat', {"user_name": userArray[0].username, "message": element.message_text});
                //console.log({"user": userArray[0].username, "message": element.message_text});
                //console.log("updated array during: " + updateArray);
            });
            
        });
    });
    //io.emit('userlist',  onlineUsersList);
    onlineUsersList.forEach(element => {
        socket.emit('userjoin', {"username" : element});
    });
    




    socket.on('fruit-chat', data => {
        // emits to all the sockets
        //console.log("got a fruit-chat message");
        //console.log(data);
        //db.users.query().select({ password: "password"}).where({"username": enteredUsername}).then(userArray => {
        db.users.query().select({"id": "id"}).where({"username": data.user_name}).then(userArray => {
            //console.log("userArray: " + userArray);
            //const userId = userArray[0].id;
            //console.log("user_id " + userId);
            db.messages.query().insert({ "message_text": data.message, "user_id": userArray[0].id, "room_id": 1, "timestamp": new Date() }).then(persistedData => {
                //console.log(persistedData);
            }).then(() => {
            io.emit("fruit-chat", data);
            });
        });

        //socket.on('users-oline', data => {
        
        //})
    })
})

//routing ->

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post("/signup", function (req, res) {
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;

    if (enteredUsername && enteredPassword) {

        //console.log('query db -> username:' + enteredUsername + " password -> " + enteredPassword) 
        // Herunder kan man bruge shorthand hvor man kun skriver password, hvis kollonen hedder password
        db.users.query().select({ password: "password"}).where({"username": enteredUsername}).then(userArray => {
            //console.log("userarray", userArray);
            if (userArray.length > 0) {
                //console.log("entered pass: ", enteredPassword);
                //console.log("pass from userarray: ", userArray[0]);

                bcrypt.compare(enteredPassword, userArray[0].password).then(response => {
                    if(response) {
                        req.session.isLoggedIn = true;
                        //console.log("ses" + req.session.isLoggedIn);

                        onlineUsersList.push(enteredUsername);
                        //console.log(onlineUsersList);
                        io.emit("userjoin", {"username": enteredUsername});

                        res.json({"response":"Logged In"});
                    } else {
                        res.json({"response":"Not loggedin"});
                    }
                });
                
            } else {
                bcrypt.hash(enteredPassword, saltRounds).then(function(hash) {
                    db.users.query().insert({ "username": enteredUsername, "password": hash }).then(persistedData => {
                        //console.log(persistedData);
                        res.json({"response":"User written to db"});
                    });
                });   
            }
        })
    } else {
        res.json({"response":"Not loggedin"});
    }
});

// app.post('/login', (req, res) => {
//     const enteredUsername = req.body.username;
//     const enteredPassword = req.body.password; 

//     db.users.query().select().where({email}).then(userArray => {
//         if (userArray.length > 0) {
//             bcrypt.compare(enteredPassword, userArray[0].password).then(response => {
//                 if(response) {
//                     req.session.isLoggedIn = true;
//                     console.log("ses" + req.session.isLoggedIn);
//                     res.redirect('/freshfruit');
//                 }
//                 res.send({ "status": 403, "response": "unauthorized"})
//             })
//         }     
//     })
// });

app.post('/logout', (req,res) => {
    req.session.destroy();
    var index = onlineUsersList.indexOf(req.body.username);
    if (index > -1) {
        onlineUsersList.splice(index, 1);
    }
    console.log(onlineUsersList);
    //io.emit('userlist', onlineUsersList);
    console.log(req.body.username);
    io.emit('userquit', {"username" : req.body.username});
    res.redirect("/");
});


server.listen(3000, function (err) {
    if (err) throw err;

    console.log("the server is running");
});