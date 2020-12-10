const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conferenceSchema = new Schema({
  creatorEmail: {
    type: String,
    required: true
  },
  confName: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  confType: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  attendingCount: {
    type: Number
  },
  attendees: [
    { type: String },
  ]
});

const Conference = mongoose.model("Conference", conferenceSchema);

module.exports = Conference;