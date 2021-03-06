import axios from "axios";

const PresenterAPI = {

  // POST presenter to database
  savePresenter: function (confId) {
    console.log("from API savePresenter", confId)
    return axios.post("/api/presenter/post", confId)
  },


  // GET all presenters
  getPresenters: function () {
    return axios.get("/api/presenter")
  },

  // GET presenters by conference
  getPresentersByConf: function (confId) {
    console.log("from API getPresenters", confId)
    return axios.get(`/api/presenter/conference/${confId}`)
  },

  // GET one presenter by presId
  getPresenterById: function (presId) {
    console.log("from API getPresenterById", presId)
    return axios.get(`/api/presenter/${presId}`)
  },

  // GET one presenter by email for this conference
  getPresenterByEmail: function (email, confId) {
    console.log("from API getPresenterByEmail", email, confId)
    return axios.get(`/api/presenter/email/${email}/${confId}`)
  },

  // GET conferences by presenter
  getConferencesPresenting: function (email) {
    console.log("from API getConferencesPresenting", email)
    return axios.get(`/api/presenter/conferences/${email}`)
  },


  // UPDATE presenter information by ID
  updatePresenterById: function (formObj, presId) {
    console.log("from API updatePresenterById", formObj, presId)
    return axios.put(`/api/presenter/update/id/${presId}`, formObj)
  },

  // UPDATE presenter information by email and confId
  updatePresenterByEmail: function (formObj, email, confId) {
    console.log("from API updatePresenterByEmail", formObj, email, confId)
    return axios.put(`/api/presenter/update/email/${email}/${confId}`, formObj)
  },


  // DELETE presenter by presId
  deletePresenter: function (presId) {
    console.log("from API deletePresenter", presId)
    return axios.delete(`/api/presenter/delete/id/${presId}`)
  },

  // DELETE presenter by email
  deletePresenterByEmail: function (email, confId) {
    console.log("from API deletePresenter", email, confId)
    return axios.delete(`/api/presenter/delete/email/${email}/${confId}`)
  }

}

export default PresenterAPI;