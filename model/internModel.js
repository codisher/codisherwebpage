const mongoose = require('mongoose')
const {Schema} = mongoose

const internSchema = new Schema(
    {
        name:
        {
            type:String
        },
        mobile:
        {
            type:Number
        },
        email:
        {
            type:String
        },
        courses:
        {
           type:String
        },
        courseID:
        {
             type:String
        },
        offerletternumber:
        {
            type:String,
            default:0
        },
        certificatenumber:
        {
            type:String,
            default:0
        },
        verifyingadmin:
        {
            type:String,
            default:''
        }
        ,
       date:
        {
            type:String,
        },
        internID:
        {
            type:String
        },
        college:
        {
            type:String
        }


    }
)
module.exports = mongoose.model("internModel",internSchema)