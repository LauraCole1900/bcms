import React, { ReactElement, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0, User } from "@auth0/auth0-react";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { UserAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

const UserCard = (): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  const [userInfo, setUserInfo] = useState<User>({});
  const [pageReady, setPageReady] = useState<boolean>(false);

  useEffect(() => {
    UserAPI.getUserByEmail(user!.email)
      .then((resp: AxiosResponse<User>) => {
        const userObj: User = resp.data;
        setUserInfo(userObj);
      })
      .catch((err: AxiosError) => console.log(err))

    setPageReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {pageReady === true &&
        isAuthenticated &&
        <Card className="infoCard">
          <Row>
            <Col sm={3}>
              <Row>
                <Col sm={12}>
                  <Image
                    fluid
                    className="profilePic"
                    src={userInfo.picture}
                    alt="Profile picture"
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Link to={{
                    state: { ...userInfo },
                    pathname: "/update_user"
                  }}>
                    <Button
                      data-toggle="popover"
                      title="Update your info"
                      className="userBtn"
                    >Update Your Info</Button>
                  </Link>
                </Col>
              </Row>
            </Col>
            <Col sm={8} className="userInfo">
              <h2>{userInfo.given_name} {userInfo.family_name}</h2>
              <h4>{userInfo.email}</h4>
            </Col>
          </Row>
        </Card >
      }
    </>
  )

}

export default UserCard;