import * as EmailValidator from 'email-validator'
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js/max'
import { ContactInfo, FinanceDetails } from '@/lib/types'
import { translations, Locale } from '@/lib/translations'

// Constants for validation
export const MAX_TEXT_LENGTH = 300; // Maximum length for text fields

/**
 * Format field name for error messages
 */
export const formatFieldName = (name: string, locale: Locale = 'en'): string => {
  // Try to find a translation key for this field
  const fieldMap: Record<string, string> = {
    'first_name': 'form.contactInfo.firstName',
    'last_name': 'form.contactInfo.lastName',
    'company_name': 'form.contactInfo.companyName',
    'company_registration_number': 'form.contactInfo.companyRegistrationNumber',
    'vat_number': 'form.contactInfo.vatNumber',
    'email': 'form.contactInfo.email',
    'phone': 'form.contactInfo.phone',
    'street_1': 'form.contactInfo.street1',
    'street_2': 'form.contactInfo.street2',
    'city': 'form.contactInfo.city',
    'state': 'form.contactInfo.state',
    'postal_code': 'form.contactInfo.postalCode',
    'country': 'form.contactInfo.country',
    'privacyConsent': 'privacy.consentText'
  };

  const translationKey = fieldMap[name];
  if (translationKey) {
    // Get the translation from the current locale
    const translation = getNestedValue(translations[locale], translationKey);
    if (typeof translation === 'string') {
      return translation;
    }
    
    // Fallback to English if translation not found
    const fallback = getNestedValue(translations.en, translationKey);
    if (typeof fallback === 'string') {
      return fallback;
    }
  }

  // Fallback to formatting the field name if no translation is found
  return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
}

/**
 * Get a validation message
 */
export const getValidationMessage = (key: string, locale: Locale = 'en', replacements?: Record<string, string | number>): string => {
  const translationKey = `validation.${key}`;
  
  // Get the translation from the current locale
  const translation = getNestedValue(translations[locale], translationKey);
  
  if (typeof translation !== 'string') {
    // Fallback to English if translation not found
    const fallback = getNestedValue(translations.en, translationKey);
    if (typeof fallback !== 'string') {
      return `Translation not found: ${translationKey}`;
    }
    return applyReplacements(fallback, replacements);
  }
  
  return applyReplacements(translation, replacements);
}

/**
 * Replace placeholders in a string with values
 */
function applyReplacements(str: string, replacements?: Record<string, string | number>): string {
  if (!replacements) return str;
  
  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    str
  );
}

/**
 * Validate a single field
 */
export const validateField = (
  name: string, 
  value: any, 
  contactInfo?: ContactInfo,
  locale: Locale = 'en',
  financeDetails?: FinanceDetails
): string => {
  // Handle boolean values (like privacyConsent)
  if (typeof value === 'boolean') {
    return !value ? getValidationMessage('required', locale) : ''
  }

    // Handle string values
  if (typeof value === 'string') {
    if (!value.trim()) {
      return getValidationMessage('required', locale)
    }
    
    // Check maximum length for all text fields
    if (value.length > MAX_TEXT_LENGTH) {
      return getValidationMessage('maxLength', locale, { max: MAX_TEXT_LENGTH })
    }

    // Special field validations
    switch (name) {
      case 'email':
        return !EmailValidator.validate(value) ? getValidationMessage('email', locale) : ''
      case 'phone':
        // If the field is empty, return required error
        if (!value.trim()) {
          return getValidationMessage('required', locale)
        }
        
        // Only validate the phone number if the user has entered something
        // This prevents validation errors during typing
        if (value.trim().length > 0) {
          // First check if we have enough digits to attempt validation
          if (value.length < 8) {
            // Only show this error on form submission, not during typing
            if (contactInfo && contactInfo.phone === value) {
              return getValidationMessage('minLength', locale, { min: 8 })
            }
            return ''
          }

          try {
            const isValid = isValidPhoneNumber(value)
            if (!isValid) {
              return getValidationMessage('pattern', locale)
            }

            const phoneNumber = parsePhoneNumber(value)
            const nationalNumber = phoneNumber?.nationalNumber || ''
            
            // Check if there's more than just the country code
            if (nationalNumber.length < 3) {
              return getValidationMessage('minLength', locale, { min: 3 })
            }
          } catch (error) {
            // Only show format error on form submission, not during typing
            if (contactInfo && contactInfo.phone === value) {
              return getValidationMessage('pattern', locale)
            }
            return ''
          }
        }
        return ''
        
      case 'finance_phone':
        // If the field is empty, return required error
        if (!value.trim()) {
          return getValidationMessage('required', locale)
        }
        
        // Only validate the phone number if the user has entered something
        // This prevents validation errors during typing
        if (value.trim().length > 0) {
          // First check if we have enough digits to attempt validation
          if (value.length < 8) {
            // Only show this error on form submission, not during typing
            if (financeDetails && financeDetails.finance_phone === value) {
              return getValidationMessage('minLength', locale, { min: 8 })
            }
            return ''
          }

          try {
            const isValid = isValidPhoneNumber(value)
            if (!isValid) {
              return getValidationMessage('pattern', locale)
            }

            const phoneNumber = parsePhoneNumber(value)
            const nationalNumber = phoneNumber?.nationalNumber || ''
            
            // Check if there's more than just the country code
            if (nationalNumber.length < 3) {
              return getValidationMessage('minLength', locale, { min: 3 })
            }
          } catch (error) {
            // Only show format error on form submission, not during typing
            if (financeDetails && financeDetails.finance_phone === value) {
              return getValidationMessage('pattern', locale)
            }
            return ''
          }
        }
        return ''
      // case 'company_registration_number':
      //   // Only validate if company is registered
      //   if (contactInfo && !contactInfo.is_registered_company) return ''
      //   return !value.trim() ? getValidationMessage('required', locale) : ''
      // case 'vat_number':
      //   // Only validate if VAT registered
      //   if (contactInfo && !contactInfo.is_vat_registered) return ''
      //   return !value.trim() ? getValidationMessage('required', locale) : ''
      default:
        return ''
    }
  }

  // Handle undefined or null
  if (value === undefined || value === null) {
    return getValidationMessage('required', locale)
  }

  return ''
}

/**
 * Validate the "How did you hear about us?" field
 */
// export const validateHowDidYouHear = (
//   howDidYouHear: string,
//   howDidYouHearOther: string,
//   locale: Locale = 'en'
// ): { [key: string]: string } => {
//   const errors: { [key: string]: string } = {}

//   if (!howDidYouHear) {
//     errors.how_did_you_hear = getValidationMessage('required', locale)
//   }

//   if (howDidYouHear === "other" && !howDidYouHearOther) {
//     errors.how_did_you_hear_other = getValidationMessage('required', locale)
//   }

//   return errors
// }

/**
 * Validate the entire form
 */
export const validateForm = (
  formData: { 
    privacyConsent: boolean, 
    contact_info: ContactInfo,
    finance_details?: FinanceDetails,
    // how_did_you_hear?: string,
    // how_did_you_hear_other?: string,
    newsletter_subscription?: boolean
  },
  locale: Locale = 'en'
): Record<string, string> => {
  const errors: Record<string, string> = {}
  const fields = [
    'first_name',
    'last_name',
    'company_name',
    'email',
    'phone',
    'company_registration_number',
    'vat_number'
  ]

  // Validate STSL account number if finance_details exists
  if (formData.finance_details && !formData.finance_details.stsl_account_number) {
    errors.stsl_account_number = getValidationMessage('required', locale);
  }

  // Validate privacy consent
  if (!formData.privacyConsent) {
    errors.privacyConsent = getValidationMessage('required', locale)
  }

  // // Validate how did you hear about us
  // const howDidYouHearErrors = validateHowDidYouHear(
  //   // formData.how_did_you_hear || "",
  //   // formData.how_did_you_hear_other || "",
  //   locale
  // )
  // Object.assign(errors, howDidYouHearErrors)

  // Validate main fields
  fields.forEach(field => {
    // Skip validation for conditional fields if their conditions are not met
    if (field === 'company_registration_number' || field === 'vat_number') return;
    
    const error = validateField(field, formData.contact_info[field as keyof ContactInfo], formData.contact_info, locale)
    if (error) errors[field] = error
  })

  // Validate address fields
  const addressFields = ['street_1', 'city', 'state', 'postal_code', 'country'] as const
  addressFields.forEach(field => {
    const value = formData.contact_info.address[field]
    const error = validateField(field, value, undefined, locale)
    if (error) errors[field] = error
  })
  
  // // Validate finance fields if they exist
  // if (formData.finance_details) {
  //   if (formData.finance_details.finance_phone) {
  //     const error = validateField('finance_phone', formData.finance_details.finance_phone, undefined, locale, formData.finance_details)
  //     if (error) errors.finance_phone = error
  //   }
    
  //   if (formData.finance_details.finance_email) {
  //     const error = validateField('email', formData.finance_details.finance_email, undefined, locale)
  //     if (error) errors.finance_email = error
  //   }
  // }

  return errors
}
