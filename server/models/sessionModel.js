const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  confId: {
    type: String,
    required: true
  },
  sessName: {
    type: String,
    required: "Please enter a name for your session."
  },
  sessPresenter: {
    type: String,
    required: "Please enter the session presenter's name."
  },
  sessPresenterEmail: {
    type: String,
  },
  sessPresenterBio: {
    type: String
  },
  sessPresenterPic: {
    type: String
  },
  sessPresenterOrg: {
    type: String,
    required: "Please enter the session presenter's organization, company, or school."
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
    type: Boolean
  }
})

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session