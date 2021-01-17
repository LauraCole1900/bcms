import axios from "axios";

const AttendeeAPI = {

  // POST attendee to database
  registerAttendee: function (formData) {
    console.log("from API registerAttendee", formData)
    return axios.post("/api/attendee/post", formData)
  },


  // GET attendees by conference
  getAttendees: function (confId) {
    console.log("from API getAttendees", confId)
    return axios.get(`/api/attendee/conference/${confId}`)
  },

  // GET conferences by attendee
  getConferencesAttending: function (email) {
    console.log("from API getConferencesAttending", email)
    return axios.get(`/api/attendee/conferences/${email}`)
  },

  // GET one attendee document to update
  getAttendeeToUpdate: function (email, confId) {
    console.log("from API getAttendeeToUpdate", email, confId)
    return axios.get(`/api/attendee/conference/${confId}/${email}`)
  },


  // UPDATE attendee information
  updateAttendee: function (formData, confId, email) {
    console.log ("from API updateAttendee", formData, confId, email)
    return axios.put(`/api/attendee/update/${confId}/${email}`, formData)
  },


  // DELETE attendee
  unregisterAttendee: function (email, confId) {
    console.log("from API unregisterAttendee", email, confId)
    return axios.delete(`/api/attendee/delete/${confId}/${email}`)
  }

}

export default AttendeeAPI;