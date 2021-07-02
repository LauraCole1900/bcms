import { ObjectId } from "mongoose";

export default interface ThisEvent {
  dataset: {
    toggle: string;
    confid: string;
    attname: string;
    confname: string;
    commname: string;
    exhname: string;
    presname: string;
    email: string;
    name: string;
  };
  title: string;
  className: string;
}
