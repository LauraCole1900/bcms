import { ObjectId } from "mongoose";

export default interface Schedule {
  confId: ObjectId,
  schedRooms: string[],
  schedTimes: string[]
}