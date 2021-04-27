const ObjectId = require('mongodb').ObjectId;
const db = require("../models");

module.exports = {
	// POST new session to database
	create: function (req, res) {
		db.Session
			.create(req.body)
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
	},


	// GET all sessions
	findAll: function (req, res) {
		db.Session
			.find({})
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
	},

	// GET sessions by confId
	findByConfId: function (req, res) {
		console.log("from sessCont findByConfId", req.params.confid)
		db.Session
			.find({ confId: req.params.confid })
			.then(dbModel => { res.json(dbModel) })
			.catch(err => {
				console.log(err)
				res.status(422).json(err)
			});
	},

	// GET sessions by sessId
	findBySessId: function (req, res) {
		console.log("from sessCont findBySessId", req.params.id)
		db.Session
			.find(ObjectId(req.params.id))
			.then(dbModel => { res.json(dbModel) })
			.catch(err => {
				console.log(err)
				res.status(422).json(err)
			});
	},


	// PUT session by sessId
	updateSession: function (req, res) {
		console.log("from sessCont updateSession", req.params.id, req.body)
		db.Session
			.findOneAndUpdate({ _id: req.params.id }, req.body)
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
	},


	// DELETE session
	removeSession: function (req, res) {
		console.log("from sessCont removeSession", req.params.id)
		db.Session
			.deleteOne({ _id: req.params.id })
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err));
	},

	// DELETE sessions by confId
	deleteSessionsByConfId: function (req, res) {
		console.log("from sessionCont deleteSessionsByConfId", req.params.id)
		db.Session
			.deleteMany({ confId: req.params.id })
			.then(dbModel => res.json(dbModel))
			.catch(err => res.status(422).json(err))
	},
};