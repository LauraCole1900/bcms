const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  confId: {
    type: String,
    required: true
  },
  sessName: {
    type: String,
    required: true
  },
  sessPresenter: {
    type: String,
    required: true
  },
  sessPresenterEmail: {
    type: String,
    match: [/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, "Please enter a valid North American phone number"],
    required: true
  },
  sessPresenterBio: {
    type: String
  },
  sessPresenterPic: {
    type: String
  },
  sessPresenterOrg: {
    type: String,
    required: true
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
    type: Boolean
  }
})

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session