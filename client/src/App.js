import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AboutBCMS, AllConfs, ConfDetails, Confirm, Error, Login, Profile, Schedule, Success, Venue } from "./components/pages";
import Navbar from "./components/navbar";
import TableComp from "./components/table"
import { ConferenceForm, ExhibitForm, Registration, SessionForm, SessionProposal, Supplemental, UpdateUser } from "./components/forms";
import "./App.css";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) return <div className="loading">
    <img className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /><h1>Loading...</h1></div>

  return (
    <Router>
      <header>
        <div>
          <Navbar />
        </div>
      </header>
      <main>
        <Route exact path="/login" component={Login} />
        <Route exact path="/about_bcms" component={AboutBCMS} />
        <Route exact path="/profile" component={Profile} />
        <Route path="/details/*" component={ConfDetails} />
        <Route path={["/schedule/*", "edit_schedule/*"]} component={Schedule} />
        <Route path="/venue/*" component={Venue} />
        <Route path={["/attendees/*", "/exhibitors/*", "/presenters/*"]} component={TableComp} />
        <Route path={["/new_conference", "/edit_conference/*"]} component={ConferenceForm} />
        <Route path={["/add_supplemental/*", "/edit_supplemental/*"]} component={Supplemental} />
        <Route path={["/add_session/*", "/edit_session/*"]} component={SessionForm} />
        <Route path="/propose_session/*" component={SessionProposal} />
        <Route path={["/register_exhibit/*", "/edit_exhibit"]} component={ExhibitForm} />
        <Route path="/update_user" component={UpdateUser} />
        <Route path={["/attendee_updated", "/conference_created", "/conference_updated", "/deleted", "/exhibitor_updated", "/register_success/*", "/session_added", "/session_updated", "/unregistered", "user_updated"]} component={Success} />
        <Route path={["/attdel_error/*", "/attreg_error/*", "/attupdate_error/*", "/exhdel_error/*", "/exhreg_error/*", "/exhupdate_error/*", "/confcreate_error/*", "/confupdate_error/*", "/userupdate_error/*"]} component={Error} />
        <Route path={["/register_attend/*", "/register_edit/*"]} component={Registration} />
        <Route path={["/unregister_confirm/*", "/unregister_exhibit_confirm/*"]} component={Confirm} />
        <Route exact path={["/", "/conferences"]} component={AllConfs} />
      </main>
    </Router>
  );
};

export default App;