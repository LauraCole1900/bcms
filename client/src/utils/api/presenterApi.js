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


  // UPDATE presenter information
  updatePresenter: function (formObj, email) {
    console.log("from API updatePresenter", formObj, email)
    return axios.put(`/api/presenter/update/${email}`, formObj)
  },


  // DELETE presenter
  deletePresenter: function (email) {
    console.log("from API deletePresenter", email)
    return axios.delete(`/api/presenter/delete/${email}`)
  }

}

export default PresenterAPI;