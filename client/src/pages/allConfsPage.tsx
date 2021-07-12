import React, { ReactElement, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ObjectId } from "mongoose";
import { useAuth0, User } from "@auth0/auth0-react";
import { Container, Card, Row, Col, Form } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../components/cards";
import { ConfirmModal, ErrorModal, SuccessModal } from "../components/modals";
import { AttendeeAPI, ConferenceAPI, ExhibitorAPI } from "../utils/api";
import { handleConfCancel, handleUnreg } from "../utils/functions";
import { Conference } from "../utils/interfaces";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

const AllConfs = (): ReactElement => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0<User>();
  const [conference, setConference] = useState<Conference>();
  const [confArray, setConfArray] = useState<Array<Conference>>([]);
  const [searchBy, setSearchBy] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [errThrown, setErrThrown] = useState<string>();
  const [btnName, setBtnName] = useState<string>();
  const [thisId, setThisId] = useState<ObjectId>();
  const [thisName, setThisName] = useState<string>();
  const [pageReady, setPageReady] = useState<boolean>(false);

  // Determines which page user is on, specifically for use with URLs that include the conference ID
  const urlArray: Array<string> = window.location.href.split("/")
  const urlId: string = urlArray[urlArray.length - 1]
  const urlType: string = urlArray[urlArray.length - 2]

  // Modal variables
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showErr, setShowErr] = useState<boolean>(false);

  // Sets boolean to show or hide relevant modal
  const handleHideConfirm = (): boolean | void => setShowConfirm(false);
  const handleShowSuccess = (): boolean | void => setShowSuccess(true);
  const handleHideSuccess = (): boolean| void => setShowSuccess(false);
  const handleShowErr = (): boolean | void => setShowErr(true);
  const handleHideErr = (): boolean | void => setShowErr(false);

  // Filter conferences by user input
  const searchFilter = (data: any): Array<Conference> => {
    switch (searchBy) {
      // Filter by conference name
      case "name":
        return data.filter((conference: Conference) => conference.confName.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Filter by presenting organization
      case "org":
        return data.filter((conference: Conference) => conference.confOrg.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      // Return all conferences
      default:
        return (confArray)
    }
  }

  useEffect(() => {
    // GET conferences
    ConferenceAPI.getConferences()
      .then((resp: AxiosResponse<Array<Conference>>) => {
        const confArr = resp.data;
        // Filter conferences by date, so only current & upcoming conferences render
        const filteredConf = confArr.filter((a: any) => new Date(a.endDate).valueOf() - new Date().valueOf() >= 0);
        // Sort filtered conferences by date, earliest to latest
        const sortedConf = filteredConf.sort((a: Conference, b: Conference) => (a.startDate > b.startDate) ? 1 : -1);
        // Set conferences in state
        setConfArray(sortedConf);
        // Set pageReady to true for page render
        setPageReady(true);
      })
      .catch((err: AxiosError) => console.log(err))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


  return (
    <>
      {pageReady === true && (
        <div className="mt-4">
          <Container>
            <Row>
              <Col sm={8}>
                {isAuthenticated &&
                  <UserCard />}
              </Col>
              <Col sm={4}>
                <Card.Body>
                  <Form inline>
                    <Row>
                      <Form.Group controlId="confSearchBy">
                        <Form.Control as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                          <option value="all">View All Conferences</option>
                          <option value="name">Search by Conference Name</option>
                          <option value="org">Search by Organization</option>
                        </Form.Control>
                      </Form.Group>
                    </Row>
                    {(searchBy !== "all") &&
                      <Row>
                        <div id="confPageSearch">
                          <Form.Control type="input" placeholder="Search conferences" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                      </Row>}
                  </Form>
                </Card.Body>
              </Col>
            </Row>

            {!isAuthenticated &&
              <Row>
                <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>
                  log in
                </Link> to register for any conference.</h1>
              </Row>}

            <Row>
              {confArray.length > 0
                ? <ConferenceCard conference={searchFilter(confArray)} setConference={setConference} setBtnName={setBtnName} setShowConfirm={setShowConfirm} setThisId={setThisId} setThisName={setThisName} />
                : <h3>We can't seem to find any upcoming conferences. If you think this is an error, please contact us.</h3>}
            </Row>

            {/* Information I need to lift:
            Button name
            Conference object
            Card object if different (session, etc.)
            */}

            <ConfirmModal
              btnname={btnName}
              confname={thisName}
              urlid={urlId}
              cancelconf={() => handleConfCancel(
                AttendeeAPI.getAttendees,
                ExhibitorAPI.getExhibitors,
                thisId!,
                conference!,
                handleHideConfirm,
                handleShowSuccess,
                setErrThrown,
                handleShowErr
                )}
              unregatt={() => handleUnreg(
                AttendeeAPI.unregisterAttendee,
                thisId!,
                user!.email!,
                handleHideConfirm,
                handleShowSuccess,
                setErrThrown,
                handleShowErr
              )}
              unregexh={() => handleUnreg(
                ExhibitorAPI.deleteExhibitor,
                thisId!,
                user!.email!,
                handleHideConfirm,
                handleShowSuccess,
                setErrThrown,
                handleShowErr
              )}
              show={showConfirm === true}
              hide={() => handleHideConfirm()}
            />

            <SuccessModal
              conference={conference}
              confname={thisName}
              confid={thisId}
              urlid={urlId}
              urltype={urlType}
              btnname={btnName}
              show={showSuccess === true}
              hide={() => handleHideSuccess()}
            />

            <ErrorModal
              conference={conference}
              urlid={urlId}
              urltype={urlType}
              errmsg={errThrown}
              btnname={btnName}
              show={showErr === true}
              hide={() => handleHideErr()}
            />

          </Container>
        </div>
      )}
    </>
  )
}

export default AllConfs;