import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Row, Col, Button, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Moment from "react-moment";
import { PresenterAPI, SessionAPI } from "../../utils/api";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import "./style.css";

const SessPropSummaryCard = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  let nameArr;
  let orgArr;

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId) => {
    const thesePres = props.presenter.filter(pres => pres.presSessionIds.includes(sessId))
    const presName = thesePres.map(pres => pres.presGivenName + " " + pres.presFamilyName)
    nameArr = [presName.join(", ")]
    return nameArr;
  }

  // Filters props.presenter by sessId, then maps through the result to put out presenter organizations
  const fetchPresOrgs = (sessId) => {
    const thesePres = props.presenter.filter(pres => pres.presSessionIds.includes(sessId))
    const presOrg = thesePres.map(pres => pres.presOrg)
    orgArr = [...new Set(presOrg)]
    return orgArr;
  }


  return (
    <>
      {props.session.map(sess => (
        <Card className="infoCard proposalCard">
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