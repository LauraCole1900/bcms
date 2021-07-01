import React from "react"

// Handles unregistration of attendees or exhibitors

const handleUnreg = (api, confId, email, handleHideConfirm, handleShowSuccess, setErrThrown, handleShowErr) => {
  handleHideConfirm();
  api(confId, email)
    .then((resp) => {
      // If no errors thrown, show Success modal
      if (resp.status !== 422) {
        handleShowSuccess();
        return resp;
      }
    })
    // If yes errors thrown, show Error modal
    .catch((err) => {
      console.log(err);
      setErrThrown(err.message);
      handleShowErr();
      return err;
    });
}

export default handleUnreg;