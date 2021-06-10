import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { UserAPI } from "../../utils/api";
import "./style.css";

const UserCard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userInfo, setUserInfo] = useState({});
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    UserAPI.getUserByEmail(user.email)
      .then(resp => {
        const userArr = resp.data;
        setUserInfo(userArr);
      })
      .catch(err => console.log(err))

    setPageReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      { pageReady === true &&
        isAuthenticated &&
        <Card className="infoCard">
          <Row>
            <Col sm={3}>
              <Image fluid="true" className="profilePic" src={userInfo.picture} alt="Profile picture" />
              <Link to={{
                state: { ...userInfo },
                pathname: "/update_user"
              }}>
                <Button data-toggle="popover" title="Update your info" className="button">Update Your Info</Button>
              </Link>
            </Col>
            <Col sm={8} className="userInfo">
              <h2>{userInfo.given_name} {userInfo.family_name}</h2>
              <h4>{userInfo.email}</h4>
            </Col>
          </Row>
        </Card>
      }
    </>
  )

}

export default UserCard;