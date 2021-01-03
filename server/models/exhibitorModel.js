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
    required: "Please enter the exhibitor's company, organization or school."
  },
  exhPhone: {
    type: String,
    required: "Please enter the exhibitor's phone number."
  },
  exhCompanyAddress: {
    type: String,
    required: "Please enter the exhibitor company's address."
  },
  exhWorkers: {
    type: Number,
    required: "Please select how many workers are associated with this exhibit."
  },
  exhNames: {
    type: [ String ],
    required: "Please enter the names of the exhibit workers."
  },
  exhSpaces: {
    type: Number,
    required: "Please select how many spaces this exhibit requires."
  },
  exhAttend: {
    type: Boolean,
  },
  exhPaid: {
    type: Boolean
  }
})

const Exhibitor = mongoose.model("Exhibitor", exhibitorSchema);

module.exports = Exhibitor