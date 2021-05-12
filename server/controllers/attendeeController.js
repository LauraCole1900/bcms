const ObjectId = require("mongodb").ObjectId;
const db = require("../models")

module.exports = {
  // CREATE new attendee in database
  create: function (req, res) {
    console.log("from attendeeController create", req.body)
    db.Attendee
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // FIND all attendees
  findAll: function (req, res) {
    db.Attendee
      .find({})
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND attendees by confId
  findByConfId: function (req, res) {
    console.log("from attendeeCont findByConfId", req.params.id)
    db.Attendee
      .find({ confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND attendee by ID
  findById: function (req, res) {
    console.log("from attendeeCont findById", req.params.id)
    db.Attendee
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND by attendee email
  findByEmail: function (req, res) {
    console.log("from attendeeCont findByEmail", req.params.email)
    db.Attendee
      .find({ email: req.params.email })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND by confId and attendee email to update
  findByIdAndEmail: function (req, res) {
    console.log("from attendeeCont findByIdAndEmail", req.params.id, req.params.email)
    db.Attendee
      .findOne({ confId: req.params.email, email: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // UPDATE attendee by confId and email
  updateAttendee: function (req, res) {
    console.log("from attendeeCont updateAttendee", req.params.id, req.params.email)
    db.Attendee
      .findOneAndUpdate({ confId: req.params.id, email: req.params.email }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // UPDATE attendee by ID
  updateAttendeeById: function (req, res) {
    console.log("from attendeeCont updateAttendeeById", req.params)
    db.Attendee
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // DELETE attendee
  removeAttendee: function (req, res) {
    console.log("from attendeeCont removeAttendee", req.params.id, req.params.email)
    db.Attendee
      .deleteOne({ confId: req.params.email, email: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // DELETE attendees by confId
  deleteAttendeesByConfId: function (req, res) {
    console.log("from attendeeCont deleteAttendeesByConfId", req.params.id)
    db.Attendee
      .deleteMany({ confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
}