const db = require("../models")

module.exports = {
  // CREATE new presenter in database
  create: function (req, res) {
    console.log("from presenterController create", req.body)
    db.Presenter
      .findOne({ email: req.body.email, confId: req.body.confId }, function (err, presenter) {
        if (err) {
          let err = new Error("We're sorry, it looks like gremlins have gotten into our database. Please try again.")
          err.status = 400;
          return err;
        } else if (presenter) {
          let err = new Error("We're sorry, that email has already been registered. Please use another email.")
          err.status = 400;
          return err;
        } else {
          db.Presenter
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
        }
      })
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


  // UPDATE presenter
  updatePresenter: function (req, res) {
    console.log("from presenterCont updatePresenter", req.params.id)
    db.Presenter
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // DELETE presenter
  removePresenter: function (req, res) {
    console.log("from presenterCont removePresenter", req.params.id)
    db.Presenter
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  }
}