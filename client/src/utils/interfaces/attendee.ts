import { ObjectId } from "mongoose";

export default interface Attendee {
  confId: ObjectId;
  email: string;
  givenName: string;
  familyName: string;
  phone: string;
  employerName: string;
  employerAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergyConfirm: string;
  allergies: string[];
  waiverSigned: boolean;
  paid: boolean;
  isAdmin: string;
  _id: ObjectId;
}
