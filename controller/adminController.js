require('dotenv').config()
const studentModel = require('../model/studentModel')
const nodemailer =require('nodemailer')
const adminModel = require('../model/adminModel')
const internModel = require('../model/internModel')
const campusModel = require('../model/campusModel')
  // env files
   const adminmail=process.env.SMAIL
   const adminpass=process.env.SPASS


// mail ka khel 

const sendmail2 = async (receiver)=>
{
    const smail=adminmail;
    const spass= adminpass;
    console.log(receiver)
    
    var subjectto = "Confirmation Email"
    var message = "Your Transaction is successfull our team will reach you soon"
    console.log(subjectto + ' ' + message + ' ' + receiver)
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
        html: `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>A simple, clean, and responsive HTML invoice template</title>
        
                <style>
                    .invoice-box {
                        max-width: 800px;
                        margin: auto;
                        padding: 30px;
                        border: 1px solid #eee;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                        font-size: 16px;
                        line-height: 24px;
                        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                        color: #555;
                    }
        
                    .invoice-box table {
                        width: 100%;
                        line-height: inherit;
                        text-align: left;
                    }
        
                    .invoice-box table td {
                        padding: 5px;
                        vertical-align: top;
                    }
        
                    .invoice-box table tr td:nth-child(2) {
                        text-align: right;
                    }
        
                    .invoice-box table tr.top table td {
                        padding-bottom: 20px;
                    }
        
                    .invoice-box table tr.top table td.title {
                        font-size: 45px;
                        line-height: 45px;
                        color: #333;
                    }
        
                    .invoice-box table tr.information table td {
                        padding-bottom: 40px;
                    }
        
                    .invoice-box table tr.heading td {
                        background: #eee;
                        border-bottom: 1px solid #ddd;
                        font-weight: bold;
                    }
        
                    .invoice-box table tr.details td {
                        padding-bottom: 20px;
                    }
        
                    .invoice-box table tr.item td {
                        border-bottom: 1px solid #eee;
                    }
        
                    .invoice-box table tr.item.last td {
                        border-bottom: none;
                    }
        
                    .invoice-box table tr.total td:nth-child(2) {
                        border-top: 2px solid #eee;
                        font-weight: bold;
                    }
        
                    @media only screen and (max-width: 600px) {
                        .invoice-box table tr.top table td {
                            width: 100%;
                            display: block;
                            text-align: center;
                        }
        
                        .invoice-box table tr.information table td {
                            width: 100%;
                            display: block;
                            text-align: center;
                        }
                    }
        
                    /** RTL **/
                    .invoice-box.rtl {
                        direction: rtl;
                        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                    }
        
                    .invoice-box.rtl table {
                        text-align: right;
                    }
        
                    .invoice-box.rtl table tr td:nth-child(2) {
                        text-align: left;
                    }
                </style>
            </head>
        
            <body>
                <div class="invoice-box">
                    <table cellpadding="0" cellspacing="0">
                        <tr class="top">
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td class="title">
                                            <img src="https://www.sparksuite.com/images/logo.png" style="width: 100%; max-width: 300px" />
                                        </td>
        
                                        <td>
                                            Invoice #: 123<br />
                                            Created: January 1, 2015<br />
                                            Due: February 1, 2015
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
        
                        <tr class="information">
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <td>
                                            Sparksuite, Inc.<br />
                                            12345 Sunny Road<br />
                                            Sunnyville, CA 12345
                                        </td>
        
                                        <td>
                                            Acme Corp.<br />
                                            John Doe<br />
                                            john@example.com
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
        
                        <tr class="heading">
                            <td>Payment Method</td>
        
                            <td>Check #</td>
                        </tr>
        
                        <tr class="details">
                            <td>Check</td>
        
                            <td>1000</td>
                        </tr>
        
                        <tr class="heading">
                            <td>Item</td>
        
                            <td>Price</td>
                        </tr>
        
                        <tr class="item">
                            <td>Website design</td>
        
                            <td>$300.00</td>
                        </tr>
        
                        <tr class="item">
                            <td>Hosting (3 months)</td>
        
                            <td>$75.00</td>
                        </tr>
        
                        <tr class="item last">
                            <td>Domain name (1 year)</td>
        
                            <td>$10.00</td>
                        </tr>
        
                        <tr class="total">
                            <td></td>
        
                            <td>Total: $385.00</td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>
        `
       
    },
    function(error) {
        
        console.log(error.message)
    })

}



const adminloginpage = async (req,res)=>
{
    res.render('adminlogin',{message:"verification"})
}

const adminlogin = async (req,res)=>
{
     const email= req.body.email
     const pass= req.body.password
     const token = req.body.token
     try
     {
          const admin = await adminModel.findOne({email:email})
         
          if(admin)
          {
            const adminpass= admin.password
            const admintoken= admin.token
            if(adminpass==pass)
            {
                  if(admintoken==token)
                  {
                    req.session.admin_id= admin._id
                    res.redirect("/admin/adminpage")
                  }
                  else
                  {
                    res.render("adminlogin",{message:"Invalid Token"})
                  }
            }
            else
            {
                  res.render("adminlogin",{message:"Invalid Password"})
            }
          }
          else
          {
            res.render("adminlogin",{message:"Invalid Credentials"})
          }
     }
     catch(error)
     {
        console.log(error.message)
     }
}

const counting = async (req,res)=>
{
    const countstudent = await studentModel.count()
    const countinterns = await internModel.count()
    const countambassadors = await campusModel.count()
    const allmembers = 
    {
        allstudents:countstudent,
        allinterns:countinterns,
        allamabassadors:countambassadors
    }
    return allmembers;
}

const adminpage = async (req,res)=>
{
    const counters= await counting();
    res.render('adminpage',{username:"kuchbhi",allmembers:counters})
}
const allinterns = async (req,res)=>
{
       const counters= await counting();
       const allinterns = await internModel.find()
       res.render('allintern',{username:"kuchbhi",allmembers:counters,allinterns:allinterns})
}
const allcampus = async (req,res)=>
{
       const counters= await counting();
       const allcampus = await campusModel.find()
       res.render('allcampus',{username:"kuchbhi",allmembers:counters,allcampus:allcampus})
}
const allstudents = async (req,res)=>
{
       const counters= await counting();
       const allstudents = await studentModel.find()
       res.render('allstudent',{username:"kuchbhi",allmembers:counters,allstudents:allstudents})
}
/*
const updatestudent = async (req,res)=>{
    const sid = '63f7a03b3e99ed87bad19aed'
    const st= await studentModel.findByIdAndUpdate({_id:sid},{$set:{isVerified:1}})
    res.send("verified")
}
*/
const getupdatepage = async (req,res)=>
{
    const id= req.query.id;
    try{
        const paisadenevale= await studentModel.findById({_id:id})
        res.render('updatepage',{persons:paisadenevale});
    }
    catch(error)
    {
        console.log(error.message);
    }
}
const updateuser =async (req,res)=>
{
    const sid = req.body.id;
    const adminname = req.body.name;
    const st = await studentModel.findByIdAndUpdate({_id:sid},{$set:{isVerified:1,verifyingadmin:adminname}})
    const reciever = st.email;
    // sendmail2(reciever);

    res.redirect('/admin/adminpage')
}
const getstdetails = async(req,res)=>
{
    const courseid= req.body.courseID
    const student = await studentModel.find({courseID:courseid})
    res.render('getstdetails',{students:student})
}

module.exports= 
{
    adminpage,
   // updatestudent,
    updateuser,
    getupdatepage,
    getstdetails,
    adminloginpage,
    adminlogin,
    allcampus,
    allinterns,
    allstudents
}