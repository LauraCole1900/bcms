const db = require("../models")

module.exports = {
  // CREATE new presenter in database
  create: function (req, res) {
    console.log("from presenterController create", req.params.email)
    db.Presenter
    .findOne({ email: req.params.email }, function (err, presenter) {
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

  // FIND presenter by ID
  findById: function (req, res) {
    db.Presenter
    .findById(req.params.id)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  },


  // UPDATE presenter
  updatePresenter: function (req, res) {
    db.Presenter
    .findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  },


  // DELETE presenter
  removePresenter: function (req, res) {
    db.Presenter
    .findById({ _id: req.params.id })
    .then(dbModel => dbModel.remove())
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  }
}