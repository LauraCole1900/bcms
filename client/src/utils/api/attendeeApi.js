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


  // UPDATE attendee information by confId and email
  updateAttendee: function (formData, confId, email) {
    console.log("from API updateAttendee", formData, confId, email)
    return axios.put(`/api/attendee/update/${confId}/${email}`, formData)
  },

  // UPDATE attendee information by confId and email
  updateAttendeeById: function (id, data) {
    console.log("from API updateAttendeeById", id, data)
    return axios.put(`/api/attendee/update/${id}`, data)
  },


  // DELETE attendee
  unregisterAttendee: function (email, confId) {
    console.log("from API unregisterAttendee", email, confId)
    return axios.delete(`/api/attendee/delete/${confId}/${email}`)
  },

  // DELETE all attendees by confId
  deleteAttendees: function (confId) {
    console.log("from API deleteAttendees", confId)
    return axios.delete(`/api/attendee/deleteconf/${confId}`)
  },

}

export default AttendeeAPI;