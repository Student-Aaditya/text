const express=require("express");
const app=express();
const port=7040;

app.set("views",path.join(__dirname,"view"));
app.set("view engine","ejs");

app.get("/",(Req,res)=>{
    res.render("index.ejs");
})

app.listen(port,(req,res)=>{
    console.log(`server working on ${port}`);
})
//Export the Express API
module.exports=app