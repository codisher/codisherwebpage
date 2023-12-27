const express =require('express')
const courseRouter = express()
courseRouter.set("view engine","ejs")
courseRouter.set("views","./views/courses")
const studentController= require('../controller/studentController')
const bodyParser = require("body-parser");
courseRouter.use(bodyParser.urlencoded({ extended: true }));



module.exports={
    courseRouter
}
