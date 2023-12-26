
const express = require('express')
const userRouter = express()
const userController = require('../controller/userController')
userRouter.set("view engine","ejs")
userRouter.set("views","./views")
const bodyParser = require("body-parser");
userRouter.use(bodyParser.urlencoded({ extended: true }));
const session= require("express-session");
userRouter.use(session({
    secret: "My session secret",
    resave: true,
    saveUninitialized: true
}));

userRouter.get("/login",userController.getLoginpage)
userRouter.get("/signup",userController.getsignup)
userRouter.post("/signup",userController.adduser)
userRouter.get("/verify",userController.verifymail)
userRouter.get('/forgotpassword',userController.sentpasswordresetlink)
userRouter.post('/forgotpassword',userController.takeemail)
userRouter.get("/newpassword",userController.getnewpasswordpage)
userRouter.post("/newpassword",userController.forgotpassword)
//userRouter.post("/login",userController.loginuser)
module.exports = {
    userRouter
}