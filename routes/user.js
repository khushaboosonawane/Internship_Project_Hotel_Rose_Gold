var express=require("express")
var route=express.Router()
var exe=require("./connection")
var upload=require("express-fileupload")
var app=express()

app.use(upload())
app.use(express.static("public"))

route.get('/',async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var slider_data=await exe(`select * from slider`);
    var about_data=await exe(`select * from about`);
    var home_room_data=await exe(`select * from rooms_and_sweets`);
    var extra_service=await exe(`select * from extra_service`);
    var latest_video_data=await exe(`select * from latest_video`);
    var hotel_facility_data=await exe(`select * from hotel_facilites`);
    var test_data=await exe(`select * from testimonial,test_rating where testimonial.test_id=test_rating.rat_id`);
    var hotel_discover_feature=await exe(`select * from hotel_facility_discover`);
    var our_new=await exe(`select * from our_new`);
    var hotel_client=await exe(`select * from hotel_client`)

    // var admin_data=await exe(`select * from admin_data where admin_id="${req.session.ad_id}"`);
    
    res.render("user/home.ejs",{"hotel_data":hotel_data,"slider_data":slider_data,"about_data":about_data,"home_room_data":home_room_data,"extra_service":extra_service,"latest_video_data":latest_video_data,"hotel_facility_data":hotel_facility_data,"test_data":test_data,"hotel_discover_feature":hotel_discover_feature,"our_new":our_new,"hotel_client":hotel_client})
    
    
})
route.get("/about",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var about_data=await exe(`select * from about`);
    var hotel_views=await exe(`select * from hotel_views`)
    var about_dishes=await exe(`select * from dishes`);
    var about_gallery=await exe(`select * from about_gallery`);
    var team_member=await exe(`select * from team_member`);
    res.render("user/about.ejs",{"hotel_data":hotel_data,"about_data":about_data,"hotel_views":hotel_views,"about_dishes":about_dishes,"about_gallery":about_gallery,"team_member":team_member})
})
route.get("/room_details/:room_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var about_data=await exe("select about_description from about");
    var data=await exe(`select * from rooms_and_sweets where room_id="${req.params.room_id}"`);
    res.render("user/room_details.ejs",{"hotel_data":hotel_data,"rooms_data":data,"about_data":about_data});
})
route.get("/metting_events",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var event_hall=await exe(`select * from events_hall`);
    res.render("user/metting_events.ejs",{"hotel_data":hotel_data,"event_hall":event_hall})
})
route.get("/hotel_discover_feature",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    res.render("user/hotel_discover_feature.ejs",{"hotel_data":hotel_data})
})
route.get("/dis_feature_data/:hot_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var dis_fea=await exe(`select * from hotel_facility_discover where hot_id="${req.params.hot_id}"`);
    var  hotel_fea_image=await exe(`select * from hotel_facility_discover_image`)
    res.render("user/dis_feature_data.ejs",{'hotel_data':hotel_data,"dis_fea":dis_fea,"hotel_fea_image":hotel_fea_image});
})
route.get("/facilites",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var hotel_facility_data=await exe(`select * from hotel_facilites`);
    var hotel_discover_feature=await exe(`select * from hotel_facility_discover`);
    res.render("user/facilites.ejs",{"hotel_data":hotel_data,"hotel_facility_data":hotel_facility_data,"hotel_discover_feature":hotel_discover_feature})
})
route.get("/offers",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var special_offer=await exe(`select * from special_offer,special_offer_details where special_offer.special_id=special_offer_details.spd_id`);
    var offer_data=await exe(`select * from offer,offer_details where offer.offer_id=offer_details.offer_det_id`)
    res.render("user/offers.ejs",{"hotel_data":hotel_data,"special_offer":special_offer,"offer_data":offer_data});
})
route.get("/blog",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var hotel_client=await exe(`select * from hotel_client`);
    var blog_data=await exe("select * from blog");
    res.render("user/blog.ejs",{"hotel_data":hotel_data,"hotel_client":hotel_client,"blog_data":blog_data})
})
route.get("/our_team",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var hotel_owner_data=await exe(`select * from hotel_owner`);
    var team_member=await exe("select * from team_member");
    res.render("user/our_team.ejs",{"hotel_data":hotel_data,"hotel_owner_data":hotel_owner_data,"team_member":team_member})
})
route.get("/terms_condition",async function(req,res){
    var ter_data=await exe("select * from terms_condition");
    var hotel_data=await exe(`select * from basic_information`);
    res.render("user/terms_condition.ejs",{"hotel_data":hotel_data,"ter_data":ter_data})
})
route.get("/privacy_policy",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var pri_poli_data=await exe("select * from privacy_policy")
    res.render("user/privacy_policy.ejs",{"hotel_data":hotel_data,"pri_poli_data":pri_poli_data})
})
route.get("/bussines_data",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var ami_data=await exe("select * from aminites_facility");
    var why_choose_hotel=await exe(`select * from why_choose_hotel`);
    res.render("user/bussines_data.ejs",{"hotel_data":hotel_data,"ami_data":ami_data,"why_choose_hotel":why_choose_hotel});
})
route.get("/gallery",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var gallery_data=await exe(`select * from about_gallery`);
    var gallery=await exe(`select * from gallery`);
    res.render("user/gallery.ejs",{"hotel_data":hotel_data,"gallery_data":gallery_data,"gallery":gallery})
})
// route.get("/more_info",async function(req,res){
//     var hotel_data=await exe(`select * from basic_information`);
//     res.render("user/more_info.ejs",{"hotel_data":hotel_data})
// })
route.get("/contact",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var contact_map=await exe("select * from contact_map");
    res.render("user/contact.ejs",{"hotel_data":hotel_data,"contact_map":contact_map})
})
route.get("/rooms",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var room_data=await exe(`select * from rooms`);
    var home_room_data=await exe(`select * from rooms_and_sweets`);
    res.render("user/rooms.ejs",{"hotel_data":hotel_data,"room_data":room_data,"home_room_data":home_room_data})
})
route.get("/foods_wine",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var food_data=await exe(`select * from food`);
    var about_dishes=await exe(`select * from dishes`);
    var wines_data=await exe(`select * from wines`);
    res.render("user/foods_wines.ejs",{"hotel_data":hotel_data,"food_data":food_data,"about_dishes":about_dishes,"wines_data":wines_data})
})
route.get("/rewards",async function(req,res){
    var reward_data=await exe("select * from rewards");
    var hotel_data=await exe(`select * from basic_information`);
    res.render("user/rewards.ejs",{"hotel_data":hotel_data,"reward_data":reward_data})
})
route.get("/directory",async function(req,res){
    var starter_data=await exe("select * from starter");
    var salad_data=await exe("select * from salad");
    var wine_data=await exe("select * from wine");
    var breakfast_data=await exe("select * from breakfast")
    var desert_data=await exe("select * from desert");
    var hotel_data=await exe(`select * from basic_information`);
    res.render("user/directory.ejs",{"hotel_data":hotel_data,"starter_data":starter_data,"salad_data":salad_data,"wine_data":wine_data,"breakfast_data":breakfast_data,"desert_data":desert_data})
})
// route.get("/dining",async function(req,res){
//     var hotel_data=await exe(`select * from basic_information`);
//     res.render("user/dining.ejs",{"hotel_data":hotel_data});
// })
route.get("/career",async function(req,res){
    var career_data=await exe("select * from career")
    var hotel_data=await exe(`select * from basic_information`);
    res.render("user/career.ejs",{"hotel_data":hotel_data,"career_data":career_data})
})
route.get("/special_offer_details/:special_id/:spd_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var sql=`select * from special_offer,special_offer_details where special_offer.special_id="${req.params.special_id}" and  special_offer_details.spd_id="${req.params.spd_id}"`;
    var data=await exe(sql);
    res.render("user/special_offer_details.ejs",{"hotel_data":hotel_data,"special_offer_data":data})
})
route.get("/book_special_offer/:special_id/:spd_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var booking_data=await exe(`select * from special_offer,special_offer_details where special_offer.special_id="${req.params.special_id}" and  special_offer_details.spd_id="${req.params.spd_id}"`)
    var data="Hall Book Success Fully"
    res.render("user/book_special_offer.ejs",{"hotel_data":hotel_data,"booking_data":booking_data,data});
})
route.post("/save_special_offer_client",async function(req,res){
    var sql=`insert into special_offer_client(client_name,client_email,client_number,client_checkin,client_checkout,hall_price,check_in_status,hall_name) values ("${req.body.client_name}","${req.body.client_email}","${req.body.client_number}","${req.body.client_checkin}","${req.body.client_checkout}","${req.body.hall_price}","pending","${req.body.hall_name}")`;
    var data=await exe(sql)
    res.redirect("/offers")
})
route.get("/book_offer_details/:offer_id/:offer_det_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var sql=`select * from offer,offer_details where offer.offer_id="${req.params.offer_id}" and offer_details.offer_det_id="${req.params.offer_det_id}"`;
    var data=await exe(sql)
    res.render("user/book_offer_details.ejs",{"hotel_data":hotel_data,"offer_data":data});
})
route.get("/book_offer_data/:offer_id/:offer_det_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var offer_data=await exe(`select * from offer,offer_details where offer.offer_id="${req.params.offer_id}" and offer_details.offer_det_id="${req.params.offer_det_id}"`)
    res.render("user/book_offer_data.ejs",{"hotel_data":hotel_data,"offer_data":offer_data})
})
route.post("/save_offer_client_data",async function(req,res){
    var sql=`insert into offer_client_data (offer_client_name,offer_client_email,offer_client_number,client_checkin,client_checkout,offer_hall_name,offer_hall_price,offer_client_status) values ("${req.body.offer_client_name}","${req.body.offer_client_email}","${req.body.offer_client_number}","${req.body.client_checkin}","${req.body.client_checkout}","${req.body.offer_hall_name}","${req.body.offer_hall_price}","pending")`;
    var data=await exe(sql)
    res.redirect("/")
})
route.post("/contact_info",async function(req,res){
    var sql=`insert into contact_info(con_name,con_email,con_phone,con_subject,con_message) values ("${req.body.con_name}","${req.body.con_email}","${req.body.con_phone}","${req.body.con_subject}","${req.body.con_message}")`
    var data=await exe(sql)
    res.send("Your message was sent successfully. ")
})
route.get("/booking",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    res.render("user/booking.ejs",{"hotel_data":hotel_data})
})
route.get("/book_room/:room_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var room_data=await exe(`select * from rooms where room_id="${req.params.room_id}"`)
    res.render("user/book_room.ejs",{"room_data":room_data,"hotel_data":hotel_data})
})
route.post("/save_room_data",async function(req,res){
    var sql=`insert into book_room_data (client_name,client_email,client_number,client_checkin,client_checkout,room_name,room_price,room_size,room_type,book_room_status) values ("${req.body.client_name}","${req.body.client_email}","${req.body.client_number}","${req.body.client_checkin}","${req.body.client_checkout}","${req.body.room_name}","${req.body.room_price}","${req.body.room_size}","${req.body.room_type}","pending")`;
    var data=await exe(sql)
    res.redirect("/rooms")
    
})
route.get("/book_other_room/:room_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var room_sweet_data=await exe(`select * from rooms_and_sweets where room_id="${req.params.room_id}"`);
    res.render("user/book_other_room.ejs",{"room_sweet_data":room_sweet_data,"hotel_data":hotel_data})
})
route.post("/save_other_room_data",async function(req,res){
    var sql=`insert into book_other_room_data (client_name,client_email,client_number,client_checkin,client_checkout,room_name,room_price,room_type,room_status) values ("${req.body.client_name}","${req.body.client_email}","${req.body.client_number}","${req.body.client_checkin}","${req.body.client_checkout}","${req.body.room_name}","${req.body.room_price}","${req.body.room_type}","pending")`;
    var data=await exe(sql)
    res.redirect("/rooms")
})
route.get("/book_metting_events/:event_hall_id",async function(req,res){
    var event_hall_data=await exe(`select * from events_hall where event_hall_id="${req.params.event_hall_id}"`);
    var hotel_data=await exe(`select * from basic_information`);
    var contact_map=await exe(`select * from contact_map`)
    res.render("user/book_metting_events.ejs",{"hotel_data":hotel_data,"event_hall_data":event_hall_data,"contact_map":contact_map})
})
route.post("/save_event_hall_data",async function(req,res){
    var sql=`insert into book_event_hall (client_name,client_email,client_number,client_checkin,client_checkout,hall_name,hall_price,hall_status) values ("${req.body.client_name}","${req.body.client_email}","${req.body.client_number}","${req.body.client_checkin}","${req.body.client_checkout}","${req.body.hall_name}","${req.body.hall_price}","pending")`;
    var data=await exe(sql)
    res.redirect("/metting_events");
})
route.get("/order_food_data/:dis_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var order_data=await exe(`select * from dishes where dis_id="${req.params.dis_id}"`);
    var contact_map=await exe(`select * from contact_map`);
    res.render("user/order_food_data.ejs",{"hotel_data":hotel_data,"order_data":order_data,"contact_map":contact_map})
})
route.post("/save_order_food_data",async function(req,res){
    var date=new Date().getDate();
    var month=parseInt(new Date().getMonth()+1);
    var year=new Date().getFullYear();
    var date_obj=date+"/"+month+"/"+year;
    var time_obj=new Date().toLocaleTimeString();
    var sql=`insert into order_food_data (client_name,client_email,client_number,dish_name,dish_price,order_status,order_date,order_time,quantity) values ("${req.body.client_name}","${req.body.client_email}","${req.body.client_number}","${req.body.dish_name}","${req.body.dish_price}","pending","${date_obj}","${time_obj}","${req.body.quantity}")`;
    var data=await exe(sql)
    res.redirect("/foods_wine")
})
route.get("/book_wines/:wines_id",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var wine_data=await exe(`select * from wines where wines_id="${req.params.wines_id}"`);
    var contact_map=await exe('select * from contact_map');
    res.render("user/book_wines.ejs",{"wine_data":wine_data,"hotel_data":hotel_data,"contact_map":contact_map})
})
route.post("/save_wines_data",async function(req,res){
    var date=new Date().getDate();
    var month=parseInt(new Date().getMonth()+1);
    var year=new Date().getFullYear();
    var date_obj=date+"/"+month+"/"+year;
    var time_obj=new Date().toLocaleTimeString();
    var sql=`insert into order_wine_data (client_name,client_email,client_number,wines_name,wines_price,quantity,wine_status,order_date,order_time) values ("${req.body.client_name}","${req.body.client_email}","${req.body.client_number}","${req.body.wines_name}","${req.body.wines_price}","${req.body.quantity}","pending","${date_obj}","${time_obj}")`;
    var data=await exe(sql)
    res.redirect("/foods_wine")
})
route.get("/faq",async function(req,res){
    var hotel_data=await exe(`select * from basic_information`);
    var faq_data=await exe(`select * from faq`)
    res.render("user/faq.ejs",{"hotel_data":hotel_data,"faq_data":faq_data});
})


module.exports=route;

// create table order_wine_data(cli_id integer primary key auto_increment,client_name varchar(10000),client_email varchar(20000),client_number varchar(11),wines_name  text,wines_price decimal,quantity integer,wine_status text,order_date varchar(20000),order_time text)

// create table order_food_data(cli_id integer primary key auto_increment,client_name varchar(50000),client_email varchar(50000),client_number varchar(11),dish_name text,dish_price decimal,order_status varchar(3000),order_date varchar(30000),order_time varchar(300000)) 

// create table book_event_hall(cli_id integer primary key auto_increment,client_name varchar(30000),client_email varchar(30000),client_number varchar(11),client_checkin varchar(2000),client_checkout varchar(2000),hall_name text,hall_price decimal,hall_status varchar(30000)) 

// create table book_other_room_data(room_id integer primary key auto_increment,client_name varchar(30000),client_email varchar(30000),client_number varchar(11),client_checkin varchar(2000),client_checkout varchar(2000),room_name varchar(30000),room_price decimal,room_type varchar(30000),room_status)

// create table book_room_data(cli_id integer primary key auto_increment,client_name varchar(3000),client_email varchar(3000),client_number varchar(11),client_checkin varchar(3000),client_checkout varchar(3000),room_name text,room_price decimal,room_size varchar(40000),room_type text,book_room_status text)

// create table contact_info(con_id integer primary key auto_increment,con_name varchar(30000),con_email varchar(3000),con_phone varchar(11),con_subject varchar(3000),con_message text)


// alter table offer_client_data add column offer_client_status varchar(30000);
// create table offer_client_data (offer_client_id integer primary key auto_increment,offer_client_name varchar(30000),offer_client_email varchar(30000),offer_client_number varchar(11),client_checkin varchar(20000),client_checkout varchar(40000),offer_hall_name text,offer_hall_price decimal)

// create table special_offer_client(cli_id integer primary key auto_increment,client_name varchar(20000),client_email varchar(50000),client_number varchar(11),client_checkin varchar(1000),client_checkout varchar(2000),hall_price decimal,check_in_status varchar(10000),hall_name varchar(1000),hall_name text);