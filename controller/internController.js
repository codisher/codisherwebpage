require('dotenv').config()
const { find } = require('../model/studentModel');
const internModel = require('../model/internModel')
const studentModel = require('../model/studentModel')
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

const postinternform = async (req,res)=>
{
    
    const currentdate = dateandtime();
  
    try{
        const countinterns = await internModel.count()
        const internnumber = countinterns+170;
        const internid ='TW1625000'+internnumber
        const username = req.body.name
        const singleintern = new internModel(
            {
                name:req.body.name,
                // input
                mobile:req.body.mobile,
                //input
                email:req.body.email,
                // input
                courses:req.body.course,
                courseID:req.body.courseID,
                // input
                //input
                date: currentdate,
                internID:internid,
                college:req.body.college
            }
        )
        
         const userdata = await singleintern.save(); 
         const receiver= userdata.email;  
         const recievername = userdata.name 
         sendmail2(receiver,username);
         res.redirect('/thanks')

   }

            catch(error)
            {
                console.log(error.messsage);
            }
}
/// frontend development

module.exports={
  postinternform,
 
 // taketransactionid,
  //getupdatepage
  
}