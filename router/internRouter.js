const express =require('express')
const internRouter = express()
internRouter.set("view engine","ejs")
internRouter.set("views","./views/internships")
const studentController= require('../controller/studentController')
const bodyParser = require("body-parser");
internRouter.use(bodyParser.urlencoded({ extended: true }));
const internController = require('../controller/internController')

internRouter.get("/:page_name",internController.internship_page)
internRouter.post('/add_intern',internController.add_internship)
internRouter.post('/submit_intern_task',internController.submit_intern_task)
module.exports={
    internRouter
}