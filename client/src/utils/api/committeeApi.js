import axios from "axios";

const CommitteeAPI = {

  // POST committee member to database
  createCommMember: function (formData) {
    console.log("from API createCommMember", formData)
    return axios.post("/api/committee/post", formData)
  },


  // GET committee by conference
  getCommittee: function (confId) {
    console.log("from API getCommittee", confId)
    return axios.get(`/api/committee/conference/${confId}`)
  },

  // GET one committee member by commID
  getCommMemberById: function (commId) {
    console.log("from API getCommitteeMemberById", commId)
    return axios.get(`/api/committee/${commId}`)
  },

  // GET one committee member document to update by email and conference ID
  getCommMemberToUpdate: function (email, confId) {
    console.log("from API getCommMemberToUpdate", email, confId)
    return axios.get(`/api/committee/conference/${confId}/${email}`)
  },


  // UPDATE committee member information by confId and email
  updateCommMember: function (formData, confId, email) {
    console.log("from API updateCommMember", formData, confId, email)
    return axios.put(`/api/committee/update/${confId}/${email}`, formData)
  },

  // UPDATE committee member information by commId
  updateCommMemberById: function (data, id) {
    console.log("from API updateCommMemberById", data, id)
    return axios.put(`/api/committee/update/${id}`, data)
  },


  // DELETE committee member
  deleteCommMember: function (email, confId) {
    console.log("from API deleteCommMember", email, confId)
    return axios.delete(`/api/committee/delete/${confId}/${email}`)
  },

  // DELETE committee by confId
  deleteCommittee: function (confId) {
    console.log("from API deleteAttendees", confId)
    return axios.delete(`/api/committee/deleteconf/${confId}`)
  },

}

export default CommitteeAPI;