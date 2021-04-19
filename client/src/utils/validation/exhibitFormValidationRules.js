const exhValidate = (exhibitor) => {
  let errors = {};

  // name errors
  if (!exhibitor.exhGivenName) {
    errors.exhGivenName = "Who are you? Please enter your first name."
  }

  if (!exhibitor.exhFamilyName) {
    errors.exhFamilyName = "Who are you? Please enter your last name."
  }

  // email errors
  if (!exhibitor.exhEmail) {
    errors.exhEmail = "How do we contact you? Please enter your email."
  } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(exhibitor.exhEmail)) {
    errors.exhEmail = "The system gremlins don't recognize your email as valid. Please enter a valid email."
  }

  // company errors
  if (!exhibitor.exhCompany) {
    errors.exhCompany = "Who are you representing? Please enter a company, organization, or school."
  }

  if (!exhibitor.exhCompanyAddress) {
    errors.exhCompanyAddress = "Where are you located? Please enter the physical address for your company, organization, or school."
  }

  // description errors
  if (!exhibitor.exhDesc) {
    errors.exhDesc = "What does your company/organization do?"
  }

  // phone errors
  if (!exhibitor.exhPhone) {
    errors.exhPhone = "How can we call you? Please enter a phone number."
  } else if (!/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(exhibitor.exhPhone)) {
    errors.exhPhone = "The system gremlins don't recognize a valid phone number. Please enter a valid phone number."
  }

  // worker errors
  if (!exhibitor.exhWorkers) {
    errors.exhWorkers = "Please tell us how many people will be working your exhibit."
  }

  if (!exhibitor.exhWorkerName1) {
    errors.exhWorkerName1 = "Please tell us who will be working your exhibit."
  }
  if (exhibitor.exhWorkers > 1 && !exhibitor.exhWorkerName2) {
    errors.exhWorkerName2 = "Please tell us who else will be working your exhibit."
  }
  if (exhibitor.exhWorkers > 2 && !exhibitor.exhWorkerName3) {
    errors.exhWorkerName3 = "Please tell us who else will be working your exhibit."
  }
  if (exhibitor.exhWorkers > 3 && !exhibitor.exhWorkerName4) {
    errors.exhWorkerName4 = "Please tell us who else will be working your exhibit."
  }

  // spaces errors
  if (!exhibitor.exhSpaces) {
    errors.exhSpaces = "How big is your exhibit? Please tell us how many spaces you need."
  }

  return errors;
}

export default exhValidate;