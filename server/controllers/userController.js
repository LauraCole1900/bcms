const db = require("../models")

module.exports = {
  // CREATE new user in database
  create: function (req, res) {
    db.User
    .findOne({ email: req.params.email }, function (err, user) {
      if (err) {
        let err = new Error("We're sorry, it looks like gremlins have gotten into our database. Please try again.")
        err.status = 400;
        return err;
      }
      if (user) {
        let err = new Error("We're sorry, that email has already been registered. Please use another email.")
        err.status = 400;
        return err;
      } else {
        db.User
        .create(req.body)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err))
      }
    })
  },


  // FIND all users
  findAll: function (req, res) {
    db.User
    .find({})
    .sort({ date: -1 })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  },

  // FIND user by ID
  findById: function (req, res) {
    db.User
    .findById(req.params.id)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  },


  // UPDATE user
  update: function (req, res) {
    db.User
    .findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  },


  // REMOVE user
  remove: function (req, res) {
    db.User
    .findById({ _id: req.params.id })
    .then(dbModel => dbModel.remove())
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  }
}