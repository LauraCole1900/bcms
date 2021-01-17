const db = require("../models")
const { findOne } = require("../models/userModel")

module.exports = {
  // CREATE new attendee in database
  create: function (req, res) {
    console.log("from attendeeController create", req.body.email)
    db.Attendee
      .findOne({ email: req.body.email }, function (err, attendee) {
        if (err) {
          let err = new Error("We're sorry, it looks like gremlins have gotten into our database. Please try again.")
          err.status = 400;
          return err;
        } else {
          db.Attendee
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
        }
      })
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
    console.log("from attendeeCont findByConfId", req.params)
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


  // UPDATE attendee
  updateAttendee: function (req, res) {
    console.log("from attendeeCont updateAttendee", req.params.id, req.params.email)
    db.Attendee
      .findOneAndUpdate({ confId: req.params.id, email: req.params.email }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // DELETE attendee
  removeAttendee: function (req, res) {
    console.log("from attendeeCont removeAttendee", req.params.id, req.params.email)
    db.Attendee
      .findOne({ confId: req.params.email, email: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  }
}