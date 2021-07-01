import { ObjectId } from "mongoose";

export default interface Session {
  confId: ObjectId;
  sessName: string;
  sessPresEmails: string[];
  sessDate: string;
  sessStart: string;
  sessEnd: string;
  sessDesc: string;
  sessEquipConfirm: string;
  sessEquipProvide: string;
  sessEquip: string[];
  sessKeynote: string;
  sessPanel: string;
  sessRoom: string;
  sessAccepted: string;
  _id: ObjectId;
}
