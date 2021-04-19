const regValidate = ([attendee, conference]) => {
  let errors = {};

  // email errors
  if (!attendee.email) {
    errors.email = "How do we contact you? Please enter your email."
  } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(attendee.email)) {
    errors.exhEmail = "The system gremlins don't recognize your email as valid. Please enter a valid email."
  }

  // name errors
  if (!attendee.givenName) {
    errors.givenName = "Who are you? Please enter your first name."
  }
  if (!attendee.familyName) {
    errors.familyName = "Who are you? Please enter your last name."
  }

  // phone errors
  if (!attendee.phone) {
    errors.phone = "How can we call you? Please enter a phone number."
  } else if (!/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(attendee.phone)) {
    errors.phone = "The system gremlins don't recognize a valid phone number. Please enter a valid phone number."
  }

  // company errors
  if (!attendee.employerName) {
    errors.employerName = "Who do you represent? Please enter the name of your company, organization, or school, or n/a if not applicable."
  }

  // allergies errors
  if (conference.confAllergies === "yes" && !attendee.allergyConfirm) {
    errors.allergyConfirm = "We want you to be safe! Please tell us if you have known allergies."
  }
  if (attendee.allergyConfirm === "yes" && !attendee.allergies) {
    errors.allergies = "We want you to be safe! Please tell us what your allergies are."
  }

  return errors;
}

export default regValidate;