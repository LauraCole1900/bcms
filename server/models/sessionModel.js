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
  sessDate: {
    type: String,
    required: true
  },
  sessStart: {
    type: String,
    required: true
  },
  sessEnd: {
    type: String,
    required: true
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
  date: {
    type: Date,
    default: Date.now
  }
})

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session