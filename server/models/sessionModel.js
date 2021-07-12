const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Conference = require("./conferenceModel");

mongoose.Schema.Types.String.checkRequired((v) => v != null);

var trimmedString = {
  type: String,
  trim: true
}

const sessionSchema = new Schema({
  confId: {
    type: Schema.Types.ObjectId,
    ref: Conference,
    required: true
  },
  sessName: {
    type: String,
    required: true
  },
  sessPresEmails: {
    type: [ trimmedString ],
    required: true,
  },
  sessPropContName: {
    type: String
  },
  sessPropContEmail: {
    type: String
  },
  sessPropContPhone: {
    type: String
  },
  sessDate: {
    type: String
  },
  sessStart: {
    type: String
  },
  sessEnd: {
    type: String
  },
  sessDesc: {
    type: String,
    required: true
  },
  sessEquipConfirm: {
    type: String,
    required: true
  },
  sessEquipProvide: {
    type: String
  },
  sessEquip: {
    type: [ trimmedString ]
  },
  sessKeynote: {
    type: String
  },
  sessPanel: {
    type: String
  },
  sessRoom: {
    type: String
  },
  sessAccepted: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;