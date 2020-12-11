import React from "react";
// import { Container, Card } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Title from "../title";
import './style.css';

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <div >
        <Title/>
        <div className="loginCard">
            <h2 id="welcome"> Welcome to UCK Conference Management System</h2>
            <button onClick={() => loginWithRedirect()} className="loginBtn">Log in</button>
        </div>
      </div>
    )
  )
};

export default Login;