import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0, User } from "@auth0/auth0-react";
import { Conference, Presenter } from "../../utils/interfaces";
import "./style.css";

// Figure out how to add session name(s)?

const PresenterCard = ({ conference, presenter, setBtnName, setThisId, setShowConfirm }: { conference: Array<Conference>, presenter: Array<Presenter>, setBtnName: any, setThisId: any, setShowConfirm: any }): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  const location = useLocation<Location>();
  const [cardRender, setCardRender] = useState<boolean>(false);

  // Sets boolean to show Confirm modal
  const handleShowConfirm = (e: MouseEvent): any | void => {
    const { dataset } = e.target as HTMLButtonElement;
    console.log(dataset.presid);
    console.log({ dataset });
    setBtnName(dataset.btnname);
    setThisId(dataset.presid);
    setShowConfirm(true);
  }

  useEffect(() => {
    if (presenter) {
      setCardRender(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <>
      {cardRender === true &&
        presenter.map((pres: Presenter) => (
          <Card className="infoCard" key={pres._id.toString()}>
            {pres.presKeynote === "yes"
              ? <>
                <Card.Header className="cardTitleKeynote">
                  <Row>
                    <Col sm={11}>
                      <h2 className="title">{pres.presGivenName} {pres.presFamilyName}, Keynote Speaker</h2>
                      <p>{pres.presOrg}</p>
                    </Col>
                    {isAuthenticated &&
                    (user!.email === conference[0].ownerEmail || user!.email === pres.presEmail) &&
                    <Button data-toggle="popover" title="Cancel this conference" className="deletebtn" data-presid={pres._id} data-confname={conference[0].confName} data-btnname="confCancel" onClick={(e) => handleShowConfirm(e)}>
                      <Image fluid src="/images/cancel-event.png" className="delete" alt="Cancel event" data-presid={pres._id} data-confname={conference[0].confName} data-btnname="confCancel" />
                    </Button>}
                  </Row>
                </Card.Header>
              </>
              :
              <>
                <Card.Header className="cardTitle">
                  <Row>
                    <Col sm={12}>
                      <h2 className="title">{pres.presGivenName} {pres.presFamilyName}</h2>
                      <p>{pres.presOrg}</p>
                    </Col>
                  </Row>
                </Card.Header>
              </>}
            <Card.Body className="infoCardBody">
              <Row>
                <Col sm={8}>
                  <Card.Text>{pres.presBio}</Card.Text>
                  {pres.presWebsite !== "" &&
                    <p>Website: <a href={pres.presWebsite} rel="noreferrer noopener" target="_blank">{pres.presWebsite}</a></p>}
                </Col>
                {pres.presPic !== "" &&
                  <Col sm={4} className="presPic">
                    <Image fluid className="presPicStyle" src={pres.presPic} alt={pres.presGivenName + " " + pres.presFamilyName} />
                  </Col>}
              </Row>
              {isAuthenticated &&
                (user!.email === conference[0].ownerEmail || conference[0].confAdmins.includes(user!.email!)) &&
                <Row>
                  <Col sm={1}></Col>
                  <Col sm={5}>
                    <Link to={`/edit_presenter/${pres._id}`} className={location.pathname === `/edit_presenter/${pres._id}` ? "link active" : "link"}>
                      <Button data-toggle="popover" title="Edit presenter" className="button">Edit Presenter</Button>
                    </Link>
                  </Col>
                </Row>}
            </Card.Body>
          </Card>
        ))
      }
    </>
  )
}

export default PresenterCard;