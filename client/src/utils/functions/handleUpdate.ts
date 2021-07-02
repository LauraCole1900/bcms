import { AxiosResponse, AxiosError } from "axios";
import { ObjectId } from "mongoose";
import { handleFetchEmails } from ".";
import { ConferenceAPI } from "../api";
import { Attendee, Committee, Conference, Exhibitor, Presenter, Session } from "../interfaces";

// Handles click on "Yes, Cancel" button on ConfirmModal
// Will need to have email functionality to email registered participants
const handleConfCancel = async (
  api1: any,
  api2: any,
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
    api1,
    confId,
    setErrThrown,
    handleShowErr
  );
  let exhEmailArr: Array<string> = await handleFetchEmails(
    api2,
    confId,
    setErrThrown,
    handleShowErr
  );
  console.log({ attEmailArr, exhEmailArr });
  // send-email functionality for registered attendees & exhibitors goes here

  ConferenceAPI.updateConference({ ...conference, confCancel: "yes" }, confId)
    .then((resp: AxiosResponse<Conference>) => {
      if (resp.status !== 422) {
        handleShowSuccess();
      }
    })
    .catch((err: AxiosError) => {
      console.log("from confCard updateConf", err);
      setErrThrown(err.message);
      handleShowErr();
    });
};

export default handleConfCancel;
