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
  confOrg: {
    type: String,
    required: true
  },
  confDesc: {
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
  confStartTime: {
    type: String,
    required: true
  },
  confEndTime: {
    type: String,
    required: true
  },
  confType: {
    type: String,
    required: true
  },
  confLoc: {
    type: String,
    required: true
  },
  confLocName: {
    type: String
  },
  confLocUrl: {
    type: String
  },
  confCapConfirm: {
    type: String,
    required: true
  },
  confAttendCap: {
    type: Number
  },
  confFee: {
    type: String,
    required: true
  },
  confFeeAmt: {
    type: Number
  },
  confAllergies: {
    type: String,
    required: true
  },
  confWaiver: {
    type: String,
    required: true
  },
  confAttendCount: {
    type: Number
  },
  confAttendees: [
    { type: String },
  ],
  confPresenters: [
    { type: String }
  ],
  confExhibitors: [
    { type: String }
  ]
});

const Conference = mongoose.model("Conference", conferenceSchema);

module.exports = Conference;