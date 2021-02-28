import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ExhibitorAPI, UserAPI } from "../../utils/api";
import "./style.css";

const ExhibitForm = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [pageReady, setPageReady] = useState(false);
  const [exhibitor, setExhibitor] = useState({});

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]
  const formType = urlArray[urlArray.length - 2]

  useEffect(() => {
    switch (formType) {
      case "edit_exhibit":
        ExhibitorAPI.getExhibitorToUpdate(confId, user.email)
          .then(resp => {
            console.log("from exhibitorForm getExhibitorToUpdate", resp.data)
            const exhObj = resp.data
            setExhibitor(exhObj)
          })
          .catch(err => console.log(err))
        break;
      default:
        setExhibitor({ ...exhibitor, confId: confId, exhEmail: user.email, })
    }

    setPageReady(true);
  }, [])

  const handleInputChange = (e) => {
    setExhibitor({ ...exhibitor, [e.target.name]: e.target.value })
  };

  const handleSetWorkers = (e) => {

  }

  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Exhibitor update", exhibitor._id);
    ExhibitorAPI.updateExhibitor({ ...exhibitor }, exhibitor._id)
      .then(history.push("/exhibitor_updated"))
      .catch(err => console.log(err))
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Exhibitor submit")
    ExhibitorAPI.registerExhibitor({ ...exhibitor, email: user.email })
      .then(history.push(`/register_success/${confId}`))
      .catch(err => console.log(err));
  }

  return (
    <>
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
                <Row>
                  <Col sm={12}>
                    <p className="subtitle">Please note that BCMS automatically assigns the logged-in email as the contact email.</p>
                  </Col>
                </Row>
              </Card.Title>
              <Card.Body className="cardBody">
                <Form.Group controlId="exhContactPerson">
                  <Row>
                    <Col sm={6}>
                      <Form.Label>Contact person's given name: <span className="red">*</span></Form.Label>
                      <Form.Control required type="input" name="exhGivenName" placeholder="Jack" value={exhibitor.exhGivenName} className="formInput" onChange={handleInputChange} />
                    </Col>
                    <Col sm={6}>
                      <Form.Label>Contact person's family name: <span className="red">*</span></Form.Label>
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
        </Container>}
    </>
  )

}

export default ExhibitForm;