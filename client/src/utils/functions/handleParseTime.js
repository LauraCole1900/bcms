import React from "react";

  // Parses time to 12-hour
  export const handleParseTime = (time) => {
    const timeArr = time.split(":");
    let hours = timeArr[0];
    let minutes = timeArr[1];
    const ampm = hours >= 12 ? "pm" : "am"
    hours = hours % 12;
    hours = hours ? hours : 12
    minutes = minutes < 10 ? "0" + minutes.slice(-1) : minutes;
    const timeStr = `${hours}:${minutes}${ampm}`
    return timeStr
  };