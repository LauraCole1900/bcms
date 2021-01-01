import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { ExhibitorAPI } from "../../utils/api";
import "./style.css";

const ExhibitForm = () => {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const [pageReady, setPageReady] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [exhibitor, setExhibitor] = useState({});

  const urlArray = window.location.href.split("/")
  const confId = urlArray[urlArray.length - 1]

  useEffect(() => {
    setExhibitor({ ...exhibitor, confId: confId })
    setPageReady(true);
  }, [])

  const handleInputChange = (e) => {
    setExhibitor({ ...exhibitor, [e.target.name]: e.target.value })
  };

  const handleFormUpdate = (e) => {
    e.preventDefault();
    console.log("Exhibitor update", confId, user.email);
    ExhibitorAPI.updateExhibitor({ ...exhibitor }, confId, user.email)
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

            <Form.Group controlId="exhCompanyName">
              <Row>
                <Col sm={8}>
                  <Form.Label>Name of company: *</Form.Label>
                  <Form.Control required type="input" name="exhCompany" placeholder="Torchwood Institute" value={exhibitor.exhCompany} className="exhComp" onChange={handleInputChange} />
                </Col>
                <Col sm={4}>
                  <Form.Label>Company phone #: *</Form.Label>
                  <Form.Control required type="input" name="exhPhone" placeholder="(123)456-7890" value={exhibitor.exhPhone} className="exhPhone" onChange={handleInputChange} />
                </Col>
              </Row>
              <Row>
                <Form.Label>Address of company: *</Form.Label>
                <Form.Control required type="input" name="exhCompanyAddress" placeholder="123 Main Street, Springfield, IL" value={exhibitor.exhCompanyAddress} className="exhCompAddy" onChange={handleInputChange} />
              </Row>
            </Form.Group>

            <Row>
              <Form.Group controlId="exhWorkers">
                <Col sm={4}>
                  <Form.Label>How many people will be working your exhibit? *</Form.Label>
                  <Form.Control as="select" name="exhWorkers" className="exhSelect" onChange={handleInputChange}>
                    <option value={1} checked={exhibitor.exhWorkers === 1}>1</option>
                    <option value={2} checked={exhibitor.exhWorkers === 2}>2</option>
                    <option value={3} checked={exhibitor.exhWorkers === 3}>3</option>
                    <option value={4} checked={exhibitor.exhWorkers === 4}>4</option>
                  </Form.Control>
                </Col>
                <Col sm={8}>
                  <Form.Label>Names of workers (one per line): *</Form.Label>
                  <Form.Control required type="input" name="exhNames" placeholder="Yazmin Khan" value={exhibitor.exhNames[0]} className="exhNameArr" onChange={handleInputChange} />
                  <Form.Control type="input" name="exhNames" placeholder="Ryan Sinclair" value={exhibitor.exhNames[1]} className="exhNameArr" onChange={handleInputChange} />
                  <Form.Control required type="input" name="exhNames" placeholder="Graham O'Brien" value={exhibitor.exhNames[2]} className="exhNameArr" onChange={handleInputChange} />
                  <Form.Control required type="input" name="exhNames" placeholder="Jack Harkness" value={exhibitor.exhNames[3]} className="exhNameArr" onChange={handleInputChange} />
                </Col>
              </Form.Group>
            </Row>

            <Row>
              <Form.Group controlId="numSpaces">
                <Col sm={4}>
                  <Form.Label>How many spaces do you need?</Form.Label>
                  <Form.Control as="select" name="exhSpaces" className="exhSpaceSelect" onChange={handleInputChange}>
                    <option value={1} checked={exhibitor.exhSpaces === 1}>1</option>
                    <option value={2} checked={exhibitor.exhSpaces === 2}>2</option>
                    <option value={3} checked={exhibitor.exhSpaces === 3}>3</option>
                    <option value={4} checked={exhibitor.exhSpaces === 4}>4</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Row>

            <Row>
                {(confId !== "new_conference")
                  ? <Button className="button" onClick={handleFormUpdate} type="submit">Update Form</Button>
                  : <Button className="button" onClick={handleFormSubmit} type="submit">Submit Form</Button>}
              </Row>

          </Form>
        </Container>}
    </>
  )

}

export default ExhibitForm;