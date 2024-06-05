var express=require("express")
var route=express.Router()
var exe=require("./connection")
var url=require("url");

var fs=require("fs");
const session = require("express-session");

function checkAdminLogin(req, res, next) {
    if (req.session.ad_id == undefined){
        res.redirect("/login");
    }
    if (req.session.ad_id != undefined)
    {
        next()
    }
}

route.get("/",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];

    var special_offer_client=await exe("select * from special_offer_client");
    var cli_id=await exe(`select count(cli_id) from special_offer_client`);
    var hall_price=await exe(`select sum(hall_price) from special_offer_client`);
    var count_value=cli_id[0]["count(cli_id)"];
    var hall_price_total=hall_price[0]["sum(hall_price)"];
    // second table 
    var offer_client_data=await exe("select * from offer_client_data");
    var offer_client_id=await exe(`select count(offer_client_id) from offer_client_data`);
    var offer_client_price=await exe(`select sum(offer_hall_price) from offer_client_data`);
    var offer_cl_count=offer_client_id[0]["count(offer_client_id)"];
    var offer_cl_total=offer_client_price[0]["sum(offer_hall_price)"];

    // thired table 
    var room_data=await exe("select * from book_room_data");
    var room_client_count=(await exe("select count(cli_id) from book_room_data"))[0]["count(cli_id)"];
    var room_price_count=(await exe("select sum(room_price) from book_room_data"))[0]["sum(room_price)"];

    // fourth table 
    var other_room_data=await exe(`select * from book_other_room_data`);
    var other_room_client=(await exe(`select count(room_id) from book_other_room_data`))[0]["count(room_id)"];
    var other_room_sum=(await exe(`select sum(room_price) from book_other_room_data`))[0]["sum(room_price)"];

    // fifth table 

    var metting_hall_data=await exe(`select * from book_event_hall`);
    var metting_hall_client_count=(await exe(`select count(cli_id) from book_event_hall`))[0]["count(cli_id)"]
    var metting_hall_price_sum=(await exe(`select sum(hall_price) from book_event_hall`))[0]["sum(hall_price)"]

    // sixth table 
    var order_food_data=await exe(`select * from order_food_data`);
    var order_client_count=(await exe(`select count(cli_id) from order_food_data`))[0]["count(cli_id)"]
    var order_client_price_total=(await exe(`select sum(dish_price) from order_food_data`))[0]["sum(dish_price)"]

    // fourth table 
    var wine_data=await exe(`select * from order_wine_data`);
    var wine_client=(await exe(`select count(cli_id) from order_wine_data`))[0]["count(cli_id)"];
    var wine_tot_pri=(await exe(`select sum(wines_price) from order_wine_data`))[0]["sum(wines_price)"];

    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
     
    res.render("admin/order.ejs",{successMessage,"special_offer_client":special_offer_client,count_value,hall_price_total,"offer_client_data":offer_client_data,offer_cl_count,offer_cl_total,"room_data":room_data,room_client_count,room_price_count,"other_room_data":other_room_data,other_room_client,other_room_sum,"metting_hall_data":metting_hall_data,metting_hall_client_count,metting_hall_price_sum,"order_food_data":order_food_data,order_client_count,order_client_price_total,"wine_data":wine_data,wine_client,wine_tot_pri,"admin_data":admin_data})
})
route.get("/book_metting_hall_client_data",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var metting_hall_data=await exe(`select * from book_event_hall`)
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/book_metting_hall_client_data.ejs",{successMessage,"metting_hall_data":metting_hall_data,"admin_data":admin_data})
})
route.get("/approve_metting_hall_client/:cli_id/:approve",checkAdminLogin,async function(req,res){
    var sql=`update book_event_hall set hall_status="${req.params.approve}" where cli_id="${req.params.cli_id}"`;
    var data=await exe(sql)
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.redirect("/admin/book_metting_hall_client_data")
})
route.get("/reject_metting_hall_client_data/:cli_id/:reject",checkAdminLogin,async function(req,res){
    var sql=`update book_event_hall set hall_status="${req.params.reject}" where cli_id="${req.params.cli_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/book_metting_hall_client_data")
})
route.get("/delete_metting_hall_client_data/:cli_id",checkAdminLogin,async function(req,res){
    var data=await exe(`delete from book_event_hall where cli_id="${req.params.cli_id}"`);
    res.redirect("/admin/book_metting_hall_client_data")
})
route.get("/approved_client/:cli_id/:approve",checkAdminLogin,async function(req,res){
    var sql=`update special_offer_client set check_in_status="${req.params.approve}" where cli_id="${req.params.cli_id}"`;
    var data=await exe(sql);
    req.flash('success', 'Order Updated successfully!');
    res.redirect("/admin")
})
route.get("/approved_client_reject/:cli_id/:reject",checkAdminLogin,async function(req,res){
    var sql=`update special_offer_client set check_in_status="${req.params.reject}" where cli_id="${req.params.cli_id}"`;
    var data=await exe(sql);
    req.flash('success', 'Order Updated successfully!');
    res.redirect("/admin/special_order_details_data")
})
route.get("/delete_special_offer_client/:cli_id",checkAdminLogin,async function(req,res){
    var sql=`delete from special_offer_client where cli_id="${req.params.cli_id}"`;
    var data=await exe(sql)
    req.flash('success', 'Order Deleted successfully!');
    res.redirect("/admin/special_order_details_data")
})
route.get("/special_order_details_data",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var special_offer_client=await exe("select * from special_offer_client");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/special_order_details_data.ejs",{successMessage,"special_offer_client":special_offer_client,"admin_data":admin_data})
})
route.get("/offer_order_details_data",checkAdminLogin,async function(req,res){
    var offer_client_data=await exe("select * from offer_client_data");
    var successMessage = req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/offer_order_details_data.ejs",{successMessage,"offer_client_data":offer_client_data,"admin_data":admin_data})
})
route.get("/approved_offer_client/:offer_client_id/:approve",checkAdminLogin,async function(req,res){
    var sql=`update offer_client_data set offer_client_status="${req.params.approve}" where offer_client_id="${req.params.offer_client_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/offer_order_details_data")
})
route.get("/approved_offer_client_reject/:offer_client_id/:reject",checkAdminLogin,async function(req,res){
    var sql=`update offer_client_data set offer_client_status="${req.params.reject}" where offer_client_id="${req.params.offer_client_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/offer_order_details_data")
})
route.get("/delete_offer_client_data/:offer_client_id",checkAdminLogin,async function(req,res){
    var sql=`delete from offer_client_data where offer_client_id="${req.params.offer_client_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/offer_order_details_data")
})
route.get("/basic_info",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var sql=`select * from basic_information`;
    var data=await exe(sql);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/basic_info.ejs",{"hotel_data":data,"successMessage":successMessage,"admin_data":admin_data})
})
route.get("/book_room_client_data",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var book_room_data=await exe("select * from book_room_data")
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/book_room_client_data.ejs",{successMessage,"book_room_data":book_room_data,"admin_data":admin_data})
})
route.get("/approved_room_client/:cli_id/:approve",checkAdminLogin,async function(req,res){
    var sql=`update book_room_data set book_room_status="${req.params.approve}" where cli_id="${req.params.cli_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/book_room_client_data")
})
route.get("/reject_room_client_data/:cli_id/:reject",checkAdminLogin,async function(req,res){
    var sql=`update book_room_data set book_room_status="${req.params.reject}" where cli_id="${req.params.cli_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/book_room_client_data")
})
route.get("/delete_order_room_client_data/:cli_id",checkAdminLogin,async function(req,res){
    var data=await exe(`delete from book_room_data where cli_id="${req.params.cli_id}"`);
    res.redirect("/admin/book_room_client_data")

})
route.get("/book_other_room_client_data",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var other_room_data=await exe(`select * from book_other_room_data`);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/book_other_room_client_data.ejs",{successMessage,"other_room_data":other_room_data,"admin_data":admin_data})
})
route.get("/approve_other_room_client/:room_id/:approve",checkAdminLogin,async function(req,res){
    var sql=`update book_other_room_data set room_status="${req.params.approve}" where room_id="${req.params.room_id}"`;
    var data=await exe(sql);
    res.redirect("/admin/book_other_room_client_data")
})
route.get("/reject_other_room_client_data/:room_id/:reject",checkAdminLogin,async function(req,res){
    var sql=`update book_other_room_data set room_status="${req.params.reject}" where room_id="${req.params.room_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/book_other_room_client_data")
})
route.get("/delete_other_room_client_data/:room_id",checkAdminLogin,async function(req,res){
    var sql=`delete from book_other_room_data where room_id="${req.params.room_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/book_other_room_client_data")
})
route.get("/book_order_food_data",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var order_food_data=await exe(`select * from order_food_data`)
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/book_order_food_data.ejs",{successMessage,"order_food_data":order_food_data,"admin_data":admin_data})
})
route.get("/approve_order_food_client/:cli_id/approve",checkAdminLogin,async function(req,res){
    var data=await exe(`update order_food_data set order_status="${req.params.approve}" where cli_id="${req.params.cli_id}"`);
    res.redirect("/admin/book_order_food_data")
})
route.get("/reject_order_food_client_data/:cli_id/:reject",checkAdminLogin,async function(req,res){
    var data=await exe(`update order_food_data set order_status="${req.params.reject}" where cli_id="${req.params.cli_id}"`);
    res.redirect("/admin/book_order_food_data")
})
route.get("/delete_order_food_data/:cli_id",checkAdminLogin,async function(req,res){
    var data=await exe(`delete from order_food_data where cli_id="${req.params.cli_id}"`);
    res.redirect("/admin/book_order_food_data")
})
route.get("/book_wine_data",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var order_wine_data=await exe(`select * from order_wine_data`);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/book_wine_data.ejs",{"order_wine_data":order_wine_data,successMessage,"admin_data":admin_data});
})
route.get("/approve_order_wine_client/:cli_id/:approve",checkAdminLogin,async function(req,res){
    var sql=`update order_wine_data set wine_status="${req.params.approve}" where cli_id="${req.params.cli_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/book_wine_data")
})
route.get("/reject_order_wine_client_data/:cli_id/:reject",checkAdminLogin,async function(req,res){
    var sql=`update order_wine_data set wine_status="${req.params.reject}" where cli_id="${req.params.cli_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/book_wine_data")
})
route.get("/delete_wine_food_data/:cli_id",checkAdminLogin,async function(req,res){
    var data=await exe(`delete from order_wine_data where cli_id="${req.params.cli_id}"`);
    res.redirect("/admin/book_wine_data")
})
route.post("/update_basic_info",checkAdminLogin,async function(req,res){
    if(req.files){
        var image_data=(await exe(`select hotel_logo from basic_information`))[0].hotel_logo;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/website_logo/${image_data}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
        });
    var hotel_logo=new Date().getTime()+req.files.hotel_logo.name;
    req.files.hotel_logo.mv("public/upload_image/website_logo/"+hotel_logo);

    var sql=`update basic_information set hotel_logo='${hotel_logo}',about_title="${req.body.about_title}",about_description="${req.body.about_description}",hotel_address="${req.body.hotel_address}",hotel_contact_number="${req.body.hotel_contact_number}",hotel_email_id="${req.body.hotel_email_id}",instagram_link="${req.body.instagram_link}",twitter_link="${req.body.twitter_link}",youtube_link="${req.body.youtube_link}",facebook_link="${req.body.facebook_link}"`;
    var data=await exe(sql)
    req.flash('success', 'Basic Information Updated successfully!');
    res.redirect("/admin/basic_info");
    }
    else{
        var sql=`update basic_information set about_title="${req.body.about_title}",about_description="${req.body.about_description}",hotel_address="${req.body.hotel_address}",hotel_contact_number="${req.body.hotel_contact_number}",hotel_email_id="${req.body.hotel_email_id}",instagram_link="${req.body.instagram_link}",twitter_link="${req.body.twitter_link}",youtube_link="${req.body.youtube_link}",facebook_link="${req.body.facebook_link}"`;
    var data=await exe(sql)
    req.flash('success', 'Basic Information Updated successfully!');
    res.redirect("/admin/basic_info");

    }
    
})
route.get("/contact_info",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var contact_data=await exe("select * from contact_info");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/contact_info.ejs",{successMessage,"contact_data":contact_data,"admin_data":admin_data})
})
route.get("/delete_all_contact_data",checkAdminLogin,async function(req,res){
    var data=await exe(`truncate table contact_info`);
    res.redirect("/admin/contact_info")
})
route.get("/delete_contact_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var data=await exe(`delete from contact_info where con_id="${urldata.id}"`);
    res.redirect("/admin/contact_info")
})
route.get("/home",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    req.flash('success', 'About Data Updated successfully!');
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/home.ejs",{successMessage,"admin_data":admin_data})
})
route.get("/slider_data",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var sql=`select * from slider`;
    var data=await exe(sql);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/slider_data.ejs",{successMessage,"slider_data":data,"admin_data":admin_data})
})
route.post("/save_slider_data",checkAdminLogin,async function(req,res){
    
    var slider_image=new Date().getTime()+req.files.slider_image.name;
    req.files.slider_image.mv("public/upload_image/slider_image/"+slider_image);

    var sql=`insert into slider (slider_subtitle,slider_maintitle,slider_image) values ("${req.body.slider_subtitle}","${req.body.slider_maintitle}","${slider_image}")`;
    var data=await exe(sql)
    req.flash('success', 'Slider Data Save successfully!');
    res.redirect("/admin/slider_data");
})
route.get("/edit_slider_data/:sli_id",checkAdminLogin,async function(req,res){
    var sql=`select * from slider where sli_id="${req.params.sli_id}"`;
    var data=await exe(sql);
    var successMessage = req.flash('success')[0];
    req.flash('success', 'Slider Data Updated successfully!');
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_slider_data.ejs",{successMessage,"slider_data":data,"admin_data":admin_data});

})
route.post("/update_slider_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var slider_image=(await exe(`select slider_image from slider where sli_id="${req.body.sli_id}"`))[0].slider_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/slider_image/${slider_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
        });
        var slider_image=new Date().getTime()+req.files.slider_image.name;
        req.files.slider_image.mv("public/upload_image/slider_image/"+slider_image);
        var sql=`update slider set slider_subtitle="${req.body.slider_subtitle}",slider_maintitle="${req.body.slider_maintitle}",slider_image="${slider_image}" where sli_id="${req.body.sli_id}"`;
        var data=await exe(sql);
        var updatesuccess=req.flash("updatesuccess")[0];
        req.flash('updatesucess','slider data updated successfully');
        res.redirect("/admin/slider_data")

    }
    else{
        var sql=`update slider set  slider_subtitle="${req.body.slider_subtitle}",slider_maintitle="${req.body.slider_maintitle}" where sli_id="${req.body.sli_id}"`;
        var data=await exe(sql);
        res.redirect("/admin/slider_data")

    }
})
route.get("/delete_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var slider_image=(await exe(`select slider_image from slider where sli_id="${urldata.id}"`))[0].slider_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/slider_image/${slider_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
        });

    var sql=`delete from slider where sli_id="${urldata.id}"`;
    var data=await exe(sql);
    res.redirect("/admin/slider_data");
})

route.get("/about",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var about_data=await exe("select * from about");
    // req.flash('success', 'About Data Updated successfully!');
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/about.ejs",{successMessage,"about_data":about_data,"admin_data":admin_data})
})
route.post("/update_about_data",checkAdminLogin,async function(req,res){

    var about_first_image=(await exe(`select about_first_image from about`))[0].about_first_image;
        const oldFilePath = `public/upload_image/about_images/${about_first_image}`;
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
        });

        var about_second_image=(await exe(`select about_second_image from about`))[0].about_second_image;
        const oldFilePath1 = `public/upload_image/about_images/${about_second_image}`;
        fs.unlink(oldFilePath1, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
        });

    var about_first_image=new Date().getTime()+req.files.about_first_image.name;
    req.files.about_first_image.mv("public/upload_image/about_images/"+about_first_image)

    var about_second_image=new Date().getTime()+req.files.about_second_image.name;
    req.files.about_second_image.mv("public/upload_image/about_images/"+about_second_image)

    var sql=`update about set about_first_image="${about_first_image}",about_second_image="${about_second_image}",about_description="${req.body.about_description}"`;

    var data=await exe(sql);

    req.flash('success', 'About Data Updated successfully!');
    res.redirect("/admin/about");
})
// route.post("/update_about_data",async function(req,res){
//     if(req.files.about_first_image){
//         var about_first_image=(await exe(`select about_first_image from about`))[0].about_first_image;
//                 const oldFilePath = `public/upload_image/about_images/${about_first_image}`;
//                 fs.unlink(oldFilePath, (err) => {
//                     if (err) {
//                         console.error("Error deleting old file: ${err.message}");
//                     }
//                 });
//         var about_first_image=new Date().getTime()+req.files.about_first_image.name;
//         req.files.about_first_image.mv("public/upload_image/about_images/"+about_first_image)
//         var sql=`update about set about_first_image="${about_first_image}",about_description="${req.body.about_description}"`;

//             var data=await exe(sql);
        
//             req.flash('success', 'About Data Updated successfully!');
//             res.redirect("/admin/about");
                
//     }
//     if(req.files.about_second_image){
//         var about_second_image=(await exe(`select about_second_image from about`))[0].about_second_image;
//                 const oldFilePath1 = `public/upload_image/about_images/${about_second_image}`;
//                 fs.unlink(oldFilePath1, (err) => {
//                     if (err) {
//                         console.error("Error deleting old file: ${err.message}");
//                     }
//                 })
//         var about_second_image=new Date().getTime()+req.files.about_second_image.name;
//         req.files.about_second_image.mv("public/upload_image/about_images/"+about_second_image)
//         var sql=`update about set about_second_image="${about_second_image}",about_description="${req.body.about_description}"`;

//         var data=await exe(sql);

//         req.flash('success', 'About Data Updated successfully!');
//         res.redirect("/admin/about");
//     }
//     if(req.files.about_first_image && req.files.about_second_image){
//         var about_first_image=(await exe(`select about_first_image from about`))[0].about_first_image;
//         const oldFilePath = `public/upload_image/about_images/${about_first_image}`;
//         fs.unlink(oldFilePath, (err) => {
//             if (err) {
//                 console.error("Error deleting old file: ${err.message}");
//             }
//         });

//         var about_second_image=(await exe(`select about_second_image from about`))[0].about_second_image;
//         const oldFilePath1 = `public/upload_image/about_images/${about_second_image}`;
//         fs.unlink(oldFilePath1, (err) => {
//             if (err) {
//                 console.error("Error deleting old file: ${err.message}");
//             }
//         });

//     var about_first_image=new Date().getTime()+req.files.about_first_image.name;
//     req.files.about_first_image.mv("public/upload_image/about_images/"+about_first_image)

//     var about_second_image=new Date().getTime()+req.files.about_second_image.name;
//     req.files.about_second_image.mv("public/upload_image/about_images/"+about_second_image)

//     var sql=`update about set about_first_image="${about_first_image}",about_second_image="${about_second_image}",about_description="${req.body.about_description}"`;

//     var data=await exe(sql);

//     req.flash('success', 'About Data Updated successfully!');
//     res.redirect("/admin/about");
//     }
//     else{
//         var sql=`update about set about_description="${req.body.about_description}"`;

//         var data=await exe(sql);
    
//         req.flash('success', 'About Data Updated successfully!');
//         res.redirect("/admin/about");
//     }
// })
route.get("/home_rooms",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];

    var home_room_data=await exe("select * from rooms_and_sweets");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/home_rooms.ejs",{successMessage,"home_room_data":home_room_data,"admin_data":admin_data});
})
route.post("/save_home_room_data",checkAdminLogin,async function(req,res){
    var rooms_image=new Date().getTime()+req.files.rooms_image.name;
    req.files.rooms_image.mv("public/upload_image/home_room_image/"+rooms_image);

    var sql=`insert into rooms_and_sweets (rooms_image,room_name,room_price,room_type) values ("${rooms_image}","${req.body.room_name}","${req.body.room_price}","${req.body.room_type}")`;
    var data=await exe(sql);
    req.flash('success', 'Rooms Data Saved Succeefully!');
    res.redirect("/admin/home_rooms")
})
route.get("/edit_home_room_data/:room_id",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    var sql=`select * from rooms_and_sweets where room_id="${req.params.room_id}"`;
    var data=await exe(sql);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_home_room_data.ejs",{"room_data":data,successMessage,"admin_data":admin_data})
})
route.post("/update_home_room_data",checkAdminLogin,async function(req,res){
    if(req.files){

        var rooms_image=(await exe(`select rooms_image from rooms_and_sweets where room_id="${req.body.room_id}"`))[0].rooms_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/home_room_image/${rooms_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });

        var rooms_image=new Date().getTime()+req.files.rooms_image.name;
        req.files.rooms_image.mv("public/upload_image/home_room_image/"+rooms_image);
        var sql=`update rooms_and_sweets set rooms_image="${rooms_image}",room_name="${req.body.room_name}",room_price="${req.body.room_price}",room_type="${req.body.room_type}" where room_id="${req.body.room_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/home_rooms")
    }
    else{
        var sql=`update rooms_and_sweets set room_name="${req.body.room_name}",room_price="${req.body.room_price}",room_type="${req.body.room_type}" where room_id="${req.body.room_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/home_rooms");
    }
})

route.get("/delete_home_room_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;

    var rooms_image=(await exe(`select rooms_image from rooms_and_sweets where room_id="${urldata.id}"`))[0].rooms_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/home_room_image/${rooms_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var sql=`delete from rooms_and_sweets where room_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/home_rooms");
})

route.get("/home_extra_service_features",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];

    var extra_service_data=await exe(`select * from extra_service`);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/home_extra_service_features.ejs",{successMessage,"extra_service_data":extra_service_data,"admin_data":admin_data});
})
route.post("/save_extra_service_data",checkAdminLogin,async function(req,res){
    var extra_service_slider_image=new Date().getTime()+req.files.extra_service_slider_image.name;
    req.files.extra_service_slider_image.mv("public/upload_image/extra_service_image/"+extra_service_slider_image);
    var sql=`insert into extra_service (extra_service_slider_image,extra_service_title,extra_service_price,extra_service_feature,extra_service_one,extra_service_two,extra_service_three) values ("${extra_service_slider_image}","${req.body.extra_service_title}","${req.body.extra_service_price}","${req.body.extra_service_feature}","${req.body.extra_service_one}","${req.body.extra_service_two}","${req.body.extra_service_three}")`;
    var data=await exe(sql)
    req.flash('success', 'Services Saved Sucessfully !');
    res.redirect("/admin/home_extra_service_features")
})

route.get("/edit_extra_service_data/:extra_id",checkAdminLogin,async function(req,res){
    var extra_service_data=await exe(`select * from extra_service where extra_id="${req.params.extra_id}"`)
    var successMessage = req.flash('success')[0];
    req.flash('success', 'Rooms Data Saved Succeefully!');
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_extra_service_data.ejs",{successMessage,"extra_service_data":extra_service_data,"admin_data":admin_data})
})
route.post("/upate_extra_service_data",checkAdminLogin,async function(req,res){
    if(req.files){

        var extra_service_slider_image=(await exe(`select extra_service_slider_image from extra_service where extra_id="${req.body.extra_id}"`))[0].extra_service_slider_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/extra_service_image/${extra_service_slider_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });

        var extra_service_slider_image=new Date().getTime()+req.files.extra_service_slider_image.name;
        req.files.extra_service_slider_image.mv("public/upload_image/extra_service_image/"+extra_service_slider_image)
        var sql=`update extra_service set extra_service_slider_image="${extra_service_slider_image}",extra_service_title="${req.body.extra_service_title}",extra_service_price="${req.body.extra_service_price}",extra_service_feature="${req.body.extra_service_feature}",extra_service_one="${req.body.extra_service_one}",extra_service_two="${req.body.extra_service_two}",extra_service_three="${req.body.extra_service_three}" where extra_id="${req.body.extra_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/home_extra_service_features");
    }
    else{
        var sql=`update extra_service set extra_service_title="${req.body.extra_service_title}",extra_service_price="${req.body.extra_service_price}",extra_service_feature="${req.body.extra_service_feature}",extra_service_one="${req.body.extra_service_one}",extra_service_two="${req.body.extra_service_two}",extra_service_three="${req.body.extra_service_three}" where extra_id="${req.body.extra_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/home_extra_service_features");
    }
})
route.get("/delete_extra_service_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;

    var extra_service_slider_image=(await exe(`select extra_service_slider_image from extra_service where extra_id="${urldata.id}"`))[0].extra_service_slider_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/extra_service_image/${extra_service_slider_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    
    var sql=`delete from extra_service where extra_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/home_extra_service_features")
    
})

route.get("/latest_video",checkAdminLogin,async function(req,res){
    var successMessage = req.flash('success')[0];
    req.flash('success', "Video Updated Succeefully!");
    var sql=`select * from latest_video`;
    var data=await exe(sql);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/latest_video.ejs",{successMessage,"latest_video_data":data,"admin_data":admin_data});
})
route.post("/update_latest_video_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var latest_video_background_image=(await exe(`select latest_video_background_image from latest_video`))[0].latest_video_background_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/latest_video/${latest_video_background_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var latest_video_background_image=new Date().getTime()+req.files.latest_video_background_image.name;
        req.files.latest_video_background_image.mv("public/upload_image/latest_video/"+latest_video_background_image);
        var sql=`update latest_video set latest_video_title="${req.body.latest_video_title}",latest_video_description="${req.body.latest_video_description}",latest_video="${req.body.latest_video}",latest_video_background_image="${latest_video_background_image}"`
        var data=await exe(sql)
        res.redirect("/admin/latest_video")
    }
    else{
        var sql=`update latest_video set latest_video_title="${req.body.latest_video_title}",latest_video_description="${req.body.latest_video_description}",latest_video="${req.body.latest_video}"`
        var data=await exe(sql)
        res.redirect("/admin/latest_video")
    }

    
})
route.get("/hotel_facility",checkAdminLogin,async function(req,res){
    var sql=`select * from hotel_facilites`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/hotel_facility.ejs",{successMessage,"hotel_fac_data":data,"admin_data":admin_data})
})
route.post("/save_hotel_facility_data",checkAdminLogin,async function(req,res){
    var sql=`insert into hotel_facilites (fac_title,fac_description) values ("${req.body.fac_title}","${req.body.fac_description}")`;
    var data=await exe(sql)
    req.flash('success',"Hotel Facilites Saved Successfully!..");
    res.redirect("/admin/hotel_facility")
})
route.get("/edit_hotel_fac_data/:fac_id",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    req.flash('success',"Hotel Facilites Updated Successfully!..");
    var sql=`select * from hotel_facilites where fac_id="${req.params.fac_id}"`
    var data=await exe(sql)
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_hotel_fac_data.ejs",{successMessage,"hotel_fac_data":data,"admin_data":admin_data})
})
route.post("/update_hotel_facility_data",checkAdminLogin,async function(req,res){

    var sql=`update hotel_facilites set fac_title="${req.body.fac_title}",fac_description="${req.body.fac_description}" where fac_id="${req.body.fac_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/hotel_facility")
})
route.get("/delete_hotel_fac_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var sql=`delete from hotel_facilites where fac_id="${urldata.id}"`;
    var data=await exe(sql);
    res.redirect("/admin/hotel_facility")
})
route.get("/testimonial",checkAdminLogin,async function(req,res){
    var sql=`select * from testimonial,test_rating where testimonial.test_id=test_rating.rat_id`;
    var test_data=await exe(sql);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/testimonial.ejs",{successMessage,"test_data":test_data,"admin_data":admin_data})
})
route.post("/save_testimonial_data",checkAdminLogin,async function(req,res){
    var test_img=new Date().getTime()+req.files.test_img.name;
    req.files.test_img.mv("public/upload_image/testimonial_image/"+test_img)
    var sql=`insert into testimonial (test_name,test_description,test_img) values ("${req.body.test_name}","${req.body.test_description}","${test_img}")`;
    var sql1=`insert into test_rating (rating) values ("${req.body.rating}")`;
    var data=await exe(sql)
    var data1=await exe(sql1);
    req.flash('success',"Testimonies Saved Successfully!..");
    res.redirect("/admin/testimonial")
})
route.get("/edit_test_data/:test_id",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var sql=`select * from testimonial,test_rating where testimonial.test_id=test_rating.rat_id`;
    var data=await exe(sql)
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_test_data.ejs",{successMessage,"test_data":data,"admin_data":admin_data})
})
route.post("/update_testimonial_data",checkAdminLogin,async function(req,res){
    if(req.files){

        var test_img=(await exe(`select test_img from testimonial where test_id="${req.body.test_id}"`))[0].test_img;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/testimonial_image/${test_img}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });

        var test_img=new Date().getTime()+req.files.test_img.name;
        req.files.test_img.mv("public/upload_image/testimonial_image/"+test_img);
        var sql=`update testimonial,test_rating set test_name="${req.body.test_name}",test_description="${req.body.test_description}",test_img="${test_img}",rating="${req.body.rating}" where testimonial.test_id="${req.body.test_id}" and test_rating.rat_id="${req.body.rat_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/testimonial");
    }
    else{
        var sql=`update testimonial,test_rating set test_name="${req.body.test_name}",test_description="${req.body.test_description}",rating="${req.body.rating}" where testimonial.test_id="${req.body.test_id}" and test_rating.rat_id="${req.body.rat_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/testimonial");
    }
})
route.get("/delete_test_data/:test_id/:rat_id",checkAdminLogin,async function(req,res){

    var test_img=(await exe(`select test_img from testimonial where test_id="${req.params.test_id}"`))[0].test_img;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/testimonial_image/${test_img}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });

    var sql=`delete testimonial,test_rating from testimonial join test_rating on testimonial.test_id=test_rating.rat_id where testimonial.test_id="${req.params.test_id}" and test_rating.rat_id="${req.params.rat_id}"`
    var data=await exe(sql)
    res.redirect("/admin/testimonial")
})
route.get("/hotel_discover_feature",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    
    var sql=`select * from hotel_facility_discover`;
    var data=await exe(sql);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/hotel_discover_feature.ejs",{successMessage,"hotel_feature_data":data,"admin_data":admin_data});
})

route.post("/save_hotel_facility_discover",checkAdminLogin,async function(req,res){
    var hot_image=new Date().getTime()+req.files.hot_image.name;
    req.files.hot_image.mv("public/upload_image/hotel_discover_feature/"+hot_image)
    var sql=`insert into hotel_facility_discover (hot_subtitle,hot_description,hot_image) values ("${req.body.hot_subtitle}","${req.body.hot_description}","${hot_image}")`;
    var data=await exe(sql)
    req.flash('success',"Discover Feature Saved Successfully!..");
    res.redirect("/admin/hotel_discover_feature")
})
route.get("/edit_hotel_feature_data/:hot_id",checkAdminLogin,async function(req,res){
    var sql=`select * from hotel_facility_discover where hot_id="${req.params.hot_id}"`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    req.flash('success',"Discover Feature Saved Successfully!..");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_hotel_feature_data.ejs",{"hotel_data":data,successMessage,"admin_data":admin_data})
})
route.post("/update_hotel_facility_discover",checkAdminLogin,async function(req,res){
    if(req.files){
        var hot_image=(await exe(`select hot_image from hotel_facility_discover where hot_id="${req.body.hot_id}"`))[0].hot_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/hotel_discover_feature/${hot_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var hot_image=new Date().getTime()+req.files.hot_image.name;
        req.files.hot_image.mv("public/upload_image/hotel_discover_feature/"+hot_image)
        var sql=`update hotel_facility_discover set hot_subtitle="${req.body.hot_subtitle}",hot_description="${req.body.hot_description}",hot_image="${hot_image}" where hot_id="${req.body.hot_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/hotel_discover_feature")
    }
    else{
        var sql=`update hotel_facility_discover set hot_subtitle="${req.body.hot_subtitle}",hot_description="${req.body.hot_description}" where hot_id="${req.body.hot_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/hotel_discover_feature")
    }
})
route.get("/delete_hotel_feature_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var hot_image=(await exe(`select hot_image from hotel_facility_discover where hot_id="${urldata.id}"`))[0].hot_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/hotel_discover_feature/${hot_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    
    var sql=`delete from hotel_facility_discover where hot_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/hotel_discover_feature")
})
route.get("/facility_images",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var sql=`select * from hotel_facility_discover_image`
    var data=await exe(sql);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/facility_images.ejs",{successMessage,"facility_image_data":data,"admin_data":admin_data});
})
route.post("/save_hotel_facility",checkAdminLogin,async function(req,res){
    var hotel_facility_image=new Date().getTime()+req.files.hotel_facility_image.name;
    req.files.hotel_facility_image.mv("public/upload_image/hotel_discover_feature/"+hotel_facility_image);
    var sql=`insert into hotel_facility_discover_image (hotel_facility_image,facility_desc) values ("${hotel_facility_image}","${req.body.facility_desc}")`;
    var data=await exe(sql) 
    req.flash('success',"Facility Images Saved Successfully!..");
    res.redirect("/admin/facility_images")
})
route.get("/edit_facility_image_data/:hot_fac_img",checkAdminLogin,async function(req,res){
    var sql=`select * from hotel_facility_discover_image where hot_fac_img="${req.params.hot_fac_img}"`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    req.flash('success',"Discover Feature Saved Successfully!..");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_facility_image_data.ejs",{successMessage,"fac_data":data,"admin_data":admin_data})
})
route.post("/update_hotel_facility_image",checkAdminLogin,async function(req,res){
    if(req.files){

    var hotel_facility_image=(await exe(`select hotel_facility_image from hotel_facility_discover_image where hot_fac_img="${req.body.hot_fac_img}"`))[0].hotel_facility_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/hotel_discover_feature/${hotel_facility_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var hotel_facility_image=new Date().getTime()+req.files.hotel_facility_image.name;
        req.files.hotel_facility_image.mv("public/upload_image/hotel_discover_feature/"+hotel_facility_image);
        var sql=`update hotel_facility_discover_image set hotel_facility_image="${hotel_facility_image}",facility_desc="${req.body.facility_desc}" where hot_fac_img="${req.body.hot_fac_img}"` 
        var data=await exe(sql)
        res.redirect("/admin/facility_images")
    }
    else{
        var sql=`update hotel_facility_discover_image set facility_desc="${req.body.facility_desc}" where hot_fac_img="${req.body.hot_fac_img}" ` 
        var data=await exe(sql)
        res.redirect("/admin/facility_images")
        
    }
})
route.get("/delete_facility_image_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var hotel_facility_image=(await exe(`select hotel_facility_image from hotel_facility_discover_image where hot_fac_img="${urldata.id}"`))[0].hotel_facility_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/hotel_discover_feature/${hotel_facility_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var sql=`delete from hotel_facility_discover_image where hot_fac_img="${urldata.id}"`;
        var data=await exe(sql);
        res.redirect("/admin/facility_images")
})
route.get("/our_news",checkAdminLogin,async function(req,res){
    var sql=`select * from our_new`;
    var data=await exe(sql);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/our_news.ejs",{successMessage,"our_news":data,"admin_data":admin_data});
})
route.post("/save_our_news",checkAdminLogin,async function(req,res){
    var our_news_image=new Date().getTime()+req.files.our_news_image.name;
    req.files.our_news_image.mv("public/upload_image/our_news/"+our_news_image);
    var sql=`insert into our_new (our_news_title,our_new_subtitle,our_news_description,our_news_data,our_news_image) values ("${req.body.our_news_title}","${req.body.our_new_subtitle}","${req.body.our_news_description}","${req.body.our_news_data}","${our_news_image}")`;
    var data=await exe(sql);
    req.flash('success',"Our News Data Saved Successfully!..");
    res.redirect("/admin/our_news")

})
route.get("/edit_our_news/:our_news_id",checkAdminLogin,async function(req,res){
    var sql=`select * from our_new where our_news_id="${req.params.our_news_id}"`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_our_news.ejs",{successMessage,"our_news_da":data,"admin_data":admin_data});
})
route.post("/update_our_news",checkAdminLogin,async function(req,res){
    if(req.files){
        var our_news_image=(await exe(`select our_news_image from our_new where our_news_id="${req.body.our_news_id}"`))[0].our_news_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/our_news/${our_news_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var our_news_image=new Date().getTime()+req.files.our_news_image.name;
        req.files.our_news_image.mv("public/upload_image/our_news/"+our_news_image);
        var sql=`update our_new set our_news_title="${req.body.our_news_title}",our_new_subtitle="${req.body.our_new_subtitle}",our_news_description="${req.body.our_news_description}",our_news_data="${req.body.our_news_data}",our_news_image="${our_news_image}" where our_news_id="${req.body.our_news_id}"`;
        var data=await exe(sql);
        res.redirect("/admin/our_news")
    }
    else{
        var sql=`update our_new set our_news_title="${req.body.our_news_title}",our_new_subtitle="${req.body.our_new_subtitle}",our_news_description="${req.body.our_news_description}",our_news_data="${req.body.our_news_data}" where our_news_id="${req.body.our_news_id}"`;
        var data=await exe(sql);
        res.redirect("/admin/our_news")
    }


})
route.get("/delete_our_news",checkAdminLogin,async function(req,res){
    urldata=url.parse(req.url,true).query;

    var our_news_image=(await exe(`select our_news_image from our_new where our_news_id="${urldata.id}"`))[0].our_news_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/our_news/${our_news_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var sql=`delete from our_new where our_news_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/our_news")
})
route.get("/hotel_client",checkAdminLogin,async function(req,res){
    var hotel_data=await exe(`select * from hotel_client`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/hotel_client.ejs",{successMessage,"hotel_data":hotel_data,"admin_data":admin_data})
})
route.post("/save_hotel_client_data",checkAdminLogin,async function(req,res){
    var hot_client_image=new Date().getTime()+req.files.hot_client_image.name;
    req.files.hot_client_image.mv("public/upload_image/hotel_client_image/"+hot_client_image);
    var sql=`insert into hotel_client (hot_client_image,hot_client_name,hot_client_description) values ("${hot_client_image}","${req.body.hot_client_name}","${req.body.hot_client_description}")`;
    var data=await exe(sql)
    req.flash('success',"Client Data Saved Successfully!..");
    res.redirect("/admin/hotel_client")
})
route.get("/edit_hotel_data/:hot_client_id",checkAdminLogin,async function(req,res){
    var sql=`select * from hotel_client where hot_client_id="${req.params.hot_client_id}"`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_hotel_data.ejs",{successMessage,"hotel_data":data,"admin_data":admin_data})
})
route.post("/update_hotel_client_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var hot_client_image=(await exe(`select hot_client_image from hotel_client where hot_client_id="${req.body.hot_client_id}"`))[0].hot_client_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/hotel_client_image/${hot_client_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var hot_client_image=new Date().getTime()+req.files.hot_client_image.name;
        req.files.hot_client_image.mv("public/upload_image/hotel_client_image/"+hot_client_image);
        var sql=`update hotel_client set hot_client_image="${hot_client_image}",hot_client_name="${req.body.hot_client_name}",hot_client_description="${req.body.hot_client_description}" where hot_client_id="${req.body.hot_client_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/hotel_client")

    }
    else{
        var sql=`update hotel_client set hot_client_name="${req.body.hot_client_name}",hot_client_description="${req.body.hot_client_description}" where hot_client_id="${req.body.hot_client_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/hotel_client")
    }
})
route.get("/delete_hotel_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;

    var hot_client_image=(await exe(`select hot_client_image from hotel_client where hot_client_id="${urldata.id}"`))[0].hot_client_image;
    // Assuming you have old file information from the database
    const oldFilePath = `public/upload_image/hotel_client_image/${hot_client_image}`;
    // Delete old file
    fs.unlink(oldFilePath, (err) => {
        if (err) {
            console.error("Error deleting old file: ${err.message}");
        }
        else{
            console.log("Data deletes succssfully after click on update button")
        }
    });

    var sql=`delete from hotel_client where hot_client_id="${urldata.id}"`;
    var data=await exe(sql);
    res.redirect("/admin/hotel_client")
})
route.get("/hotel_views",checkAdminLogin,async function(req,res){
    var hotel_data=await exe("select * from hotel_views");
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/hotel_views.ejs",{successMessage,"hotel_data":hotel_data,"admin_data":admin_data})
})
route.post("/save_hotel_view_data",checkAdminLogin,async function(req,res){
    var hotel_view_image=new Date().getTime()+req.files.hotel_view_image.name;
    req.files.hotel_view_image.mv("public/upload_image/hotel_view_image/"+hotel_view_image);
    var sql=`insert into hotel_views (hotel_view_image,hotel_view_title,hotel_view_description) values ("${hotel_view_image}","${req.body.hotel_view_title}","${req.body.hotel_view_description}")`;
    var data=await exe(sql)
    req.flash('success',"Hotel Views Saved Successfully!..");
    res.redirect("/admin/hotel_views")
})
route.get("/edit_hotel_view_data/:hotel_view_id",checkAdminLogin,async function(req,res){
    var sql=`select * from hotel_views where hotel_view_id="${req.params.hotel_view_id}"`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_hotel_view_data.ejs",{"hotel_view_data":data,successMessage,"admin_data":admin_data})
})
route.post("/update_hotel_view_data",checkAdminLogin,async function(req,res){
    if(req.files){

        var hotel_view_image=(await exe(`select hotel_view_image from hotel_views where hotel_view_id="${req.body.hotel_view_id}"`))[0].hotel_view_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/hotel_view_image/${hotel_view_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var hotel_view_image=new Date().getTime()+req.files.hotel_view_image.name;
        req.files.hotel_view_image.mv("public/upload_image/hotel_view_image/"+hotel_view_image);
        var sql=`update hotel_views set hotel_view_image="${hotel_view_image}",hotel_view_title="${req.body.hotel_view_title}",hotel_view_description="${req.body.hotel_view_description}" where hotel_view_id="${req.body.hotel_view_id}"`;
        var data=await exe(sql);
        res.redirect("/admin/hotel_views")
        
    }
    else{
        var sql=`update hotel_views set hotel_view_title="${req.body.hotel_view_title}",hotel_view_description="${req.body.hotel_view_description}" where hotel_view_id="${req.body.hotel_view_id}"`;
        var data=await exe(sql);
        res.redirect("/admin/hotel_views")
    }
})
route.get("/delete_hotel_view_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var hotel_view_image=(await exe(`select hotel_view_image from hotel_views where hotel_view_id="${urldata.id}"`))[0].hotel_view_image;
    // Assuming you have old file information from the database
    const oldFilePath = `public/upload_image/hotel_view_image/${hotel_view_image}`;
    // Delete old file
    fs.unlink(oldFilePath, (err) => {
        if (err) {
            console.error("Error deleting old file: ${err.message}");
        }
        else{
            console.log("Data deletes succssfully after click on update button")
        }
    });
    var sql=`delete from hotel_views where hotel_view_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/hotel_views")
})
route.get("/about_dishes",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var about_dishes=await exe(`select * from dishes`);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/about_dishes.ejs",{successMessage,"about_dishes":about_dishes,"admin_data":admin_data});
})
route.post("/save_about_dishes",checkAdminLogin,async function(req,res){
    var dish_image=new Date().getTime()+req.files.dish_image.name;
    req.files.dish_image.mv("public/upload_image/about_dish_image/"+dish_image)
    var sql=`insert into dishes(dish_name,dish_image,dis_fea_one,dis_fea_two,dis_fea_three,dis_price) values ("${req.body.dish_name}","${dish_image}","${req.body.dis_fea_one}","${req.body.dis_fea_two}","${req.body.dis_fea_three}","${req.body.dis_price}")`;
    var data=await exe(sql)
    req.flash('success',"About Dishes Saved Successfully!..");
    res.redirect("/admin/about_dishes")
})
route.get("/edit_about_dishes/:dis_id",checkAdminLogin,async function(req,res){
    var sql=`select * from dishes where dis_id="${req.params.dis_id}"`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_about_dishes.ejs",{successMessage,"hotel_dish":data,"admin_data":admin_data})

})
route.post("/update_about_dishes",checkAdminLogin,async function(req,res){
    if(req.files){
        var dish_image=(await exe(`select dish_image from dishes where dis_id="${req.body.dis_id}"`))[0].dish_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/about_dish_image/${dish_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var dish_image=new Date().getTime()+req.files.dish_image.name;
        req.files.dish_image.mv("public/upload_image/about_dish_image/"+dish_image);
        var sql=`update dishes set dish_name="${req.body.dish_name}",dish_image="${dish_image}",dis_fea_one="${req.body.dis_fea_one}",dis_fea_two="${req.body.dis_fea_two}",dis_fea_three="${req.body.dis_fea_three}",dis_price="${req.body.dis_price}" where dis_id="${req.body.dis_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/about_dishes")
    }
    else{
        var sql=`update dishes set dish_name="${req.body.dish_name}",dis_fea_one="${req.body.dis_fea_one}",dis_fea_two="${req.body.dis_fea_two}",dis_fea_three="${req.body.dis_fea_three}",dis_price="${req.body.dis_price}" where dis_id="${req.body.dis_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/about_dishes")  
    }
})

route.get("/delete_about_dishes",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var dish_image=(await exe(`select dish_image from dishes where dis_id="${urldata.id}"`))[0].dish_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/about_dish_image/${dish_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var sql=`delete from dishes where dis_id="${urldata.id}"`;
        var data=await exe(sql)
        res.redirect("/admin/about_dishes")
})
route.get("/about_gallery",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var about_gallery=await exe("select * from about_gallery");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/about_gallery.ejs",{successMessage,"about_gallery":about_gallery,"admin_data":admin_data});
})
route.post("/save_about_gallery_data",checkAdminLogin,async function(req,res){
    var about_gallery_image=new Date().getTime()+req.files.about_gallery_image.name;
    req.files.about_gallery_image.mv("public/upload_image/about_gallery_image/"+about_gallery_image);
    var sql=`insert into about_gallery (about_gallery_name,about_gallery_image) values ("${req.body.about_gallery_name}","${about_gallery_image}")`;
    var data=await exe(sql)
    req.flash('success',"About Gallery Information Saved Successfully!..");
    res.redirect("/admin/about_gallery")
})
route.get("/edit_about_gallery/:about_gallery_id",checkAdminLogin,async function(req,res){
    var about_gallery_data=await exe(`select * from about_gallery where about_gallery_id="${req.params.about_gallery_id}"`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_about_gallery.ejs",{"about_gallery_data":about_gallery_data,successMessage,"admin_data":admin_data});
})
route.post("/update_about_gallery_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var about_gallery_image=(await exe(`select about_gallery_image from about_gallery where about_gallery_id="${req.body.about_gallery_id}"`))[0].about_gallery_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/about_gallery_image/${about_gallery_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var about_gallery_image=new Date().getTime()+req.files.about_gallery_image.name;
        req.files.about_gallery_image.mv("public/upload_image/about_gallery_image/"+about_gallery_image);
        var sql=`update about_gallery set about_gallery_name="${req.body.about_gallery_name}",about_gallery_image="${about_gallery_image}" where about_gallery_id="${req.body.about_gallery_id}"`
        var data=await exe(sql)
        res.redirect("/admin/about_gallery");

    }
    else{
        var sql=`update about_gallery set about_gallery_name="${req.body.about_gallery_name}" where about_gallery_id="${req.body.about_gallery_id}"`
        var data=await exe(sql)
        res.redirect("/admin/about_gallery");
    }
})
route.get("/delete_about_gallery",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var about_gallery_image=(await exe(`select about_gallery_image from about_gallery where about_gallery_id="${urldata.id}"`))[0].about_gallery_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/about_gallery_image/${about_gallery_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var sql=`delete from about_gallery where about_gallery_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/about_gallery");
})
route.get("/team_member",checkAdminLogin,async function(req,res){
    var team_member_data=await exe("select * from team_member");
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/team_member.ejs",{successMessage,"team_member_data":team_member_data,"admin_data":admin_data});
})
route.post("/save_team_member_data",checkAdminLogin,async function(req,res){
    var team_member_image=new Date().getTime()+req.files.team_member_image.name;
    req.files.team_member_image.mv("public/upload_image/team_member_image/"+team_member_image);
    var sql=`insert into team_member (team_member_name,team_member_desi,team_member_image,team_member_mobile,team_member_lidin,team_facebook_link,team_member_email) values ("${req.body.team_member_name}","${req.body.team_member_desi}","${team_member_image}","${req.body.team_member_mobile}","${req.body.team_member_lidin}","${req.body.team_facebook_link}","${req.body.team_member_email}")`
    var data=await exe(sql)
    req.flash('success',"Team Member Information Saved Successfully!..");
    res.redirect("/admin/team_member")
})
route.get("/edit_team_member_data/:tem_member_id",checkAdminLogin,async function(req,res){
    var team_data=await exe(`select * from team_member where tem_member_id="${req.params.tem_member_id}"`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_team_member_data.ejs",{"team_data":team_data,successMessage,"admin_data":admin_data})
})
route.post("/update_team_member_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var team_member_image=(await exe(`select team_member_image from team_member where tem_member_id="${req.body.tem_member_id}"`))[0].team_member_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/team_member_image/${team_member_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var team_member_image=new Date().getTime()+req.files.team_member_image.name;
        req.files.team_member_image.mv("public/upload_image/team_member_image/"+team_member_image);
        var sql=`update team_member set team_member_name="${req.body.team_member_name}",team_member_desi="${req.body.team_member_desi}",team_member_image="${team_member_image}",team_member_mobile="${req.body.team_member_mobile}",team_member_lidin="${req.body.team_member_lidin}",team_facebook_link="${req.body.team_facebook_link}",team_member_email="${req.body.team_member_email}" where tem_member_id="${req.body.tem_member_id}"`
        var data=await exe(sql)
        res.redirect("/admin/team_member")
    }
    else{
        var sql=`update team_member set team_member_name="${req.body.team_member_name}",team_member_desi="${req.body.team_member_desi}",team_member_mobile="${req.body.team_member_mobile}",team_member_lidin="${req.body.team_member_lidin}",team_facebook_link="${req.body.team_facebook_link}",team_member_email="${req.body.team_member_email}" where tem_member_id="${req.body.tem_member_id}"`
        var data=await exe(sql)
        res.redirect("/admin/team_member")
    }
})
route.get("/delete_team_member_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var team_member_image=(await exe(`select team_member_image from team_member where tem_member_id="${urldata.id}"`))[0].team_member_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/team_member_image/${team_member_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var sql=`delete from team_member where tem_member_id="${urldata.id}"`
        var data=await exe(sql)
        res.redirect("/admin/team_member")
})
route.get("/special_offer",checkAdminLogin,async function(req,res){
    var sql=`select * from special_offer,special_offer_details where special_offer.special_id=special_offer_details.spd_id`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/special_offer.ejs",{successMessage,"special_offer":data,"admin_data":admin_data});
})
route.post("/save_special_offer_data",checkAdminLogin,async function(req,res){
    var special_offer_image=new Date().getTime()+req.files.special_offer_image.name;
    req.files.special_offer_image.mv("public/upload_image/special_offer_image/"+special_offer_image);
    var sql=`insert into special_offer (special_offer_name,special_offer_price,special_offer_percentage,special_offer_image) values ("${req.body.special_offer_name}","${req.body.special_offer_price}","${req.body.special_offer_percentage}","${special_offer_image}")`

    var sql1=`insert into special_offer_details (special_offer_description,check_in_details,check_out_details,special_checkin_instruction,pets,allowed_person,wifi_con,room_size,breakfast) values ("${req.body.special_offer_description}","${req.body.check_in_details}","${req.body.check_out_details}","${req.body.special_checkin_instruction}","${req.body.pets}","${req.body.allowed_person}","${req.body.wifi_con}","${req.body.room_size}","${req.body.breakfast}")`
    var data=await exe(sql)
    var data1=await exe(sql1)
    req.flash('success',"Special Offers Saved Successfully!..");
    res.redirect("/admin/special_offer")
})
route.get("/edit_special_offer_data/:special_id/:spd_id",checkAdminLogin,async function(req,res){
    var sql=`select * from special_offer,special_offer_details where special_offer.special_id=${req.params.special_id} and special_offer_details.spd_id="${req.params.spd_id}"`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_special_offer_data.ejs",{successMessage,"sp_off_data":data,"admin_data":admin_data})

})
route.post("/update_special_offer_data",checkAdminLogin,async function(req,res){
    if(req.files){

        var special_offer_image=(await exe(`select special_offer_image from special_offer where special_id="${req.body.special_id}"`))[0].special_offer_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/special_offer_image/${special_offer_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });

        var special_offer_image=new Date().getTime()+req.files.special_offer_image.name;
       req.files.special_offer_image.mv("public/upload_image/special_offer_image/"+special_offer_image);
       var sql=`update special_offer,special_offer_details set special_offer_name="${req.body.special_offer_name}",special_offer_price="${req.body.special_offer_price}",special_offer_percentage="${req.body.special_offer_percentage}",special_offer_image="${special_offer_image}",special_offer_description="${req.body.special_offer_description}",check_in_details="${req.body.check_in_details}",check_out_details="${req.body.check_out_details}",special_checkin_instruction="${req.body.special_checkin_instruction}",pets="${req.body.pets}",allowed_person="${req.body.allowed_person}",wifi_con="${req.body.wifi_con}",room_size="${req.body.room_size}",breakfast="${req.body.breakfast}" where special_offer.special_id="${req.body.special_id}" and special_offer_details.spd_id="${req.body.spd_id}"`;
       var data=await exe(sql);
       res.redirect("/admin/special_offer")
    }
    else{
        var sql=`update special_offer,special_offer_details set special_offer_name="${req.body.special_offer_name}",special_offer_price="${req.body.special_offer_price}",special_offer_percentage="${req.body.special_offer_percentage}",special_offer_description="${req.body.special_offer_description}",check_in_details="${req.body.check_in_details}",check_out_details="${req.body.check_out_details}",special_checkin_instruction="${req.body.special_checkin_instruction}",pets="${req.body.pets}",allowed_person="${req.body.allowed_person}",wifi_con="${req.body.wifi_con}",room_size="${req.body.room_size}",breakfast="${req.body.breakfast}" where special_offer.special_id="${req.body.special_id}" and special_offer_details.spd_id="${req.body.spd_id}"`;
       var data=await exe(sql);
       res.redirect("/admin/special_offer")
    }
})
// create table special_offer_details(spd_id integer primary key auto_increment,special_offer_description text,check_in_details text,check_out_details text,special_checkin_instruction text,pets varchar(1000),allowed_person integer,wifi_con varchar(1000),room_size integer,breakfast varchar(100))
route.get("/delete_special_offer_data/:special_id/:spd_id",checkAdminLogin,async function(req,res){
    var special_offer_image=(await exe(`select special_offer_image from special_offer where special_id="${req.params.special_id}"`))[0].special_offer_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/special_offer_image/${special_offer_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var sql=`delete special_offer,special_offer_details from special_offer join special_offer_details on special_offer.special_id=special_offer_details.spd_id where special_offer.special_id="${req.params.special_id}" and special_offer_details.spd_id="${req.params.spd_id}"`
    var data=await exe(sql)
    res.redirect("/admin/special_offer")
})
route.get("/hotel_owner_info",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var hotel_owner_data=await exe("select * from hotel_owner");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/hotel_owner_info.ejs",{successMessage,"hotel_owner_data":hotel_owner_data,"admin_data":admin_data})
})
route.post("/update_owner_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var hotel_owner_image=(await exe(`select hotel_owner_image from hotel_owner`))[0].hotel_owner_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/owner_image/${hotel_owner_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var hotel_owner_image=new Date().getTime()+req.files.hotel_owner_image.name;
        req.files.hotel_owner_image.mv("public/upload_image/owner_image/"+hotel_owner_image)
       
        var sql=`update hotel_owner set hotel_owner_image="${hotel_owner_image}",hotel_owner_name="${req.body.hotel_owner_name}",hotel_owner_education="${req.body.hotel_owner_education}",hotel_owner_description="${req.body.hotel_owner_description}"`;
        var data=await exe(sql)
        res.redirect("/admin/hotel_owner_info")
    }
    else{
        var sql=`update hotel_owner set hotel_owner_name="${req.body.hotel_owner_name}",hotel_owner_education="${req.body.hotel_owner_education}",hotel_owner_description="${req.body.hotel_owner_description}"`;
        var data=await exe(sql)
        res.redirect("/admin/hotel_owner_info")
    }
    
})
route.get("/offer_details",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var offer_data=await exe(`select * from offer,offer_details where offer.offer_id=offer_details.offer_det_id`)
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/offer_details.ejs",{successMessage,"offer_data":offer_data,"admin_data":admin_data});
})
route.post("/save_offer_data",checkAdminLogin,async function(req,res){
    var offer_image=new Date().getTime()+req.files.offer_image.name;
    req.files.offer_image.mv("public/upload_image/offer_image/"+offer_image);
    var sql=`insert into offer (offer_image,offer_price,offer_price_percentage,offer_name) values ("${offer_image}","${req.body.offer_price}","${req.body.offer_price_percentage}","${req.body.offer_name}")`;
    var sql1=`insert into offer_details (offer_det_description,offer_det_che_in,offer_det_checkout,offer_det_pets,total_person,wifi,offer_room_size,food_service) values ("${req.body.offer_det_description}","${req.body.offer_det_che_in}","${req.body.offer_det_checkout}","${req.body.offer_det_pets}","${req.body.total_person}","${req.body.wifi}","${req.body.offer_room_size}","${req.body.food_service}")`;
    var data=await exe(sql)
    var data1=await exe(sql1)
    res.redirect("/admin/offer_details")
})
route.get("/edit_offer_data/:offer_id/:offer_det_id",checkAdminLogin,async function(req,res){
    var sql=`select * from offer,offer_details where offer.offer_id="${req.params.offer_id}" and offer_details.offer_det_id="${req.params.offer_det_id}"`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_offer_data.ejs",{"offer_data":data,successMessage,"admin_data":admin_data})
})
route.post("/update_offer_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var offer_image=(await exe(`select offer_image from offer where offer_id="${req.body.offer_id}"`))[0].offer_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/offer_image/${offer_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var offer_image=new Date().getTime()+req.files.offer_image.name;
        req.files.offer_image.mv("public/upload_image/offer_image/"+offer_image);
        var sql=`update offer,offer_details set offer_image="${offer_image}",offer_price="${req.body.offer_price}",offer_price_percentage="${req.body.offer_price_percentage}",offer_name="${req.body.offer_name}",offer_det_description="${req.body.offer_det_description}",offer_det_che_in="${req.body.offer_det_che_in}",offer_det_checkout="${req.body.offer_det_checkout}",offer_det_pets="${req.body.offer_det_pets}",total_person="${req.body.total_person}",wifi="${req.body.wifi}",offer_room_size="${req.body.offer_room_size}",food_service="${req.body.food_service}" where offer.offer_id="${req.body.offer_id}" and offer_details.offer_det_id="${req.body.offer_det_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/offer_details")
    }
    else{
        var sql=`update offer,offer_details set offer_price="${req.body.offer_price}",offer_price_percentage="${req.body.offer_price_percentage}",offer_name="${req.body.offer_name}",offer_det_description="${req.body.offer_det_description}",offer_det_che_in="${req.body.offer_det_che_in}",offer_det_checkout="${req.body.offer_det_checkout}",offer_det_pets="${req.body.offer_det_pets}",total_person="${req.body.total_person}",wifi="${req.body.wifi}",offer_room_size="${req.body.offer_room_size}",food_service="${req.body.food_service}" where offer.offer_id="${req.body.offer_id}" and offer_details.offer_det_id="${req.body.offer_det_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/offer_details")
    }
})
route.get("/delete_offer_data/:offer_id/:offer_det_id",checkAdminLogin,async function(req,res){
    var sql=`delete offer,offer_details from offer join offer_details on offer.offer_id=offer_details.offer_det_id where offer.offer_id="${req.params.offer_id}" and offer_details.offer_det_id="${req.params.offer_det_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/offer_details")
})
route.get("/view_categories",checkAdminLogin,async function(req,res){
    var cat_data=await exe("select * from category");
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/view_categories.ejs",{successMessage,"cat_data":cat_data,"admin_data":admin_data})
})
route.get("/add_category",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/add_category.ejs",{successMessage,"admin_data":admin_data});
})
route.post("/save_categories",checkAdminLogin,async function(req,res){
    var sql=`insert into category (cat_name,cat_desc) values ("${req.body.cat_name}","${req.body.cat_desc}")`;
    var data=await exe(sql)
    res.redirect("/admin/view_categories")
})
route.get("/edit_cat_data/:cat_id",checkAdminLogin,async function(req,res){
    var sql=`select * from category where cat_id="${req.params.cat_id}"`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_cat_data.ejs",{successMessage,"cat_data":data,"admin_data":admin_data});
})
route.post("/update_categories",checkAdminLogin,async function(req,res){
    var sql=`update category set cat_name="${req.body.cat_name}",cat_desc="${req.body.cat_desc}" where cat_id="${req.body.cat_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/view_categories")
})
route.get("/add_sub_cat_data/:cat_id",checkAdminLogin,async function(req,res){
    var sql=`select * from category where cat_id="${req.params.cat_id}"`;
    var food_data=await exe(`select * from food`);
    var wine_data=await exe(`select * from wines`);
    var event_data=await exe(`select * from events_hall`);
    var room_data=await exe(`select * from rooms`);
    var data=await exe(sql)
    var sub_id=req.params.cat_id;
    // if(sub_id==1){

    // }
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/add_sub_cat_data.ejs",{successMessage,sub_id,"cat_data":data,"food_data":food_data,"wine_data":wine_data,"event_data":event_data,"room_data":room_data,"admin_data":admin_data})
})
route.get("/delete_cat/:cat_id",checkAdminLogin,async function(req,res){
    var sql=`delete from category where cat_id="${req.params.cat_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/view_categories")
})
route.post("/save_food_sub_cat_data",checkAdminLogin,async function(req,res){
    var food_image=new Date().getTime()+req.files.food_image.name;
    req.files.food_image.mv("public/upload_image/food_images/"+food_image);
    var sql=`insert into food (food_name,food_price,food_quantity,food_com_id,food_image,food_description,food_feature_one,food_feature_two,food_feature_three,food_veg_nonveg,food_type) values ("${req.body.food_name}","${req.body.food_price}","1","${req.body.food_com_id}","${food_image}","${req.body.food_description}","${req.body.food_feature_one}","${req.body.food_feature_two}","${req.body.food_feature_three}","${req.body.food_veg_nonveg}","${req.body.food_type}")`;
    var data=await exe(sql)
    req.flash('success',"Food Sub Category Data Saved Successfully!..");
    // res.redirect(`/admin/add_sub_cat_data/${req.body.food_com_id}`)
    res.redirect("/admin/view_food_sub_cat_data")
})
route.get("/view_food_sub_cat_data",checkAdminLogin,async function(req,res){
    var data=await exe("select * from food");
    var successMessage=req.flash('success')[0];
    if(data.length>0){
        res.render("admin/view_food_sub_cat_data.ejs",{successMessage,"food_data":data})
    }
    else{
        res.redirect("/admin")
    }
    
})
route.get("/edit_food_sub_cat_data/:food_id",checkAdminLogin,async function(req,res){
    var food_data=await exe(`select * from food where food_id="${req.params.food_id}"`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_food_sub_cat_data.ejs",{successMessage,"food_data":food_data,"admin_data":admin_data})
})
route.post("/update_food_sub_cat_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var food_image=(await exe(`select food_image from food where food_id="${req.body.food_id}"`))[0].food_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/food_images/${food_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var food_image=new Date().getTime()+req.files.food_image.name;
        req.files.food_image.mv("public/upload_image/food_images/"+food_image);
        var sql=`update food set food_name="${req.body.food_name}",food_price="${req.body.food_price}",food_quantity="1",food_com_id="${req.body.food_com_id}",food_image="${food_image}",food_description="${req.body.food_description}",food_feature_one="${req.body.food_feature_one}",food_feature_two="${req.body.food_feature_two}",food_feature_three="${req.body.food_feature_three}",food_veg_nonveg="${req.body.food_veg_nonveg}",food_type="${req.body.food_type}" where food_id="${req.body.food_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/view_food_sub_cat_data")
        
    }
    else{
        var sql=`update food set food_name="${req.body.food_name}",food_price="${req.body.food_price}",food_quantity="1",food_com_id="${req.body.food_com_id}",food_description="${req.body.food_description}",food_feature_one="${req.body.food_feature_one}",food_feature_two="${req.body.food_feature_two}",food_feature_three="${req.body.food_feature_three}",food_veg_nonveg="${req.body.food_veg_nonveg}",food_type="${req.body.food_type}" where food_id="${req.body.food_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/view_food_sub_cat_data")
    }
})
route.get("/delete_food_sub_cat_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var food_image=(await exe(`select food_image from food where food_id="${urldata.id}"`))[0].food_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/food_images/${food_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });

    var sql=`delete from food where food_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/view_food_sub_cat_data")
})
route.post("/save_wines_sub_cat_data",checkAdminLogin,async function(req,res){
    var wines_image=new Date().getTime()+req.files.wines_image.name;
    req.files.wines_image.mv("public/upload_image/wine_images/"+wines_image)
    var sql=`insert into wines (wines_name,wines_price,wines_quantity,wine_com_id,wines_description,wines_image,wines_feature) values ("${req.body.wines_name}","${req.body.wines_price}","1","${req.body.wine_com_id}","${req.body.wines_description}","${wines_image}","${req.body.wines_feature}")`;
    var data=await exe(sql)
    res.redirect("/admin/view_wines_sub_cat_data")
})
route.get("/view_wines_sub_cat_data",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var wines_data=await exe("select * from wines");
    if(wines_data.length>0){
        var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
        res.render("admin/view_wines_sub_cat_data.ejs",{successMessage,"wines_data":wines_data,"admin_data":admin_data})
    }
    else{
        res.redirect("/admin")
    }
    
})
route.get("/edit_wine_sub_cat_data/:wines_id",checkAdminLogin,async function(req,res){
    var cat_data=await exe("select * from category")
    var wine_data=await exe(`select * from wines where wines_id=${req.params.wines_id}`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_wine_sub_cat_data.ejs",{successMessage,"cat_data":cat_data,"wine_data":wine_data,"admin_data":admin_data})
})
route.post("/update_wines_sub_cat_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var wines_image=(await exe(`select wines_image from wines where wines_id="${req.body.wines_id}"`))[0].wines_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/wine_images/${wines_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var wines_image=new Date().getTime()+req.files.wines_image.name;
        req.files.wines_image.mv("public/upload_image/wine_images/"+wines_image)
        var sql=`update wines set wines_name="${req.body.wines_name}",wines_price="${req.body.wines_price}",wines_quantity="1",wine_com_id="${req.body.wine_com_id}",wines_description="${req.body.wines_description}",wines_image="${wines_image}",wines_feature="${req.body.wines_feature}" where wines_id="${req.body.wines_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/view_wines_sub_cat_data")
    }
    else{
        var sql=`update wines set wines_name="${req.body.wines_name}",wines_price="${req.body.wines_price}",wines_quantity="1",wine_com_id="${req.body.wine_com_id}",wines_description="${req.body.wines_description}",wines_feature="${req.body.wines_feature}" where wines_id="${req.body.wines_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/view_wines_sub_cat_data")
    }
})
route.get("/delete_wine_sub_cat_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var wines_image=(await exe(`select wines_image from wines where wines_id="${urldata.id}"`))[0].wines_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/wine_images/${wines_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var sql=`delete from wines where wines_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/view_wines_sub_cat_data")
})
route.post("/save_event_hall_sub_cat_data",checkAdminLogin,async function(req,res){
    var event_hall_image=new Date().getTime()+req.files.event_hall_image.name;
    req.files.event_hall_image.mv("public/upload_image/event_hall_image/"+event_hall_image)
    var sql=`insert into events_hall (event_hall_com_id,event_hall_name,event_hall_price,event_hall_feature,event_hall_image) values ("${req.body.event_hall_com_id}","${req.body.event_hall_name}","${req.body.event_hall_price}","${req.body.event_hall_feature}","${event_hall_image}")`;
    var data=await exe(sql)
    res.redirect("/admin/view_event_hall_sub_cat_data")
})
route.get("/view_event_hall_sub_cat_data",checkAdminLogin,async function(req,res){
    var event_data=await exe(`select * from events_hall`);
    var successMessage=req.flash('success')[0];
    if(event_data.length>0){
        var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
        res.render("admin/view_event_hall_sub_cat_data.ejs",{successMessage,"event_data":event_data,"admin_data":admin_data})
    }
    else{
        res.redirect("/admin")
    }
    
})
route.get("/edit_event_hall_sub_cat_data/:event_hall_id",checkAdminLogin,async function(req,res){
    var sql=`select * from events_hall where event_hall_id="${req.params.event_hall_id}"`;
    var data=await exe(sql)
    var cat_data=await exe(`select * from category`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_event_hall_sub_cat_data.ejs",{"event_data":data,successMessage,"cat_data":cat_data,"admin_data":admin_data});
})
route.post("/update_event_hall_sub_cat_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var event_hall_image=(await exe(`select event_hall_image from events_hall where event_hall_id="${req.body.event_hall_id}"`))[0].event_hall_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/event_hall_image/${event_hall_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var event_hall_image=new Date().getTime()+req.files.event_hall_image.name;
        req.files.event_hall_image.mv("public/upload_image/event_hall_image/"+event_hall_image)
        var sql=`update events_hall set event_hall_com_id="${req.body.event_hall_com_id}",event_hall_name="${req.body.event_hall_name}",event_hall_price="${req.body.event_hall_price}",event_hall_feature="${req.body.event_hall_feature}",event_hall_image="${event_hall_image}" where event_hall_id="${req.body.event_hall_id}"`;
        var data=await exe(sql) 
        res.redirect("/admin/view_event_hall_sub_cat_data")
    }
    else{
        var sql=`update events_hall set event_hall_com_id="${req.body.event_hall_com_id}",event_hall_name="${req.body.event_hall_name}",event_hall_price="${req.body.event_hall_price}",event_hall_feature="${req.body.event_hall_feature}" where event_hall_id="${req.body.event_hall_id}"`;
        var data=await exe(sql) 
        res.redirect("/admin/view_event_hall_sub_cat_data")
    }
})
route.get("/delete_event_hall_sub_cat_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var event_hall_image=(await exe(`select event_hall_image from events_hall where event_hall_id="${urldata.id}"`))[0].event_hall_image;
    // Assuming you have old file information from the database
    const oldFilePath = `public/upload_image/event_hall_image/${event_hall_image}`;
    // Delete old file
    fs.unlink(oldFilePath, (err) => {
        if (err) {
            console.error("Error deleting old file: ${err.message}");
        }
        else{
            console.log("Data deletes succssfully after click on update button")
        }
    });
    var sql=`delete from events_hall where event_hall_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/view_event_hall_sub_cat_data")
})
route.post("/save_room_sub_cat_data",checkAdminLogin,async function(req,res){
    var room_image=new Date().getTime()+req.files.room_image.name;
    req.files.room_image.mv("public/upload_image/room_image/"+room_image)
    var sql=`insert into rooms (room_name,room_price,room_type,room_feature,room_com_id,room_size,room_image) values ("${req.body.room_name}","${req.body.room_price}","${req.body.room_type}","${req.body.room_feature}","${req.body.room_com_id}","${req.body.room_size}","${room_image}")`;
    var data=await exe(sql)
    res.redirect("/admin/view_room_sub_cat_data")
})
route.get("/view_room_sub_cat_data",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var rooms=await exe("select * from rooms")
    if(rooms.length>0){
        var room_data=await exe("select * from rooms");
        var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
        res.render("admin/view_room_sub_cat_data.ejs",{successMessage,"room_data":room_data,"admin_data":admin_data});
    }
    else{
        res.redirect("/admin")
    }
    
})
route.get("/edit_room_sub_cat_data/:room_id",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var room_data=await exe(`select * from rooms where room_id="${req.params.room_id}"`);
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_room_sub_cat_data.ejs",{successMessage,"room_data":room_data,"admin_data":admin_data})
})
route.post("/update_room_sub_cat_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var room_image=(await exe(`select room_image from rooms where room_id="${req.body.room_id}"`))[0].room_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/room_image/${room_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var room_image=new Date().getTime()+req.files.room_image.name;
        req.files.room_image.mv("public/upload_image/room_image/"+room_image)
        var sql=`update rooms set room_name="${req.body.room_name}",room_price="${req.body.room_price}",room_type="${req.body.room_type}",room_feature="${req.body.room_feature}",room_com_id="${req.body.room_com_id}",room_size="${req.body.room_size}",room_image="${room_image}" where room_id="${req.body.room_id}"`
        var data=await exe(sql)
        res.redirect("/admin/view_room_sub_cat_data")
    }
    else{
        var sql=`update rooms set room_name="${req.body.room_name}",room_price="${req.body.room_price}",room_type="${req.body.room_type}",room_feature="${req.body.room_feature}",room_com_id="${req.body.room_com_id}",room_size="${req.body.room_size}" where room_id="${req.body.room_id}"`
        var data=await exe(sql)
        res.redirect("/admin/view_room_sub_cat_data")
    }
})
route.get("/delete_room_sub_cat_data",checkAdminLogin,async function(req,res){
    var room_image=(await exe(`select room_image from rooms where room_id="${urldata.id}"`))[0].room_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/room_image/${room_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var urldata=url.parse(req.url,true).query;
    var sql=`delete from rooms where room_id="${urldata.id}"`
    var data=await exe(sql)
    res.redirect("/admin/view_room_sub_cat_data")
})
route.get("/terms_condition",checkAdminLogin,async function(req,res){
    var term_con_data=await exe("select * from terms_condition")
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/terms_condition.ejs",{successMessage,"term_con_data":term_con_data,"admin_data":admin_data})
})
route.post("/save_terms_condition",checkAdminLogin,async function(req,res){
    var sql=`insert into terms_condition(ter_title,ter_desc) values ("${req.body.ter_title}","${req.body.ter_desc}")`;
    var data=await exe(sql)
    req.flash('success',"Terms And Condition Data Saved Successfully!..");
    res.redirect("/admin/terms_condition");
})
route.get("/edit_term_data/:ter_id",checkAdminLogin,async function(req,res){
    var ter_data=await exe(`select * from terms_condition where ter_id=${req.params.ter_id}`)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_term_data.ejs",{successMessage,"ter_data":ter_data,"admin_data":admin_data})
})
route.post("/update_terms_condition",checkAdminLogin,async function(req,res){
    var sql=`update terms_condition set ter_title="${req.body.ter_title}",ter_desc="${req.body.ter_desc}" where ter_id="${req.body.ter_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/terms_condition")
})
route.get("/delete_term_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var sql=`delete from terms_condition where ter_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/terms_condition")
})
route.get("/privacy_policy",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var pri_data=await exe("select * from privacy_policy")
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/privacy_policy.ejs",{successMessage,"pri_data":pri_data,"admin_data":admin_data});
})
route.post("/save_privacy_policy",checkAdminLogin,async function(req,res){
    var sql=`insert into privacy_policy (privacy_policy_title,privacy_policy_desc) values ("${req.body.privacy_policy_title}","${req.body.privacy_policy_desc}")`;
    var data=await exe(sql);
    req.flash('success',"Privacy and Policy Data Saved Successfully!..");
    res.redirect("/admin/privacy_policy")
})
route.get("/edit_pri_poli_data/:pri_id",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var pri_data=await exe("select * from privacy_policy");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_pri_poli_data.ejs",{successMessage,"pri_data":pri_data,"admin_data":admin_data});
})
route.post("/update_privacy_policy",checkAdminLogin,async function(req,res){
    var sql=`update privacy_policy set privacy_policy_title="${req.body.privacy_policy_title}",privacy_policy_desc="${req.body.privacy_policy_desc}" where pri_id="${req.body.pri_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/privacy_policy")
})
route.get("/delete_pri_poli_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var data=await exe(`delete from privacy_policy where pri_id="${urldata.id}"`);
    res.redirect("/admin/privacy_policy")
})
route.get("/aminity_facility",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var ami_data=await exe("select * from aminites_facility")
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/aminity_facility.ejs",{successMessage,"ami_data":ami_data,"admin_data":admin_data})
})
route.post("/save_aminity_facility",checkAdminLogin,async function(req,res){
    var ami_image=new Date().getTime()+req.files.ami_image.name;
    req.files.ami_image.mv("public/upload_image/aminity_facility_image/"+ami_image);
    var sql=`insert into aminites_facility(ami_image,ami_title,ami_desc) values ("${ami_image}","${req.body.ami_title}","${req.body.ami_desc}")`;
    var data=await exe(sql) 
    res.redirect("/admin/aminity_facility")
})
route.get("/edit_ami_data/:am_id",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var am_data=await exe(`select * from aminites_facility where am_id="${req.params.am_id}"`)
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_ami_data.ejs",{successMessage,"am_data":am_data,"admin_data":admin_data})
})
route.post("/update_aminity_facility",checkAdminLogin,async (req,res)=>{
    if(req.files){
        var ami_image=(await exe(`select ami_image from aminites_facility where am_id="${req.body.am_id}"`))[0].ami_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/aminity_facility_image/${ami_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var ami_image=new Date().getTime()+req.files.ami_image.name;
        req.files.ami_image.mv("public/upload_image/aminity_facility_image/"+ami_image);
        var sql=`update aminites_facility set ami_image="${ami_image}",ami_title="${req.body.ami_title}",ami_desc="${req.body.ami_desc}" where am_id="${req.body.am_id}"`;
        
        var data=await exe(sql);
        res.redirect("/admin/aminity_facility")
    }
    else{
        var sql=`update aminites_facility set ami_title="${req.body.ami_title}",ami_desc="${req.body.ami_desc}" where am_id="${req.body.am_id}"`;
        
        var data=await exe(sql);
        res.redirect("/admin/aminity_facility")
    }
})
route.get("/delete_ami_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var ami_image=(await exe(`select ami_image from aminites_facility where am_id="${urldata.id}"`))[0].ami_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/aminity_facility_image/${ami_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var am_data=await exe(`delete from aminites_facility where am_id="${urldata.id}"`);
    res.redirect("/admin/aminity_facility")
})
route.get("/why_choose_hotel",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var why_data=await exe("select * from why_choose_hotel");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/why_choose_hotel.ejs",{successMessage,"why_data":why_data,"admin_data":admin_data})
})
route.post("/save_why_choos",checkAdminLogin,async function(req,res){
    var why_image=new Date().getTime()+req.files.why_image.name;
    req.files.why_image.mv("public/upload_image/why_choose_hotel/"+why_image)
    var sql=`insert into why_choose_hotel (why_image,why_title,why_desc) values ("${why_image}","${req.body.why_title}","${req.body.why_desc}")`;
    var data=await exe(sql)
    res.redirect("/admin/why_choose_hotel")
})
route.get("/edit_why_data/:wh_id",checkAdminLogin,async function(req,res){
    var why_data=await exe(`select * from why_choose_hotel where wh_id="${req.params.wh_id}"`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_why_data.ejs",{"why_data":why_data,successMessage,"admin_data":admin_data})
})
route.post("/update_why_choos",checkAdminLogin,async function(req,res){
    if(req.files){
        var why_image=(await exe(`select why_image from why_choose_hotel where wh_id="${req.body.wh_id}"`))[0].why_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/why_choose_hotel/${why_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var why_image=new Date().getTime()+req.files.why_image.name;
        req.files.why_image.mv("public/upload_image/why_choose_hotel/"+why_image)
        var sql=`update why_choose_hotel set why_image="${why_image}",why_title="${req.body.why_title}",why_desc="${req.body.why_desc}" where wh_id="${req.body.wh_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/why_choose_hotel");
    }
    else{
        var sql=`update why_choose_hotel set why_title="${req.body.why_title}",why_desc="${req.body.why_desc}" where wh_id="${req.body.wh_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/why_choose_hotel");
    }
})
route.get("/delete_why_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var why_image=(await exe(`select why_image from why_choose_hotel where wh_id="${urldata.id}"`))[0].why_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/why_choose_hotel/${why_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var data=await exe(`delete from why_choose_hotel where wh_id="${urldata.id}"`);
    res.redirect("/admin/why_choose_hotel")
})
route.get("/gallery_data",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var gallery_data=await exe("select * from gallery")
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/gallery_data.ejs",{successMessage,"gallery_data":gallery_data,"admin_data":admin_data})
})
route.post("/save_gallery_data",checkAdminLogin,async function(req,res){
    var gallery_image=new Date().getTime()+req.files.gallery_image.name;
    req.files.gallery_image.mv("public/upload_image/gallery_image/"+gallery_image)
    var sql=`insert into gallery(gallery_image,gallery_video) values ("${gallery_image}","${req.body.gallery_video}")`;
    var data=await exe(sql)
    req.flash('success',"Gallery Data Saved Successfully!..");
    res.redirect("/admin/gallery_data");

})
route.get("/edit_gallery_data/:gallery_id",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var gallery_data=await exe(`select * from gallery where gallery_id="${req.params.gallery_id}"`)
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_gallery_data.ejs",{successMessage,"gallery_data":gallery_data,"admin_data":admin_data})
})
route.post("/update_gallery_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var gallery_image=(await exe(`select gallery_image from gallery where gallery_id="${req.body.gallery_id}"`))[0].gallery_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/gallery_image/${gallery_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var gallery_image=new Date().getTime()+req.files.gallery_image.name;
        req.files.gallery_image.mv("public/upload_image/gallery_image/"+gallery_image)
        var sql=`update gallery set gallery_image="${gallery_image}",gallery_video="${req.body.gallery_video}" where gallery_id="${req.body.gallery_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/gallery_data")
    }
    else{
        var sql=`update gallery set gallery_video="${req.body.gallery_video}" where gallery_id="${req.body.gallery_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/gallery_data")
    }
})
route.get("/delete_gallery_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var gallery_image=(await exe(`select gallery_image from gallery where gallery_id="${urldata.id}"`))[0].gallery_image;
    // Assuming you have old file information from the database
    const oldFilePath = `public/upload_image/gallery_image/${gallery_image}`;
    // Delete old file
    fs.unlink(oldFilePath, (err) => {
        if (err) {
            console.error("Error deleting old file: ${err.message}");
        }
        else{
            console.log("Data deletes succssfully after click on update button")
        }
    });
    var data=await exe(`delete from gallery where gallery_id="${urldata.id}"`);
    res.redirect("/admin/gallery_data")
})
route.get("/blog",checkAdminLogin,async function(req,res){
    var blog_data=await exe("select * from blog");
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/blog.ejs",{successMessage,"blog_data":blog_data,"admin_data":admin_data})
})
route.post("/save_blog_data",checkAdminLogin,async function(req,res){
    var blog_image=new Date().getTime()+req.files.blog_image.name;
    req.files.blog_image.mv("public/upload_image/blog_image/"+blog_image);
    var sql=`insert into blog(blog_title,blog_desc,blog_image) values ("${req.body.blog_title}","${req.body.blog_desc}","${blog_image}")`
    var data=await exe(sql)
    req.flash('success',"Blog Data Saved Successfully!..");
    res.redirect("/admin/blog")
})
route.get("/edit_blog_data/:blog_id",checkAdminLogin,async function(req,res){
    var blog_data=await exe(`select * from blog where blog_id="${req.params.blog_id}"`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_blog_data.ejs",{"blog_data":blog_data,successMessage,"admin_data":admin_data})
})
route.post("/update_blog_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var blog_image=(await exe(`select blog_image from blog where blog_id="${req.body.blog_id}"`))[0].blog_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/blog_image/${blog_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var blog_image=new Date().getTime()+req.files.blog_image.name;
        req.files.blog_image.mv("public/upload_image/blog_image/"+blog_image);
        var sql=`update blog set blog_title="${req.body.blog_title}",blog_desc="${req.body.blog_desc}",blog_image="${blog_image}" where blog_id="${req.body.blog_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/blog")
    }
    else{
        var sql=`update blog set blog_title="${req.body.blog_title}",blog_desc="${req.body.blog_desc}" where blog_id="${req.body.blog_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/blog")
    }
})
route.get("/delete_blog_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var blog_image=(await exe(`select blog_image from blog where blog_id="${urldata.id}"`))[0].blog_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/blog_image/${blog_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var data=await exe(`delete from blog where blog_id="${urldata.id}"`);
    res.redirect("/admin/blog")

})
route.get("/rewards",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var reward_data=await exe("select * from rewards");
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/rewards.ejs",{successMessage,"reward_data":reward_data,"admin_data":admin_data});
})
route.post("/save_rewards_data",checkAdminLogin,async function(req,res){
    var reward_image=new Date().getTime()+req.files.reward_image.name;
    req.files.reward_image.mv("public/upload_image/reward_image/"+reward_image);
    var sql=`insert into rewards (rew_title,rew_desc,rew_date,reward_image) values ("${req.body.rew_title}","${req.body.rew_desc}","${req.body.rew_date}","${reward_image}")`;
    var data=await exe(sql)
    res.redirect("/admin/rewards")
})
route.get("/edit_reward_data/:rew_id",checkAdminLogin,async function(req,res){
    var reward_data=await exe(`select * from rewards where rew_id="${req.params.rew_id}"`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_reward_data.ejs",{successMessage,"reward_data":reward_data,"admin_data":admin_data})
})
route.post("/update_rewards_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var reward_image=(await exe(`select reward_image from rewards where rew_id="${req.body.rew_id}"`))[0].reward_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/reward_image/${reward_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var reward_image=new Date().getTime()+req.files.reward_image.name;
        req.files.reward_image.mv("public/upload_image/reward_image/"+reward_image);
        var sql=`update rewards set rew_title="${req.body.rew_title}",rew_desc="${req.body.rew_desc}",rew_date="${req.body.rew_date}",reward_image="${reward_image}" where rew_id="${req.body.rew_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/rewards")
    }
    else{
        var sql=`update rewards set rew_title="${req.body.rew_title}",rew_desc="${req.body.rew_desc}",rew_date="${req.body.rew_date}" where rew_id="${req.body.rew_id}"`;
        var data=await exe(sql)
       res.redirect("/admin/rewards")
    }
})
route.get("/delete_reward_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var reward_image=(await exe(`select reward_image from rewards where rew_id="${urldata.id}"`))[0].reward_image;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/reward_image/${reward_image}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
    var sql=`delete from rewards where rew_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/rewards")
})
route.get("/starters",checkAdminLogin,async function(req,res){
    var sql=`select * from starter`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/starters.ejs",{successMessage,"start_data":data,"admin_data":admin_data});
})
route.post("/save_starter_data",checkAdminLogin,async function(req,res){
    // var sql=`insert into starter(first_dish,first_dish_dis,second_dish,sec_des,thir_dish,thir_dis,fourth_dish,fourth_dis,fifth_dish,fifth_des,sixth_dish,sixth_des,fir_pri,sec_pri,thir_pri,four_pri,fif_pri,six_pri) values ("${req.body.first_dish}","${req.body.first_dish_dis}","${req.body.second_dish}","${req.body.sec_des}","${req.body.thir_dish}","${req.body.thir_dis}","${req.body.fourth_dish}","${req.body.fourth_dis}","${req.body.fifth_dish}","${req.body.fifth_des}","${req.body.sixth_dish}","${req.body.sixth_des}","${req.body.fir_pri}","${req.body.sec_pri}","${req.body.thir_pri}","${req.body.four_pri}","${req.body.fif_pri}","${req.body.six_pri}")`;
    var sql=`update starter set first_dish="${req.body.first_dish}",first_dish_dis="${req.body.first_dish_dis}",second_dish="${req.body.second_dish}",sec_des="${req.body.sec_des}",thir_dish="${req.body.thir_dish}",thir_dis="${req.body.thir_dis}",fourth_dish="${req.body.fourth_dish}",fourth_dis="${req.body.fourth_dis}",fifth_dish="${req.body.fifth_dish}",fifth_des="${req.body.fifth_des}",sixth_dish="${req.body.sixth_dish}",sixth_des="${req.body.sixth_des}",fir_pri="${req.body.fir_pri}",sec_pri="${req.body.sec_pri}",thir_pri="${req.body.thir_pri}",four_pri="${req.body.four_pri}",fif_pri="${req.body.fif_pri}",six_pri="${req.body.six_pri}"`
    var data=await exe(sql)
    req.flash('success',"Starter Data Updated Successfully!..");
    res.redirect("/admin/starters")
})
route.get("/salad",checkAdminLogin,async function(req,res){
    var sql=`select * from salad`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/salad.ejs",{successMessage,"start_data":data,"admin_data":admin_data})
})
route.post("/save_salad_data",checkAdminLogin,async function(req,res){
    // var sql=`insert into salad(first_dish,first_dish_dis,second_dish,sec_des,thir_dish,thir_dis,fourth_dish,fourth_dis,fifth_dish,fifth_des,sixth_dish,sixth_des,fir_pri,sec_pri,thir_pri,four_pri,fif_pri,six_pri) values ("${req.body.first_dish}","${req.body.first_dish_dis}","${req.body.second_dish}","${req.body.sec_des}","${req.body.thir_dish}","${req.body.thir_dis}","${req.body.fourth_dish}","${req.body.fourth_dis}","${req.body.fifth_dish}","${req.body.fifth_des}","${req.body.sixth_dish}","${req.body.sixth_des}","${req.body.fir_pri}","${req.body.sec_pri}","${req.body.thir_pri}","${req.body.four_pri}","${req.body.fif_pri}","${req.body.six_pri}")`;
    var sql=`update salad set first_dish="${req.body.first_dish}",first_dish_dis="${req.body.first_dish_dis}",second_dish="${req.body.second_dish}",sec_des="${req.body.sec_des}",thir_dish="${req.body.thir_dish}",thir_dis="${req.body.thir_dis}",fourth_dish="${req.body.fourth_dish}",fourth_dis="${req.body.fourth_dis}",fifth_dish="${req.body.fifth_dish}",fifth_des="${req.body.fifth_des}",sixth_dish="${req.body.sixth_dish}",sixth_des="${req.body.sixth_des}",fir_pri="${req.body.fir_pri}",sec_pri="${req.body.sec_pri}",thir_pri="${req.body.thir_pri}",four_pri="${req.body.four_pri}",fif_pri="${req.body.fif_pri}",six_pri="${req.body.six_pri}"`
    var data=await exe(sql)
    req.flash('success',"Salad Data Updated Successfully!..");
    res.redirect("/admin/salad")
})
route.get("/wine",checkAdminLogin,async function(req,res){
    var sql=`select * from wine`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/wine.ejs",{successMessage,"start_data":data,"admin_data":admin_data});
})
route.post("/save_wine_data",checkAdminLogin,async function(req,res){
    // var sql=`insert into wine(first_dish,first_dish_dis,second_dish,sec_des,thir_dish,thir_dis,fourth_dish,fourth_dis,fifth_dish,fifth_des,sixth_dish,sixth_des,fir_pri,sec_pri,thir_pri,four_pri,fif_pri,six_pri) values ("${req.body.first_dish}","${req.body.first_dish_dis}","${req.body.second_dish}","${req.body.sec_des}","${req.body.thir_dish}","${req.body.thir_dis}","${req.body.fourth_dish}","${req.body.fourth_dis}","${req.body.fifth_dish}","${req.body.fifth_des}","${req.body.sixth_dish}","${req.body.sixth_des}","${req.body.fir_pri}","${req.body.sec_pri}","${req.body.thir_pri}","${req.body.four_pri}","${req.body.fif_pri}","${req.body.six_pri}")`;
    var sql=`update wine set first_dish="${req.body.first_dish}",first_dish_dis="${req.body.first_dish_dis}",second_dish="${req.body.second_dish}",sec_des="${req.body.sec_des}",thir_dish="${req.body.thir_dish}",thir_dis="${req.body.thir_dis}",fourth_dish="${req.body.fourth_dish}",fourth_dis="${req.body.fourth_dis}",fifth_dish="${req.body.fifth_dish}",fifth_des="${req.body.fifth_des}",sixth_dish="${req.body.sixth_dish}",sixth_des="${req.body.sixth_des}",fir_pri="${req.body.fir_pri}",sec_pri="${req.body.sec_pri}",thir_pri="${req.body.thir_pri}",four_pri="${req.body.four_pri}",fif_pri="${req.body.fif_pri}",six_pri="${req.body.six_pri}"`
    var data=await exe(sql)
    req.flash('success',"Wine Data Updated Successfully!..");
    res.redirect("/admin/wine")
})
route.get("/breakfast",checkAdminLogin,async function(req,res){
    var sql=`select * from breakfast`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/breakfast.ejs",{successMessage,"start_data":data,"admin_data":admin_data});
})
route.post("/save_breakfast_data",checkAdminLogin,async function(req,res){
    // var sql=`insert into wine(first_dish,first_dish_dis,second_dish,sec_des,thir_dish,thir_dis,fourth_dish,fourth_dis,fifth_dish,fifth_des,sixth_dish,sixth_des,fir_pri,sec_pri,thir_pri,four_pri,fif_pri,six_pri) values ("${req.body.first_dish}","${req.body.first_dish_dis}","${req.body.second_dish}","${req.body.sec_des}","${req.body.thir_dish}","${req.body.thir_dis}","${req.body.fourth_dish}","${req.body.fourth_dis}","${req.body.fifth_dish}","${req.body.fifth_des}","${req.body.sixth_dish}","${req.body.sixth_des}","${req.body.fir_pri}","${req.body.sec_pri}","${req.body.thir_pri}","${req.body.four_pri}","${req.body.fif_pri}","${req.body.six_pri}")`;
    var sql=`update breakfast set first_dish="${req.body.first_dish}",first_dish_dis="${req.body.first_dish_dis}",second_dish="${req.body.second_dish}",sec_des="${req.body.sec_des}",thir_dish="${req.body.thir_dish}",thir_dis="${req.body.thir_dis}",fourth_dish="${req.body.fourth_dish}",fourth_dis="${req.body.fourth_dis}",fifth_dish="${req.body.fifth_dish}",fifth_des="${req.body.fifth_des}",sixth_dish="${req.body.sixth_dish}",sixth_des="${req.body.sixth_des}",fir_pri="${req.body.fir_pri}",sec_pri="${req.body.sec_pri}",thir_pri="${req.body.thir_pri}",four_pri="${req.body.four_pri}",fif_pri="${req.body.fif_pri}",six_pri="${req.body.six_pri}"`
    var data=await exe(sql)
    req.flash('success',"BreakFast Data Updated Successfully!..");
    res.redirect("/admin/breakfast")
})
route.get("/desert",checkAdminLogin,async function(req,res){
    var sql=`select * from desert`;
    var data=await exe(sql)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/desert.ejs",{successMessage,"start_data":data,"admin_data":admin_data});
})
route.post("/save_desert_data",checkAdminLogin,async function(req,res){
    // var sql=`insert into wine(first_dish,first_dish_dis,second_dish,sec_des,thir_dish,thir_dis,fourth_dish,fourth_dis,fifth_dish,fifth_des,sixth_dish,sixth_des,fir_pri,sec_pri,thir_pri,four_pri,fif_pri,six_pri) values ("${req.body.first_dish}","${req.body.first_dish_dis}","${req.body.second_dish}","${req.body.sec_des}","${req.body.thir_dish}","${req.body.thir_dis}","${req.body.fourth_dish}","${req.body.fourth_dis}","${req.body.fifth_dish}","${req.body.fifth_des}","${req.body.sixth_dish}","${req.body.sixth_des}","${req.body.fir_pri}","${req.body.sec_pri}","${req.body.thir_pri}","${req.body.four_pri}","${req.body.fif_pri}","${req.body.six_pri}")`;
    var sql=`update desert set first_dish="${req.body.first_dish}",first_dish_dis="${req.body.first_dish_dis}",second_dish="${req.body.second_dish}",sec_des="${req.body.sec_des}",thir_dish="${req.body.thir_dish}",thir_dis="${req.body.thir_dis}",fourth_dish="${req.body.fourth_dish}",fourth_dis="${req.body.fourth_dis}",fifth_dish="${req.body.fifth_dish}",fifth_des="${req.body.fifth_des}",sixth_dish="${req.body.sixth_dish}",sixth_des="${req.body.sixth_des}",fir_pri="${req.body.fir_pri}",sec_pri="${req.body.sec_pri}",thir_pri="${req.body.thir_pri}",four_pri="${req.body.four_pri}",fif_pri="${req.body.fif_pri}",six_pri="${req.body.six_pri}"`
    var data=await exe(sql)
    req.flash('success',"Desert Data Updated Successfully!..");
    res.redirect("/admin/desert")
})
route.get("/career",checkAdminLogin,async function(req,res){
    var car_data=await exe("select * from career")
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/career.ejs",{successMessage,"car_data":car_data,"admin_data":admin_data})
})
route.post("/save_career_data",checkAdminLogin,async function(req,res){
    var sql=`insert into career(job_title,job_education,job_age,job_salary,job_apply_link) values ("${req.body.job_title}","${req.body.job_education}","${req.body.job_age}","${req.body.job_salary}","${req.body.job_apply_link}")`;
    var data=await exe(sql)
    req.flash('success',"Job Posted Successfully!..");
    res.redirect("/admin/career");
})
route.get("/edit_car_data/:car_id",checkAdminLogin,async function(req,res){
    var car_data=await exe(`select * from career where car_id="${req.params.car_id}"`)
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_car_data.ejs",{"car_data":car_data,successMessage,"admin_data":admin_data})
})
route.post("/update_career_data",checkAdminLogin,async function(req,res){
    var sql=`update career set job_title="${req.body.job_title}",job_education="${req.body.job_education}",job_age="${req.body.job_age}",job_salary="${req.body.job_salary}",job_apply_link="${req.body.job_apply_link}" where car_id="${req.body.car_id}"`;
    var data=await exe(sql)
    res.redirect("/admin/career")
})
route.get("/delete_car_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var sql=`delete from career where car_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/career")

})
route.get("/contact_map",checkAdminLogin,async function(req,res){
    var con_data=await exe("select * from contact_map");
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/contact_map.ejs",{successMessage,"con_data":con_data,"admin_data":admin_data})
})
route.post("/update_contact_map",checkAdminLogin,async function(req,res){
    var sql=`update contact_map set con_link='${req.body.con_link}'`;
    var data=await exe(sql)
    req.flash('success',"Contact Map Updated Successfully!..");
    res.redirect("/admin/contact_map")
})
route.get("/admin_data",checkAdminLogin,async function(req,res){
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data`);
    var admin_data1=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/admin_data.ejs",{successMessage,"admin_data":admin_data,"admin_data1":admin_data1})
})
route.post("/save_admin_data",checkAdminLogin,async function(req,res){
    var admin_img=new Date().getTime()+req.files.admin_img.name;
    req.files.admin_img.mv("public/upload_image/admin_image/"+admin_img)
    var sql=`insert into admin_data (admin_name,admin_mobile,admin_email,admin_img,admin_password,admin_desig) values ("${req.body.admin_name}","${req.body.admin_mobile}","${req.body.admin_email}","${admin_img}","${req.body.admin_password}","${req.body.admin_desig}")`;
    var data=await exe(sql)
    res.redirect("/admin/admin_data");
})
route.get("/edit_admin_data/:ad_id",checkAdminLogin,async function(req,res){
    var admin_data=await exe(`select * from admin_data where ad_id="${req.params.ad_id}"`);
    var successMessage=req.flash('success')[0];
    var admin_data1=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_admin_data.ejs",{successMessage,"admin_data":admin_data,"admin_data1":admin_data1})
})
route.post("/update_admin_data",checkAdminLogin,async function(req,res){
    if(req.files){
        var admin_img=(await exe(`select admin_img from admin_data where ad_id="${req.body.ad_id}"`))[0].admin_img;
        // Assuming you have old file information from the database
        const oldFilePath = `public/upload_image/admin_image/${admin_img}`;
        // Delete old file
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error("Error deleting old file: ${err.message}");
            }
            else{
                console.log("Data deletes succssfully after click on update button")
            }
        });
        var admin_img=new Date().getTime()+req.files.admin_img.name;
        req.files.admin_img.mv("public/upload_image/admin_image/"+admin_img)
        var sql=`update admin_data set admin_name="${req.body.admin_name}",admin_mobile="${req.body.admin_mobile}",admin_email="${req.body.admin_email}",admin_img="${admin_img}",admin_password="${req.body.admin_password}",admin_desig="${req.body.admin_desig}" where ad_id="${req.body.ad_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/admin_data");
    }
    else{
        var sql=`update admin_data set admin_name="${req.body.admin_name}",admin_mobile="${req.body.admin_mobile}",admin_email="${req.body.admin_email}",admin_password="${req.body.admin_password}",admin_desig="${req.body.admin_desig}" where ad_id="${req.body.ad_id}"`;
        var data=await exe(sql)
        res.redirect("/admin/admin_data");
    }
})
route.get("/delete_admin_data",checkAdminLogin,async function(req,res){
    var urldata=url.parse(req.url,true).query;
    var admin_img=(await exe(`select admin_img from admin_data where ad_id="${urldata.id}"`))[0].admin_img;
    // Assuming you have old file information from the database
    const oldFilePath = `public/upload_image/admin_image/${admin_img}`;
    // Delete old file
    fs.unlink(oldFilePath, (err) => {
        if (err) {
            console.error("Error deleting old file: ${err.message}");
        }
        else{
            console.log("Data deletes succssfully after click on update button")
        }
    });
    var sql=`delete from admin_data where ad_id="${urldata.id}"`;
    var data=await exe(sql)
    res.redirect("/admin/admin_data")
})
route.get("/view_profile",async function(req,res){
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    var admin_data1=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/view_profile.ejs",{successMessage,"admin_data":admin_data,"admin_data1":admin_data1})
})
route.get("/logout_admin",async function(req,res){
    var sql=`delete from admin_data where ad_id="${req.session.ad_id}"`;
    var data=await exe(sql)
    res.redirect("/login")
})
route.get("/faq",async function(req,res){
    var faq_data=await exe(`select * from faq`);
    var successMessage=req.flash('success')[0];
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/faq.ejs",{successMessage,"faq_data":faq_data,"admin_data":admin_data})
})
route.post("/save_faq_data",async function(req,res){
    var sql=`insert into faq(faq_que,faq_ans) values ("${req.body.faq_que}","${req.body.faq_ans}")`;
    var data=await exe(sql)
    req.flash('success',"Faq Data Saved Successfully!..");
    res.redirect("/admin/faq");
})
route.get("/edit_faq_data_data/:faq_id",async function(req,res){
    var successMessage=req.flash('success')[0];
    var faq_data=await exe(`select * from faq where faq_id="${req.params.faq_id}"`)
    var admin_data=await exe(`select * from admin_data where ad_id="${req.session.ad_id}"`)
    res.render("admin/edit_faq_data_data.ejs",{successMessage,"faq_data":faq_data,"admin_data":admin_data})
})
route.post("/update_faq_data",async function(req,res){
    var sql=`update faq set faq_que="${req.body.faq_que}",faq_ans="${req.body.faq_ans}" where faq_id="${req.body.faq_id}"`;
    var data=await exe(sql)
    req.flash('success',"Faq Data Updated Successfully!..");
    res.redirect("/admin/faq")
})
route.get("/delete_faq_data_data",async function(req,res){
    var urldata=url.parse(req.url,true).query
    var data=await exe(`delete from faq where faq_id="${urldata.id}"`);
    res.redirect("/admin/faq")
})
module.exports=route;

// create table faq(faq_id integer primary key auto_increment,faq_que text,faq_ans text);

// create table admin_data(ad_id integer primary key auto_increment,admin_name varchar(3000),admin_mobile varchar(11),admin_email varchar(30000),admin_img text,admin_password varchar(20000),admin_desig);

// create table contact_map(con_id integer primary key auto_increment,con_link text);

// create table career(car_id integer primary key auto_increment,job_title text,job_education text,job_age text,job_salary decimal,job_apply_link text);

// insert into salad(first_dish,first_dish_dis,second_dish,sec_des,thir_dish,thir_dis,fourth_dish,fourth_dis,fifth_dish,fifth_des,sixth_dish,sixth_des,fir_pri,sec_pri,thir_pri,four_pri,fif_pri,six_pri) values ("asdfg","asdfgh","sdfg","asdfg","asdfg","asdf","asdfg","sdfgh","asdfg","asdfgh","asdfghj","asdfg","234","234","234","234","234","234")

// create table salad(str_id integer primary key auto_increment,first_dish varchar(100000),first_dish_dis text,second_dish varchar(20000),sec_des text,thir_dish varchar(20000),thir_dis text,fourth_dish varchar(20000),fourth_dis varchar(20000),fifth_dish varchar(30000),fifth_des text,sixth_dish varchar(20000),sixth_des text,fir_pri decimal,sec_pri decimal,thir_pri decimal,four_pri decimal,fif_pri decimal,six_pri decimal);


// create table starter(str_id integer primary key auto_increment,first_dish varchar(100000),first_dish_dis text,second_dish varchar(20000),sec_des text,thir_dish varchar(20000),thir_dis text,fourth_dish varchar(20000),fourth_dis varchar(20000),fifth_dish varchar(30000),fifth_des text,sixth_dish varchar(20000),sixth_des text,fir_pri decimal,sec_pri decimal,thir_pri decimal,four_pri decimal,fif_pri decimal,six_pri decimal);

// create table rewards(rew_id integer primary key auto_increment,rew_title text,rew_desc text,rew_date varchar(30000),reward_image text);


// create table blog (blog_id integer primary key auto_increment,blog_title text,blog_desc text,blog_image text);

// create table gallery(gallery_id integer primary key auto_increment,gallery_image text,gallery_video text);

// create table why_choose_hotel (wh_id integer primary key auto_increment,why_image text,why_title text,why_desc text)

// create table aminites_facility(am_id integer primary key auto_increment,ami_image text,ami_title text,ami_desc text);

// create table privacy_policy(pri_id integer primary key auto_increment,privacy_policy_title text,privacy_policy_desc text)

// create table terms_condition(ter_id integer primary key auto_increment,ter_title text,ter_desc text)

// create table rooms(room_id integer primary key auto_increment,room_name text,room_price decimal,room_type text,room_feature text,room_com_id integer,room_size integer,room_image text)

// create table events_hall (event_hall_id integer primary key auto_increment,event_hall_com_id integer,event_hall_name text,event_hall_price text,event_hall_feature text,event_hall_image text);

// create table wines (wines_id integer primary key auto_increment,wines_name varchar(10000),wines_price integer,wines_quantity integer,wine_com_id integer,wines_description text,wines_image text,wines_feature text) 

// create table food (food_id integer primary key AUTO_INCREMENT,food_name varchar(20000),food_price integer,food_quantity integer,food_com_id text,food_image text,food_description text,food_feature_one text,food_feature_two text,food_feature_three text,food_veg_nonveg varchar(20000),food_type text)

// create table category(cat_id integer primary key auto_increment,cat_name text,cat_desc text)

// create table offer(offer_id integer primary key auto_increment,offer_image text,offer_price decimal,offer_price_percentage integer,offer_name text);

// create table offer_details (offer_det_id integer primary key auto_increment,offer_det_description text,offer_det_che_in text,offer_det_checkout text,offer_det_pets varchar(1000),total_person integer,wifi varchar(1000),offer_room_size integer,food_service varchar(2000));

// create table hotel_owner(hot_on_id integer primary key auto_increment,hotel_owner_image text,hotel_owner_name text,hotel_owner_education text,hotel_owner_description text)



// create table special_offer (special_id integer primary key auto_increment,special_offer_name varchar(20000),special_offer_price decimal,special_offer_percentage integer,special_offer_image text)

// create table special_offer_details(spd_id integer primary key auto_increment,special_offer_description text,check_in_details text,check_out_details text,special_checkin_instruction text,pets varchar(1000),allowed_person integer,wifi_con varchar(1000),room_size integer,breakfast varchar(100))

// create table team_member (tem_member_id integer primary key auto_increment,team_member_name varchar(20000),team_member_image text,team_member_mobile varchar(11),team_member_lidin text,team_facebook_link text,team_member_email text,team_member_desi  varchar(200000));

// create table about_gallery (about_gallery_id integer primary key auto_increment,about_gallery_name varchar(10000),about_gallery_image text)

// create table dishes (dis_id integer primary key auto_increment,dish_name varchar(10000),dish_image text,dis_fea_one varchar(20000),dis_fea_two varchar(20000),dis_fea_three varchar(20000),dis_price decimal)

// create table hotel_views (hotel_view_id integer primary key auto_increment,hotel_view_image text,hotel_view_title varchar(10000),hotel_view_description text);

// create table break_fast(br_id integer primary key auto_increment,break_fast_name varchar(2000),break_fast_price decimal,breakfast_feature_id integer,breakfast_fea_one text,breakfast_fea_two text,breakfast_fea_three text,breakfast_img text,brf_dish_fea text);

// create table dishes(dis_id integer primary key auto_increment,dish_name text,dish_cat integer,dish_price decimal,dish_fea_one text,dish_fea_two text,dish_fea_three text,dish_img text,dish_cat_feature text);

// create table hotel_client(hot_client_id integer primary key auto_increment,hot_client_image text,hot_client_name varchar(20000),hot_client_description text)

// create table our_new (our_news_id integer primary key auto_increment,our_news_title varchar(2000),our_new_subtitle varchar(10000),our_news_description text,our_news_data text,our_news_image text)

// create table hotel_facility_discover(hot_id integer primary key auto_increment,hot_subtitle text,hot_description text,hot_image text);

// create table hotel_facility_discover_image (hot_fac_img integer primary key auto_increment,hotel_facility_image text,facility_desc varchar(1000))

// create table test_rating(rat_id,rating integer)

// create table testimonial (test_id integer primary key auto_increment,test_name varchar(20000),test_description varchar(10000),test_img text);

// create table hotel_facilites(fac_id integer primary key auto_increment,fac_title varchar(10000),fac_description varchar(50000))

// create table latest_video(lat_id integer primary key auto_increment,latest_video_title varchar(1000),latest_video_description varchar(2000),latest_video text,latest_video_background_image text)

// create table extra_service(extra_id integer primary key auto_increment,extra_service_slider_image text,extra_service_title varchar(1000),extra_service_price integer,extra_service_feature varchar(20000),extra_service_one varchar(2000),extra_service_two varchar(2000),extra_service_three varchar(3000))

// create table rooms_and_sweets(room_id integer primary key auto_increment,rooms_image text,room_name varchar(2000),room_price integer,room_type varchar(2000))

// create table about(about_first_image,about_second_image,about_description)


// create table slider (sli_id integer primary key auto_increment,slider_subtitle varchar(10000),slider_maintitle varchar(20000),slider_rating varchar(10),slider_image text);

// create table basic_information(bid integer primary key auto_increment,hotel_logo text,about_title varchar(1000),about_description text,hotel_address text,hotel_contact_number varchar(12),hotel_email_id text,instagram_link text,twitter_link text,youtube_link text,facebook_link text,whatsapp_link text);