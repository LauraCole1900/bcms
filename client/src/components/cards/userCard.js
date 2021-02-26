import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import "./style.css";
import { UserAPI } from "../../utils/api";

const UserCard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userInfo, setUserInfo] = useState({});
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    UserAPI.getUserByEmail(user.email)
      .then(resp => {
        console.log("from userCard getUserByEmail", resp.data);
        const userArr = resp.data;
        setUserInfo(userArr);
      })
      .catch(err => console.log(err))

    setPageReady(true);
  }, [])

  return (
    <>
      { pageReady === true &&
        isAuthenticated &&
        <Card className="infoCard">
          <Row>
            <Col sm={2}>
              <Image fluid className="profilePic" src={userInfo.picture} alt="Profile picture" />
            </Col>
            <Col sm={4} className="userInfo">
              <h1 className="userName">{userInfo.given_name} {userInfo.family_name}</h1>
              <h3 className="userEmail">{userInfo.email}</h3>
              <Link to={{
                state: { ...userInfo },
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