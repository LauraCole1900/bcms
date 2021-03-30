const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conferenceSchema = new Schema({
  ownerConfirm: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  },
  confName: {
    type: String,
    required: "Please enter the name of your conference."
  },
  confOrg: {
    type: String,
    required: "Please enter the name of the organization presenting your conference."
  },
  confDesc: {
    type: String,
    required: "Please enter the description of your conference."
  },
  startDate: {
    type: String,
    required: "Please enter your conference's starting date."
  },
  endDate: {
    type: String,
    required: "Please enter your conference's ending date."
  },
  numDays: {
    type: Number,
  },
  confStartTime: {
    type: String,
    required: "Please enter your conference's starting time. You will be creating a full schedule later."
  },
  confEndTime: {
    type: String,
    required: "Please enter your conference's ending time. You will be creating a full schedule later."
  },
  confType: {
    type: String,
    required: "Please select whether this conference is live or virtual."
  },
  confLoc: {
    type: String,
    required: "Please enter your conference's location."
  },
  confLocName: {
    type: String
  },
  confLocUrl: {
    type: String
  },
  confRegDeadline: {
    type: String,
    required: "Please enter a registration deadline. If there is no registration deadline, please enter the conference's end date."
  },
  confKeynote: {
    type: String,
    required: "Please indicate whether your conference will have a keynote speaker."
  },
  confCapConfirm: {
    type: String,
    required: "Please select whether your conference has a cap on the number of attendees."
  },
  confAttendCap: {
    type: String
  },
  confFee: {
    type: String,
    required: "Please select whether your conference has a registration fee."
  },
  confFeeAmt: {
    type: String
  },
  confEarlyRegConfirm: {
    type: String,
    required: "Please select whether there is a deadline for early registration."
  },
  confEarlyRegDeadline: {
    type: String
  },
  confEarlyRegFee: {
    type: String
  },
  confEarlyRegSwagConfirm: {
    type: String
  },
  confEarlyRegSwagType: {
    type: String
  },
  confEarlyRegSizeConfirm: {
    type: String
  },
  confSessProposalConfirm: {
    type: String,
    required: "Please select whether your conference will require proposals for sessions from prospective presenters."
  },
  confAllergies: {
    type: String,
    required: "Please select whether you need attendees to tell you about their allergies."
  },
  confWaiver: {
    type: String,
    required: "Please select whether your conference requires a liability waiver."
  },
  confAttendCount: {
    type: Number
  },
  confAdmins: {
    type: [ String ]
  }
});

const Conference = mongoose.model("Conference", conferenceSchema);

module.exports = Conference;