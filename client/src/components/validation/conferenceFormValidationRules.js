const confValidate = (conference) => {
  let errors = {};
  // ownership errors
  if (!conference.ownerConfirm) {
    errors.ownerConfirm = "Please tell us whether you are the owner or primary organizer of this conference."
  }

  // email errors
  if (!conference.ownerEmail) {
    errors.ownerEmail = "The system gremlins can't seem to find an email address. Please check that you entered one."
  } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(conference.ownerEmail)) {
    errors.ownerEmail = "The system gremlins think the email you entered is invalid. Please enter a valid email."
  }

  // conference name errors
  if (!conference.confName || conference.confName.length < 3) {
    errors.confName = "Please name your conference!"
  }

  // presenting organization errors
  if (!conference.confOrg || conference.confOrg.length < 3) {
    errors.confOrg = "Please tell us the organization presenting your conference."
  }

  // conference description errors
  if (!conference.confDesc) {
    errors.confDesc = "Please describe or summarize your conference."
  } else if (conference.confDesc.length < 50) {
    errors.confDesc = "We want to know more! Please use 50 characters or more to describe or summarize your conference."
  }

  // start-date errors
  if (!conference.startDate) {
    errors.startDate = "When does your conference start?"
  }

  // end-date errors
  if (!conference.endDate) {
    errors.endDate = "When does your conference end?"
  }

  // start time errors
  if (!conference.confStartTime) {
    errors.confStartTime = "What time does your conference start? Don't worry, you'll have the option to create a full schedule later."
  }

  // end time errors
  if (!conference.confEndTime) {
    errors.confEndTime = "What time does your conference end? Don't worry, you'll have the option to create a full schedule later."
  }

  // conference type errors
  if (!conference.confType) {
    errors.confType = "Please tell us whether your conference is live (in-person) or virtual."
  }

  // conference location errors
  if (conference.confType === "Live" && !conference.confLoc) {
    errors.confLocLive = "Please enter your conference venue's name and address."
  }

  if (conference.confType === "Virtual" && !conference.confLoc) {
    errors.confLocVir = "Please enter your conference's URL. If the URL will be sent to registered attendees later, please enter that in the URL field."
  }

  // registration deadline errors
  if (!conference.confRegDeadline) {
    errors.confRegDeadline = "Please tell us the registration deadline. If there is no registration deadline, please enter the conference's end date."
  }

  // keynote errors
  if (!conference.confKeynote) {
    errors.confKeynote = "Please indicate whether your conference will have a keynote speaker."
  }

  // attendee cap errors
  if (!conference.confCapConfirm) {
    errors.confCapConfirm = "Please indicate whether there is a cap on the number of attendees."
  }

  // registration fee errors
  if (!conference.confFee) {
    errors.confFee = "Please indicate whether there will be a registration fee."
  }

  if (conference.confFee === "yes" && !conference.confFeeAmt) {
    errors.confFeeAmt = "Please tell us the registration fee amount."
  }

  // early registration errors
  if (!conference.confEarlyRegConfirm) {
    errors.confEarlyRegConfirm = "Please indicate whether there will be incentives for early registration."
  }

  if (conference.confEarlyRegConfirm === "yes" && !conference.confEarlyRegDeadline) {
    errors.confEarlyRegDeadline = "Please tell us the deadline for early registration."
  }

  if (conference.confEarlyRegConfirm === "yes" && !conference.confEarlyRegFee) {
    errors.confEarlyRegFee = "Please tell us the early registration fee amount."
  }

  // session proposal errors
  if (!conference.confSessProposalConfirm) {
    errors.confSessProposalConfirm = "Please indicate whether your conference will require proposals for sessions from prospective presenters."
  }

  // allergies errors
  if (!conference.confAllergies) {
    errors.confAllergies = "Please indicate whether you need to ask attendees to tell you about their allergies."
  }

  // waiver errors
  if(!conference.confWaiver) {
    errors.confWaiver = "Please indicate whether your event requires a liability waiver."
  }

  return errors;
}

export default confValidate;