import React from "react";
import { Button, Card, Row } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";

const SchedSessCard = (props) => {
  console.log(props);
  const { user, isAuthenticated } = useAuth0();
  let nameArr = [];

  // Filters props.presenter by sessId, then maps through the result to pull out presenter names
  const fetchPresNames = (sessId) => {
    const thesePres = props.presenters.filter(pres => pres.presSessionIds.includes(sessId))
    const presName = thesePres.map(pres => pres.presGivenName + " " + pres.presFamilyName)
    nameArr = [presName.join(", ")]
    return nameArr;
  }


  return (
    <>
      {(isAuthenticated &&
        (user.email === props.conference.ownerEmail || props.conference.confAdmins.includes(user.email)))
        ? <>
          {props.session[0] !== undefined
            ? <Card className="sched">
              <Row>
                <h3 className="textTight">{props.session[0].sessName}</h3>
              </Row>
              <Row>
                <p>{fetchPresNames(props.session[0]._id)}</p>
              </Row>
              <Row>
                <Button className="button">Session Details</Button>
              </Row>
            </Card>
            : <Card className="schedBlue">
              <h3 className="textTight">Click to add session</h3>
            </Card>}
        </>
        : <>
          {props.session[0] !== undefined
            ? <Card className="sched">
              <Row className="maxWidth">
                <h3 className="textTight">{props.session[0].sessName}</h3><br />
              </Row>
              <Row className="maxWidth">
                <p className="textTight">{fetchPresNames(props.session[0]._id)}</p><br />
              </Row>
              <Row className="maxWidth">
                <Button className="button">Session Details</Button>
              </Row>
            </Card>
            : <Card className="schedBlue">
              <h3 className="textTight">FREE</h3>
            </Card>}
        </>}
    </>
  )
}

export default SchedSessCard;