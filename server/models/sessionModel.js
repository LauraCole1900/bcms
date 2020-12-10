const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  confId: {
    type: String,
    required: true
  },
  sessName: {
    type: String,
    required: true
  },
  sessPresenter: {
    type: String,
    required: true
  },
  sessDate: {
    type: String,
    required: true
  },
  sessStart: {
    type: String,
    required: true
  },
  sessEnd: {
    type: String,
    required: true
  },
  sessDesc: {
    type: String,
    required: true
  }
})

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session