const presValidate = (presenter) => {
  let errors = {};

  // name errors
  if (presenter.givenName === "") {
    errors.presGivenName = "Who is presenting this session? Please enter the presenter's first name."
  }
  if (presenter.familyName === "") {
    errors.presFamilyName = "Who is presenting this session? Please enter the presenter's last name."
  }

  // organization name errors
  if (presenter.presOrg === "") {
    errors.presOrg = "Who does this presenter represent? Please enter the name of the presenter's company, organization, or school."
  }

  // bio errors
  if (presenter.presBio === "") {
    errors.presBio = "Tell us a little about this presenter."
  } else if (presenter.presBio.length < 10) {
    errors.presBio = "We want to know more! Please use 10 characters or more to tell us about this presenter."
  }

  return errors;
}

export default presValidate