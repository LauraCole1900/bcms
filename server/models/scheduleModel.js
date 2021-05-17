const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var trimmedString = {
  type: String,
  trim: true
}

const scheduleSchema = new Schema({
  confId: {
    type: String,
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