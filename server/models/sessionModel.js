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
  sessPresEmails: {
    type: [ trimmedString ],
    required: "Please enter the session presenter's email.",
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
  sessPanel: {
    type: String
  },
  sessRoom: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session