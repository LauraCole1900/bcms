import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Image } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { UserAPI } from "../../utils/api";
import "./style.css";

const Navigation = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({});
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      UserAPI.getUserByEmail(user.email)
        .then(resp => {
          console.log("from userInfo getUserByEmail", resp.data);
          const userArr = resp.data;
          setUserInfo(userArr);
          setPageReady(true);
        })
        .catch(err => console.log(err))
    } else {
      setPageReady(true);
    }
  }, [])

  return (
    <>
      {pageReady === true &&
        <Navbar fluid expand="sm" className="navbar">
          <Navbar.Brand className="logo ml-3">
            <div>
              <Image fluid src="/images/bristlecone-light.png" alt="logo" className="pineTree mylogo" />
              <Link to="/conferences" className={location.pathname === "/conferences" ? "mylogo active" : "mylogo"}>
                Bristlecone CMS
              </Link>
            </div>
          </Navbar.Brand>
          <Navbar.Text className="hello">
            Welcome,
          {isAuthenticated
              ? <Link to="/profile" className={location.pathname === "/profile" ? "navlink active" : "navlink"}>
                {userInfo.given_name}!
                </Link>
              : <Link className="navlink login" onClick={() => loginWithRedirect()}>
                Guest!
                </Link>
            }
          </Navbar.Text>
          <Nav className="navobj">
            <Navbar.Toggle fluid aria-controls="basic-navbar-nav" className="toggle" />
            <Navbar.Collapse id="basic-navbar-nav" className="navobject">
              {isAuthenticated &&
                <Link to="/profile" className={location.pathname === "/profile" ? "navlink placelink active" : "navlink placelink"}>
                  Profile
                </Link>}
              <Link to="/conferences" className={location.pathname === "/conferences" ? "navlink placelink active" : "navlink placelink"}>
                Conferences
              </Link>
              <Link to="/about_bcms" className={location.pathname === "/about_bcms" ? "navlink placelink active" : "navlink placelink"}>
                About
              </Link>
              {isAuthenticated
                ? <Link to={window.location.origin} className="navlink auth" onClick={() => logout({ returnTo: window.location.origin })}>
                  Logout
                  </Link>
                : <Link to={window.location.origin} className="navlink auth" onClick={() => loginWithRedirect()}>
                  Log In
                  </Link>
              }
            </Navbar.Collapse>
          </Nav>
        </Navbar>
      }
    </>
  )
}

export default Navigation;