import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import "./style.css";

const UserCard = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <>
      { isAuthenticated &&
        <Card className="userCard">
          <Row>
            <Col sm={2}>
              <Image fluid className="profilePic" src={user.picture} alt="Profile picture" />
            </Col>
            <Col sm={4} className="userInfo">
              <h1 className="userName">{user.given_name} {user.family_name}</h1>
              <h3 className="userEmail">{user.email}</h3>
              <Link to={{
                state: { ...user },
                pathname: "/update_user"
              }}>
                <Button data-toggle="popover" title="Update your info" className="button">Update Your Info</Button>
              </Link>
            </Col>
          </Row>
        </Card>
      }
    </>
  )

}

export default UserCard;