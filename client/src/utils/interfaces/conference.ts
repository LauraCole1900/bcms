import { ObjectId } from "mongoose";

export default interface Conference {
  ownerConfirm: string;
  ownerEmail: string;
  confName: string;
  confOrg: string;
  confDesc: string;
  startDate: string;
  endDate: string;
  numDays: number;
  confStartTime: string;
  confEndTime: string;
  confType: string;
  confLoc: string;
  confLocName: string;
  confLocUrl: string;
  confRegDeadline: string;
  confKeynote: string;
  confCapConfirm: string;
  confAttendCap: number;
  confFee: string;
  confFeeAmt: string;
  confEarlyRegConfirm: string;
  confEarlyRegDeadline: string;
  confEarlyRegFee: string;
  confEarlyRegSwagConfirm: string;
  confEarlyRegSwagType: string;
  confEarlyRegSizeConfirm: string;
  confSessProposalConfirm: string;
  confSessProposalDeadline: string;
  confSessProposalCommittee: string[];
  confAllergies: string;
  confWaiver: string;
  confAdmins: string[];
  confCancel: string;
  _id: ObjectId;
}
