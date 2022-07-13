const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
//define a schema
const Schema = new mongoose.Schema({
    account: String,
    password: String,
    name: String,
    birth: String,
    zodiac: String,
    age: Number,
    sex: String,
    address: String,
    state: String,
    offend: Boolean,
    sudo: String,
    record: Array,
});
//create a model for 信眾(believers)
const believer = mongoose.model("believer", Schema);

//此行為middleware 代表必定會被執行
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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
app.get("/homepage_login", (req, res) => {
    res.render("index", { user: user });
})

//register
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/regSuccess", async (req, res) => {
    let { account, password, name, birth, zodiac, age, sex, address, offend, sudo } = req.body;
    //將抓過來的檔案及合成一個data
    try {
        //把密碼加密
        const hash = await bcrypt.hash(password, 10);//參數10代表密碼學中的salt，意思是要在加密的字串中加特定的字符，數字越大salt次數越多越安全相對的時間越長
        req.body.password = hash;
    } catch (e) {
        console.log(e);
        res.status(400).send("Something is broken");
    }
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
    console.log(req.body)
    user = await believer.findOne({ account: email }) //去Database找有沒有這個人
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password)//檢查加密後的密碼有沒有一樣，會回傳True或False
        if (isMatch == true) {
            res.status(200).render("index", { user: user });//登入成功導回首頁
        } else {
            res.status(400).send("帳號或密碼錯誤");
        }
    } else {
        res.status(404).send("請先註冊");
    }
});

//管理者管理系統
app.get("/administrator", async (req, res) => {
    members = await believer.find();//獲取所有會員資料
    res.render("administrator", { members: members, user: user });//顯示會員管理系統並把user、menber(所有會員)傳入

})

//列印光明燈
app.post("/printer", async (req, res) => {
    console.log("接收到post方法")
    console.log(req.body.values)
    res.render("printer", { values: req.body.values });
})
app.get("/printer", async (req, res) => {
    console.log("接收到get方法")
    console.log(req.body.values)
    res.render("printer", { values: req.body.values });
})

//edit
app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    //console.log(id);
    believer.findById(id)
        .then(result => {
            res.render("edit", { owner: result, user: user });
        })
        .catch(err => {
            console.log(err);
        });
})

app.post("/editsuccess/:id", async (req, res) => {
    try {
        let { account, password, name, address, state, record } = req.body;
        year = new Date().getFullYear();
        try {
            //把密碼加密
            const hash = await bcrypt.hash(password, 10);//參數10代表密碼學中的salt，意思是要在加密的字串中加特定的字符，數字越大salt次數越多越安全相對的時間越長
            req.body.password = hash;
        } catch (e) {
            console.log(e);
            res.status(400).send("Something is broken");
        }
        const id = req.params.id;
        if (state == "已繳費") {
            await believer.findByIdAndUpdate(id, { $addToSet: { "record": year } });
        }
        await believer.findByIdAndUpdate(id, req.body);
        res.render("editsuccess", { user: user });
    } catch {
        res.status(404);
    }
})

//delete
app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    //console.log(id);
    believer.findById(id)
        .then(result => {
            res.render("delete", { owner: result, user: user });
        })
        .catch(err => {
            console.log(err);
        });
})

app.post("/delsuccess/:id", async (req, res) => {
    const id = req.params.id;
    await believer.findByIdAndDelete(id);
    res.render("delsuccess", { user: user });
})

//光明燈
app.get("/light", async (req, res) => {
    res.render("light", { user: user });
})


app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));