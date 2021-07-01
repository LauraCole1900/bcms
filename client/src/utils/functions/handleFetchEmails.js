import React from "react";

// Creates email array for mass emails on conference cancellation

const handleFetchEmails = async (query, confId, setErrThrown, handleShowErr) => {
  let thisEmail;
  console.log("from confCard fetchAttendees", confId)
  return await query(confId)
    .then((resp) => {
      // define which key to match based on which collection is being queried
      if (query.name === "getAttendees") {
        thisEmail = "email";
      } else if (query.name === "getExhibitors") {
        thisEmail = "exhEmail";
      } else if (query.name === "getPresenters") {
        thisEmail = "presEmail";
      }
      // map through res.data and pull all emails into an array
      const dataObj = resp.data
      let dataEmails = dataObj.map((data) => data[thisEmail])
      return dataEmails;
    })
    .catch((err) => {
      console.log("from confCard fetAttEmails", err)
      setErrThrown(err.message);
      handleShowErr();
    })
}

export default handleFetchEmails;