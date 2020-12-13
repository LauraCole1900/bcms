import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Image } from "react-bootstrap";
import { FaBars } from "react-icons/fa"
import { useAuth0 } from "@auth0/auth0-react";
import "./style.css";

const Navigation = () => {
  const { user, logout } = useAuth0();
  const location = useLocation();

  return (
    <>
      <Navbar fluid expand="sm" className="navbar">
        <Navbar.Brand className="logo ml-3">
          <div>
            <Image fluid src="images/columbine-line-blue-white-yellow.png" alt="logo" className="columbine" />
          </div>
          <div>
            <Link to="/conferences" className={location.pathname === "/conferences" ? "mylogo active" : "mylogo"}>
              Bristlecone CMS
            </Link>
          </div>
        </Navbar.Brand>
        <Navbar.Text className="hello">
          Hello,
          <Link to="/profile" className={location.pathname === "/profile" ? "navlink active" : "navlink"}>
            Insert-Name-Here!
            </Link>
        </Navbar.Text>
        <Nav className="navobj">
          <Navbar.Toggle fluid aria-controls="basic-navbar-nav" className="toggle" />
          <Navbar.Collapse id="basic-navbar-nav" className="navobject">
            <Link to="/profile" className={location.pathname === "/profile" ? "navlink placelink active" : "navlink placelink"}>
              Profile
              </Link>
            <Link to="/conferences" className={location.pathname === "/conferences" ? "navlink placelink active" : "navlink placelink"}>
              Conferences
              </Link>
            <Link to="/contact_bcms" className={location.pathname === "/contact_bcms" ? "navlink placelink active" : "navlink placelink"}>
              Contact
              </Link>
            <Link className="navlink logout" onClick={() => logout({ returnTo: window.location.origin })}>
              Logout
              </Link>
          </Navbar.Collapse>
        </Nav>
      </Navbar>
    </>
  )
}

export default Navigation;