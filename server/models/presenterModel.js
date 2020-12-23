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
    required: true
  },
  presPhone: {
    type: String,
    required: true
  },
  presOrg: {
    type: String,
    required: true
  },
  presWebsite: {
    type: String,
  }
})

const Presenter = mongoose.model("Presenter", presenterSchema);

module.exports = Presenter