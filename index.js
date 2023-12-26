require('dotenv').config()
const express = require('express')
const app = express();
const port= 7021
const courseRouter = require('./router/courseRouter')
const internRouter = require('./router/internRouter')
const userRouter = require('./router/userRouter')
const studentRouter = require('./router/studentRouter')
const adminRouter = require('./router/adminRouter')
const mongoose = require('mongoose')
const campuscontroller = require('./controller/campuscontroller')
const mongourl=process.env.MONGOURL
const bodyParser = require("body-parser");
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const cookieParser = require('cookie-parser')
const { name } = require('ejs');
const auth = require('./controller/auth');
const session = require('express-session');
app.use(session(
    {
        secret:"Mysecret",
        resave:false,
        saveUninitialized:false
    }
))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(passport.initialize());
// running server
app.listen(port,()=>
{
    console.log(`Running Server At ${port}`)
})
// setting view engine
   app.set("view engine","ejs")
   app.set('views','./views')
   app.use("/public/images",express.static('./public/images'));
   app.use('/assets',express.static('assets'));
// showing main page
app.use("/course",courseRouter.courseRouter)
app.use("/internship",internRouter.internRouter)
app.use("/student",studentRouter.studentRouter)
app.use("/",userRouter.userRouter)
app.use("/admin",adminRouter.adminRouter)
app.use("/",auth.app)
app.post("/campusambassador",campuscontroller.postcampusform )
//Database Connection
// mongoose.set("strictQuery", false);
// mongoose.connect(mongourl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
    
//   });
//   const db = mongoose.connection;
//   db.on("error", (error) => console.log(error));
//   db.once("open", () => console.log("Database Connected"));
  

 