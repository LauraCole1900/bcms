const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    type: [ String ],
    required: true
  },
  presKeynote: {
    type: String
  }
})

const Presenter = mongoose.model("Presenter", presenterSchema);

module.exports = Presenter