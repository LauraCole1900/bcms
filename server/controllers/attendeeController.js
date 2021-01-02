const db = require("../models")

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
        } else if (attendee) {
          let err = new Error("We're sorry, that email has already been registered. Please use another email.")
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

  // FIND attendee by ID
  findById: function (req, res) {
    db.Attendee
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND attendee by email
  findByEmail: function (req, res) {
    db.Attendee
      .findById(req.body.email)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // UPDATE attendee
  updateAttendee: function (req, res) {
    db.Attendee
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // DELETE attendee
  removeAttendee: function (req, res) {
    db.Attendee
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  }
}