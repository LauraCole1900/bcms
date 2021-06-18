import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";

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

interface Session {
  confId: string,
  sessName: string,
  sessPresEmails: string[],
  sessDate: string,
  sessStart: string,
  sessEnd: string,
  sessDesc: string,
  sessKeynote: string,
  sessPanel: string,
  sessRoom: string,
  sessAccepted: string,
  _id: string
}

const SessPropSummaryCard = (props: any): object => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  let nameArr: string[];
  let orgArr: string[];

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId: string): string[] => {
    const thesePres: Presenter[] = props.presenter.filter((pres: Presenter) => pres.presSessionIds.includes(sessId))
    const presName: string[] = thesePres.map(pres => pres.presGivenName + " " + pres.presFamilyName);
    nameArr = [presName.join(", ")]
    return nameArr;
  }

  // Filters props.presenter by sessId, then maps through the result to put out presenter organizations
  const fetchPresOrgs = (sessId: string): string[] => {
    const thesePres: Presenter[] = props.presenter.filter((pres: Presenter) => pres.presSessionIds.includes(sessId))
    const presOrg: string[] = thesePres.map((pres: Presenter) => pres.presOrg)
    orgArr = [...new Set(presOrg)]
    return orgArr;
  }


  return (
    <>
      {props.session.map((sess: Session) => (
        <Card className="infoCard proposalCard" key={sess._id}>
          <Card.Header className="cardTitle">
            <Row>
              <Col sm={11}>
                <h2 className="title">{sess.sessName}</h2>
                <p>{fetchPresNames(sess._id)}</p>
                <p>{fetchPresOrgs(sess._id)}</p>
              </Col>
              {/* <Col sm={1}>
                {isAuthenticated &&
                  (user.email === props.conference[0].ownerEmail || props.conference[0].confAdmins.includes(user.email)) &&
                  <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" onClick={(e) => handleShowConfirm(e)}>
                    <Image fluid="true" src="/images/trash-can.png" className="delete" alt="Delete session" data-sessid={sess._id} data-sessname={sess.name} name="sessDelete" />
                  </Button>}
              </Col> */}
            </Row>
          </Card.Header>
          <Card.Body className="cardBody">
            <Row>
              <Col sm={12}>
                <p>{sess.sessDesc}</p>
              </Col>
            </Row>
            <Row>
              <Col sm={12} className="flexEnd">
                <Link to={`/proposal_details/${sess._id}`} className={location.pathname === `/details/${sess._id}` ? "link active" : "link"}>
                  <Button data-toggle="popover" title="Proposal Details" className="button">Proposal Details</Button>
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )
      )}
    </>
  )
}

export default SessPropSummaryCard;