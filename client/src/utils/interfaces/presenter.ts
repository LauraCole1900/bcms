import { ObjectId } from "mongoose";

export default interface Presenter {
  confId: ObjectId;
  presGivenName: string;
  presFamilyName: string;
  presOrg: string;
  presBio: string;
  presEmail: string;
  presPhone: string;
  presWebsite: string;
  presPic: string;
  presSessionIds: Array<ObjectId>;
  presKeynote: string;
  presAccepted: string;
  _id: ObjectId;
}
