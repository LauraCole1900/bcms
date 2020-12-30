const mongoose = require("mongoose");
const db = require("../models");

// This file empties the Conference collection and inserts the conferences below

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/bcms"
);

const conferenceSeed = [
  {
    creatorEmail: "email@email.com",
    confName: "Seeder Conference",
    confOrg: "Fake Org",
    confDesc: "This is a seeder conference to test routes. It is not real.",
    startDate: "2021-01-01",
    endDate: "2021-01-01",
    confStartTime: "9:00am",
    confEndTime: "5:00pm",
    confType: "Virtual",
    confLoc: "Zoom",
    confCapConfirm: false,
    confWaiver: false
  }
];

db.Conference
  .remove({})
  .then(() => db.Conference.collection.insertMany(conferenceSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });