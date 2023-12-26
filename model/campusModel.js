const mongoose = require("mongoose");
const { Schema } = mongoose;

const campusSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone:
  {
    type:String
  },
  collegeName: {
    type: String,
  },
  branch: {
    type: String,
  },
  year: {
    type: String,
    default: "",
  },
  location: {
    type: String,
  },
  campusAmbassadorID: {
    type: String,
  },
  date: {
    type: String,
  },
});
module.exports = mongoose.model("campusModel", campusSchema);
