import axios from "axios";

const SessionAPI = {

  // POST session to database
  saveSession: function (confId) {
    console.log("from API saveSession", confId)
    return axios.post("/api/session/post", confId)
  },


  // GET sessions by confId
  getSessions: function (confId) {
    console.log("from API getSessions", confId)
    return axios.get(`/api/session/conference/${confId}`)
  },

  // GET sessions by presenterId
  getSessionsByPresenter: function (presenterId) {
    console.log("from API getSessionsByPresenter", presenterId)
    return axios.get(`/api/session/presenter/${presenterId}`)
  },

  // GET session by sessId
  getSessionById: function (sessId) {
    console.log("from API getSessionById", sessId)
    return axios.get(`/api/session/${sessId}`)
  },


  // UPDATE session by sessId
  updateSession: function (formObj, sessId) {
    console.log("from API updateSession", formObj, sessId)
    return axios.put(`/api/session/update/${sessId}`, formObj)
  },


  // DELETE session
  deleteSession: function (sessId) {
    return axios.delete(`/api/session/delete/${sessId}`)
  },

  // DELETE all sessions by confId
  deleteSessions: function (confId) {
    console.log("from API deleteSessions", confId)
    return axios.delete(`/api/session/deleteconf/${confId}`)
  },
}

export default SessionAPI;