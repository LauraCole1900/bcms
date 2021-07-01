import React from "react";

export const handleFetchOne = async (query, id, setData) => {
  await query(id)
    .then(resp => {
      console.log("handleFetchConf", resp.data)
      const dataObj = resp.data
      setData(dataObj);
    })
    .catch(err => {
      console.log(err)
      return false
    })
}