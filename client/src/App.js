import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
// import { Container } from "react-bootstrap";
// import { useAuth0 } from "@auth0/auth0-react";
import Login from "./components/pages/loginPage";
// import Profile from "./components/pages/profilePage";
// import AllConfs from "./components/pages/allConfsPage";
// import ConfDetails from "./components/pages/confDetails";
// import Schedule from "./components/pages/confSchedule";
// import Venue from "./components/pages/confVenue";
// import ContactBCMS from "./components/pages/contactPage";
import Navbar from "./components/navbar";
import ConferenceForm from "./components/forms/conferenceForm";
// import SessionForm from "./components/forms/sessionForm";
// import SessionProposal from "./components/forms/sessionProposal";
// import ExhibitForm from "./components/forms/exhibitForm";
// import Registration from "./components/forms/registrationForm";
// import ConfUpdated from "./pages/success/conferenceUpdated";
// import SessionUpdated from "./pages/success/sessionUpdated";
// import ConfSuccess from "./pages/success/conferenceSuccess";
// import SessionSuccess from "./pages/success/sessionSuccess";
// import DeleteSuccess from "./pages/success/deleteSuccess";
import "./App.css";

function App() {
  // const { isLoading, isAuthenticated } = useAuth0();

  // if (isLoading) return <div>Loading...</div>

  return (
    <Router>
      <header>
        <div>
          {/* {isAuthenticated && */}
          <Navbar />
          {/* } */}
        </div>
      </header>
      <main>
        {/* <Route exact path="/contact_bcms" component={ContactBCMS} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/conferences" component={AllConfs} />
              <Route path="/conferences/*" component={ConfDetails} />
              <Route path="/conferences/schedule/*" component={Schedule} />
              <Route path="/conferences/venue/*" component={Venue} /> */}
              <Route path="/new_conference" component={ConferenceForm} />
              <Route path="/edit_conference/*" component={ConferenceForm} />
        {/*   <Route path="/add_session/*" component={SessionForm} />
              <Route path="/propose_session/*" component={SessionProposal} />
              <Route path="/register_exhibit/*" component={ExhibitForm} />
              <Route path="/attend/*" component={Registration} />
              <Route path="/conference_created/*" component={ConfSuccess} />
              <Route path="/session_added" component={SessionSuccess} />
              <Route path="/deleted" component={DeleteSuccess} />
              <Route path="/conference_updated" component={ConfUpdated} />
              <Route path="/session_updated" component={SessionUpdated} /> */}
        <Route path={["/", "/login"]} component={Login} />
      </main>
    </Router>
  );
};

export default App;