import { FormData } from "@/lib/types"
import { translations, Locale } from "@/lib/translations"

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

// Constants for validation
export const MAX_CAPACITY = 1000000; // 1 million as reasonable max capacity
export const MAX_TEXT_LENGTH = 300; // Maximum length for text fields
export const MAX_SUMMARY_LENGTH = 2000; // Maximum length for summary fields
export const MAX_COMMUNICATION_LENGTH = 500; // Maximum length for communication responsible field
export const MAX_PARTIES = 15; // Maximum number of involved parties allowed

export const validateCapacity = (
  maxLegalCapacity: number | undefined,
  // expectedAudience: number | undefined,
  locale: Locale = 'en'
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!maxLegalCapacity) {
    errors.max_legal_capacity = getValidationMessage('required', locale)
  } else if (isNaN(maxLegalCapacity) || !isFinite(maxLegalCapacity)) {
    errors.max_legal_capacity = getValidationMessage('invalid', locale)
  } else if (maxLegalCapacity <= 0) {
    errors.max_legal_capacity = getValidationMessage('positive', locale)
  } else if (maxLegalCapacity > MAX_CAPACITY) {
    errors.max_legal_capacity = getValidationMessage('max', locale, { max: MAX_CAPACITY })
  }
  
  // if (!expectedAudience) {
  //   errors.expected_audience = getValidationMessage('required', locale)
  // } else if (isNaN(expectedAudience) || !isFinite(expectedAudience)) {
  //   errors.expected_audience = getValidationMessage('invalid', locale)
  // } else if (expectedAudience <= 0) {
  //   errors.expected_audience = getValidationMessage('positive', locale)
  // } else if (expectedAudience > MAX_CAPACITY) {
  //   errors.expected_audience = getValidationMessage('max', locale, { max: MAX_CAPACITY })
  // } else if (maxLegalCapacity && expectedAudience > maxLegalCapacity) {
  //   errors.expected_audience = getValidationMessage('max', locale, { max: maxLegalCapacity })
  // }

  return errors
}

export const validatePromotion = (
  isPromoted: boolean | undefined,
  promotionMethods: string[],
  communicationResponsible: string,
  thirdPartyAdvertising: boolean,
  involvedParties: string[],
  locale: Locale = 'en'
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (isPromoted === undefined) {
    errors.is_promoted = getValidationMessage('required', locale)
  }

  if (isPromoted) {
    if (promotionMethods.length === 0) {
      errors.promotion_methods = getValidationMessage('required', locale)
    }
    
    if (!communicationResponsible) {
      errors.communication_responsible = getValidationMessage('required', locale)
    } else if (communicationResponsible.length > MAX_COMMUNICATION_LENGTH) {
      errors.communication_responsible = getValidationMessage('maxLength', locale, { max: MAX_COMMUNICATION_LENGTH })
    }
    
    if (thirdPartyAdvertising && (!involvedParties || involvedParties.length === 0)) {
      errors.involved_parties = getValidationMessage('required', locale)
    } else if (involvedParties && involvedParties.some(party => party.length > MAX_TEXT_LENGTH)) {
      errors.involved_parties = getValidationMessage('maxLength', locale, { max: MAX_TEXT_LENGTH })
    } else if (involvedParties && involvedParties.length > MAX_PARTIES) {
      errors.max_parties_exceeded = getValidationMessage('maxPartiesExceeded', locale, { max: MAX_PARTIES })
    }
  
  }

  return errors
}

export const validateEventSummary = (
  summary: string,
  hasBrandActivities: boolean | undefined,
  relatedBrandActivities: string,
  locale: Locale = 'en'
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!summary) {
    errors.summary = getValidationMessage('required', locale)
  } else if (summary.length > MAX_SUMMARY_LENGTH) {
    errors.summary = getValidationMessage('maxLength', locale, { max: MAX_SUMMARY_LENGTH })
  }
  
  if (hasBrandActivities === undefined) {
    errors.has_brand_activities = getValidationMessage('required', locale)
  }
  
  if (hasBrandActivities && !relatedBrandActivities) {
    errors.related_brand_activities = getValidationMessage('required', locale)
  } else if (hasBrandActivities && relatedBrandActivities && relatedBrandActivities.length > MAX_SUMMARY_LENGTH) {
    errors.related_brand_activities = getValidationMessage('maxLength', locale, { max: MAX_SUMMARY_LENGTH })
  }

  return errors
}

export const validateInteractiveElements = (
  fullLengthFilm: boolean | undefined,
  audienceParticipation: boolean | undefined,
  livePerformance: boolean | undefined,
  hasTheme: boolean | undefined,
  specialEffects: boolean | undefined,
  characterLikness: boolean | undefined,
  locale: Locale = 'en'
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (fullLengthFilm === undefined) {
    errors.full_length_film = getValidationMessage('required', locale)
  }
  
  if (audienceParticipation === undefined) {
    errors.audience_participation = getValidationMessage('required', locale)
  }
  
  if (livePerformance === undefined) {
    errors.live_performance = getValidationMessage('required', locale)
  }
  
  if (hasTheme === undefined) {
    errors.has_theme = getValidationMessage('required', locale)
  }

  if (hasTheme === undefined) {
    errors.has_theme = getValidationMessage('required', locale)
  }
  return errors

  if (specialEffects === undefined) {
    errors.special_effects = getValidationMessage('required', locale)
  }
  return errors

  if (characterLikness === undefined) {
    errors.character_likness = getValidationMessage('required', locale)
  }

  return errors
}

export const validateStep4 = (formData: FormData, locale: Locale = 'en'): { [key: string]: string } => {
  const capacityErrors = validateCapacity(
    formData.capacity?.max_legal_capacity,
    locale
  )

  const promotionErrors = validatePromotion(
    formData.promotion?.is_promoted,
    formData.promotion?.promotion_methods || [],
    formData.promotion?.communication_responsible || "",
    formData.promotion?.third_party_advertising || false,
    formData.event_summary?.involved_parties || [],
    locale
  )

  const eventSummaryErrors = validateEventSummary(
    formData.event_summary?.summary || "",
    formData.event_summary?.has_brand_activities,
    formData.event_summary?.related_brand_activities || "",
    locale
  )

  const interactiveElementsErrors = validateInteractiveElements(
    formData.interactive_elements?.full_length_film,
    formData.interactive_elements?.audience_participation,
    formData.interactive_elements?.live_performance,
    formData.interactive_elements?.has_theme,
    formData.interactive_elements?.special_effects,
    formData.interactive_elements?.character_likness,
    locale
  )

  return {
    ...capacityErrors,
    ...promotionErrors,
    ...eventSummaryErrors,
    ...interactiveElementsErrors
  }
}
