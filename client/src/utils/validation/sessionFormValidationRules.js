const sessValidate = ([session, conference, formType]) => {
  let errors = {};

  // session proposal contact errors
  if ((formType === "propose_session" || formType === "edit_propose_session") && !session.sessPropContName) {
    errors.sessPropContName = "Who is the contact person for this proposed session? Please give us their name."
  }
  if ((formType === "propose_session" || formType === "edit_propose_session") && !session.sessPropContEmail) {
    errors.sessPropContEmail = "What is the contact person's email?"
  }
  if ((formType === "propose_session" || formType === "edit_propose_session") && !session.sessPropContPhone) {
    errors.sessPropContPhone = "What is the contact person's phone number?"
  }

  // session name errors
  if (!session.sessName || session.sessName === "") {
    errors.sessName = "Please enter the name of this session."
  }

  // session description errors
  if (!session.sessDesc || session.sessDesc === "") {
    errors.sessDesc = "What is this session about? Please enter a description."
  } else if (session.sessDesc.length < 10) {
    errors.sessDesc = "We want to know more! Please use 10 characters or more to describe or summarize this session."
  }

  // session date errors
  // if (!session.sessDate) {
  //   errors.sessDate = "When is this session? Please enter a date."
  // }

  // session time errors
  // if (!session.sessStart) {
  //   errors.sessStart = "When does this session start? Please enter a start time."
  // }

  // if (!session.sessEnd) {
  //   errors.sessEnd = "When does this session end? Please enter an end time."
  // } else if (session.sessStart >= session.sessEnd) {
  //   errors.sessEnd = "End time must be later than the start time. Please choose a different end time."
  // }

  // session location errors
  if (conference.confType === "Live" && !session.sessRoom) {
    errors.sessRoom = "Where is this session? Please enter a room or location. If that isn't assigned yet, please enter 'TBA' or 'TBD'."
  }

  // panel discussion errors
  if (!session.sessPanel || session.sessPanel === "") {
    errors.sessPanel = "Please indicate whether this is a panel discussion."
  }

  // keynote errors
  if (conference.confKeynote === "yes" && (!session.sessKeynote || session.sessKeynote === "")) {
    errors.sessKeynote = "Please indicate whether this is a keynote session."
  }

  // session presenter email errors
  if (!session.sessPresEmails.length || session.sessPresEmails[0] === "") {
    errors.sessPresEmails = "Please enter the emails of the presenter(s)."
  }

  return errors;
}

export default sessValidate;