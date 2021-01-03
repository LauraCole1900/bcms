const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const presenterSchema = new Schema({
  confId: {
    type: String,
    required: true
  },
  presEmail: {
    type: String,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    required: "Please enter the presenter's email."
  },
  presPhone: {
    type: String,
    required: "Please enter the presenter's phone number."
  },
  presOrg: {
    type: String,
    required: "Please enter the presenter's organization."
  },
  presWebsite: {
    type: String,
  }
})

const Presenter = mongoose.model("Presenter", presenterSchema);

module.exports = Presenter