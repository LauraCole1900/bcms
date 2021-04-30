const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var trimmedString = {
  type: String,
  trim: true
}

const presenterSchema = new Schema({
  confId: {
    type: String,
    required: true
  },
  presGivenName: {
    type: String,
    required: "Please enter the presenter's given name."
  },
  presFamilyName: {
    type: String,
    required: "Please enter the presenter's family name."
  },
  presOrg: {
    type: String,
    required: "Please enter the presenter's organization."
  },
  presBio: {
    type: String,
    required: "Please enter a short bio of the presenter."
  },
  presEmail: {
    type: String,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    required: "Please enter the presenter's email."
  },
  presPhone: {
    type: String,
  },
  presWebsite: {
    type: String,
  },
  presPic: {
    type: String,
  },
  presSessionIds: {
    type: [ trimmedString ],
    required: true
  },
  presKeynote: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Presenter = mongoose.model("Presenter", presenterSchema);

module.exports = Presenter