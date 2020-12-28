import axios from "axios";

const PresenterAPI = {

  // POST presenter to database
  savePresenter: function (confId) {
    console.log("from API savePresenter", confId)
    return axios.post("/api/presenters/post", confId)
  },


  // GET presenters by conference
  getPresenters: function (confId) {
    console.log("from API getPresenters", confId)
    return axios.get(`/api/presenters/${confId}`)
  },


  // UPDATE presenter information
  updatePresenter: function (formObj, email) {
    console.log ("from API updatePresenter", formObj, email)
    return axios.put(`/api/presenters/update/${email}`, formObj)
  },


  // DELETE presenter
  deletePresenter: function (email) {
    console.log("from API deletePresenter", email)
    return axios.delete(`/api/presenters/delete/${email}`)
  }

}

export default PresenterAPI;