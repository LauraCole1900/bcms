import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ObjectId } from "mongoose";
import { useAuth0, User } from "@auth0/auth0-react";
import { Container, Row, Col, Table, Form, Card, Image } from "react-bootstrap";
import { ConferenceCard, UserCard } from "../cards";
import { CommitteeForm } from "../forms";
import { AttendeeTable, CommitteeTable, ExhibitorTable, PresenterTable } from "./";
import { ConfirmModal, ErrorModal, SuccessModal } from "../modals";
import { Sidenav } from "../navbar";
import { AttendeeAPI, CommitteeAPI, ConferenceAPI, ExhibitorAPI, SessionAPI, PresenterAPI } from "../../utils/api";
import { Attendee, Committee, Conference, Exhibitor, Presenter, Session, ThisEvent } from "../../utils/interfaces";
import { AxiosResponse, AxiosError } from "axios";
import "./style.css";

const TableComp = (): ReactElement => {

  // TO-DO:
  // Link "Add Presenter" button to PresForm

  const { isAuthenticated, loginWithRedirect } = useAuth0<User>();
  const [attendees, setAttendees] = useState<Array<Attendee>>([]);
  const [committee, setCommittee] = useState<Array<Committee>>([]);
  const [member, setMember] = useState({
    commGivenName: "",
    commFamilyName: "",
    commEmail: "",
    commPhone: "",
    commOrg: ""
  });
  const [conference, setConference] = useState<Array<Conference>>([]);
  const [exhibitors, setExhibitors] = useState<Array<Exhibitor>>([]);
  const [presenters, setPresenters] = useState<Array<Presenter>>([]);
  const [sessNames, setSessNames] = useState<Array<string>>([]);
  const [search, setSearch] = useState<string>("");
  const [searchBy, setSearchBy] = useState<string>("all");
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [errThrown, setErrThrown] = useState<string | void>();
  const [btnName, setBtnName] = useState<string>("");
  const [thisId, setThisId] = useState<string | undefined>();
  const [thisEmail, setThisEmail] = useState<string | undefined>();
  const [confName, setConfName] = useState<string>();
  const [attName, setAttName] = useState<string>();
  const [commName, setCommName] = useState<string>();
  const [exhName, setExhName] = useState<string>();
  const [presName, setPresName] = useState<string>();
  const [pageReady, setPageReady] = useState<boolean>(false);
  const [confReady, setConfReady] = useState<boolean>(false);
  let thisEvent: ThisEvent;

  const urlArray: Array<string> = window.location.href.split("/");
  const confId: string = urlArray[urlArray.length - 1];
  const dataSet: string = urlArray[urlArray.length - 2];

  const attHeaders: Array<string> = ["familyName", "givenName", "email", "phone", "employerName", "emergencyContactName", "emergencyContactPhone", "allergies", "isAdmin"];
  const commHeaders: Array<string> = ["commFamilyName", "commGivenName", "commEmail", "commPhone", "commOrg", "isChair"]
  const exhHeaders: Array<string> = ["exhFamilyName", "exhGivenName", "exhEmail", "exhPhone", "exhCompany", "exhWorkerNames", "exhSpaces", "exhAttend", "exhBoothNum"];
  const presHeaders: Array<string> = ["presFamilyName", "presGivenName", "presEmail", "presPhone", "presOrg", "presWebsite", "presSessionIds"];

  // Modal variables
  const [showConfirm, setShowConfirm] = useState<string | undefined>("none");
  const [showSuccess, setShowSuccess] = useState<string | undefined>("none");
  const [showErr, setShowErr] = useState<string | undefined>("none");

  // Sets boolean to show or hide relevant modal
  const handleShowConfirm = (e: MouseEvent): any | void => {
    switch (dataSet) {
      case "committee":
        console.log(thisEvent);
        setShowConfirm("index");
        setBtnName(thisEvent.dataset.name);
        setThisId(thisEvent.dataset.confid);
        setConfName(thisEvent.dataset.confname);
        setThisEmail(thisEvent.dataset.email);
        setAttName(thisEvent.dataset.attname);
        setCommName(thisEvent.dataset.commname);
        setExhName(thisEvent.dataset.exhname);
        setPresName(thisEvent.dataset.presname);
        break;
      default:
        const { dataset, name } = e.target as HTMLButtonElement;
        console.log(name, dataset.confid, dataset.confname, dataset.attname, dataset.email);
        setShowConfirm("index");
        setBtnName(name);
        setThisId(dataset.confid);
        setConfName(dataset.confname);
        setThisEmail(dataset.email);
        setAttName(dataset.attname);
        setCommName(dataset.commname);
        setExhName(dataset.exhname);
        setPresName(dataset.presname);
    }
  }
  const handleHideConfirm = (): string | void => setShowConfirm("none");
  const handleShowSuccess = (): string | void => setShowSuccess("index");
  const handleHideSuccess = (): string | void => setShowSuccess("none");
  const handleShowErr = (): string | void => setShowErr("index");
  const handleHideErr = (): string | void => setShowErr("none");

  // Handles click on "Yes, unregister attendee" button on ConfirmModal
  const handleAttUnreg = (confId: string| undefined, email: string | undefined): Attendee | void => {
    console.log("from confirm attUnreg", confId, email)
    handleHideConfirm();
    // DELETE call to delete attendee document
    AttendeeAPI.unregisterAttendee(confId, email)
      .then((resp: AxiosResponse<Attendee>) => {
        // If no errors thrown, show Success modal
        if (resp.status !== 422) {
          handleShowSuccess()
        }
      })
      // If yes errors thrown, show Error modal
      .catch((err: AxiosError) => {
        console.log(err);
        setErrThrown(err.message);
        handleShowErr();
      });
  }

  // Handles click on "Yes, delete member" button on ConfirmModal
  const handleDeleteComm = (email: string | undefined, confId: string | undefined): Committee | void => {
    console.log("from confirm deleteComm", email, confId)
    handleHideConfirm();
    // DELETE call to delete committee document
    CommitteeAPI.deleteCommMember(email, confId)
      .then((resp: AxiosResponse<Committee>) => {
        // If no errors thrown, show Success modal
        if (resp.status !== 422) {
          console.log(resp);
        }
      })
      // If yes errors thrown, show Error modal
      .catch((err: AxiosError) => {
        console.log(err);
        setErrThrown(err.message);
        handleShowErr();
      });
    // Filters member email from conf.confSessProposalComm[]
    const comms: Array<string> = conference[0].confSessProposalCommittee.filter(commEmail => commEmail !== email)
    // Updates conference document with filtered email array
    ConferenceAPI.updateConference({ ...conference[0], confSessProposalCommittee: comms }, conference[0]._id)
      .then((resp: AxiosResponse<Conference>) => {
        if (resp.status !== 422) {
          handleShowSuccess();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        setErrThrown(err.message);
        handleShowErr();
      })
  }

  // Handles click on "Yes, unregister exhibitor" button on ConfirmModal
  const handleExhUnreg = (confId: string | undefined, email: string | undefined): Exhibitor | void => {
    console.log("from confirm exhUnreg", confId, email)
    handleHideConfirm();
    // DELETE call to delete exhibitor document
    ExhibitorAPI.deleteExhibitor(confId, email)
      .then((resp: AxiosResponse<Exhibitor>) => {
        // If no errors thrown, show Success modal
        if (resp.status !== 422) {
          handleShowSuccess();
        }
      })
      // If yes errors thrown, show Error modal
      .catch((err: AxiosError) => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      });
  }

  // Sets event data as variable to use in modals
  const setEvent = (data: ThisEvent): ThisEvent => {
    thisEvent = data;
    return thisEvent;
  }

  // GET conference info for useEffect and callback
  const fetchConf = async (confId: string): Promise<Array<Conference> | void> => {
    await ConferenceAPI.getConferenceById(confId)
      .then((resp: AxiosResponse<Array<Conference>>) => {
        console.log("table getConfsById", resp.data)
        setConference(resp.data)
      })
      .catch((err: AxiosError) => console.log(err))
    setConfReady(true);
  }

  // GETs attendees for useEffect and callback
  const fetchAttendees = async (confId: string): Promise<Array<Attendee> | void> => {
    await AttendeeAPI.getAttendees(confId)
      .then((resp: AxiosResponse<Array<Attendee>>) => {
        console.log("table fetchAttendees", resp.data)
        const attSort: Array<Attendee> = ascendingSort(resp.data, "familyName")
        setAttendees(attSort)
      })
      .catch((err: AxiosError) => console.log(err))
  }

  // GETs committee members for useEffect and callback
  const fetchCommittee = async (confId: string): Promise<Array<Committee> | void> => {
    await CommitteeAPI.getCommittee(confId)
      .then((resp: AxiosResponse<Array<Committee>>) => {
        console.log("table fetchCommittee", resp.data)
        const commSort: Array<Committee> = ascendingSort(resp.data, "commFamilyName")
        setCommittee(commSort)
      })
      .catch((err: AxiosError) => console.log(err))
  }

  // GETs exhibitors for useEffect
  const fetchExhibitors = async (confId: string): Promise<Array<Exhibitor> | void> => {
    await ExhibitorAPI.getExhibitors(confId)
      .then((resp: AxiosResponse<Array<Exhibitor>>) => {
        console.log("table fetchExhibitors", resp.data)
        const exhSort: Array<Exhibitor> = ascendingSort(resp.data, "exhFamilyName")
        setExhibitors(exhSort)
      })
      .catch((err: AxiosError) => console.log(err))
  }

  // GETs presenters for useEffect
  const fetchPresenters = async (confId: string): Promise<Array<Presenter> | void> => {
    await PresenterAPI.getPresentersByConf(confId)
      .then((resp: AxiosResponse<Array<Presenter>>) => {
        console.log("table fetchPresenters", resp.data)
        const presSort: Array<Presenter> = ascendingSort(resp.data, "presFamilyName")
        setPresenters(presSort)
      })
      .catch((err: AxiosError) => console.log(err))
  }

  // GETs session names
  const fetchSessions = async (sessId: ObjectId): Promise<Array<Session> | void> => {
    await SessionAPI.getSessions(sessId)
      .then((resp: AxiosResponse<Array<Session>>) => {
        console.log("table fetchSessions", resp.data)
        // setSessNames(resp.data.sessName)
      })
  }

  // Search method
  const getFilteredData = (data: any, arr: any, attr: any): Array<Attendee> | Array<Exhibitor> | Array<Presenter> => {
    return data.filter((arr: any) => arr[attr].toLowerCase().indexOf(search.toLowerCase()) !== -1);
  }

  // Defines which array to search based on searchBy and dataSet variables
  const searchFilter = (data: Array<object>): any => {
    switch (searchBy) {
      case "name":
        switch (dataSet) {
          case "exhibitors":
            return getFilteredData(data, exhibitors, "exhFamilyName");
          case "presenters":
            return getFilteredData(data, presenters, "presFamilyName");
          default:
            return getFilteredData(data, attendees, "familyName");
        }
      case "email":
        switch (dataSet) {
          case "exhibitors":
            return getFilteredData(data, exhibitors, "exhEmail");
          case "presenters":
            return getFilteredData(data, presenters, "presEmail");
          default:
            return getFilteredData(data, attendees, "email");
        }
      case "org":
        switch (dataSet) {
          case "exhibitors":
            return getFilteredData(data, exhibitors, "exhCompany");
          case "presenters":
            return getFilteredData(data, presenters, "presOrg");
          default:
            return getFilteredData(data, attendees, "employerName");
        }
      default:
        switch (dataSet) {
          case "exhibitors":
            return (exhibitors);
          case "presenters":
            return (presenters);
          default:
            return (attendees);
        }
    }
  }

  // Sort ascending
  const ascendingSort = (arr: any, value: any): any => {
    return arr.sort((a: any, b: any) => (a[value] > b[value]) ? 1 : -1);
  }

  // Sort descending
  const descendingSort = (arr: any, value: any): any => {
    return arr.sort((a: any, b: any) => (a[value] > b[value]) ? -1 : 1);
  }

  // Toggles boolean on sort to re-render page
  const ascendingSortSet = (): boolean | void => {
    switch (sortAscending) {
      case false:
        setSortAscending(true)
        break;
      default:
        setSortAscending(false)
    }
  }

  // Sort by column header
  const sortBy = (e: MouseEvent): any => {
    const { innerHTML } = e.target as HTMLButtonElement;
    switch (dataSet) {
      case "committee":
        const sortComm = (sortAscending) ? ascendingSort(committee, innerHTML) : descendingSort(committee, innerHTML)
        setExhibitors(sortComm)
        ascendingSortSet();
        break;
      case "exhibitors":
        const sortExh = (sortAscending) ? ascendingSort(exhibitors, innerHTML) : descendingSort(exhibitors, innerHTML)
        setExhibitors(sortExh)
        ascendingSortSet();
        break;
      case "presenters":
        const sortPres = (sortAscending) ? ascendingSort(presenters, innerHTML) : descendingSort(presenters, innerHTML)
        setPresenters(sortPres)
        ascendingSortSet();
        break;
      default:
        const sortAtt = (sortAscending) ? ascendingSort(attendees, innerHTML) : descendingSort(attendees, innerHTML)
        setAttendees(sortAtt)
        ascendingSortSet();
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      console.log({ showSuccess })
      fetchConf(confId);

      switch (dataSet) {
        case "committee":
          fetchCommittee(confId);
          break;
        case "exhibitors":
          fetchExhibitors(confId);
          break;
        case "presenters":
          fetchPresenters(confId)
          break;
        default:
          fetchAttendees(confId);
      }
    }
    setPageReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confId, dataSet, showSuccess, committee.length, member.commEmail.length])

  return (
    <>
      {!isAuthenticated &&
        <Row>
          <h1 className="regRemind">Please <Link to={window.location.origin} className="login" onClick={() => loginWithRedirect()}>log in</Link> to access this feature.</h1>
          <div className="authLogo"><Image fluid className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /></div>
        </Row>}

      {pageReady === true &&
        confReady === true &&
        <Container>
          <Row>
            {isAuthenticated
              ? <Col sm={4}>
                <UserCard />
              </Col>
              : <Col sm={2}></Col>}
            <Col sm={8}>
              <ConferenceCard 
                conference={conference}
                showSuccess={showSuccess}
                setShowSuccess={setShowSuccess}
              />
            </Col>
          </Row>

          <Row>
            <Col sm={2} className="nomargin">
              <Sidenav
                conference={conference}
                showSuccess={showSuccess}
                setShowSuccess={setShowSuccess}
              />
            </Col>

            <Col sm={10}>
              <Row>
                <Col className="center">
                  {dataSet === "attendees" &&
                    <h1>Attendees</h1>}
                  {dataSet === "committee" &&
                    <h1>Session Proposal Review Committee</h1>}
                  {dataSet === "exhibitors" &&
                    <h1>Exhibitors</h1>}
                  {dataSet === "presenters" &&
                    <h1>Presenters</h1>}
                </Col>
              </Row>
              {dataSet !== "committee" &&
                <Row className="instr">
                  <Col sm={4}></Col>
                  <Col sm={6}>
                    <Card.Body>
                      <Form inline>
                        <Row>
                          <Col sm={5}>
                            <Form.Group controlId="confSearchBy">
                              <Form.Control as="select" name="searchBy" onChange={(e) => setSearchBy(e.target.value)}>
                                <option value="all">View All</option>
                                <option value="name">Search by Family Name</option>
                                <option value="email">Search by Email</option>
                                <option value="org">Search by Organization</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                          <Col sm={4}>
                            {(searchBy !== "all") &&
                              <div id="confPageSearch">
                                <Form.Control className="mr-lg-5 search-area" type="input" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                              </div>}
                          </Col>
                        </Row>
                      </Form>
                    </Card.Body>
                  </Col>
                </Row>}
              <Row className="instr">
                <Col sm={12}>
                  {dataSet === "attendees" &&
                    <p className="allergyWarn">If accurate information regarding allergies is required, entering a third party's data is not recommended.</p>}
                  {dataSet === "committee" &&
                    <CommitteeForm
                      conference={conference}
                      committee={committee}
                      setCommittee={setCommittee}
                      member={member}
                      setMember={setMember}
                      setBtnName={setBtnName}
                      handleShowErr={handleShowErr}
                      handleShowSuccess={handleShowSuccess}
                      setErrThrown={setErrThrown}
                      errThrown={errThrown}
                      btnName={btnName}
                    />}
                  <p className="subhead">Click column headers to sort</p>
                </Col>
              </Row>
              <Table bordered hover responsive className="table">
                <thead>
                  <tr>
                    {dataSet === "attendees" &&
                      attendees.length > 0 && (
                        attHeaders.map((data, idx) => (
                          <td key={idx} className="tHead" onClick={sortBy}>{data}</td>
                        )))}
                    {dataSet === "committee" &&
                      committee.length > 0 && (
                        commHeaders.map((data, idx) => (
                          <td key={idx} className="tHead" onClick={sortBy}>{data}</td>
                        )))}
                    {dataSet === "exhibitors" &&
                      exhibitors.length > 0 && (
                        exhHeaders.map((data, idx) => (
                          <td key={idx} className="tHead" onClick={sortBy}>{data}</td>
                        )))}
                    {dataSet === "presenters" &&
                      presenters.length > 0 && (
                        presHeaders.map((data, idx) => (
                          <td key={idx} className="tHead" onClick={sortBy}>{data}</td>
                        )))}
                  </tr>
                </thead>
                <tbody>
                  {dataSet === "attendees" && (
                    attendees.length > 0
                      ? <AttendeeTable
                          attendees={searchFilter(attendees)}
                          conference={conference}
                          confcb={fetchConf}
                          attcb={fetchAttendees}
                          delete={handleShowConfirm}
                        />
                      : <tr><td className="tableComm">We can't seem to find any registered attendees at this time. If you think this is an error, please contact us.</td></tr>)}
                  {dataSet === "committee" && (
                    committee.length > 0
                      ? <CommitteeTable
                          committee={committee}
                          conference={conference}
                          setBtnName={setBtnName}
                          setCommName={setCommName}
                          setConfName={setConfName}
                          setEvent={setEvent}
                          setMember={setMember}
                          confcb={fetchConf}
                          commcb={fetchCommittee}
                          delete={handleShowConfirm}
                          setErrThrown={setErrThrown}
                          handleShowErr={handleShowErr}
                          handleShowSuccess={handleShowSuccess}
                        />
                      : <tr><td className="tableComm">We can't seem to find any members of the session proposal committee at this time. If you think this is an error, please contact us.</td></tr>)}
                  {dataSet === "exhibitors" && (
                    exhibitors.length > 0
                      ? <ExhibitorTable
                          exhibitors={searchFilter(exhibitors)}
                          conference={conference}
                          confcd={fetchConf}
                          exhcb={fetchExhibitors}
                          delete={handleShowConfirm}
                        />
                      : <tr><td className="tableComm">We can't seem to find any exhibitors registered for this conference. If you think this is an error, please contact us.</td></tr>)}
                  {dataSet === "presenters" && (
                    presenters.length > 0
                      ? <PresenterTable
                          presenters={searchFilter(presenters)}
                        />
                      : <tr><td className="tableComm">We can't seem to find any presenters for this conference. If you think this is an error, please contact us.</td></tr>)}
                </tbody>
              </Table>

              {/* Applies to Attendees, Exhibitors & Presenters ONLY, not to Conferences */}
              {/* Click on 'delete' button, ConfirmModal pops up */}
              {/* ConfirmModal needs button name, conf name, urlid, unregatt(), unregexh(), delpres(), attendee name */}
              {/* handleDeleteAtt() needs attendee._id OR attendee.email + attendee.confId */}

              {/* Will need to add deletesess={() => handleSessDelete(sess._id)}? Or only from sessionCard? */}
              <ConfirmModal
                btnname={btnName}
                confname={confName}
                urlid={confId}
                attname={attName}
                commname={commName}
                exhname={exhName}
                presname={presName}
                unregatt={() => handleAttUnreg(thisId, thisEmail)}
                unregexh={() => handleExhUnreg(thisId, thisEmail)}
                delcomm={() => handleDeleteComm(thisEmail, thisId)}
                show={showConfirm === "index"}
                hide={() => handleHideConfirm()}
              />

              <SuccessModal
                conference={conference[0]}
                confname={confName}
                urlid={confId}
                urltype={dataSet}
                btnname={btnName}
                attname={attName}
                commname={commName}
                exhname={exhName}
                presname={presName}
                show={showSuccess === "index"}
                hide={() => handleHideSuccess()}
              />

              <ErrorModal
                conference={conference[0]}
                confname={confName}
                urlid={confId}
                urltype={dataSet}
                errmsg={errThrown}
                btnname={btnName}
                show={showErr === "index"}
                hide={() => handleHideErr()}
              />

            </Col>
          </Row>

        </Container>
      }
    </>
  )

}

export default TableComp;