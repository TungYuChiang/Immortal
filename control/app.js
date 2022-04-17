const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//此行為middleware 代表必定會被執行
app.use(bodyParser.urlencoded({ extended: true }));

//connect to mongoDB
mongoose
    .connect("mongodb://localhost:27017/Immortal", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB.");
    })
    .catch(err => {
        console.log("Connection Failed.");
        console.log(err);
    });

//define a schema
const Schema = new mongoose.Schema({
    account: String,
    password: String,
    name: String,
    birth: Date,
    zodiac: String,
    age: Number,
    sex: String,
    address: String,
    offend: Boolean,
});
//create a model for 信眾(believers)
const believer = mongoose.model("believer", Schema);

app.set("view engine", "ejs");

app.use(express.static('public'));

//homepage
app.get("/", (req, res) => {
    res.render("index")
})

//register
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/regSuccess", (req, res) => {
    let { account, password, name, birth, zodiac, age, sex, address, offend } = req.body;
    //console.log(req.body);
    res.send("註冊成功!!")
    //將抓過來的檔案及合成一個data
    const data = new believer(req.body);
    //save data to DB
    data.save()
        .then(() => {
            console.log("Successful!");
        })
        .catch((e) => {
            console.log("error");
            console.log(e);
        });
})

//login
app.get("/login", (req, res) => {
    res.render("Login");
})

app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));

