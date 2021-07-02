import { Attendee, Exhibitor, Presenter } from "../interfaces"
import { AxiosResponse, AxiosError } from "axios";
import { ObjectId } from "mongoose";

// Creates an array of conference IDs
export const handleFetchConfIds = (query: any, email: string): ObjectId[] | void => {
  return query(email)
    .then((resp: AxiosResponse<Array<Attendee | Exhibitor | Presenter>>) => {
      const dataArr: Array<Attendee | Exhibitor | Presenter> = resp.data
      const dataRes: ObjectId[] = dataArr.map(data => data.confId)
      return dataRes
    })
    .catch((err: AxiosError) => {
      console.log(err)
      return false
    })
}

// Creates email array for mass emails on conference cancellation
export const handleFetchEmails = async (query: any, confId: ObjectId, setErrThrown: any, handleShowErr: any) => {
  let thisEmail: any;
  console.log("handleFetchEmails", confId)
  return await query(confId)
    .then((resp: AxiosResponse<Array<Attendee | Exhibitor | Presenter>>) => {
      // define which key to match based on which collection is being queried
      if (query.name === "getAttendees") {
        thisEmail = "email" as keyof Attendee;
      } else if (query.name === "getExhibitors") {
        thisEmail = "exhEmail" as keyof Exhibitor;
      } else if (query.name === "getPresenters") {
        thisEmail = "presEmail" as keyof Presenter;
      }
      // map through res.data and pull all emails into an array
      const dataObj: Array<Attendee | Exhibitor | Presenter> = resp.data
      let dataEmails = dataObj.map((data: any) => data[thisEmail])
      return dataEmails;
    })
    .catch((err: AxiosError) => {
      console.log("handleFetchEmails", err)
      setErrThrown(err.message);
      handleShowErr();
    })
}

// GETs one document by ID
export const handleFetchOne = async (query: any, id: string, setData: any) => {
  return await query(id)
    .then((resp: AxiosResponse) => {
      console.log("handleFetchOne", resp.data)
      const dataObj = resp.data;
      setData(dataObj);
      return dataObj;
    })
    .catch((err: AxiosError) => {
      console.log(err)
      return false
    })
}