const express=require("express");
const app=express();

app.set("view engine", "ejs");

app.use(express.static('public'));

//homepage
app.get("/",(req,res)=>{
    res.sendFile("index.html");
})



//login
app.get("/login",(req,res)=>{
    res.render("Login.ejs");
})

app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));

