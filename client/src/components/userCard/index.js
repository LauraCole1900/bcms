import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { UserAPI } from "../../utils/api";
import "./style.css";

const UserCard = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();

  function handleUpdate() {
    const email = { email: user.email }
    UserAPI.updateUser({ ...user }, email)
      .then(history.push(`/update_user/${user._id}`))
      .catch(err => console.log(err))
  }

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
              <Button onClick={handleUpdate} type="submit">Update Your Info</Button>
            </Col>
          </Row>
        </Card>
      }
    </>
  )

}

export default UserCard;