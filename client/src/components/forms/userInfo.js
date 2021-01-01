import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { UserAPI } from "../../utils/api";
import "./style.css";

const UpdateUser = () => {
  const { user } = useAuth0();
  const history = useHistory();
  const [pageReady, setPageReady] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    UserAPI.getUserByEmail(user.email).then(resp => {
      console.log("from userInfo getUserByEmail", resp.data);
      const userArr = resp.data;
      setUserInfo(userArr[0]);
      setPageReady(true);
    })
  }, [])

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  };

  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("User update", user.email);
    UserAPI.updateUser({ ...user, given_name: userInfo.given_name, family_name: userInfo.family_name }, user.email)
      .then(history.push("/user_updated"))
      .catch(err => console.log(err))
  }

  return (
    <>
      {pageReady === true &&
        <Container>
          <Form className="userForm">
            <Row>
              <Form.Group controlId="formUserName">
                <Col sm={6}>
                  <Form.Label>Given name:</Form.Label>
                  <Form.Control type="input" name="given_name" placeholder="Martha" value={user.given_name} className="userFName" onChange={handleInputChange} />
                </Col>
                <Col sm={6}>
                  <Form.Label>Family name:</Form.Label>
                  <Form.Control type="input" name="family_name" placeholder="Jones" value={user.family_name} className="userLName" onChange={handleInputChange} />
                </Col>
              </Form.Group>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="formUserNickname">
                  <Form.Label>Nickname?</Form.Label>
                  <Form.Control type="input" name="nickname" placeholder="Enter your nickname" value={user.nickname} className="userNickname" onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="formUserPicUrl">
                  <Form.Label>URL of profile pic:</Form.Label>
                  <Form.Control type="input" name="picture" placeholder="Enter URL of externally-hosted profile picture" value={user.picture} className="userPic" onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Button onClick={handleFormUpdate} type="submit">Update Info</Button>
            </Row>

          </Form>
        </Container>}
    </>
  )

}

export default UpdateUser;