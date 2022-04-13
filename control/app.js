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

app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));

