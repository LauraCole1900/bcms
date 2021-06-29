import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AboutBCMS, AllConfs, AllSessProps, ConfDetails, ConfExhibits, Login, NotFound, Profile, Schedule, SessPropDetails, Venue } from "./pages";
import { Navigation } from "./components/navbar";
import TableComp from "./components/table"
import { ConferenceForm, ExhibitForm, PresenterForm, Registration, SessionForm, SessSuppForm, Supplemental, UpdateUser } from "./components/forms";
import "./App.css";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) return <div className="loading">
    <img className="loadLogo" src="/images/bristlecone-dark.png" alt="BCMS logo" /><h1>Loading...</h1></div>

  return (
    <Router>
      <header>
        <div>
          <Navigation />
        </div>
      </header>
      <main>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/about_bcms" component={AboutBCMS} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/details/*" component={ConfDetails} />
          <Route path={["/schedule/*", "edit_schedule/*"]} component={Schedule} />
          <Route path="/venue/*" component={Venue} />
          <Route path="/exhibits/*" component={ConfExhibits} />
          <Route path={["/attendees/*", "/committee/*", "/exhibitors/*", "/presenters/*"]} component={TableComp} />
          <Route path="/session_proposals/*" component={AllSessProps} />
          <Route path="/proposal_details/*" component={SessPropDetails} />
          <Route path={["/new_conference", "/edit_conference/*"]} component={ConferenceForm} />
          <Route path={["/add_supplemental/*", "/edit_supplemental/*"]} component={Supplemental} />
          <Route path={["/new_session/*", "/edit_session/*", "/propose_session/*", "/edit_propose_session/*"]} component={SessionForm} />
          <Route path={["/propose_session_supp/*", "/edit_propose_session_supp/*"]} component={SessSuppForm} />
          <Route path={["/new_session_pres/*", "/edit_presenter/*", "/admin_edit_pres/*", "/propose_session_pres/*", "/edit_propose_session_pres/*"]} component={PresenterForm} />
          <Route path={["/register_exhibit/*", "/edit_exhibit/*", "/admin_register_exh/*", "/admin_edit_exh/*"]} component={ExhibitForm} />
          <Route path="/update_user" component={UpdateUser} />
          <Route path={["/register_attend/*", "/register_edit/*", "/admin_register_att/*", "/admin_edit_att/*"]} component={Registration} />
          <Route exact path={["/", "/conferences"]} component={AllConfs} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </Router>
  );
};

export default App;