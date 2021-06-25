import React, { ReactElement, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Location } from "history";
import { Navbar, Nav, Image } from "react-bootstrap";
import { useAuth0, User } from "@auth0/auth0-react";
import { UserAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css";

const Navigation = (): ReactElement => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0<User>();
  const location = useLocation<Location>();
  const [userInfo, setUserInfo] = useState<User>({});
  const [pageReady, setPageReady] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      UserAPI.getUserByEmail(user!.email)
        .then((resp: AxiosResponse<User>) => {
          console.log("from userInfo getUserByEmail", resp.data);
          const userArr = resp.data;
          setUserInfo(userArr);
          setPageReady(true);
        })
        .catch((err: AxiosError) => console.log(err))
    } else {
      setPageReady(true);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {pageReady === true &&
        <Navbar expand="sm" className="navbar">
          <Navbar.Brand className="logo ml-3">
            <div>
              <Image fluid src="/images/bristlecone-light.png" alt="BCMS logo" className="pineTree mylogo" />
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
              : <Link to={window.location.origin} className="navlink guest" onClick={() => loginWithRedirect()}>
                Guest!
                </Link>
            }
          </Navbar.Text>
          <Nav className="navobj">
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggle" data-toggle="popover" title="Show Menu" />
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