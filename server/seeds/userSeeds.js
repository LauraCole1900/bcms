const mongoose = require("mongoose");
const db = require("../models/");

// Empties the Users collection and inserts the user(s) below

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/bcms"
);

const userSeed = [
    {
      given_name: "Martha",
      family_name: "Jones",
      nickname: "user",
      name: "Martha Jones",
      picture: "https://lh3.googleusercontent.com/a-/AOh14GipKmbXcoOtw-x2h3ilQKQj-wqL3HCtlOgmHJAi=s192-c-rg-br100",
      locale: "en",
      updated_at: "2020-12-06T04:01:03.632Z",
      email: "email@email.com",
      email_verified: true,
      sub: "google-oauth2|117267836135427028977",
      __v: 0
    }
];

db.User
  .remove({})
  .then(() => db.User.collection.insertMany(userSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });