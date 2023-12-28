require('dotenv').config()
const userModel = require("../model/userModel")
const nodemailer = require('nodemailer');
const {registerValidation} = require('../validations/authvalidation')

const host = process.env.host
const bcrypt = require('bcrypt');
const saltrounds = 10;
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
             res.render('usersignup')
    }
    catch(error)
    {
        console.log(error.message)
    }
}
const user_register = async (req,res)=>
{
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(200).json(error.message);
    }
    const salt= await bcrypt.genSalt(10);
    const securepassword = await bcrypt.hash(req.body.password,salt)
    req.body.password=securepassword
    try
    {
        const given_mail_id = req.body.email
        const exist_user = await userModel.findOne({email:given_mail_id})
        if(exist_user)
        {
            return res.status(200).json("User Already Exist")
        }
        const user_count = await userModel.count()
        req.body.student_id = `CD1625000${user_count+1}`
        const user = new userModel(req.body)
        const createUser = await user.save()
        const {error} = sendmail2(createUser.email,createUser._id)
        if(error)
        {
            return res.status(200).json(error.message)
        }
        return res.status(200).json("An Email Has Been Sent To Your Email Id .Please Verify Your Email Id")
    }
    catch(error)
    {
        return res.send(error.message)
    }
}

const userLogin = async (req,res)=>
{
    
    try
    {
          const {email} = req.body
            const user = await userModel.findOne({ email }).lean();
            if (!user) {
              return  res.status(400).json("User Not Exist");
            }
            if(user.is_verified!==1)
            {
              return res.status(400).json("Please Verify your Email Id")
            }
        const password = req.body.password;
        if(!bcrypt.compareSync(password, user.password))
        {
            return res.status(400).json("Incorrect Password")
        
        }
         const encoded_email = encodeURIComponent(user.email)
         res.cookie('user_email',encoded_email)
         return res.status(200).json("Logged_In")
    }
    catch(error)
    {
       return res.status(200).json(error.message)
    }
}



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
        user: process.env.mail, // generated ethereal user
        pass: process.env.mail_password // generated ethereal password
    }
}); 

//Sending mail to provided emailid
let info = transporter.sendMail({
        from: process.env.mail, // sender address
        to: receiver, // list of receivers
        subject: subjectto, // Subject line
        html: message +`<a href="${host}verify?id=${user_id}">Click Here To Verify</a>`
       
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
        user: process.env.mail, // generated ethereal user
        pass: process.env.mail_password // generated ethereal password
    }
}); 


//Sending mail to provided emailid
let info = transporter.sendMail({
        from: process.env.mail, // sender address
        to: receiver, // list of receivers
        subject: subjectto, // Subject line
        html: message +`<a href="${host}/newpassword?id=${user_id}"> Click Here to set new Password</a>`
       
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
    const salt= await bcrypt.genSalt(10);
    const securepassword = await bcrypt.hash(req.body.password,salt)
    try{
        if(newpass==confirmpassword)
        {
            const vuser = await userModel.updateOne({_id:req.query.id},{$set:{password:securepassword}});
            res.render('forgotpassword',{message:'verification'})
        }
        else
        {
            res.render('forgotpassword',{message:"Password does not  match"})
        }
        
    }
    catch(error){
             console.log(error.message);
    }
}



const getuserdetail = async (req,res)=>
{
    try
    {
        const user = await userModel.findOne({email:req.query.email})
        const user_detail =
        {
            name:user.name,
            email:user.email,
        }

        return res.status(200).json(user_detail)    

    }
    catch(error)
    {
        console.log(error.message)
    
    }
}


const userlogout = async (req,res)=>
{
    try
    {
        req.session.destroy()
        res.clearCookie('user_email')
        res.redirect('/')
    }
    catch(error)
    {
        console.log(error.message)
    }
}


module.exports = {
    getLoginpage,
    getsignup,
    user_register,
    userLogin,
    verifymail,
    forgotpassword,
    sentpasswordresetlink,
    takeemail,
    getuserdetail,
    getnewpasswordpage,
    userlogout
   // loginuser
}



