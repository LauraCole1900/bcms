const mongoose = require("mongoose");
const db = require("../models");

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/conference"
);

const conferenceSeed = [
  {
    _id: ObjectId("5fed4bc060c8492ca05b4537"),
    creatorEmail: "lauracole1900@gmail.com",
    confName: "Another test conference",
    confOrg: "Test organization",
    confDesc: "This is another text conference to test Live options in the form and the rendering, and the sorting of the conferences in the rendering.",
    startDate: "2021-01-15",
    endDate: "2021-01-15",
    confStartTime: "09:00",
    confEndTime: "17:00",
    confType: "Live",
    confLoc: "2101 10th Ave, Greeley, CO 80639",
    confCapConfirm: "no",
    confAttendCount: 0,
    confFee: "no",
    confWaiver: false,
    confLocName: "University of Northern Colorado Main Ballroom",
    confLocUrl: "https://www.unco.edu/university-center/",
  },
  {
    _id: ObjectId("5fed4f18bc71db3f88363868"),
    creatorEmail: "lauracole1900@gmail.com",
    confName: "Testy test",
    confOrg: "Testy McTestFace",
    confDesc: "This is a text conference to test whether a virtual conference without a link will render without a link.",
    startDate: "2021-01-14",
    endDate: "2021-01-14",
    confStartTime: "09:00",
    confEndTime: "17:00",
    confType: "Virtual",
    confLoc: "URL will not be emailed because this is a fake conference.",
    confCapConfirm: "no",
    confAttendCount: 0,
    confWaiver: false,
    confAttendCap: 100,
    confFee: "no"
  },
  {
    _id: ObjectId("5fed69e10e39384e709b3b38"),
    creatorEmail: "lauracole1900@gmail.com",
    confName: "Testing",
    confOrg: "More testing",
    confDesc: "Another testy test",
    startDate: "2021-01-19",
    endDate: "2021-01-21",
    confStartTime: "09:00",
    confEndTime: "16:00",
    confType: "Virtual",
    confLoc: "Message",
    confCapConfirm: "no",
    confAttendCount: 0,
    confWaiver: true,
    confLocName: "No URL",
    confLocUrl: "",
    confFee: "no"
  },
  {
    _id: ObjectId("5fee40e77921f31a7c765798"),
    creatorEmail: "garytalmes@gmail.com",
    confName: "More testing",
    confOrg: "Testy McTestFace",
    confDesc: "This is a fake conference to test the rearrangement of my server-side api file.",
    startDate: "2021-01-24",
    endDate: "2021-01-24",
    confStartTime: "13:00",
    confEndTime: "15:00",
    confType: "Virtual",
    confLoc: "No such URL",
    confCapConfirm: "no",
    confAttendCount: 0,
    confWaiver: false,
    confFee: "no",
  },
  {
    _id: ObjectId("5fee41ff7921f31a7c76579c"),
    creatorEmail: "lauracole1900@gmail.com",
    confName: "One more test",
    confOrg: "More testing",
    confDesc: "One more test for my server-side api file rearrangement",
    startDate: "2021-01-03",
    endDate: "2021-01-03",
    confStartTime: "18:00",
    confEndTime: "20:00",
    confType: "Live",
    confLoc: "700 14th Street, Denver, CO, 80202",
    confCapConfirm: "yes",
    confAttendCount: 0,
    confWaiver: "yes",
    confLocName: "Colorado Convention Center",
    confLocUrl: "https://denverconvention.com/",
    confAttendCap: 5000,
    confFee: "yes",
    confFeeAmt: 500,
    confAllergies: "yes"
  },
  {
    _id: ObjectId("5fee4f9825ac9027388ba6c5"),
    creatorEmail: "lauracole1900@comcast.net",
    confName: "New test",
    confOrg: "New testers",
    confDesc: "Testing conference post route with new email",
    startDate: "2021-02-02",
    endDate: "2021-02-02",
    confStartTime: "15:00",
    confEndTime: "16:00",
    confType: "Virtual",
    confLoc: "No URL",
    confCapConfirm: "no",
    confAttendCount: 0,
    confWaiver: false,
    confFee: "no",
  },
  {
    _id: ObjectId("5fefccadefdd6a1ed8f41d09"),
    creatorEmail: "lauracole1900@comcast.net",
    confName: "Testing again",
    confOrg: "Testy McTestFace",
    confDesc: "Testing to see if all of my new imports work",
    startDate: "2021-01-29",
    endDate: "2021-01-30",
    confStartTime: "09:00",
    confEndTime: "16:00",
    confType: "Live",
    confLoc: "1 Lake Avenue, Colorado Springs, CO",
    confCapConfirm: "no",
    confAttendCount: 0,
    confWaiver: true,
    confLocName: "Broadmoor Hotel",
    confLocUrl: "https://www.broadmoor.com/",
    confFee: "no",
  }
]

db.Conference
  .remove({})
  .then(() => db.Conference.collection.insertMany(conferenceSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });