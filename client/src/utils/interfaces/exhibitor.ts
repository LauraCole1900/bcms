import { ObjectId } from "mongoose";

export default interface Exhibitor {
  confId: ObjectId;
  exhGivenName: string;
  exhFamilyName: string;
  exhEmail: string;
  exhCompany: string;
  exhPhone: string;
  exhCompanyAddress: string;
  exhDesc: string;
  exhLogo: string;
  exhWebsite: string;
  exhWorkers: number;
  exhWorkerNames: string[];
  exhSpaces: number;
  exhBoothNum: string;
  exhAttend: boolean;
  _id: ObjectId;
}
