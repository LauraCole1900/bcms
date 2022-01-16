import React, { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { ObjectId } from "mongoose";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useAuth0, User } from "@auth0/auth0-react";
import { Presenter, Session } from "../../utils/interfaces";
import "./style.css";

const SessPropSummaryCard = (props: any): ReactElement => {
  const { user, isAuthenticated } = useAuth0<User>();
  const location = useLocation<Location>();
  let nameArr: Array<string>;
  let orgArr: Array<string>;

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId: ObjectId): Array<string> => {
    const thesePres: Array<Presenter> = props.presenter.filter((pres: Presenter) => pres.presSessionIds.includes(sessId))
    const presName: Array<string> = thesePres.map(pres => pres.presGivenName + " " + pres.presFamilyName);
    nameArr = [presName.join(", ")]
    return nameArr;
  }

  // Filters props.presenter by sessId, then maps through the result to put out presenter organizations
  const fetchPresOrgs = (sessId: ObjectId): Array<string> => {
    const thesePres: Array<Presenter> = props.presenter.filter((pres: Presenter) => pres.presSessionIds.includes(sessId))
    const presOrg: Array<string> = thesePres.map((pres: Presenter) => pres.presOrg)
    orgArr = [...new Set(presOrg)]
    return orgArr;
  }


  return (
    <>
      {props.session.map((sess: Session) => (
        <Card className="infoCard smallCard" key={sess._id.toString()}>
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
                  <Button data-toggle="popover" title="Delete this session" className="deletebtn" data-sessname={sess.name} name="sessDelete" onClick={(e: MouseEvent) => handleShowConfirm(e, sess._id)}>
                    <Image fluid src="/images/trash-can.png" className="delete" alt="Delete session" data-sessname={sess.name} name="sessDelete" onClick={(e: MouseEvent) => handleShowConfirm(e, sess._id)} />
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
                <Link
                  to={`/proposal_details/${sess._id}`}
                  className={location.pathname === `/details/${sess._id}` ? "link active" : "link"}
                >
                  <Button
                    data-toggle="popover"
                    title="Proposal Details"
                    className="button"
                  >Proposal Details</Button>
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