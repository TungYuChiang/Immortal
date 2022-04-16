const express=require("express");
const app=express();

app.set('views', "C:/Users/AS/Desktop/Immortal-1" + '/views');
app.set("view engine", "ejs");

app.use(express.static('public'));

//homepage
app.get("/",(req,res)=>{
    res.render("index")
})



//login
app.get("/login",(req,res)=>{
    res.render("Login");
})

app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));

