const db = require("../models")
const { findOneAndDelete } = require("../models/attendeeModel")

module.exports = {
  // CREATE new presenter in database
  create: function (req, res) {
    console.log("from presenterController create", req.body)
    db.Presenter
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // FIND all presenters
  findAll: function (req, res) {
    db.Presenter
      .find({})
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND presenters by conference
  findByConfId: function (req, res) {
    console.log("from presenterCont findByConfId", req.params.id)
    db.Presenter
      .find({ confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND presenter by ID
  findById: function (req, res) {
    console.log("from presenterCont findById", req.params.id)
    db.Presenter
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND presenter by email
  findByEmail: function (req, res) {
    console.log("from presenterCont findByEmail", req.params.email, req.params.id)
    db.Presenter
      .findOne({ presEmail: req.params.email, confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // UPDATE presenter by ID
  updatePresenterById: function (req, res) {
    console.log("from presenterCont updatePresenterById", req.params.id, req.body)
    db.Presenter
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // UPDATE presenter by email and confId
  updatePresenterByEmail: function (req, res) {
    console.log("from presenterCont updatePresenterByEmail", req.params.email, req.params.id, req.body)
    db.Presenter
      .findOneAndUpdate({ presEmail: req.params.email, confId: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // DELETE presenter by presId
  removePresenterById: function (req, res) {
    console.log("from presenterCont removePresenterById", req.params.id)
    db.Presenter
      .findOneAndDelete({ _id: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // DELETE presenter by email and confId
  removePresenterByEmail: function (req, res) {
    console.log("from presenterCont removePresenterByEmail", req.params.email, req.params.id)
    db.Presenter
      .findOneAndDelete({ presEmail: req.params.email, confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  }
}