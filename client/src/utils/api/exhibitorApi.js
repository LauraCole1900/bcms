import axios from "axios";

const ExhibitorAPI = {

  // POST exhibitor to database
  registerExhibitor: function (formData) {
    console.log("from API registerExhibitor", formData)
    return axios.post("/api/exhibitor/post", formData)
  },


  // GET exhibitors by conference
  getExhibitors: function (confId) {
    console.log("from API getExhibitors", confId)
    return axios.get(`/api/exhibitor/conference/${confId}`)
  },

  // GET one exhibitor document by exhId
  getExhibitorById: function (exhId) {
    console.log("from API getExhibitorById", exhId)
    return axios.get(`/api/exhibitor/${exhId}`)
  },

  // GET one exhibitor document by confId and user.email
  getExhibitorToUpdate: function (confId, email) {
    console.log("from API getExhibitorToUpdate", confId, email)
    return axios.get(`/api/exhibitor/conference/${confId}/${email}`)
  },

  //GET conferences by exhibitor
  getConferencesExhibiting: function (email) {
    console.log("from API get ConferencesExhibiting", email)
    return axios.get(`/api/exhibitor/conferences/${email}`)
  },


  // UPDATE exhibitor information
  updateExhibitor: function (formObj, exhId) {
    console.log ("from API updateExhibitor", formObj, exhId)
    return axios.put(`/api/exhibitor/update/${exhId}`, formObj)
  },


  // DELETE exhibitor
  deleteExhibitor: function (confId, email) {
    console.log("from API deleteExhibitor", confId, email)
    return axios.delete(`/api/exhibitor/delete/${confId}/${email}`)
  },

  // DELETE all exhibitors by confId
  deleteExhibitors: function (confId) {
    console.log("from API deleteExhibitors", confId)
    return axios.delete(`/api/exhibitor/deleteconf/${confId}`)
  },

}

export default ExhibitorAPI;