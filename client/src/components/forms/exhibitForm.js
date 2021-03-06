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
  const [charRem, setCharRem] = useState(150);
  const [conference, setConference] = useState({});
  const [exhibitor, setExhibitor] = useState({
    exhGivenName: "",
    exhFamilyName: "",
    exhEmail: "",
    exhCompany: "",
    exhPhone: "",
    exhCompanyAddress: "",
    exhDesc: "",
    exhLogo: "",
    exhWebsite: "",
    exhWorkers: 1,
    exhWorkerNames: [],
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
    const { name, value } = e.target;
    setExhibitor({ ...exhibitor, [name]: value })
    if (name === "exhWorkerNames") {
      // Splits input into workerNames field at commas to create an array
      let names = value.split(",")
      setExhibitor({ ...exhibitor, exhWorkerNames: names })
    }
  };

  // Handles character limit and input changes for textarea
  const handleTextArea = (e) => {
    const { name, value } = e.target;
    const charCount = value.length;
    const charLeft = 150 - charCount;
    setCharRem(charLeft);
    setExhibitor({ ...exhibitor, [name]: value.slice(0, 150) })
  }

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
        .then(resp => {
          // If no errors thrown, show Success modal
          if (!resp.err) {
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
        .then(resp => {
          // If no errors thrown, show Success modal
          if (!resp.err) {
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
          <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to register.</h1>
          <div className="authLogo"><Image fluid="true" className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      { pageReady === true &&
        isAuthenticated &&
        <Container>
          <Form className="exhForm">

            <Row>
              <Col sm={2}>
                {(formType === "register_exhibit" || formType === "admin_register_exh")
                  ? <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>
                  : <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>}
              </Col>
            </Row>
            {Object.keys(errors).length !== 0 &&
              <Row>
                <Col sm={12}>
                  <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
                </Col>
              </Row>}

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
                  <Row>
                    <Col sm={12}>
                      <Form.Label>Description of company or organization: <span className="red">*</span></Form.Label><br />
                      <Form.Text className="subtitle" muted>What does your company or organization do?</Form.Text>
                      {errors.exhDesc &&
                        <div className="error"><p>{errors.exhDesc}</p></div>}
                      <Form.Control required as="textarea" rows={5} type="input" name="exhDesc" placeholder="What do you do?" value={exhibitor.exhDesc} className="formText" onChange={handleTextArea} />
                      <Form.Text muted>Characters remaining: {charRem}</Form.Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Form.Label>Company logo:</Form.Label>
                      <Form.Control type="input" name="exhLogo" placeholder="Upload logo here" value={exhibitor.exhLogo} className="formInput" onChange={handleInputChange} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Form.Label>Company website:</Form.Label>
                      <Form.Control type="input" name="exhWebsite" placeholder="www.companywebsite.com" value={exhibitor.exhWebsite} className="formInput" onChange={handleInputChange} />
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
                    <Col sm={3}>
                      <Form.Label>How many people will be working your exhibit? <span className="red">*</span></Form.Label>
                      {errors.exhWorkers &&
                        <div className="error"><p>{errors.exhWorkers}</p></div>}
                      <Form.Control type="number" min="1" max="4" name="exhWorkers" className="formNum" value={exhibitor.exhWorkers} onChange={handleInputChange} />
                    </Col>
                    <Col sm={9}>
                      <Form.Label>Names of workers: <span className="red">*</span></Form.Label><br />
                      <Form.Text className="subtitle" muted>Please separate names with commas</Form.Text>
                      {errors.exhWorkerNames &&
                        <div className="error"><p>{errors.exhWorkerNames}</p></div>}
                      <Form.Control required type="input" name="exhWorkerNames" placeholder="Yazmin Khan" value={exhibitor.exhWorkerNames} className="exhNameArr" onChange={handleInputChange} />
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

            {Object.keys(errors).length !== 0 &&
              <Row>
                <Col sm={12}>
                  <div className="error"><p>The nanobots have detected an error or omission in one or more required fields. Please review this form.</p></div>
                </Col>
              </Row>}
            <Row>
              <Col sm={2}>
                {(formType === "register_exhibit" || formType === "admin_register_exh")
                  ? <Button data-toggle="popover" title="Submit" className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>
                  : <Button data-toggle="popover" title="Update" className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>}
              </Col>
            </Row>

          </Form>

          <SuccessModal conference={conference} confname={conference.confName} confid={conference._id} urltype={formType} exhname={exhibitor.exhCompany} show={showSuccess} hide={e => handleHideSuccess(e)} />

          <ErrorModal conference={conference} confname={conference.confName} confid={conference._id} urltype={formType} errmsg={errThrown} exhname={exhibitor.exhCompany} show={showErr} hide={e => handleHideErr(e)} />

        </Container>}
    </>
  )

}

export default ExhibitForm;