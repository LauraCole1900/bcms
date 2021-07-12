const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Conference = require("./conferenceModel");

var trimmedString = {
  type: String,
  trim: true
}

const exhibitorSchema = new Schema({
  confId: {
    type: Schema.Types.ObjectId,
    ref: Conference,
    required: true
  },
  exhGivenName: {
    type: String,
    required: "Please enter the exhibit contact person's given name."
  },
  exhFamilyName: {
    type: String,
    required: "Please enter the exhibit contact person's family name."
  },
  exhEmail: {
    type: String,
    required: "Please enter the exhibitor's contact email."
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
  exhDesc: {
    type: String,
    required: "Please enter a description of what your company does."
  },
  exhLogo: {
    type: String,
  },
  exhWebsite: {
    type: String,
  },
  exhWorkers: {
    type: Number,
    required: "Please select how many workers are associated with this exhibit."
  },
  exhWorkerNames: {
    type: [ trimmedString ],
    required: "Please enter the names of the exhibit workers.",
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
  },
  exhBoothNum: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Exhibitor = mongoose.model("Exhibitor", exhibitorSchema);

module.exports = Exhibitor;