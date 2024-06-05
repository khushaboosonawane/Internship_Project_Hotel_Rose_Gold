var express=require("express")
var exe=require("./connection")
var route=express.Router()

route.get("/",async function(req,res){
    var successMessage = req.flash('success')[0];
    res.render("login/login.ejs")
})
route.post("/check_admin",async function(req,res){
    var sql=`select * from admin_data where admin_email="${req.body.admin_email}" and admin_password="${req.body.admin_password}"`;
    var data=await exe(sql)
    if(data.length>0){
        req.session["ad_id"]=data[0].ad_id;
        req.flash('success', ` ${data[0].admin_name} Login successful...`);
        res.redirect("/admin/")
    }
    else{
        res.redirect("/login")
    }
})
route.get("/forgot_password",async function(req,res){
    var successMessage = req.flash('success')[0];
    res.render("admin/forgot_password.ejs")
})
route.post("/change_pass",async function(req,res){
    var sql=`update admin_data set admin_email="${req.body.admin_email}",admin_password="${req.body.admin_password}" where admin_email="${req.body.admin_email}"`;
    var data=await exe(sql)
    res.redirect("/admin")
})


// create table admin_data(ad_id integer primary key auto_increment,admin_name varchar(3000),admin_mobile varchar(11),admin_email varchar(30000),admin_img text,admin_password varchar(20000),admin_desig);

module.exports=route;