import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
// import { Container } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { AllConfs, Login, Profile, Success } from "./components/pages";
// import ConfDetails from "./components/pages/confDetails";
// import Schedule from "./components/pages/confSchedule";
// import Venue from "./components/pages/confVenue";
// import ContactBCMS from "./components/pages/contactPage";
import Navbar from "./components/navbar";
import { ConferenceForm, ExhibitForm, Registration, UpdateUser } from "./components/forms";
// import SessionForm from "./components/forms/sessionForm";
// import SessionProposal from "./components/forms/sessionProposal";
import "./App.css";

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

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
        {/* <Route exact path="/contact_bcms" component={ContactBCMS} /> */}
        <Route exact path="/profile" component={Profile} />
        {/*   <Route path="/conferences/*" component={ConfDetails} />
              <Route path="/conferences/schedule/*" component={Schedule} />
              <Route path="/conferences/venue/*" component={Venue} /> */}
        <Route path="/new_conference" component={ConferenceForm} />
        <Route path="/edit_conference/*" component={ConferenceForm} />
        {/*   <Route path="/add_session/*" component={SessionForm} />
              <Route path="/propose_session/*" component={SessionProposal} /> */}
        <Route path="/register_exhibit/*" component={ExhibitForm} />
        <Route path="/update_user" component={UpdateUser} />
        <Route path="/conference_created" component={Success} />
        <Route path="/session_added" component={Success} />
        <Route path="/deleted" component={Success} />
        <Route path="/conference_updated" component={Success} />
        <Route path="/session_updated" component={Success} />
        <Route path="/user_updated" component={Success} />
        <Route path="/register_attend/*" component={Registration} />
        <Route exact path={["/", "/conferences"]} component={AllConfs} />
      </main>
    </Router>
  );
};

export default App;