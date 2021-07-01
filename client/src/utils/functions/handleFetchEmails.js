import React from "react";

const handleFetchEmails = async (api, confId, setErrThrown, handleShowErr) => {
  console.log("from confCard fetchAttendees", confId)
  return await api(confId)
    .then((resp) => {
      // map through res.data and pull all emails into an array
      const attData = resp.data
      let attEmails = attData.map((att) => att.email)
      return attEmails
    })
    .catch((err) => {
      console.log("from confCard fetAttEmails", err)
      setErrThrown(err.message);
      handleShowErr();
    })
}

export default handleFetchEmails;