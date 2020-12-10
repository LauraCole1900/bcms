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
    match: [/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, "Please enter a valid North American phone number"],
    required: true
  },
  waiverSigned: {
    type: Boolean,
  },
  paid: {
    type: Boolean
  }
})

const Attendee = mongoose.model("Attendee", attendeeSchema);

module.exports = Attendee