exports.userRoutes = function(app) {

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post("/signup", function (req, res) {
    console.log(req.body);
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;

    if (enteredUsername && enteredPassword) {

        console.log('query db -> username:' + enteredUsername + " password -> " + enteredPassword) 
        // Herunder kan man bruge shorthand hvor man kun skriver password, hvis kollonen hedder password
        db.users.query().select({ password: "password"}).where({"username": enteredUsername}).then(userArray => {
            console.log(userArray);
            if (userArray.length > 0) {
                console.log(enteredPassword);
                console.log(userArray[0]);

                if (enteredPassword === userArray[0].password) {
                    req.session.isLoggedIn = true;
                    //myCookie = req.session.isLoggedIn;
                    console.log(req.session.isLoggedIn)
                    res.json({"response":"Logged In"});
                }
                res.json({"response":"Not loggedin"});
                
            } else {
                // Man kan bruge .wherenotexists

                bcrypt.hash(enteredPassword, saltRounds).then(function(hash) {
                    db.users.query().insert({ "username": enteredUsername, "password": enteredPassword }).then(persistedData => {
                        console.log(persistedData);
                        res.json({"response":"User written to db"}); //skal ny bruger ikke også logges ind?
                    });
                });   
            }
        })
    }
    res.json({"response":"Not loggedin"});
    
});

app.post('/login', (req, res) => {
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password; 

    db.users.query().select().where({email}).then(userArray => {
        if (userArray.length > 0) {
            bcrypt.compare(enteredPassword, userArray[0].password).then(response => {
                if(response) {
                    req.session.isLoggedIn = true;
                    console.log("ses" + req.session.isLoggedIn);
                    res.redirect('/freshfruit');
                }
                res.send({ "status": 403, "response": "unauthorized"});
            })
        }
        //username not found?     
    })
});

app.get('/logout', (req,res) => {

    req.session.destroy();
    res.redirect('/');

});


    /* old user.js
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    app.post("/signup", function (req, res) {

        const enteredUsername = req.body.username;
        const enteredPassword = req.body.password;

        if (enteredUsername && enteredPassword) {

            console.log('query db -> username:' + enteredUsername + " password -> " + enteredPassword) 
            // Herunder kan man bruge shorthand hvor man kun skriver password, hvis kollonen hedder password
            db.users.query().select({ password: "password"}).where({"username": enteredUsername}).then(userArray => {
                console.log(userArray);
                if (userArray.length > 0) {
                    console.log(enteredPassword);
                    console.log(userArray[0]);
    
                    if (enteredPassword === userArray[0].password) {
                        console.log("DU ER LOGGET IND");
                    } else {
                        console.log("FORKERT PASSWORD!");
                    }
                } else {
                    // Man kan bruge .wherenotexists

                    bcrypt.hash(enteredPassword, saltRounds).then(function(hash) {
                        db.users.query().insert({ "username": username, "password": password }).then(persistedData => {
                            console.log(persistedData);
                        });
                    });   
                }
            })
        } else {
            console.log('fail')
        }
    });

    app.post('/login', (req, res) => {
        const enteredUsername = req.body.username;
        const enteredPassword = req.body.password; 

        db.users.query().select().where({email}).then(userArray => {
            if (userArray.length > 0) {
                bcrypt.compare(enteredPassword, userArray[0].password).then(response => {
                    if(response) {
                        req.session.isLoggedIn = true;
                        res.redirect('/forbidden');
                    }
                    res.send({ "status": 403, "response": "unauthorized"})
                })
            }     
        })
    });

    app.get('/logout', (req,res) => {

    });
*/
}