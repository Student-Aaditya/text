const express=require("express");
const app=express();
const port=7040;

app.get("/",(Req,res)=>{
    res.send("hello");
})

app.listen(port,(req,res)=>{
    console.log(`server working on ${port}`);
})
//Export the Express API
module.exports=app