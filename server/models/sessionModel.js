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
    required: true
  },
  sessPresEmails: {
    type: [ trimmedString ],
    required: true,
  },
  sessPropContName: {
    type: String
  },
  sessPropContEmail: {
    type: String
  },
  sessPropContPhone: {
    type: String
  },
  sessDate: {
    type: String
  },
  sessStart: {
    type: String
  },
  sessEnd: {
    type: String
  },
  sessDesc: {
    type: String,
    required: true
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
  sessAccepted: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session