import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Form, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { UserAPI } from "../../utils/api";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const UpdateUser = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  let err;
  const [pageReady, setPageReady] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  // Breaks down the URL
  const urlArray = window.location.href.split("/")
  // Use to refer to "/new_conference"
  const urlId = urlArray[urlArray.length - 1]
  // Use to refer to "/edit_conference/{confId}"
  const urlType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

  useEffect(() => {
    if (isAuthenticated) {
      // GET call to pre-populate the form
      UserAPI.getUserByEmail(user.email)
        .then(resp => {
          console.log("from userInfo getUserByEmail", resp.data);
          const userArr = resp.data;
          setUserInfo(userArr);
          setPageReady(true);
        })
        .catch(err => console.log(err))
    }
  }, [])

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
  };

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("User update", user.email);
    // PUT call to update user document
    UserAPI.updateUser({ ...user, given_name: userInfo.given_name, family_name: userInfo.family_name }, user.email)
      .then(res => {
        // If no errors thrown, push to Success page
        if (!res.err) {
          handleShowSuccess();
        }
      })
      // If yes errors thrown, push to Error page
      .catch(err => {
        handleShowErr();
        console.log(err)
        return err
      })
  }


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to edit user information.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      {pageReady === true &&
        <Container>
          <Form className="userForm">

            <Card className="formCard">
              <Card.Title><h1>Update Your Information</h1></Card.Title>
              <Card.Body className="cardBody">
                <Row>
                  <Form.Group controlId="formUserName">
                    <Col sm={6}>
                      <Form.Label>Given name:</Form.Label>
                      <Form.Control type="input" name="given_name" placeholder="Martha" value={userInfo.given_name} className="formInput" onChange={handleInputChange} />
                    </Col>
                    <Col sm={6}>
                      <Form.Label>Family name:</Form.Label>
                      <Form.Control type="input" name="family_name" placeholder="Jones" value={userInfo.family_name} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Form.Group>
                </Row>

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formUserNickname">
                      <Form.Label>Nickname?</Form.Label>
                      <Form.Control type="input" name="nickname" placeholder="Enter your nickname" value={userInfo.nickname} className="formInput" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={12}>
                    <Form.Group controlId="formUserPicUrl">
                      <Form.Label>URL of profile pic:</Form.Label>
                      <Form.Control type="input" name="picture" placeholder="Enter URL of externally-hosted profile picture" value={userInfo.picture} className="formInput" onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Info</Button>
            </Row>

          </Form>

          <SuccessModal urlid={urlId} urltype={urlType} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal urlid={urlId} urltype={urlType} errmsg={err} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )

}

export default UpdateUser;