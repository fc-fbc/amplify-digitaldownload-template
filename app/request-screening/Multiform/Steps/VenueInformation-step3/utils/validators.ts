import { ScreeningDetails } from "@/lib/types"

// Constants for validation
export const MAX_TEXT_LENGTH = 300; // Maximum length for text fields

// All validation functions now accept a translation function as a parameter
export const validateScreeningType = (screeningType: string | undefined, t: (key: string) => string): string => {
  return !screeningType ? t("validation.selectScreeningType") : ""
}

export const validateAddress = (
  street1: string | undefined,
  city: string | undefined,
  state: string | undefined,
  postalCode: string | undefined,
  country: string | undefined,
  t: (key: string) => string,
  useSameAddress: boolean = false
): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  // Skip validation if using the same address as correspondence
  if (useSameAddress) {
    return errors;
  }
  
  if (!street1) errors.street_1 = t("validation.streetRequired")
  if (!city) errors.city = t("validation.cityRequired")
  if (!state) errors.state = t("validation.stateRequired")
  if (!postalCode) errors.postal_code = t("validation.postalCodeRequired")
  if (!country) errors.country = t("validation.countryRequired")
  
  // Check maximum length for all text fields
  if (street1 && street1.length > MAX_TEXT_LENGTH) errors.street_1 = `${t("validation.maxLength").replace("{max}", MAX_TEXT_LENGTH.toString())}`
  if (city && city.length > MAX_TEXT_LENGTH) errors.city = `${t("validation.maxLength").replace("{max}", MAX_TEXT_LENGTH.toString())}`
  if (state && state.length > MAX_TEXT_LENGTH) errors.state = `${t("validation.maxLength").replace("{max}", MAX_TEXT_LENGTH.toString())}`
  if (postalCode && postalCode.length > MAX_TEXT_LENGTH) errors.postal_code = `${t("validation.maxLength").replace("{max}", MAX_TEXT_LENGTH.toString())}`
  if (country && country.length > MAX_TEXT_LENGTH) errors.country = `${t("validation.maxLength").replace("{max}", MAX_TEXT_LENGTH.toString())}`
  
  return errors
}

export const validateVenue = (venue: string | undefined, t: (key: string) => string): string => {
  if (!venue) return t("validation.venueRequired")
  if (venue.length > MAX_TEXT_LENGTH) return `${t("validation.maxLength").replace("{max}", MAX_TEXT_LENGTH.toString())}`
  return ""
}

export const validateHasWebsite = (hasWebsite: boolean | undefined, t: (key: string) => string): string => {
  return hasWebsite === undefined ? t("validation.websiteSelectionRequired") : ""
}

export const validateWebsite = (website: string | undefined, hasWebsite: boolean | undefined, t: (key: string) => string): string => {
  // console.log("validateWebsite called with:", { website, hasWebsite });
  
  // Simple rule: if has_website is false, no validation needed
  if (hasWebsite === false) {
    // console.log("has_website is false, no validation needed");
    return "";
  }
  
  // If has_website is undefined, no validation needed (not selected yet)
  if (hasWebsite === undefined) {
    // console.log("has_website is undefined, no validation needed");
    return "";
  }
  
  // If has_website is true but website is empty, it's required
  if (!website || website.trim() === "") {
    // console.log("has_website is true but website is empty, validation error");
    return t("validation.websiteRequired");
  }
  
  // If we have a website, validate its format
  try {
    // If URL doesn't have a protocol, add https:// for validation purposes
    let urlToValidate = website.trim();
    if (!urlToValidate.match(/^https?:\/\//i)) {
      urlToValidate = `https://${urlToValidate}`;
    }
    
    // Validate the URL
    new URL(urlToValidate);
    console.log("URL is valid");
    return "";
  } catch (e) {
    console.log("URL is invalid");
    return t("validation.validUrl");
  }
}

export const validateFormat = (format: string | undefined, t: (key: string) => string): string => {
  return !format ? t("validation.formatRequired") : ""
}

export const validateScreenSize = (
  width: number | undefined,
  height: number | undefined,
  t: (key: string) => string
): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  if (!width || width <= 0) {
    errors.width_m = t("validation.screenWidthPositive")
  }
  
  if (!height || height <= 0) {
    errors.height_m = t("validation.screenWidthPositive")
  }
  
  return errors
}

export const validateScreeningDetails = (
  screeningDetails: ScreeningDetails | undefined, 
  t: (key: string) => string,
  useSameAddress: boolean = false
): Record<string, string> => {
  
  if (!screeningDetails) return { form: t("validation.screeningDetailsRequired") }
  
  const errors: Record<string, string> = {}
  
  // Validate screening type
  const screeningTypeError = validateScreeningType(screeningDetails.screening_type, t)
  if (screeningTypeError) errors.screening_type = screeningTypeError
  
  // Validate address
  const addressErrors = validateAddress(
    screeningDetails.screening_address.street_1,
    screeningDetails.screening_address.city,
    screeningDetails.screening_address.state,
    screeningDetails.screening_address.postal_code,
    screeningDetails.screening_address.country,
    t,
    useSameAddress
  )
  Object.assign(errors, addressErrors)
  
  // // Validate venue
  // const venueError = validateVenue(screeningDetails.venue, t)
  // if (venueError) errors.venue = venueError
  
  // Validate has_website selection
  const hasWebsiteError = validateHasWebsite(screeningDetails.has_website, t)
  if (hasWebsiteError) errors.has_website = hasWebsiteError
  
  // Skip website validation if has_website is false
  if (screeningDetails.has_website !== false) {
    // Validate website only if has_website is true or undefined
    const websiteError = validateWebsite(screeningDetails.event_website, screeningDetails.has_website, t)
    if (websiteError) errors.event_website = websiteError
  } else {
  }
  
  // Validate screen size
  const screenSizeErrors = validateScreenSize(
    screeningDetails.screen_size?.width_m,
    screeningDetails.screen_size?.height_m,
    t
  )
  Object.assign(errors, screenSizeErrors)
  
  // console.log("Validation errors:", errors);
  return errors
}
