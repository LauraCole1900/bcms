const ObjectId = require('mongodb').ObjectId;
const db = require("../models");

module.exports = {
  // POST new schedule information to database
  create: function (req, res) {
    db.Schedule
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // GET schedule by confId
  findByConfId: function (req, res) {
    console.log("from scheduleCont findByConfId", req.params.id)
    db.Schedule
      .find({ confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // UPDATE schedule by ID
  updateScheduleById: function (req, res) {
    console.log("from scheduleCont updateSchedule", req.params, req.body)
    db.Schedule
      .updateOne({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // UPDATE schedule by confId
  updateScheduleByConfId: function (req, res) {
    console.log("from scheduleCont updateScheduleByConfId", req.params.id, req.body)
    db.Schedule
      .updateOne({ confId: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },
};