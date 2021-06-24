import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";

// Figure out how to add session name(s)?

interface Conference {
  ownerConfirm: string,
  ownerEmail: string,
  confName: string,
  confOrg: string,
  confDesc: string,
  startDate: string,
  endDate: string,
  numDays: number,
  confStartTime: string,
  confEndTime: string,
  confType: string,
  confLoc: string,
  confLocName: string,
  confLocUrl: string,
  confRegDeadline: string,
  confKeynote: string,
  confCapConfirm: string,
  confAttendCap: number,
  confFee: string,
  confFeeAmt: string,
  confEarlyRegConfirm: string,
  confEarlyRegDeadline: string,
  confEarlyRegFee: string,
  confEarlyRegSwagConfirm: string,
  confEarlyRegSwagType: string,
  confEarlyRegSizeConfirm: string,
  confSessProposalConfirm: string,
  confSessProposalDeadline: string,
  confSessProposalCommittee: string[],
  confAllergies: string,
  confWaiver: string,
  confAdmins: string[],
  confCancel: string
}

interface Presenter {
  confId: string,
  presGivenName: string,
  presFamilyName: string,
  presOrg: string,
  presBio: string,
  presEmail: string,
  presPhone: string,
  presWebsite: string,
  presPic: string,
  presSessionIds: string[],
  presKeynote: string,
  presAccepted: string,
  _id: string
}

const PresenterCard = ({ conference, presenter }: { conference: Conference[], presenter: Presenter[] }) => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [cardRender, setCardRender] = useState(false);

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
          <Card className="infoCard" key={pres._id}>
            {pres.presKeynote === "yes"
              ? <>
                <Card.Header className="cardTitleKeynote">
                  <Row>
                    <Col sm={12}>
                      <h2 className="title">{pres.presGivenName} {pres.presFamilyName}, Keynote Speaker</h2>
                      <p>{pres.presOrg}</p>
                    </Col>
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