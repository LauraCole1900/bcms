import axios from "axios";

const ScheduleAPI = {

  // POST schedule to database
  saveSchedule: function (confId) {
    console.log("from API saveSchedule", confId)
    return axios.post("/api/schedule/post", confId)
  },


  // GET schedule info by confId
  getScheduleByConfId: function (confId) {
    console.log("from API getScheduleByConfId", confId)
    return axios.get(`/api/schedule/conference/${confId}`)
  },


  // UPDATE schedule header information by schedId
  updateScheduleById: function (data, id) {
    console.log("from API updateScheduleById", data, id)
    return axios.put(`/api/schedule/update/${id}`, data)
  },

  // UPDATE schedule header information by confId
  updateScheduleByConfId: function (formData, confId) {
    console.log("from API updateScheduleByConfId", formData, confId)
    return axios.put(`/api/schedule/update/conference/${confId}`, formData)
  },

}

export default ScheduleAPI;