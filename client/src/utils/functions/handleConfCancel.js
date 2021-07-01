import React from "react";
import { handleFetchEmails } from ".";
import { ConferenceAPI } from "../api";

// Handles click on "Yes, Cancel" button on ConfirmModal
// Will need to have email functionality to email registered participants

const handleConfCancel = async (api1, api2, confId, conference, handleHideConfirm, handleShowSuccess, setErrThrown, handleShowErr) => {
  console.log("from confCard", confId)
  handleHideConfirm();
  let attEmailArr = await handleFetchEmails(api1, confId, setErrThrown, handleShowErr);
  let exhEmailArr = await handleFetchEmails(api2, confId, setErrThrown, handleShowErr);
  console.log({ attEmailArr, exhEmailArr });
  // send-email functionality for registered attendees & exhibitors goes here

  ConferenceAPI.updateConference({ ...conference, confCancel: "yes" }, confId)
    .then((resp) => {
      if (resp.status !== 422) {
        handleShowSuccess();
      }
    })
    .catch((err) => {
      console.log("from confCard updateConf", err);
      setErrThrown(err.message);
      handleShowErr();
    });
};

export default handleConfCancel;