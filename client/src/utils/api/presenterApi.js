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


  // UPDATE presenter information by email and confId
  updatePresenterByEmail: function (formObj, email, confId) {
    console.log("from API updatePresenterByEmail", formObj, email, confId)
    return axios.put(`/api/presenter/update/email/${email}/${confId}`, formObj)
  },

  // UPDATE presenter information by id
  updatePresenter: function (formObj, presId) {
    console.log("from updatePresenter", formObj, presId)
    return axios.put(`/api/presenter/update/id/${presId}`)
  },


  // DELETE presenter
  deletePresenter: function (email, confId) {
    console.log("from API deletePresenter", email, confId)
    return axios.delete(`/api/presenter/delete/${email}/${confId}`)
  }

}

export default PresenterAPI;