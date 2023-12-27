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
const userModel = require('./model/userModel')
const campuscontroller = require('./controller/campuscontroller')
const mongourl=process.env.MONGOURL
const bodyParser = require("body-parser");
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const cookieParser = require('cookie-parser')
const { name } = require('ejs');
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
app.post("/campusambassador",campuscontroller.postcampusform )
// dataabase Connection
mongoose.set("strictQuery", false);
mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  });
  const db = mongoose.connection;
  db.on("error", (error) => console.log(error));
  db.once("open", () => console.log("Database Connected"));


  // Google Auth
  
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.google_client_id,
			clientSecret: process.env.google_client_secret,
			callbackURL: `${process.env.host}auth/google/callback`,
		},
		(accessToken, refreshToken, profile, done) => {
			// You can save the user's profile in the database or handle the authentication as needed.
			return done(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

app.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/', (req, res) => {
	res.render('index');
})

app.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	async (req, res) => {
		const exist_user = await userModel
			.findOne({ email: req.user.emails[0].value })
			.lean();
		if (exist_user) {
			res.cookie('user_email', encodeURIComponent(req.user.emails[0].value));
			return res.redirect('/');
		} else {
			req.body.name = req.user.displayName;
			req.body.email = req.user.emails[0].value;
			req.body.is_verified = true;
			const google_user = new userModel(req.body);
			const g_user = await google_user.save();
			res.cookie('user_email', encodeURIComponent(req.user.emails[0].value));
			return res.redirect('/');
		}
	}
);