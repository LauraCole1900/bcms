import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ConferenceAPI, ExhibitorAPI } from "../../utils/api";
import { ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const ExhibitForm = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [pageReady, setPageReady] = useState(false);
  const [conference, setConference] = useState({});
  const [exhibitor, setExhibitor] = useState({
    exhGivenName: "",
    exhFamilyName: "",
    exhEmail: "",
    exhCompany: "",
    exhPhone: "",
    exhCompanyAddress: "",
    exhWorkers: 1,
    exhWorkerNames: [],
    exhSpaces: 1
  });
  const [errThrown, setErrThrown] = useState();

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

  // Handles input changes to form fields
  const handleInputChange = (e) => {
    setExhibitor({ ...exhibitor, [e.target.name]: e.target.value })
  };

  // Handles click on "Update" button
  const handleFormUpdate = (e) => {
    e.preventDefault();
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
      })
  };

  // Handles click on "Submit" button
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Exhibitor submit")
    // POST call to create exhibitor document
    ExhibitorAPI.registerExhibitor({ ...exhibitor, email: user.email })
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
  };

  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link className="login" onClick={() => loginWithRedirect()}>
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
                      <Form.Control required type="email" name="exhEmail" placeholder="name@email.com" value={exhibitor.exhEmail} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Label>Contact person's first name: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="exhGivenName" placeholder="Jack" value={exhibitor.exhGivenName} className="formInput" onChange={handleInputChange} />
                    </Col>
                    <Col sm={6}>
                      <Form.Label>Contact person's last name: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="exhFamilyName" placeholder="Harkness" value={exhibitor.exhFamilyName} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group controlId="exhCompanyInfo">
                  <Row>
                    <Col sm={8}>
                      <Form.Label>Name of company: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="exhCompany" placeholder="Torchwood Institute" value={exhibitor.exhCompany} className="formInput" onChange={handleInputChange} />
                    </Col>
                    <Col sm={4}>
                      <Form.Label>Company phone #: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="exhPhone" placeholder="(123)456-7890" value={exhibitor.exhPhone} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Form.Label>Address of company: <span className="red">*</span></Form.Label>
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
                      <Form.Control type="number" min="1" max="4" name="exhWorkers" className="formNum" value={exhibitor.exhWorkers} onChange={handleInputChange} />
                    </Col>
                    <Col sm={8}>
                      <Form.Label>Names of workers (one name per line): <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="exhWorkerName1" placeholder="Yazmin Khan" value={exhibitor.exhWorkerName1} className="exhNameArr" onChange={handleInputChange} />
                      {exhibitor.exhWorkers > 1 &&
                        <Form.Control type="input" name="exhWorkerName2" placeholder="Ryan Sinclair" value={exhibitor.exhWorkerName2} className="exhNameArr" onChange={handleInputChange} />}
                      {exhibitor.exhWorkers > 2 &&
                        <Form.Control required type="input" name="exhWorkerName3" placeholder="Graham O'Brien" value={exhibitor.exhWorkerName3} className="exhNameArr" onChange={handleInputChange} />}
                      {exhibitor.exhWorkers > 3 &&
                        <Form.Control required type="input" name="exhWorkerName4" placeholder="Jack Harkness" value={exhibitor.exhWorkerName4} className="exhNameArr" onChange={handleInputChange} />}
                    </Col>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group controlId="numSpaces">
                    <Col sm={4}>
                      <Form.Label>How many spaces do you need? <span className="red">*</span></Form.Label>
                      <Form.Control type="number" min="1" max="5" name="exhSpaces" className="formNum" value={exhibitor.exhSpaces} onChange={handleInputChange} />
                    </Col>
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              {(formType === "register_exhibit")
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