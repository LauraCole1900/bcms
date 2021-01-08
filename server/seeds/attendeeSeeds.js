const mongoose = require("mongoose");
const db = require("../models");

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/attendee"
);

const attendeeSeed = [
  {
    _id: ObjectId("5ff068f81fc16a1be4192e5f"),
    allergies: [
      "People named Brendon"
    ],
    confId: "5fee41ff7921f31a7c76579c",
    email: "garytalmes@gmail.com",
    givenName: "Gary",
    familyName: "Almes",
    phone: "(123)456-7809",
    employerName: "Starship Enterprise",
    employerAddress: "3700 O St NW, Washington, DC, 20057",
    emergencyContactName: "Dave Cole",
    emergencyContactPhone: "(970)284-7809",
    allergyConfirm: "yes",
  },
  {
    _id: ObjectId("5ff6bf03cb364a1bbc9a86b7"),
    allergies: [],
    confId: "5fefccadefdd6a1ed8f41d09",
    email: "lauracole1900@gmail.com",
    givenName: "Laura",
    familyName: "Cole",
    phone: "(123)456-7809",
    employerName: "Montgomery Church",
    employerAddress: "111 Main St. LaSalle, Co",
    emergencyContactName: "The Doctor",
    emergencyContactPhone: "(970)865-4321",
  },
  {
    _id: ObjectId("5ff769e725837b25f8966a7e"),
    allergies: [],
    confId: "5fed4f18bc71db3f88363868",
    email: "garytalmes@gmail.com",
    givenName: "Gary",
    familyName: "Almes",
    phone: "(123)456-7890",
    employerName: "Noble Corporation",
    employerAddress: "123 Park Ave., Somewhere, MD, 20707",
    emergencyContactName: "The Doctor",
    emergencyContactPhone: "(970)865-4321",
}
]

db.Attendee
  .remove({})
  .then(() => db.Attendee.collection.insertMany(attendeeSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });