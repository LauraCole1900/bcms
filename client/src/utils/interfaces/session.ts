import { ObjectId } from "mongoose";

export default interface Session {
  confId: ObjectId;
  sessName: string;
  sessPresEmails: Array<string>;
  sessDate: string;
  sessStart: string;
  sessEnd: string;
  sessDesc: string;
  sessEquipConfirm: string;
  sessEquipProvide: string;
  sessEquip: Array<string>;
  sessKeynote: string;
  sessPanel: string;
  sessRoom: string;
  sessAccepted: string;
  _id: ObjectId;
}
