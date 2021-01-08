import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Button } from "react-bootstrap";
import { TitleCard } from "../cards";
import './style.css';

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <div >
        <TitleCard />
        <Card>
          <Card.Body className="login">
            <h2> Welcome to Blue Star Conference Management System</h2>
            <Button data-toggle="popover" title="Log in" onClick={() => loginWithRedirect()} className="button">Log in</Button>
          </Card.Body>
        </Card>
      </div>
    )
  )
};

export default Login;