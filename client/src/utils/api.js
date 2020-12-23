import axios from "axios";

const API = {

  // User Routes

  // POST user to database
  saveUser: function (userData) {
    console.log("from API saveUser", userData)
    return axios.post("/api/user", userData)
  },


  // GET all users
  getUsers: function () {
    return axios.get("/api/users")
  },

  // GET attendees by conference
  getUsersAttending: function (confId) {
    console.log("from API getUsersAttending", confId)
    return axios.get(`/api/users/attending/${confId}`)
  },

  // GET presenters by conference
  getUsersPresenting: function (confId) {
    console.log("from API getUsersPresenting", confId)
    return axios.get(`/api/users/presenting/${confId}`)
  },

  // GET exhibitors by conference
  getUsersExhibiting: function (confId) {
    console.log("from API getUsersExhibiting", confId)
    return axios.get(`/api/users/exhibiting/${confId}`)
  },


  // UPDATE user information
  updateUser: function (formObj, email) {
    console.log("from API updateUser", formObj, email)
    return axios.put(`/api/users/update/${email}`, formObj)
  },
  

  // DELETE user
  deleteUser: function (email) {
    console.log("from API deleteUser", email)
    return axios.delete(`/api/users/delete/${email}`)
  },


  // Conference Routes

  // POST conference to database
  createConference: function (confData) {
    console.log("from API createConference", confData)
    return axios.post("/api/conference/post", confData)
  },


  // GET all conferences
  getConferences: function () {
    return axios.get("/api/conference")
  },

  // GET conferences by user email
  getConferencesByEmail: function (email) {
    console.log("from API getConferencesByEmail", email)
    return axios.get(`/api/conference/${email}`)
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
  },


  // Session Routes

  // POST session to database
}

export default API;