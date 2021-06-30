const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Conference = require("./conferenceModel");

var trimmedString = {
  type: String,
  trim: true
}

const scheduleSchema = new Schema({
  confId: {
    type: Schema.Types.ObjectId,
    ref: Conference,
    required: true
  },
  schedRooms: {
    type: [ trimmedString ]
  },
  schedTimes: {
    type: [ trimmedString ]
  }
})

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule