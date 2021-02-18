import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Row, Col } from "react-bootstrap";
import { SessionAPI } from "../../utils/api";
import "./style.css";

const ConfDetails = () => {
const [sessArray, setSessArray] = useState();
const [searchBy, setSearchBy] = useState("allSess");
const [search, setSearch] = useState("");
const [pageReady, setPageReady] = useState(false);

const urlArray = window.location.href.split("/")
const confId = urlArray[urlArray.length - 1]

useEffect(() => {
  SessionAPI.getSessions(confId)
  .then(resp => {
    const sessArr = resp.data;
    setSessArray(sessArr);
    setPageReady(true);
  })
  .catch(err => console.log(err))
}, [])

}

export default ConfDetails;