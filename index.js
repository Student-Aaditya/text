// const express=require("express");
// const app=express();
// const port=7040;
// const path=require("path");

// app.set("views",path.join(__dirname,"view"));
// app.set("view engine","ejs");
// app.use(express.static(path.join(__dirname, "public")));

// app.get("/",(req,res)=>{
//     res.render("index.ejs");
//     // res.send("hello");
// })

// app.listen(port,(req,res)=>{
//     console.log(`server working on ${port}`);
// })
//Export the Express API


if(process.env.NODE_ENV!="Production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const passport=require("passport");
const Users=require("./Model/user.js");
const localStrategy=require("passport-local");
const session=require("express-session");
const flash=require("connect-flash");
const MongoStore = require("connect-mongo");
const port=7040;
app.set("views",path.join(__dirname,"view"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

main().
    then(() => {
        console.log("connection successful");
    }).catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/signup1");
}

const store=MongoStore.create({
    mongoUrl:"mongodb://127.0.0.1:27017/signup1",
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo store",err);
});

const sessionOption = ({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
})

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


app.get("/",(req,res)=>{
    try{
    res.render("index.ejs",{msg:req.flash("success")});
    }catch (error) {
        res.status(500).send("Internal Server Error");
      }
});

app.post("/",async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newusers= new Users({email,username});
    const regist=await Users.register(newusers,password);
    req.flash("success","successful register");
    console.log(regist);
    res.redirect("/");
    }catch (error) {
        res.status(500).send("Internal Server Error");
      }
})


app.listen(port,(req,res)=>{
    console.log(`server working on ${port}`);
});

module.exports=app
