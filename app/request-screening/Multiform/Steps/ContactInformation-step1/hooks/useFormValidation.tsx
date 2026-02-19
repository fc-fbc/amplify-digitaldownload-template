import { useState, ChangeEvent, useEffect } from 'react'
import { FormData, ContactInfo, FinanceDetails } from '@/lib/types'
import { validateField, validateForm, getValidationMessage } from '../utils/validators'
import { useFormContext } from '../../../context/FormContext'
import { useTranslation } from '@/lib/hooks/useTranslation'

type ErrorType = {
  [key in keyof FormData]?: string;
} & {
  [key in keyof ContactInfo]?: string;
} & {
  [key in keyof FinanceDetails]?: string;
} & {
  street_1?: string;
  street_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  submit?: string;
  [key: string]: string | undefined;
}

export const useFormValidation = () => {
  const { formData: contextFormData, updateFormData } = useFormContext();
  const { locale } = useTranslation();
  
  const [localFormData, setLocalFormData] = useState<FormData>(contextFormData);
  const [errors, setErrors] = useState<ErrorType>({});
  const [hasInteractedWithPhone, setHasInteractedWithPhone] = useState(false);

  // Keep local form data in sync with context - one-way data flow
  useEffect(() => {
    setLocalFormData(contextFormData);
  }, [contextFormData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let updatedData: FormData;
    
    if (name === 'stsl_account_number' || name === 'stsl_user_name' || name === 'finance_email' || name === 'finance_phone') {
      // Initialize finance_details if it doesn't exist
      const finance_details = localFormData.finance_details || {};

      updatedData = {
        ...localFormData,
        finance_details: {
          ...finance_details,
          [name]: value
        }
      };

      // Validate required finance fields
      if (name === 'stsl_account_number') {
        if (!value.trim()) {
          setErrors((prev) => ({ ...prev, stsl_account_number: getValidationMessage('required', locale) }))
        } else {
          setErrors((prev) => ({ ...prev, stsl_account_number: "" }))
        }
      } else {
        // No validation needed for other finance fields as they are optional (including stsl_user_name)
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }

      // Log for debugging
      console.log(`Updated finance_details (${name}):`, updatedData.finance_details);
    } else if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      updatedData = {
        ...localFormData,
        contact_info: {
          ...localFormData.contact_info,
          address: {
            ...localFormData.contact_info.address,
            [addressField]: value
          }
        }
      };
      // Validate address field immediately
      const error = validateField(addressField, value, undefined, locale)
      setErrors((prev) => ({ ...prev, [addressField]: error }))
    } else if (name === 'privacyConsent') {
      const newValue = value === 'true'
      updatedData = {
        ...localFormData,
        privacyConsent: newValue
      };
      setErrors((prev) => ({ 
        ...prev, 
        privacyConsent: !newValue ? validateField('privacyConsent', newValue, undefined, locale) : "" 
      }))
    // } else if (name === 'how_did_you_hear_other') {
    //   // Handle how_did_you_hear_other field
    //   updatedData = {
    //     ...localFormData,
    //     how_did_you_hear_other: value
    //   };
      // Clear error when typing
      setErrors((prev) => ({ ...prev, how_did_you_hear_other: "" }))
    } else {
      // Handle other contact_info fields
      updatedData = {
        ...localFormData,
        contact_info: {
          ...localFormData.contact_info,
          [name]: value
        }
      };
      // Validate field immediately
      const error = validateField(name, value, localFormData.contact_info, locale)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
  }

  const handleRadioChange = (name: string, value: any) => {
    let updatedData: FormData;
    
    if (name === "privacyConsent") {
      updatedData = {
        ...localFormData,
        privacyConsent: value
      };
    } else {
      updatedData = {
        ...localFormData,
        contact_info: {
          ...localFormData.contact_info,
          [name]: value
        }
      };
    }
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    let updatedData: FormData;
    
    if (name === "privacyConsent") {
      updatedData = {
        ...localFormData,
        privacyConsent: checked
      };
      setErrors(prev => ({ ...prev, privacyConsent: "" }))
    } else if (name === "newsletter_subscription") {
      updatedData = {
        ...localFormData,
        newsletter_subscription: checked
      };
      setErrors(prev => ({ ...prev, newsletter_subscription: "" }))
    } else {
      updatedData = {
        ...localFormData,
        contact_info: {
          ...localFormData.contact_info,
          [name]: checked
        }
      };
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
  }

  const handlePhoneChange = (phone: string) => {
    const updatedData = {
      ...localFormData,
      contact_info: {
        ...localFormData.contact_info,
        phone
      }
    };
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
    
    // Clear any existing error while the user is typing
    // This prevents error messages from appearing during typing
    setErrors((prev) => ({ ...prev, phone: "" }))
  }

  const handleFinancePhoneChange = (phone: string) => {
    // Initialize finance_details if it doesn't exist
    const finance_details = localFormData.finance_details || {};
    
    const updatedData = {
      ...localFormData,
      finance_details: {
        ...finance_details,
        finance_phone: phone
      }
    };
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
    
    // No validation needed for finance fields as they are optional
    setErrors((prev) => ({ ...prev, finance_phone: "" }))
    
    // Log for debugging
    console.log("Updated finance_details (phone):", updatedData.finance_details);
  }

const setPhoneInteraction = () => {
  // Only set the interaction flag but don't validate immediately
  // This prevents error messages from appearing as soon as the user focuses on the field
  setHasInteractedWithPhone(true)
}

  const validateFormData = () => {
    const newErrors = validateForm(localFormData, locale)
    setErrors(newErrors)
    
    // Check if there are any errors
    const isValid = Object.keys(newErrors).length === 0
    
    // If the form is invalid, scroll to the first error
    if (!isValid) {
      // Use setTimeout to ensure the DOM has updated with error messages
      setTimeout(() => {
        const firstErrorField = Object.keys(newErrors).find(key => newErrors[key])
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField)
          if (element) {
            // Scroll to the element without focusing it
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            })
          }
        }
      }, 100)
    }
    
    return isValid
  }

  // Keep this function for manual focusing if needed
  const focusFirstError = () => {
    const firstErrorField = Object.keys(errors).find(key => errors[key])
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.focus()
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  return {
    formData: localFormData,
    errors,
    handleInputChange,
    handleRadioChange,
    handleCheckboxChange,
    handlePhoneChange,
    handleFinancePhoneChange,
    setPhoneInteraction,
    validateFormData,
    focusFirstError,
    hasInteractedWithPhone
  }
}
