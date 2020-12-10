const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendeeSchema = new Schema({
  email: {
    type: String,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"],
    required: true
  },
  email_verified: {
    type: Boolean,
    required: true
  },
  givenName: {
    type: String,
    required: true
  },
  familyName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  waiverSigned: {
    type: Boolean,
  },
  paid: {
    type: Boolean
  }
})