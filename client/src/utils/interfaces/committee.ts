import { ObjectId } from "mongoose";

export default interface Committee {
  confId: ObjectId;
  commEmail: string;
  commGivenName: string;
  commFamilyName: string;
  commOrg: string;
  commPhone: string;
  isChair: string;
  _id: ObjectId;
}
