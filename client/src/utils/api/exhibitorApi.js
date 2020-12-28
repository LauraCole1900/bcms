import axios from "axios";

const ExhibitorAPI = {

  // POST exhibitor to database
  registerExhibitor: function (confId) {
    console.log("from API registerExhibitor", confId)
    return axios.post("/api/exhibitors/post", confId)
  },


  // GET exhibitors by conference
  getExhibitors: function (confId) {
    console.log("from API getExhibitors", confId)
    return axios.get(`/api/exhibitors/${confId}`)
  },


  // UPDATE exhibitor information
  updateExhibitor: function (formObj, email) {
    console.log ("from API updateExhibitor", formObj, email)
    return axios.put(`/api/exhibitors/update/${email}`, formObj)
  },


  // DELETE exhibitor
  deleteExhibitor: function (email) {
    console.log("from API deleteExhibitor", email)
    return axios.delete(`/api/exhibitors/delete/${email}`)
  }

}

export default ExhibitorAPI;