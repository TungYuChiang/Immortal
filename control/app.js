const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
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
    sudo: String,
});
//create a model for 信眾(believers)
const believer = mongoose.model("believer", Schema);

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


app.set("view engine", "ejs");

app.use(express.static('public'));

//homepage
app.get("/", (req, res) => {
    res.render("index", { user: null });
})

//register
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/regSuccess", (req, res) => {
    let { account, password, name, birth, zodiac, age, sex, address, offend, sudo } = req.body;
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
    res.render("regsuccess.ejs");
})

//login
app.get("/login", (req, res) => {
    res.render("Login");
})
//login request
app.post("/login", async (req, res) => {
    let { email, password } = req.body;//把user送過來的資料抓下來
    user = await believer.findOne({ account: email, password: password }) //去Database找有沒有這個人
    console.log(user);
    if (user) {
        res.render("index", { user: user });//導回首頁
    } else {
        res.status(404).send("登入失敗")
    }
})

//管理者管理系統
app.get("/administrator",async(req,res)=>{
    members = await believer.find();//獲取所有會員資料
    res.render("administrator",{members:members,user:user});//顯示會員管理系統並把user、menber(所有會員)傳入
    console.log(members);
})
app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));

