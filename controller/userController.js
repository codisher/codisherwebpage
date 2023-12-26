require('dotenv').config()
const userModel = require("../model/userModel")
const nodemailer = require('nodemailer');
const adminmail = process.env.SMAIL
const adminpass = process.env.SPASS
const getLoginpage = async (req,res)=>
{
    try{
            res.render('userlogin')
    }
    catch(error)
    {
          console.log(error.message)
    }
}
const getsignup = async (req,res)=>
{
    try{
             res.render('usersignup',{message:undefined,vmessage:undefined})
    }
    catch(error)
    {
        console.log(error.message)
    }
}
const adduser = async (req,res)=>
{
    
    const name = req.body.name
    const email = req.body.email
    const password=req.body.password
    const confirmpassword = req.body.cpassword

      // check if the are empty 
      if (!email || !name || !password || !confirmpassword) 
      {
        res.render("usersignup", { message: "All Fields Required !"});
    } 
    else if (password != confirmpassword)
     {
        res.render("usersignup", { message: "Password Don't Match !"});
     }

     else{
        const user = await userModel.findOne({email:email})
        if(user)
        {
            res.render('usersignup',{message:"User Already Exist"})
        }
        else{

            try
        {

          const singleuser=new userModel(
          {
            displayName:req.body.name,
            email:req.body.email,
            password:req.body.password
          });
          
          const userData = await singleuser.save();
          const receiver = userData.email;
          const user_id =userData._id;
           sendmail2(receiver,user_id);
           res.render('usersignup',{message:"verification"})

    }
    catch(error)
    {
        console.log(error.message)
    }
        }
    
}
}

const smail=adminmail;
const spass=adminpass;

// MAil ka khel....................
const sendmail2 = async (receiver,user_id)=>
{
    
  
var subjectto = "Verificaton  Email"
var message = "Verify Your Email With ThinkWhat "
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
        html: message +'<a href="https://thinkwht.com/verify?id='+user_id+'">Click Here To Verify</a>'
       
    },
    function(error) {
        
        console.log(error.message)
    })

}
///////////////////////////////
const verifymail = async(req,res)=>
{
    
    try{
        const vuser = await userModel.updateOne({_id:req.query.id},{$set:{is_verified:1}});
        res.render('verify',{message:undefined,vmessage:undefined})
    }
    catch(error)
    {
         console.log(error.message);
    }
}
// forgot password mail
const sendmail3 = async (receiver,user_id)=>
{
var subjectto = "Password Reset Email"
var message = "Click on this link to reset the password "
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
        html: message +'<a href="https://thinkwht.com/newpassword?id='+user_id+'"> Click Here to set new Password</a>'
       
    },
    function(error) {
        
        console.log(error.message)
    })

}
const sentpasswordresetlink = async (req,res)=>
{
    res.render('sentpassword',{message:undefined,vmessage:undefined})
}

const takeemail = async (req,res)=>
{
    const usermail= req.body.email
    const receiver = usermail
    const user = await userModel.findOne({email:usermail})
    if(user)
    {
        const user_id = user._id
        sendmail3(usermail,user_id)
         res.render('sentpassword',{message:"verification"})
    }
    else
    {
          
          res.render('sentpassword',{message:"User Not Registered"})
    }
}

const getnewpasswordpage = async (req,res)=>
{
     res.render('forgotpassword',{message:undefined,vmessage:undefined})
}


const forgotpassword = async(req,res)=>
{
    const newpass = req.body.password
    const confirmpassword = req.body.cpassword
   
    try{
        if(newpass==confirmpassword)
        {
            const vuser = await userModel.updateOne({_id:req.query.id},{$set:{password:newpass}});
            res.render('forgotpassword',{message:'verification'})
        }
        else
        {
            res.render('forgotpassword',{message:"Password does not  match"})
        }
        
    }
    catch{

    }
}
//sendmail();
/*
const loginuser = async (req,res)=>
{
    try{
    const lemail= req.body.email
    const password = req.body.password
    const user = await userModel.findOne({email:lemail})
    if(user)
    {
        const pass= user.password
        if(pass==password)
        {
            req.session.admin_id= user._id
            displayName=user.displayName
            res.redirect('/?displayName='+displayName)
        }
        else{
            res.render('userlogin',{error:"Invalid Password"})
        }
    }
    else{
        res.render('userlogin',{error:"Invalid Credentials"})
    }
    }
    catch(error)
    {
        console.log(error.message)
    }
}
*/

module.exports = {
    getLoginpage,
    getsignup,
    adduser,
    verifymail,
    forgotpassword,
    sentpasswordresetlink,
    takeemail,
    getnewpasswordpage
   // loginuser
}