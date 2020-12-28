import axios from "axios";

const AttendeeAPI = {

  // POST attendee to database
  registerAttendee: function (formData) {
    console.log("from API registerAttendee", formData)
    return axios.post("/api/attendees/post", formData)
  },


  // GET attendees by conference
  getAttendees: function (confId) {
    console.log("from API getAttendees", confId)
    return axios.get(`/api/attendees/${confId}`)
  },


  // UPDATE attendee information
  updateAttendee: function (formData, email) {
    console.log ("from API updateAttendee", formData, email)
    return axios.put(`/api/attendees/update/${email}`, formData)
  },


  // DELETE attendee
  unregisterAttendee: function (email) {
    console.log("from API unregisterAttendee", email)
    return axios.delete(`/api/attendees/delete/${email}`)
  }

}

export default AttendeeAPI;