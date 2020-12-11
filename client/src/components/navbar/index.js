import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { FaBars } from "react-icons/fa"
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";

const Navigation = () => {
  const { user, logout } = useAuth0();
  const location = useLocation();

  return (
    <>
      <Navbar fluid expand="sm" className="navbar">
        <Navbar.Brand>
          <Link to="/profile" className={location.pathname === "/profile" ? "mylogo active" : "mylogo"}>
            Concino CMS
        </Link>
        </Navbar.Brand>
        <Navbar.Text>
          {/* Hello, {user.given_name}! */}
        </Navbar.Text>
        <Navbar.Toggle fluid aria-controls="basic-navbar-nav" className="toggle" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Link className="navlink logout" onClick={() => logout({ returnTo: window.location.origin })}>
              Log Out
            </Link>
            <Link to="/profile" className={location.pathname === "/profile" ? "navlink active" : "navlink"}>
              Profile
            </Link>
            <Link to="/conferences" className={location.pathname === "/conferences" ? "navlink active" : "navlink"}>
              Conferences
            </Link>
            <Link to="/contact_ccms" className={location.pathname === "/contact_ccms" ? "navlink active" : "navlink"}>
              Contact Concino
          </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Navigation;