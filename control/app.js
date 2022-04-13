const express=require("express");
const app=express();


//homepage
app.get("/",(req,res)=>{
    res.send("You are on the homepage.")
})



//login
app.get("/login",(req,res)=>{
    res.render("Login.ejs");
})

app.listen(3000,()=>{
    console.log("Sever is running on port 3000")
})