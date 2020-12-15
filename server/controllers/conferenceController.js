const ObjectId = require("mongodb").ObjectId;
const db = require("../models");

module.exports = {
  // POST
  create: function (req, res) {
    db.Conference
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // GET
  findAll: function (req, res) {
    db.Conference
      .find({})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.statue(422).json(err))
  },

  findByEmail: function (req, res) {
    console.log("from confCont findByEmail", req.params.email)
    db.Conference
      .find({ email: req.params.email })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  findConfAttending: function (req, res) {
    console.log("from confCont findConfAttending", req.params.email)
    db.Conference
      .find({ confAttendees: req.params.email })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  findById: function (req, res) {
    console.log("from confCont findById", req.params.confId)
    db.Conference
      .find(ObjectId(req.params.confId))
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // PUT
  updateConference: function (req, res) {
    console.log("from confCont updateConference", req.params.confId)
    db.Conference
      .findOneAndUpdate({ _id: req.params.confId }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  updateRegistered: function (req, res) {
    console.log("from confCont updateRegistered", req.params.confId, req.body.email)
    db.Conference
      .updateOne({ _id: req.params.confId }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // DELETE
  removeConference: function (req, res) {
    console.log("from confCont removeConference", req.params.confId)
    db.Conference
    .findById({ _id: ObjectId(req.params.confId) })
    .then(dbModel => dbModel.remove())
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  }
};