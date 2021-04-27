const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var trimmedString = {
  type: String,
  trim: true
}

const sessionSchema = new Schema({
  confId: {
    type: String,
    required: true
  },
  sessName: {
    type: String,
    required: "Please enter a name for your session."
  },
  sessNumPres: {
    type: Number,
    required: "Please enter the number of presenters for this session."
  },
  sessPresEmails: {
    type: [ trimmedString ],
    required: "Please enter the session presenter's email.",
    trim: true
  },
  sessDate: {
    type: String,
    required: "Please enter the date for this session."
  },
  sessStart: {
    type: String,
    required: "Please enter the starting time for this session."
  },
  sessEnd: {
    type: String,
    required: "Please enter the ending time for this session."
  },
  sessDesc: {
    type: String,
    required: "Please enter the session's description."
  },
  sessKeynote: {
    type: String
  },
  sessRoom: {
    type: String
  }
})

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session