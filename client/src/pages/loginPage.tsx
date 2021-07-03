import React, { ReactElement } from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import { Card, Button } from "react-bootstrap";
import { TitleCard } from "../components/cards";
import './style.css';

const Login = (): ReactElement => {
  const { loginWithRedirect, isAuthenticated } = useAuth0<User>();

  return (
    <>
      {!isAuthenticated &&
        <div >
          <TitleCard />
          <Card>
            <Card.Body className="login">
              <h2> Welcome to Bristlecone Conference Management System</h2>
              <Button data-toggle="popover" title="Log in" onClick={() => loginWithRedirect()} className="button">Log in</Button>
            </Card.Body>
          </Card>
        </div>
      }
    </>
  )
};

export default Login;