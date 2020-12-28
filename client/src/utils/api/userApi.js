import axios from "axios";

const UserAPI = {

  // POST user to database
  saveUser: function (userData) {
    console.log("from API saveUser", userData)
    return axios.post("/api/users/post", userData)
  },


  // GET all users
  getUsers: function () {
    return axios.get("/api/users")
  },


  // UPDATE user information
  updateUser: function (formObj, email) {
    console.log("from API updateUser", formObj, email)
    return axios.put(`/api/users/update/${email}`, formObj)
  },


  // DELETE user
  deleteUser: function (email) {
    console.log("from API deleteUser", email)
    return axios.delete(`/api/users/delete/${email}`)
  }

}

export default UserAPI;