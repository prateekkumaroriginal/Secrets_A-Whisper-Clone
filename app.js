require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB").then(() => {
    console.log('connnected');
}).catch((err) => {
    console.log(err);
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ['password'] })

const User = mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        User.create({
            email: req.body.username,
            password: req.body.password
        }).then(() => {
            res.render("secrets")
        }).catch((err) => {
            console.log(err);
        })
    })

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        User.findOne({ email: req.body.username }).then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === req.body.password) {
                    res.render("secrets")
                } else {
                    console.log('Invalid Credentials');
                }
            } else {
                console.log(`No user found with email: ${req.body.username}`);
            }
        }).catch((err) => {
            console.log(err);
        })
    })

app.listen(3000, () => {
    console.log("Server running in http://127.0.0.1:3000");
});