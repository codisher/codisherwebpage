const express =require('express')
const adminRouter = express()
adminRouter.set("view engine","ejs")
adminRouter.set("views","./views/admin")
const bodyParser = require("body-parser");
adminRouter.use(bodyParser.urlencoded({ extended: true }));
const studentController = require('../controller/studentController')
const adminController = require('../controller/adminController')
const adminauth = require('../middleware/adminauth')
const session= require("express-session");
adminRouter.use(session({
    secret: "My session Secret",
    resave: true,
    saveUninitialized: true
}));

adminRouter.get("/adminpage",adminauth.userisLogin,adminController.adminpage)
adminRouter.get("/updatepage",adminauth.userisLogin,adminController.getupdatepage)
adminRouter.post("/updatepage",adminauth.userisLogin,adminController.updateuser)
adminRouter.get("/allinterns",adminauth.userisLogin,adminController.allinterns)
adminRouter.get("/allcampus",adminauth.userisLogin,adminController.allcampus)
adminRouter.get("/allstudent",adminauth.userisLogin,adminController.allstudents)
adminRouter.get("/adminlogin",adminController.adminloginpage)
adminRouter.post("/adminlogin",adminController.adminlogin)
module.exports=
{
    adminRouter
}