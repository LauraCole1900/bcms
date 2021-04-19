const sessValidate = ([session, conference]) => {
  let errors = {};

  // session name errors
  if (!session.sessName) {
    errors.sessName = "Please enter the name of this session."
  }

  // session description errors
  if (!session.sessDesc) {
    errors.sessDesc = "What is this session about? Please enter a description."
  } else if (session.sessDesc.length < 50) {
    errors.sessDesc = "We want to know more! Please use 50 characters or more to describe or summarize this session."
  }

  // session date errors
  if (!session.sessDate) {
    errors.sessDate = "When is this session? Please enter a date."
  }

  // session time errors
  if (!session.sessStart) {
    errors.sessStart = "When does this session start? Please enter a start time."
  }

  if (!session.sessEnd) {
    errors.sessEnd = "When does this session end? Please enter an end time."
  }

  // session location errors
  if (conference.confType === "Live" && !session.sessRoom) {
    errors.sessRoom = "Where is this session? Please enter a room or location. If that isn't assigned yet, please enter 'TBA' or 'TBD'."
  }

  // keynote errors
  if (conference.confKeynote === "yes" && !session.sessKeynote) {
    errors.sessKeynote = "Please indicate whether this is a keynote session."
  }

  return errors;
}

export default sessValidate;