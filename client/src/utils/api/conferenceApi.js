import axios from "axios";

const ConferenceAPI = {

  // POST conference to database
  createConference: function (confData) {
    console.log("from API createConference", confData)
    return axios.post("/api/conference/post", confData)
  },


  // GET all conferences
  getConferences: function () {
    return axios.get("/api/conference")
  },

  // GET conferences user has created
  getConferencesCreated: function (email) {
    console.log("from API getConferencesCreated", email)
    return axios.get(`/api/conference/email/${email}`)
  },

  // GET conferences user is attending
  getConferencesAttending: function (email) {
    console.log("from API getConferencesAttending", email)
    return axios.get(`/api/conference/attending/${email}`)
  },

  // GET conferences at which user is presenting
  getConferencesPresenting: function (email) {
    console.log("from API getConferencesPresenting", email)
    return axios.get(`/api/conference/presenting/${email}`)
  },

  // GET conferences at which user is exhibitor
  getConferencesExhibiting: function (email) {
    console.log("from API getConferencesExhibiting", email)
    return axios.get(`/api/conference/exhibiting/${email}`)
  },

  // GET conference by confId
  getConferenceById: function (confId) {
    console.log("from API getConferenceById", confId)
    return axios.get(`/api/conference/${confId}`)
  },


  // UPDATE conference by confId
  updateConference: function (formObj, confId) {
    console.log("from API updateConference: obj, id", formObj, confId)
    return axios.put(`/api/conference/update/${confId}`, formObj)
  },

  // UPDATE conference attendees
  updateConferenceAttendees: function (confId, email) {
    console.log("from API updateConferenceAttendees: confId, email", confId, email)
    return axios.put(`/api/conference/attending/${confId}`, email)
  },


  // DELETE conference
  deleteConference: function (confId) {
    console.log("from API deleteConference", confId)
    return axios.delete(`/api/conference/delete/${confId}`)
  }
  
}

export default ConferenceAPI;