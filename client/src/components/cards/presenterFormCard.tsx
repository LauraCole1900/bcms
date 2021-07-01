import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { Presenter } from "../../utils/interfaces";
import "./style.css";

const PresenterFormCard = (props: any): ReactElement => {
  let pres: Presenter[] = props.presenter;
  const [charRem, setCharRem] = useState<number | void>(750);

  // Handles input changes to form fields
  const handleInputChange = (e: ChangeEvent): any => {
    const { dataset, name, value } = e.target as HTMLInputElement;
    // Finds where Object._id === dataset.id and concatenates data there
    pres = (pres.map((pres: Presenter) => pres._id.toString() === dataset.id ? { ...pres, [name]: value } : { ...pres }))
    props.handleChange([...pres], dataset);
  }

  // Handles character limit and input changes for textarea
  const handleTextArea = (e: ChangeEvent): string | void => {
    const { dataset, name, value } = e.target as HTMLInputElement;
    const charCount: number = value.length;
    const charLeft: number = 750 - charCount;
    setCharRem(charLeft);
    // Finds where Object._id === dataset.id and concatenates data there
    pres = (pres.map((pres: Presenter) => pres._id.toString() === dataset.id ? { ...pres, [name]: value } : { ...pres }));
    props.handleText([...pres], dataset);
  }

  useEffect(() => {
    console.log("from presFormCard useEffect", pres, props.idx)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {pres.map((pres: Presenter, index: number) => (
        <Card className="formCard" key={pres._id.toString()}>
          <Card.Title><h1>Presenter Information</h1></Card.Title>

          <Card.Body className="cardBody">
            <Form.Group controlId={pres._id.toString()}>
              <Row>
                <Col sm={6}>
                  <Form.Label>Presenter's email: <span className="red">*</span></Form.Label>
                  <Form.Control required type="email" name="presEmail" placeholder="name@email.com" value={pres.presEmail} className="formEmail" readOnly />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formPresName">
              <Row>
                <Col sm={6}>
                  <Form.Label>Presenter's first name: <span className="red">*</span></Form.Label>
                  {props.errors[index] &&
                    (props.errors[index].presGivenName &&
                      <div className="error"><p>{props.errors[index].presGivenName}</p></div>)}
                  <Form.Control required type="input" name="presGivenName" placeholder="Samwise" value={pres.presGivenName} data-id={pres._id} className="formInput" onChange={handleInputChange} />
                </Col>
                <Col sm={6}>
                  <Form.Label>Presenter's last name: <span className="red">*</span></Form.Label>
                  {props.errors[index] &&
                    (props.errors[index].presFamilyName &&
                      <div className="error"><p>{props.errors[index].presFamilyName}</p></div>)}
                  <Form.Control required type="input" name="presFamilyName" placeholder="Gamgee" value={pres.presFamilyName} data-id={pres._id} className="formInput" onChange={handleInputChange} />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Form.Label>Presenter's organization: <span className="red">*</span></Form.Label>
                  {props.errors[index] &&
                    (props.errors[index].presOrg &&
                      <div className="error"><p>{props.errors[index].presOrg}</p></div>)}
                  <Form.Control required type="input" name="presOrg" placeholder="Enter organization the presenter represents" value={pres.presOrg} data-id={pres._id} className="formInput" onChange={handleInputChange} />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="formPresContact">
              <Row>
                <Col sm={4}>
                  <Form.Label>Presenter's phone:</Form.Label>
                  <Form.Control type="input" name="presPhone" placeholder="(123)456-7890" value={pres.presPhone} className="formInput" data-id={pres._id} onChange={handleInputChange} />
                </Col>
                <Col sm={8}>
                  <Form.Label>Presenter's website URL:</Form.Label>
                  <Form.Control type="input" name="presWebsite" placeholder="http://www.website.com" value={pres.presWebsite} className="formInput" data-id={pres._id} onChange={handleInputChange} />
                </Col>
              </Row>
            </Form.Group>

            <Row>
              <Col sm={12}>
                <Form.Group controlId="formPresBio">
                  <Form.Label>Presenter's bio (min 10 characters, max 750 characters): <span className="red">*</span></Form.Label>
                  {props.errors[index] &&
                    (props.errors[index].presBio &&
                      <div className="error"><p>{props.errors[index].presBio}</p></div>)}
                  <Form.Control as="textarea" rows={10} type="input" name="presBio" placeholder="Enter a short bio of the presenter" value={pres.presBio} data-id={pres._id} className="formInput" onChange={handleTextArea} />
                  <Form.Text muted>Characters remaining: {charRem}</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <Form.Group controlId="formPresPic">
                  <Form.Label>Upload presenter's picture:</Form.Label>
                  <Form.Control type="input" name="presPic" placeholder="URL for presenter's picture" value={pres.presPic} data-id={pres._id} className="formInput" onChange={handleInputChange} />
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