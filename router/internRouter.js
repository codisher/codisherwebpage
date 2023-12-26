const express =require('express')
const internRouter = express()
internRouter.set("view engine","ejs")
internRouter.set("views","./views/internships")
const studentController= require('../controller/studentController')
const bodyParser = require("body-parser");
internRouter.use(bodyParser.urlencoded({ extended: true }));
const authController = require('../controller/auth')
const internController = require('../controller/internController')

internRouter.get("/uiuxintern",authController.getuiuxintern)
internRouter.get("/frontendintern",authController.getfrontendintern)
internRouter.get("/backendintern",authController.getbackendintern)
internRouter.get("/flutterintern",authController.getflutterintern)
internRouter.get("/reactintern",authController.getreactintern)
internRouter.get("/pythonintern",authController.getpythonintern)
internRouter.get("/cintern",authController.getcintern)
internRouter.get("/sqlintern",authController.getsqlintern)


internRouter.post("/uiuxintern",internController.postinternform)
internRouter.post("/frontendintern",internController.postinternform)
internRouter.post("/backendintern",internController.postinternform)
internRouter.post("/flutterintern",internController.postinternform)
internRouter.post("/reactintern",internController.postinternform)
internRouter.post("/pythonintern",internController.postinternform)
internRouter.post("/cintern",internController.postinternform)
internRouter.post("/sqlintern",internController.postinternform)

module.exports={
    internRouter
}