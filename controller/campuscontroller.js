require('dotenv').config()
const { find } = require('../model/studentModel');
const studentModel = require('../model/studentModel')
const campusModel = require('../model/campusModel')
const nodemailer = require('nodemailer');

const adminmail = process.env.SMAIL
const adminpass = process.env.SPASS
const { DateTime } = require("luxon");

//mail ka khel
const sendmail2 = async (receiver,username)=>
{
    const smail=adminmail;
    const spass= adminpass;
    const recievername = username
    var subjectto = "Details Submitted"
    var message = 'Dear '+ recievername + `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
    
            <body>
            <p>Congratulations!!!</p>
            <p>Thanks for your connecting with THINKWHAT</p>
            </br>
            <p>We are excited you have taken the first step towards getting results.</p>
            <p>You will recieve a message from our representative team members shortly . </p>
            <p>Congratulations Once again! we are thrilled to you have join our team.</p>
            <p>Welcome Abroad</p>
            <p>Visit to: <a href="thinkwht.com">thinkwht.com</a></p>
            <p>Regards</p>
            </br>
            <p>HR Team</p>
        </body>
    </html>
    `
    let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: smail, // generated ethereal user
        pass: spass // generated ethereal password
    }
}); 
//Sending mail to provided emailid
let info = transporter.sendMail({
        from: smail, // sender address
        to: receiver, // list of receivers
        subject: subjectto, // Subject line
        html: message
       
    },
    function(error) {
        
        console.log(error.message)
    })
}
const dateandtime = () => {
    const dt = DateTime.now();
    var hours = dt.hour;
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    var minutes = dt.minute;
    const month = dt.month;
    const day = dt.day;
    const year = dt.year;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const finaldate =
      day + "/" + month + "/" + year + " " + hours + ":" + minutes + " " + ampm;
    return finaldate;
  };

const postcampusform = async (req,res)=>
{
    const currentdate = dateandtime();
  
    try{
        const countstudents = await campusModel.count()
        const studentnumber = countstudents+1;
        const studentid ='TWCA16250'+studentnumber
        const username = req.body.name
        const singleCampus = new campusModel(
            {
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                collegeName:req.body.college,
                branch:req.body.branch,
                year:req.body.year,
                location:req.body.location,
                date: currentdate,
                campusAmbassadorID:studentid,
            }
        )
        
         const userdata = await singleCampus.save(); 
         const receiver= userdata.email;  
         const recievername = userdata.name 
         sendmail2(receiver,username);
         res.redirect("/thanks")
   }

            catch(error)
            {
                console.log(error.messsage);
            }
}
/// frontend development

const getupdatepage = (req,res)=>
{
   res.render('updatepage')
}











module.exports={
 
  postcampusform
 // taketransactionid,
  //getupdatepage
  
}