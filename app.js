const Knex = require("knex");
const express = require('express');
const app = express();
const Model = require("objection").Model;
const knexConfig = require("./knexfile");
const bodyParser = require('body-parser');

const session = require('express-session')
//app.use(session({
//    cookie: 
//}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'))

// use the driver and connect locally to mysql
const knex = Knex(knexConfig.development);
Model.knex(knex);
const db = {
    "knex": knex,
    "users": require("./models/Users")
};

const userRoutes = require('./routes/user');
userRoutes.userRoutes(app);


app.get("/", function (req, res) {
    res.send('Index')
});

app.get("/freshfruit", function (req,res){
    res.sendFile(__dirname + "/public/freshfruit/freshfruit.html");
});

app.get("/bananachat", function (req,res){
    res.sendFile(__dirname + "/public/bananachat/bananachat.html");
});

app.get("/bunchofgrapes", function (req,res){
    res.sendFile(__dirname + "/public/bunchofgrapes/bunchofgrapes.html");
});

app.listen(3000, function (err) {
    if (err) throw err;

    console.log("the server is running");
})

