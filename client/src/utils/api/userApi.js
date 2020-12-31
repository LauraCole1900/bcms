import axios from "axios";

const UserAPI = {

  // POST user to database
  saveUser: function (userData) {
    console.log("from API saveUser", userData)
    return axios.post("/api/user/post", userData)
  },


  // GET all users
  getUsers: function () {
    return axios.get("/api/user")
  },


  // UPDATE user information
  updateUser: function (formObj, email) {
    console.log("from API updateUser", formObj, email)
    return axios.put(`/api/user/update/${email}`, formObj)
  },


  // DELETE user
  deleteUser: function (email) {
    console.log("from API deleteUser", email)
    return axios.delete(`/api/user/delete/${email}`)
  }

}

export default UserAPI;