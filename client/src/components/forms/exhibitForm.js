import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import { exhValidate } from "../../utils/validation";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const ExhibitForm = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [pageReady, setPageReady] = useState(false);
  const [errThrown, setErrThrown] = useState();
  const [errors, setErrors] = useState({});
  const [conference, setConference] = useState({});
  const [exhibitor, setExhibitor] = useState({
    exhGivenName: "",
    exhFamilyName: "",
    exhEmail: "",
    exhCompany: "",
    exhPhone: "",
    exhCompanyAddress: "",
    exhWorkers: 1,
    exhWorkerName1: "",
    exhWorkerName2: "",
    exhWorkerName3: "",
    exhWorkerName4: "",
    exhSpaces: 1
  });

  // Breaks down the URL
  const urlArray = window.location.href.split("/")
  // Use to find confId from the URL
  const confId = urlArray[urlArray.length - 1]
  // Use to determine whether submitting new exhibit or editing existing exhibit
  const formType = urlArray[urlArray.length - 2]

  // Modal variables
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErr, setShowErr] = useState(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowErr = () => setShowErr(true);
  const handleHideErr = () => setShowErr(false);

  // GET call for conference information
  const fetchConf = async (id) => {
    await ConferenceAPI.getConferenceById(id)
      .then(resp => {
        console.log("from exhibitForm getConferenceById", resp.data)
        const confArr = resp.data[0];
        console.log({ confArr })
        setConference(confArr);
      })
      .catch(err => console.log(err));
  }

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    setExhibitor({ ...exhibitor, [e.target.name]: e.target.value })
  };

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
    // Validates required inputs
    const validationErrors = exhValidate(exhibitor);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log("Exhibitor update", exhibitor._id);
      // PUT call to update exhibitor document
      ExhibitorAPI.updateExhibitor({ ...exhibitor }, exhibitor._id)
        .then(res => {
          // If no errors thrown, show Success modal
          if (!res.err) {
            handleShowSuccess();
          }
        })
        // If yes errors thrown, setState(err.message) and show Error modal
        .catch(err => {
          console.log(err);
          setErrThrown(err.message);
          handleShowErr();
        });
    } else {
      console.log({ validationErrors });
    }
  };

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(exhibitor.exhWorkers)
    // Validates required inputs
    const validationErrors = exhValidate(exhibitor);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log("Exhibitor submit", exhibitor)
      // POST call to create exhibitor document
      ExhibitorAPI.registerExhibitor({ ...exhibitor })
        .then(res => {
          // If no errors thrown, show Success modal
          if (!res.err) {
            handleShowSuccess();
          }
        })
        // If yes errors thrown, setState(err.message) and show Error modal
        .catch(err => {
          console.log(err)
          setErrThrown(err.message);
          handleShowErr();
        })
    } else {
      console.log({ validationErrors });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      switch (formType) {
        case "edit_exhibit":
          fetchConf(confId)
          // GET call by confId and user.email to pre-populate the form if URL indicates this is an existing exhibitor
          ExhibitorAPI.getExhibitorToUpdate(confId, user.email)
            .then(resp => {
              console.log("from exhibitorForm getExhibitorToUpdate", resp.data)
              const exhObj = resp.data
              setExhibitor(exhObj)
            })
            .catch(err => console.log(err))
          break;
        case "admin_edit_exh":
          // GET call by the exhId in the URL to pre-populate the form
          ExhibitorAPI.getExhibitorById(confId)
            .then(resp => {
              console.log("from exhibitForm getExhibitorById", resp.data)
              setExhibitor(resp.data)
              fetchConf(resp.data.confId)
            })
          break;
        case "admin_register_exh":
          fetchConf(confId);
          // Sets confId in state as exhibitor.confId
          setExhibitor({ ...exhibitor, confId: confId })
          break;
        default:
          fetchConf(confId);
          // Sets the conference ID in state as exhibitor.confId and the user's email as exhibitor.exhEmail
          setExhibitor({ ...exhibitor, confId: confId, exhEmail: user.email })
      }
    }
    setPageReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to register.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      { pageReady === true &&
        isAuthenticated &&
        <Container>
          <Form className="exhForm">

            <Card className="formCard">
              <Card.Title>
                <Row>
                  <Col sm={12}>
                    <h1>Company Information</h1>
                  </Col>
                </Row>
              </Card.Title>
              <Card.Body className="cardBody">
                <Form.Group controlId="exhContactPerson">
                  <Row>
                    <Col sm={6}>
                      <Form.Label>Contact email: <span className="red">*</span></Form.Label>
                      {errors.exhEmail &&
                        <div className="error"><p>{errors.exhEmail}</p></div>}
                      <Form.Control required type="email" name="exhEmail" placeholder="name@email.com" value={exhibitor.exhEmail} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Label>Contact person's first name: <span className="red">*</span></Form.Label>
                      {errors.exhGivenName &&
                        <div className="error"><p>{errors.exhGivenName}</p></div>}
                      <Form.Control required type="input" name="exhGivenName" placeholder="Jack" value={exhibitor.exhGivenName} className="formInput" onChange={handleInputChange} />
                    </Col>
                    <Col sm={6}>
                      <Form.Label>Contact person's last name: <span className="red">*</span></Form.Label>
                      {errors.exhFamilyName &&
                        <div className="error"><p>{errors.exhFamilyName}</p></div>}
                      <Form.Control required type="input" name="exhFamilyName" placeholder="Harkness" value={exhibitor.exhFamilyName} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group controlId="exhCompanyInfo">
                  <Row>
                    <Col sm={8}>
                      <Form.Label>Name of company: <span className="red">*</span></Form.Label>
                      {errors.exhCompany &&
                        <div className="error"><p>{errors.exhCompany}</p></div>}
                      <Form.Control required type="input" name="exhCompany" placeholder="Torchwood Institute" value={exhibitor.exhCompany} className="formInput" onChange={handleInputChange} />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Company phone #: <span className="red">*</span></Form.Label>
                      {errors.exhPhone &&
                        <div className="error"><p>{errors.exhPhone}</p></div>}
                      <Form.Control required type="input" name="exhPhone" placeholder="(123)456-7890" value={exhibitor.exhPhone} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Form.Label>Address of company: <span className="red">*</span></Form.Label>
                      {errors.exhCompanyAddress &&
                        <div className="error"><p>{errors.exhCompanyAddress}</p></div>}
                      <Form.Control required type="input" name="exhCompanyAddress" placeholder="123 Main Street, Springfield, IL" value={exhibitor.exhCompanyAddress} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="formCard">
              <Card.Title><h1>Exhibit Information</h1></Card.Title>
              <Card.Body className="cardBody">
                <Row>
                  <Form.Group controlId="exhWorkers">
                    <Col sm={4}>
                      <Form.Label>How many people will be working your exhibit? <span className="red">*</span></Form.Label>
                      {errors.exhWorkers &&
                        <div className="error"><p>{errors.exhWorkers}</p></div>}
                      <Form.Control type="number" min="1" max="4" name="exhWorkers" className="formNum" value={exhibitor.exhWorkers} onChange={handleInputChange} />
                    </Col>
                    <Col sm={8}>
                      <Form.Label>Names of workers (one name per line): <span className="red">*</span></Form.Label>
                      {errors.exhWorkerName1 &&
                        <div className="error"><p>{errors.exhWorkerName1}</p></div>}
                      <Form.Control required type="input" name="exhWorkerName1" placeholder="Yazmin Khan" value={exhibitor.exhWorkerName1} className="exhNameArr" onChange={handleInputChange} />
                      {exhibitor.exhWorkers > 1 &&
                        <div>
                          {errors.exhWorkerName2 &&
                            <div className="error"><p>{errors.exhWorkerName2}</p></div>}
                          <Form.Control type="input" name="exhWorkerName2" placeholder="Ryan Sinclair" value={exhibitor.exhWorkerName2} className="exhNameArr" onChange={handleInputChange} />
                        </div>}
                      {exhibitor.exhWorkers > 2 &&
                        <div>
                          {errors.exhWorkerName3 &&
                            <div className="error"><p>{errors.exhWorkerName3}</p></div>}
                          <Form.Control required type="input" name="exhWorkerName3" placeholder="Graham O'Brien" value={exhibitor.exhWorkerName3} className="exhNameArr" onChange={handleInputChange} />
                        </div>}
                      {exhibitor.exhWorkers > 3 &&
                        <div>
                          {errors.exhWorkerName4 &&
                            <div className="error"><p>{errors.exhWorkerName4}</p></div>}
                          <Form.Control required type="input" name="exhWorkerName4" placeholder="Jack Harkness" value={exhibitor.exhWorkerName4} className="exhNameArr" onChange={handleInputChange} />
                        </div>}
                    </Col>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group controlId="numSpaces">
                    <Col sm={4}>
                      <Form.Label>How many spaces do you need? <span className="red">*</span></Form.Label>
                      {errors.exhSpaces &&
                        <div className="error"><p>{errors.exhSpaces}</p></div>}
                      <Form.Control type="number" min="1" max="5" name="exhSpaces" className="formNum" value={exhibitor.exhSpaces} onChange={handleInputChange} />
                    </Col>
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              {(formType === "register_exhibit" || formType === "admin_register_exh")
                ? <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>
                : <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>}
            </Row>

          </Form>

          <SuccessModal conference={conference} urlid={confId} urltype={formType} exhname={exhibitor.exhCompany} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal conference={conference} urlid={confId} urltype={formType} errmsg={errThrown} exhname={exhibitor.exhCompany} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )

}

export default ExhibitForm;