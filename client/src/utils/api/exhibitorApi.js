import axios from "axios";

const ExhibitorAPI = {

  // POST exhibitor to database
  registerExhibitor: function (confId) {
    console.log("from API registerExhibitor", confId)
    return axios.post("/api/exhibitor/post", confId)
  },


  // GET exhibitors by conference
  getExhibitors: function (confId) {
    console.log("from API getExhibitors", confId)
    return axios.get(`/api/exhibitor/${confId}`)
  },


  // UPDATE exhibitor information
  updateExhibitor: function (formObj, email) {
    console.log ("from API updateExhibitor", formObj, email)
    return axios.put(`/api/exhibitor/update/${email}`, formObj)
  },


  // DELETE exhibitor
  deleteExhibitor: function (email) {
    console.log("from API deleteExhibitor", email)
    return axios.delete(`/api/exhibitor/delete/${email}`)
  }

}

export default ExhibitorAPI;