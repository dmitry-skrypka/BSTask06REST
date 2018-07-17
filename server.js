const express = require('express');
const app = express();
var http = require("http").Server(app);
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose');
const UserModel = require('./models/users');
const MessageModel = require('./models/messages');
var messages = [];

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true});





    app.use(express.static(path.join(__dirname, '/public')));


    app.get("/", function (req, res) {
        res.sendFile(__dirname + "/public/index.html");
    });

    app.get("/script.js", function (req, res) {
        res.sendFile(__dirname + "/script.js");
    });

    app.get("/style.css", function (req, res) {
        res.sendFile(__dirname + "/style.css");
    });

    app.get('/messages', (req, res) => {
        res.json(messages);
    });

    app.post('/messages', (req, res) => {
        messages.push(req.body);
    });

app.post('/login', async (req, res) => {
    console.log(req);
    console.log(req.username)
    try {
        let user = await UserModel.findOneAndUpdate({username: req.body.username, name: req.body.name}, req.name, {
            new: true,
            upsert: true
        }, function (err, user) {



        });
        // console.log('memem')


        res.status(200).send({message:"User Login success"})


    } catch (e) {
        console.log('E, login,', e);
        res.status(500).send({message: 'error'})
    }
});






















    http.listen(7777, function () {
        console.log("Started on :7777");
    });

