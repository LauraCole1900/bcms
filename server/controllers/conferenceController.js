const ObjectId = require("mongodb").ObjectId;
const db = require("../models");

module.exports = {
  // POST new conference to database
  create: function (req, res) {
    console.log("from confCont create", req.body)
    db.Conference
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  
  // GET all conferences
  findAll: function (req, res) {
    db.Conference
      .find({})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.statue(422).json(err))
  },
  
    // GET conference by confId
    findById: function (req, res) {
      console.log("from confCont findById", req.params.id)
      db.Conference
        .find(ObjectId(req.params.id))
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    },

  // GET conferences associated with user's email
  findByEmail: function (req, res) {
    console.log("from confCont findByEmail", req.params.email)
    db.Conference
      .find({ creatorEmail: req.params.email })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  // GET conferences user is attending
  findConfAttending: function (req, res) {
    console.log("from confCont findConfAttending", req.params.email)
    db.Conference
      .find({ confAttendees: req.params.email })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  // GET conferences at which user is presenting
  findConfPresenting: function (req, res) {
    console.log("from confCont findConfPresenting", req.params.email)
    db.Conference
      .find({ confPresenters: req.params.email })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  // GET conferences at which user is exhibiting
  findConfExhibiting: function (req, res) {
    console.log("from confCont findConfExhibiting", req.params.email)
    db.Conference
    .find({ confExhibitors: req.params.email })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err));
  },


  // PUT existing conference
  updateConference: function (req, res) {
    console.log("from confCont updateConference", req.params.id)
    db.Conference
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  // PUT attendees
  updateRegistered: function (req, res) {
    console.log("from confCont updateRegistered", req.params.id, req.body.email)
    db.Conference
      .updateOne({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },


  // DELETE conference
  removeConference: function (req, res) {
    console.log("from confCont removeConference", req.params.id)
    db.Conference
      .findById({ _id: ObjectId(req.params.id) })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};