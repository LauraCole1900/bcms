const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exhibitorSchema = new Schema({
  confId: {
    type: String,
    required: true
  },
  exhEmail: {
    type: String,
    required: true
  },
  exhCompany: {
    type: String,
    required: true
  },
  exhCompanyAddress: {
    type: String,
    required: true
  },
  exhWorkers: {
    type: Number,
    required: true
  },
  exhNames: {
    type: [ String ],
    required: true
  },
  exhPhone: {
    type: String,
    required: true
  },
  exhSpaces: {
    type: String,
    required: true
  },
  exhAttend: {
    type: Boolean,
    required: true
  },
  exhPaid: {
    type: Boolean
  }
})

const Exhibitor = mongoose.model("Exhibitor", exhibitorSchema);

module.exports = Exhibitor