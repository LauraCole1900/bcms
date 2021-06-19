const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const committeeSchema = new Schema ({
  confId: {
    type: String,
    required: true
  },
  commEmail: {
    type: String,
    required: true
  },
  commGivenName: {
    type: String,
    required: true
  },
  commFamilyName: {
    type: String,
    required: true
  },
  commOrg: {
    type: String,
    required: true
  },
  commPhone: {
    type: String
  },
  isChair: {
    type: String
  }
});

const Committee = mongoose.model("Committee", committeeSchema);

module.exports = Committee;