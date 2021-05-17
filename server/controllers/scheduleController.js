const ObjectId = require('mongodb').ObjectId;
const db = require("../models");

module.exports = {
  // POST new schedule information to database
  create: function (req, res) {
    db.Schedule
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => console.log(err))
  },


  // GET schedule by confId
  findByConfId: function (req, res) {
    console.log("from schedCont findByConfId", req.params.id)
    db.Schedule
      .find({ confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => console.log(err))
  },


  // PUT schedule by confId
  updateScheduleByConfId: function (req, res) {
    console.log("from schedConf updateScheduleByConfId", req.params.id)
    db.Schedule
      .findOneAndUpdate({ confId: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => console.log(err))
  },
};