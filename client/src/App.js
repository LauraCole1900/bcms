import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { AllConfs, ConfDetails, ContactBCMS, Login, Profile, Schedule, Success, Venue } from "./components/pages";
import Navbar from "./components/navbar";
import { ConferenceForm, ExhibitForm, Registration, SessionForm, SessionProposal, UpdateUser } from "./components/forms";
import "./App.css";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>

  return (
    <Router>
      <header>
        <div>
          <Navbar />
        </div>
      </header>
      <main>
        <Route exact path="/login" component={Login} />
        <Route exact path="/contact_bcms" component={ContactBCMS} />
        <Route exact path="/profile" component={Profile} />
        <Route path="/conferences/*" component={ConfDetails} />
        <Route path="/conferences/schedule/*" component={Schedule} />
        <Route path="/conferences/venue/*" component={Venue} />
        <Route path={["/new_conference", "/edit_conference/*"]} component={ConferenceForm} />
        <Route path={["/add_session/*", "/edit_session/*"]} component={SessionForm} />
        <Route path="/propose_session/*" component={SessionProposal} />
        <Route path="/register_exhibit/*" component={ExhibitForm} />
        <Route path="/update_user" component={UpdateUser} />
        <Route path={["/conference_created", "/conference_updated", "/deleted", "/register_success/*", "/session_added", "/session_updated", "user_updated"]} component={Success} />
        <Route path="/register_attend/*" component={Registration} />
        <Route exact path={["/", "/conferences"]} component={AllConfs} />
      </main>
    </Router>
  );
};

export default App;