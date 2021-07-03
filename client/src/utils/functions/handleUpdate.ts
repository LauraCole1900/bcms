import { AxiosResponse, AxiosError } from "axios";
import { ObjectId } from "mongoose";
import { handleFetchEmails } from ".";
import { ConferenceAPI } from "../api";
import { Attendee, Committee, Conference, Exhibitor, Presenter, Session } from "../interfaces";

// Handles click on "Yes, Cancel" button on ConfirmModal
// Will need to have email functionality to email registered participants
export const handleConfCancel = async (
  query1: any,
  query2: any,
  confId: ObjectId,
  conference: Conference,
  handleHideConfirm: any,
  handleShowSuccess: any,
  setErrThrown: any,
  handleShowErr: any
): Promise<Conference | void> => {
  console.log("from confCard", confId);
  handleHideConfirm();
  let attEmailArr: Array<string> = await handleFetchEmails(
    query1,
    confId,
    setErrThrown,
    handleShowErr
  );
  let exhEmailArr: Array<string> = await handleFetchEmails(
    query2,
    confId,
    setErrThrown,
    handleShowErr
  );
  console.log({ attEmailArr, exhEmailArr });
  // send-email functionality for registered attendees & exhibitors goes here

  // handleUpdateById(ConferenceAPI.updateConference, confId, conference, {confCancel: "yes"}, handleShowSuccess, setErrThrown, handleShowErr)
  ConferenceAPI.updateConference({ ...conference, confCancel: "yes" }, confId)
    .then((resp: AxiosResponse<Conference>) => {
      if (resp.status !== 422) {
        handleShowSuccess();
      }
    })
    .catch((err: AxiosError) => {
      console.log("from handleUpdateById", err);
      setErrThrown(err.message);
      handleShowErr();
    });
};

export const handleUpdateById = async (
  query: any,
  id: ObjectId,
  data: Attendee | Committee | Conference | Exhibitor | Presenter | Session,
  update: {
    key: string,
    value: string
  },
  handleShowSuccess: any,
  setErrThrown: any,
  handleShowErr: any
): Promise<Attendee | Committee | Conference | Exhibitor | Presenter | Session | void> => {
  console.log({ update });
  query({ ...data, update }, id)
  .then((resp: AxiosResponse<Attendee | Committee | Conference | Exhibitor | Presenter | Session>) => {
    if (resp.status !== 422) {
      console.log(resp);
      handleShowSuccess();
    }
  })
  .catch((err: AxiosError) => {
    console.log("from handleUpdateById", err);
    setErrThrown(err.message);
    handleShowErr();
  })
}