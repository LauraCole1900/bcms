const commValidate = (committee) => {
  let errors = {};

  // name errors
  if (!committee.commGivenName || committee.commGivenName === "") {
    errors.commGivenName = "Please enter the committee member's first name."
  }
  if (!committee.commFamilyName || committee.commFamilyName === "") {
    errors.commFamilyName = "Please enter the committee member's last name."
  }

  // email errors
  if (!committee.commEmail || committee.commEmail === "") {
    errors.commEmail = "Please enter the committee member's email."
  } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(committee.commEmail)) {
    errors.commEmail = "The system gremlins don't recognize this email as valid. Please enter a valid email."
  }

  // organization name errors
  if (!committee.commOrg || committee.commOrg === "") {
    errors.commOrg = "Please enter the name of the committee member's organization."
  }

  return errors;
}

export default commValidate;