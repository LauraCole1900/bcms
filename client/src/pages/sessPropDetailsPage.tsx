import React, { ReactElement, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ObjectId } from "mongoose";
import { useAuth0, User } from "@auth0/auth0-react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { ConferenceCard } from "../components/cards";
import { Sidenav } from "../components/navbar";
import { ConferenceAPI, PresenterAPI, SessionAPI } from "../utils/api";
import { Conference, Presenter, Session } from "../utils/interfaces";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css"

const SessPropDetails = (): ReactElement => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0<User>();
  const [conference, setConference] = useState<Array<Conference>>();
  const [session, setSession] = useState<Array<Session>>();
  const [presArray, setPresArray] = useState<Array<Presenter>>();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [confReady, setConfReady] = useState<boolean>(false);
  const [presReady, setPresReady] = useState<boolean>(false);
  const [sessReady, setSessReady] = useState<boolean>(false);

  // Pull session ID from URL
  const urlArray: Array<string> = window.location.href.split("/")
  const sessId: string = urlArray[urlArray.length - 1]
  const urlType: string = urlArray[urlArray.length - 2]

  const fetchConf = async (id: ObjectId | string): Promise<Array<Conference> | void> => {
    await ConferenceAPI.getConferenceById(id)
      .then((resp: AxiosResponse<Array<Conference>>) => {
        console.log("sessPropDetailsPage fetchConf", resp.data)
        const confObj: Array<Conference> = resp.data.slice(0)
        console.log({ confObj });
        setConference(confObj)
      })
      .catch(err => {
        console.log(err)
        return err;
      })
    setConfReady(true)
  }

  const fetchPres = async (email: string, id: ObjectId | string): Promise<Presenter | void> => {
    await PresenterAPI.getPresenterByEmail(email, id)
      .then((resp: AxiosResponse<Presenter>) => {
        console.log("sessPropDetailsPage fetchPres", resp.data)
        return resp;
      })
      .catch((err: AxiosError) => {
        console.log(err)
        return err;
      })
  }

  const fetchSess = async (id: ObjectId | string): Promise<Array<Session> | void> => {
    let sessObj: Array<Session> | undefined;
    let presArr: Array<Presenter> = [];
    await SessionAPI.getSessionById(id)
      .then((resp: AxiosResponse<Array<Session>>) => {
        console.log("sessPropDetailsPage fetchSess", resp.data)
        sessObj = resp.data.slice(0)
        console.log({ sessObj });
        setSession(sessObj)
        return sessObj;
      })
      .catch((err: AxiosError) => {
        console.log(err)
        return false
      })
    // GET conference by session.confId
    fetchConf(sessObj![0].confId)
      .then((resp: Array<Conference> | void) => {
        console.log(resp);
      })
      .catch((err: AxiosError) => console.log(err));
    sessObj![0].sessPresEmails.forEach(email => {
      let presObj = fetchPres(email, sessObj![0].confId)
        .then((resp: Presenter | void) => {
          console.log(presObj);
          if (resp !== undefined && resp !== null) {
            presArr = [...presArr, resp]
            console.log({ presArr })
          }
          if (presArr.length === sessObj![0].sessPresEmails.length) {
            setPresArray(presArr);
            setPresReady(true);
          }
        })
        .catch(err => {
          console.log(err);
        })
    })
    setSessReady(true)
  }

  useEffect(() => {
    // GET session by ID
    fetchSess(sessId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess])


  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="authRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>
            log in
          </Link> to access session proposals.</h1>
          <div className="authLogo"><Image fluid className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      {isAuthenticated &&
        sessReady === true &&
        presReady === true &&
        confReady === true &&
        <Container>

          <ConferenceCard conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />

          <Row>
            <Col sm={2}>
              <Sidenav conference={conference} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
            </Col>

            <Col sm={10}>
              <Row>
                <h1 className="center">Details for {session![0].sessName} Proposal</h1>
              </Row>

              <Row>
                <Col sm={4}>
                  <Row>
                    {session![0].sessPresEmails.length === 1
                      ? <h3>Presenter:</h3>
                      : <h3>Presenters:</h3>}
                  </Row>
                  {presArray!.map(pres => (
                    <Row key={pres._id.toString()}>
                      <p>{pres.presGivenName} {pres.presFamilyName}, {pres.presOrg}</p>
                      <p>{pres.presEmail}</p>
                    </Row>
                  ))}
                </Col>

                <Col sm={8}>
                  <h3>Description:</h3>
                  <p>{session![0].sessDesc}</p>
                </Col>
              </Row>


            </Col>
          </Row>

        </Container>}
    </>
  )

}

export default SessPropDetails;