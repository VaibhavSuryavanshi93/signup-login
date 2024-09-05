require('dotenv').config();
const md5 = require("md5")
const express = require("express");
const bodyParser = require("body-parser"); 
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption")

// console.log(md5("hash"));

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/yourDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String,
});
 

// userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});
const User = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/secrets", (req, res) => {
    res.render("secrets");
});

app.get("/submit", (req, res) => {
    res.render("submit");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser
        .save()
        .then(() => {
            res.render("secrets");
        })
        .catch((err) => {
            res.send(err);
        });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);

  try {
    const foundUser = await User.findOne({ email: username });
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        res.status(401).send("Incorrect password");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});


app.listen(3000, () => {
    console.log("server started on port 3000");
});
