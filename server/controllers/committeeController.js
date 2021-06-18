const ObjectId = require("mongodb").ObjectId;
const db = require("../models")

module.exports = {
  // CREATE new committee member in database
  create: function (req, res) {
    console.log("from committeeController create", req.body)
    db.Committee
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // FIND committee member by ID
  findById: function (req, res) {
    console.log("from committeeCont findById", req.params.id)
    db.Committee
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND committee members by confId
  findByConfId: function (req, res) {
    console.log("from committeeCont findByConfId", req.params.id)
    db.Committee
      .find({ confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND by confId and attendee email to update
  findByIdAndEmail: function (req, res) {
    console.log("from committeeCont findByIdAndEmail", req.params.id, req.params.email)
    db.Committee
      .findOne({ confId: req.params.email, email: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // UPDATE committee member by ID
  updateCommMemberById: function (req, res) {
    console.log("from committeeCont updateCommMemberById", req.params)
    db.Committee
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // UPDATE committee member by confId and email
  updateCommMember: function (req, res) {
    console.log("from committeeCont updateCommMember", req.params.id, req.params.email)
    db.Committee
      .findOneAndUpdate({ confId: req.params.id, email: req.params.email }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // DELETE committee member
  deleteCommMember: function (req, res) {
    console.log("from committeeCont deleteCommMember", req.params.id, req.params.email)
    db.Committee
      .deleteOne({ confId: req.params.email, email: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // DELETE committee members by confId
  deleteCommitteeByConfId: function (req, res) {
    console.log("from committeeCont deleteCommitteeByConfId", req.params.id)
    db.Committee
      .deleteMany({ confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
}