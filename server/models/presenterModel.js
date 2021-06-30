const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Conference = require("./conferenceModel");
const Session = require("./sessionModel");

mongoose.Schema.Types.String.checkRequired(v => v != null);

var trimmedString = {
  type: String,
  trim: true
}

const presenterSchema = new Schema({
  confId: {
    type: Schema.Types.ObjectId,
    ref: Conference,
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
    type: [ Schema.Types.ObjectId ],
    ref: Session,
    required: true
  },
  presKeynote: {
    type: String
  },
  presAccepted: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Presenter = mongoose.model("Presenter", presenterSchema);

module.exports = Presenter