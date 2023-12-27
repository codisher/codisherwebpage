require('dotenv').config()
const { find } = require('../model/studentModel');
const internModel = require('../model/internModel')
const studentModel = require('../model/studentModel')
const nodemailer = require('nodemailer');
const internData = require('./interndata')
const adminmail = process.env.SMAIL
const adminpass = process.env.SPASS
const { DateTime } = require("luxon");
const userModel = require('../model/userModel');
const internship_page_data = require('./interndata');

//mail ka khel
const sendmail2 = async (receiver, username) => {
    const smail = adminmail;
    const spass = adminpass;
    const recievername = username
    var subjectto = "Details Submitted"
    var message = 'Dear ' + recievername + `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
    
            <body>
            <p>Congratulations!!!</p>
            <p>Thanks for your connecting with THINKWHAT</p>
            </br>
            <p>We are excited you have taken the first step towards getting results.</p>
            <p>You will recieve a message from our representative team members shortly . </p>
            <p>Congratulations Once again! we are thrilled to you have join our team.</p>
            <p>Welcome Abroad</p>
            <p>Visit to: <a href="thinkwht.com">thinkwht.com</a></p>
            <p>Regards</p>
            </br>
            <p>HR Team</p>
        </body>
    </html>
    `
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
        html: message

    },
        function (error) {

            console.log(error.message)
        })
}
const dateandtime = () => {
    const dt = DateTime.now();
    var hours = dt.hour;
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    var minutes = dt.minute;
    const month = dt.month;
    const day = dt.day;
    const year = dt.year;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const finaldate =
        day + "/" + month + "/" + year + " " + hours + ":" + minutes + " " + ampm;
    return finaldate;
};


/// frontend development




const add_internship = async (req, res) => {
    try {
        const internship_details =
        {
            internship_domain_name: req.body.course_name,
            internship_domain_id: req.body.course_id,
            transaction_id: req.body.transaction_id,
        }
        
        const user = await userModel.findOneAndUpdate({email: req.body.user_email }, { $push: { internships: internship_details } })
        return res.status(200).json("You will get update soon about your internship.")
    }
    catch (error) {
        console.log(error.message)
    }
}

const update_intern_payment_status = async (req, res) => {
    try {
        const start_date = '01-01-2024'
        const end_date = '01-02-2024'
        const task1 = 'Portfolio'
        const task2 = 'Music Player'
        const user = await userModel.findOneAndUpdate({email: req.query.email, "internships._id": req.query.internship_id },
            { $set: { "internships.$.payment": true, 
            "internships.$.internship_start_date": start_date,
             "internships.$.internship_end_date": end_date, 
             "internships.$.internship_task1": task1,
              "internships.$.internship_task2": task2,
                "internships.$.internship_offer_letter": true,
            } })
        return res.redirect('/admin/user_details')
    }
    catch (error) {
        console.log(error.message)
    }
}

const submit_intern_task = async (req, res) => {

    try
    {
         
           console.log(req.body)
           const user = await userModel.findOneAndUpdate({ _id: req.body.user_id, "internships._id": req.body.internship_id },
            { $set: { "internships.$.internship_task1_github_url": req.body.github_url_task1,
            "internships.$.internship_task2_github_url": req.body.github_url_task2,
            "internships.$.internship_task1_linkedin_url": req.body.linkedin_url_task1,
            "internships.$.internship_task2_linkedin_url": req.body.linkedin_url_task2,
            "internships.$.internship_task_submmited": true,
            } })
            return  res.status(200).json("Task Submmitted Successfully. You will get your certificate after evaluation of the tasks.")
    }
    catch(error)
    {
        console.log(error.message)
    }
}

const approve_certificate =  async (req,res)=>
{
    try
    {
           const user = await userModel.findOneAndUpdate({ email: req.query.email, "internships._id": req.query.internship_id },
            { $set: { "internships.$.internship_certificate": true, 
            } })
            return res.redirect('/admin/user_details')
    }
    catch(error)
    {
       console.log(error.message)
    }
}

const internship_details = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.params.email })

        return res.render('enrolled_internship', { user: user })
    }
    catch (error) {
        console.log(error.message)
    }
}

const internship_page = async (req, res) => {
           
    try
    {
        const page_name = req.params.page_name;
        function search_page(page_name) {
            for (let i = 0; i < internship_page_data.length; i++) {
                if (internship_page_data[i].page_name == page_name) {
                    return internship_page_data[i];
                } else if (
                    internship_page_data[i].page_name != page_name &&
                    i == internship_page_data.length - 1
                ) {
                    return false;
                }
            }
        }
        const page_content = search_page(page_name);
        if (page_content == false) {
            res.send('Page Not Found');
        } else {

            res.render('internship_page', { internship_data: page_content });
        }
    }
    catch(error)
    {
        console.log(error.message)
    }

}

const user_details = async (req,res)=>
{
    try
    {
        const user_details = await userModel.find()
        const user_with_internship = []
        user_details.forEach(element => {
            if(element.internships.length>0)
            {
                user_with_internship.push(element)
            }
        });

        return res.render('user_details',{userDetails:user_with_internship})
    }
    catch(error)
    {
        console.log(error.message)
    
}}

module.exports = {
    add_internship,
    update_intern_payment_status,
    submit_intern_task,
    internship_details,
    internship_page,
    user_details,
    approve_certificate
    // taketransactionid,
    //getupdatepage
}