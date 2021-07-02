import { ObjectId } from "mongoose";
import { AxiosResponse, AxiosError } from "axios";
import { Attendee, Exhibitor } from "../interfaces"

// Handles unregistration of attendees or exhibitors
export const handleUnreg = (api: any, confId: string | ObjectId, email: string, handleHideConfirm: any, handleShowSuccess: any, setErrThrown: any, handleShowErr: any): Attendee | Exhibitor | void => {
  handleHideConfirm();
  api(confId, email)
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
}

