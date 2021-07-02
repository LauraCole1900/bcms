import { ObjectId } from "mongoose";

export default interface Schedule {
  confId: ObjectId,
  schedRooms: Array<string>,
  schedTimes: Array<string>
}