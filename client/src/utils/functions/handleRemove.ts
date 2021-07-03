import { Attendee, Exhibitor } from "../interfaces";
import { AxiosResponse, AxiosError } from "axios";
import { ObjectId } from "mongoose";

// Handles deleting one document by document ID
export const handleDeleteById = (
  query: any,
  id: string | ObjectId,
  handleShowSuccess: any,
  setErrThrown: any,
  handleShowErr: any
) => {
  query(id)
      .then((resp: AxiosResponse) => {
        // If no errors thrown, show Success modal
        if (resp.status !== 422) {
          handleShowSuccess();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err)
        setErrThrown(err.message);
        handleShowErr();
      })
}

// Handles deleting document by email and confId
// Unregistration of attendees or exhibitors
export const handleUnreg = (
  query: any,
  confId: string | ObjectId,
  email: string,
  handleHideConfirm: any,
  handleShowSuccess: any,
  setErrThrown: any,
  handleShowErr: any
): Attendee | Exhibitor | void => {
  handleHideConfirm();
  query(confId, email)
    .then((resp: AxiosResponse) => {
      // If no errors thrown, show Success modal
      if (resp.status !== 422) {
        handleShowSuccess();
        return resp;
      }
    })
    // If yes errors thrown, show Error modal
    .catch((err: AxiosError) => {
      console.log(err);
      setErrThrown(err.message);
      handleShowErr();
      return err;
    });
};