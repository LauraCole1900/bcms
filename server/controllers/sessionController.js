const ObjectId = require('mongodb').ObjectId;
const db = require("../models");

module.exports = {
  // POST
  create: function (req, res) {
    db.Session
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  // GET 
	findAll: function (req, res) {
		db.Session
			.find({})
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
    },
  
	findByConfId: function (req, res) {
		console.log("from sessCont findByConfId", req.params.id)
		db.Session
			.find({ confId: req.params.id })
			.then(dbModel => {
				res.json(dbModel)
			})
			.catch(err => {
				console.log(err)
				res.status(422).json(err)
			});
  },
  
	findBySessId: function (req, res) {
    console.log("from sessCont findBySessId", req.params.id)
    db.Session
      .find(ObjectId(req.params.id))
      .then(dbModel => {
				res.json(dbModel)
			})
      .catch(err => {
				console.log(err)
				res.status(422).json(err)
			});
  },
  
  // PUT
	updateSession: function (req, res) {
    console.log("from sessCont updateSession", req.params.sessId)
		db.Session
			.findOneAndUpdate({ _id: req.params.sessId }, req.body)
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
  },
  
  // DELETE
	removeSession: function (req, res) {
    console.log("from sessCont removeSession", req.params.sessId)
		db.Session
			.findById({ _id: req.params.sessId })
			.then(dbModel => dbModel.remove())
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
	}
};