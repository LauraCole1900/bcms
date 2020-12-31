const db = require("../models")

module.exports = {
  // POST new user to database
  create: function (req, res) {
    console.log("from userController create", req.body.email)
    db.User
    .findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        let err = new Error("We're sorry, it looks like gremlins have gotten into our database. Please try again.")
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


  // GET all users
  findAll: function (req, res) {
    db.User
    .find({})
    .sort({ date: -1 })
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  },

  // GET user by ID
  findById: function (req, res) {
    db.User
    .findById(req.params.id)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  },


  // PUT user
  updateUser: function (req, res) {
    db.User
    .findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  },


  // DELETE user
  removeUser: function (req, res) {
    db.User
    .findById({ _id: req.params.id })
    .then(dbModel => dbModel.remove())
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))
  }
}