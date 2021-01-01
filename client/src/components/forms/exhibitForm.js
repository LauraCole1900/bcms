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

            <Row>
              <Form.Group controlId="exhCompanyName">
                <Col sm={8}>
                  <Form.Label>Name of company: *</Form.Label>
                  <Form.Control required type="input" name="exhCompany" placeholder="Torchwood Institute" value={exhibitor.exhCompany} className="exhComp" onChange={handleInputChange} />
                </Col>
                <Col sm={4}>
                  <Form.Label>Company phone #: *</Form.Label>
                  <Form.Control required type="input" name="exhPhone" placeholder="(123)456-7890" value={exhibitor.exhPhone} className="exhPhone" onChange={handleInputChange} />
                </Col>
                <Form.Label>Address of company: *</Form.Label>
                <Form.Control required type="input" name="exhCompanyAddress" placeholder="123 Main Street, Springfield, IL" value={exhibitor.exhCompanyAddress} className="exhCompAddy" onChange={handleInputChange} />
              </Form.Group>
            </Row>

          </Form>
        </Container>}
    </>
  )

}

export default ExhibitForm;