const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  email_verified: {
    type: Boolean,
    required: true
  },
  family_name: {
    type: String,
    required: true
  },
  given_name: {
    type: String,
    required: true
  },
  locale: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  sub: {
    type: String,
    required: true
  },
  updated_at: {
    type: String,
    required: true
  }
})

const User = mongoose.model("User", userSchema);
module.exports = User