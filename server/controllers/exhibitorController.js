const db = require("../models")

module.exports = {
  // CREATE new exhibitor in database
  create: function (req, res) {
    console.log("from exhibitorController create", req.body.email)
    db.Exhibitor
      .findOne({ email: req.body.email }, function (err, exhibitor) {
        if (err) {
          let err = new Error("We're sorry, it looks like gremlins have gotten into our database. Please try again.")
          err.status = 400;
          return err;
        } else if (exhibitor) {
          let err = new Error("We're sorry, that email has already been registered. Please use another email.")
          err.status = 400;
          return err;
        } else {
          db.Exhibitor
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
        }
      })
  },


  // FIND all exhibitors
  findAll: function (req, res) {
    db.Exhibitor
      .find({})
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND exhibitors by confId
  findByConfId: function (req, res) {
    console.log("from exhibitorCont findByConfId", req.params.id)
    db.Exhibitor
      .find({ confId: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND exhibitor by ID
  findById: function (req, res) {
    console.log("from exhibitorCont findById", req.params.id)
    db.Exhibitor
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  // FIND by exhibitor email
  findByEmail: function (req, res) {
    console.log("from exhibitorCont findByEmail", req.params.email)
    db.Exhibitor
      .find({ exhEmail: req.params.email })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },

  //FIND by confId and exhibitor email to update
  findByIdAndEmail: function (req, res) {
    console.log("from exhibitorCont findByIdAndEmail", req.params.id, req.params.email)
    db.Exhibitor
      .findOne({ confId: req.params.id, exhEmail: req.params.email })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // UPDATE exhibitor
  updateExhibitor: function (req, res) {
    db.Exhibitor
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  },


  // DELETE exhibitor
  removeExhibitor: function (req, res) {
    db.Exhibitor
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err))
  }
}