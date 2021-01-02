import { useState, createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { UserAPI } from "../api";


const UserContext = createContext({
  userInfo: {},
  SetUserInfo: () => {
    const { user } = useAuth0();
    const [userInfo, setUserInfo] = useState({});

    UserAPI.getUserByEmail(user.email)
      .then(resp => {
        const userArr = resp.data;
        setUserInfo(userArr)
          .then(userInfo => resp.json(userInfo))
          .catch(err => resp.status(422).json(err))
      }).catch(err => console.log(err))
  }
})

export default UserContext;