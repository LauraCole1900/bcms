import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image, Form, Button } from "react-bootstrap";
import { PresenterAPI } from "../../utils/api";
import "./style.css";

const PresenterFormCard = (props) => {
  const [presenter, setPresenter] = useState();
  const [charRem, setCharRem] = useState(750);

  // Handles click on "Check for existing" button
  const handleEmailCheck = (e) => {
    console.log("presForm handleEmailCheck", e.target.value)
    // GETs presenter document by email
    PresenterAPI.getPresenterByEmail(e.target.value, props.conference._id)
      .then(resp => {
        if (resp.length > 0) {
          console.log("from presForm handleEmailCheck", resp.data)
          const presObj = resp.data[0]
          setPresenter({ ...presenter, presObj })
          // PUT presenter document with confId added to confId[] and sessId added to sessId[]
          return true
        } else {
          return false
        }
      })
  }


  return (
    <>
      {props.session.sessPresEmails.map(email => (
        <Card className="formCard" key={props.session._id + props.session.sessPresEmails.indexOf(email)}>
          <Card.Title><h1>Presenter Information</h1></Card.Title>

          <Card.Body className="cardBody">
            <Form.Group controlId="formPresEmail">
              <Row>
                <Col sm={6}>
                  <Form.Label>Presenter's email: <span className="red">*</span></Form.Label>
                  <Form.Control required type="email" name="presEmail" placeholder="name@email.com" value={email} className="formEmail" onChange={props.handleInputChange} />
                </Col>
                <Col sm={6}>
                  <Button data-toggle="popover" title="Check whether presenter already exists in database" className="button" onClick={handleEmailCheck} type="submit">Check for existing</Button>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formPresName">
              <Row>
                <Col sm={6}>
                  <Form.Label>Presenter's first name: <span className="red">*</span></Form.Label>
                  <Form.Control required type="input" name="presGivenName" placeholder="Enter presenter's name" value={props.presenter.presGivenName} className="formInput" onChange={props.handleInputChange} />
                </Col>
                <Col sm={6}>
                  <Form.Label>Presenter's last name: <span className="red">*</span></Form.Label>
                  <Form.Control required type="email" name="presFamilyName" placeholder="name@email.com" value={props.presenter.presFamilyName} className="formEmail" onChange={props.handleInputChange} />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Form.Label>Presenter's organization: <span className="red">*</span></Form.Label>
                  <Form.Control required type="input" name="presOrg" placeholder="Enter organization the presenter represents" value={props.presenter.presOrg} className="formInput" onChange={props.handleInputChange} />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formPresContact">
              <Row>
                <Col sm={4}>
                  <Form.Label>Presenter's phone:</Form.Label>
                  <Form.Control type="input" name="presPhone" placeholder="(123)456-7890" value={props.presenter.presPhone} className="formInput" onChange={props.handleInputChange} />
                </Col>
                <Col sm={8}>
                  <Form.Label>Presenter's website URL:</Form.Label>
                  <Form.Control type="input" name="presWebsite" placeholder="http://www.website.com" value={props.presenter.presWebsite} className="formInput" onChange={props.handleInputChange} />
                </Col>
              </Row>
            </Form.Group>

            <Row>
              <Col sm={12}>
                <Form.Group controlId="formPresBio">
                  <Form.Label>Presenter's bio (min 10 characters, max 750 characters):</Form.Label>
                  <Form.Control as="textarea" rows={10} type="input" name="presBio" placeholder="Enter a short bio of the presenter" value={props.presenter.presBio} className="formInput" onChange={props.handleTextArea} />
                  <Form.Text muted>Characters remaining: {charRem}</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <Form.Group controlId="formPresPic">
                  <Form.Label>Upload presenter's picture:</Form.Label>
                  <Form.Control type="input" name="presPic" placeholder="URL for presenter's picture" value={props.presenter.presPic} className="formInput" onChange={props.handleInputChange} />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </>
  )
}

export default PresenterFormCard;