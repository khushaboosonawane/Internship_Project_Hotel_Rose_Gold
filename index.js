var express=require("express")
var bodyparser=require("body-parser")
var flash = require('express-flash');
var upload=require("express-fileupload")
var userRoute=require("./routes/user")
var loginRoute=require("./routes/login")
var adminRoute=require("./routes/admin")
var session=require("express-session")



var app=express()
app.use(bodyparser.urlencoded({extended:true}))
app.use(session({
    secret:"asdfg",
    resave:true,
    saveUninitialized:true,
}))
app.use(upload())
app.use(express.static("public"))
app.use(flash())
app.use("/",userRoute)
app.use("/login",loginRoute)
app.use("/admin",adminRoute)

app.listen(1000)

