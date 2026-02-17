"use client"

import { useState, ChangeEvent, useEffect } from "react"
import { FormData, ScreeningDetails } from "@/lib/types"
import { validateScreeningDetails } from "../utils/validators"
import { useFormContext } from "../../../context/FormContext"
import { useTranslation } from "@/lib/hooks/useTranslation"

type ErrorType = Record<string, string>

export const useFormValidation = () => {
  const { formData: contextFormData, updateFormData } = useFormContext();
  const { t } = useTranslation();
  
  const [localFormData, setLocalFormData] = useState<FormData>(contextFormData);
  const [errors, setErrors] = useState<ErrorType>({});
  // Initialize useSameAddress by comparing the addresses
  const [useSameAddress, setUseSameAddress] = useState<boolean>(() => {
    // Check if screening_details and screening_address exist
    if (!contextFormData.screening_details?.screening_address) return false;
    
    const screeningAddress = contextFormData.screening_details.screening_address;
    const contactAddress = contextFormData.contact_info.address;
    
    // Compare the addresses
    return (
      screeningAddress.street_1 === contactAddress.street_1 &&
      screeningAddress.street_2 === contactAddress.street_2 &&
      screeningAddress.city === contactAddress.city &&
      screeningAddress.state === contactAddress.state &&
      screeningAddress.postal_code === contactAddress.postal_code &&
      screeningAddress.country === contactAddress.country
    );
  });

  // Keep local form data in sync with context - one-way data flow
  useEffect(() => {
    setLocalFormData(contextFormData);
  }, [contextFormData]);
  
  // Track previous useSameAddress value to detect changes
  const [prevUseSameAddress, setPrevUseSameAddress] = useState(useSameAddress);
  
  // When useSameAddress changes from false to true, update the screening address
  useEffect(() => {
    // Only run when useSameAddress changes from false to true
    if (useSameAddress && !prevUseSameAddress) {
      // Copy the address from contact_info to screening_details
      const updatedData = {
        ...localFormData,
        screening_details: {
          ...localFormData.screening_details!,
          screening_address: {
            ...localFormData.contact_info.address
          }
        }
      };
      
      // Update both local state and context
      setLocalFormData(updatedData);
      updateFormData(updatedData);
      
      // Clear any address-related errors
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.street_1;
        delete newErrors.city;
        delete newErrors.state;
        delete newErrors.postal_code;
        delete newErrors.country;
        return newErrors;
      });
    }
    
    // Update previous value
    setPrevUseSameAddress(useSameAddress);
  }, [
    useSameAddress, 
    prevUseSameAddress, 
    localFormData.contact_info.address, 
    localFormData.screening_details, 
    updateFormData
  ]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let updatedData: FormData;
    
    if (name.startsWith('screening_address.')) {
      const addressField = name.split('.')[1]
      updatedData = {
        ...localFormData,
        screening_details: {
          ...localFormData.screening_details!,
          screening_address: {
            ...localFormData.screening_details!.screening_address,
            [addressField]: value
          }
        }
      };
    } else if (name.startsWith('screen_size.')) {
      const sizeField = name.split('.')[1]
      updatedData = {
        ...localFormData,
        screening_details: {
          ...localFormData.screening_details!,
          screen_size: {
            ...localFormData.screening_details!.screen_size,
            [sizeField]: parseFloat(value) || 0
          }
        }
      };
    } else {
      updatedData = {
        ...localFormData,
        screening_details: {
          ...localFormData.screening_details!,
          [name]: value
        }
      };
    }
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
    setErrors((prev) => ({ ...prev, [name.split('.').pop()!]: "" }))
  }

  const setScreeningType = (value: string) => {
    const updatedData = {
      ...localFormData,
      screening_details: {
        ...localFormData.screening_details!,
        screening_type: value
      }
    };
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
    setErrors((prev) => ({ ...prev, screening_type: "" }))
  }

  const setFormat = (value: string) => {
    const updatedData = {
      ...localFormData,
      screening_details: {
        ...localFormData.screening_details!,
        format: value
      }
    };
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
    setErrors((prev) => ({ ...prev, format: "" }))
  }

  const setDcpCapability = (value: boolean) => {
    const updatedData = {
      ...localFormData,
      screening_details: {
        ...localFormData.screening_details!,
        dcp_35mm_capability: value
      }
    };
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
  }

  const setHasWebsite = (value: boolean) => {
    console.log("Setting has_website to:", value);
    const updatedData = {
      ...localFormData,
      screening_details: {
        ...localFormData.screening_details!,
        has_website: value
      }
    };
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
    setErrors((prev) => ({ ...prev, has_website: "" }));
  }

  const setTheatricalRelease = (value: boolean) => {
    const updatedData = {
      ...localFormData,
      screening_details: {
        ...localFormData.screening_details!,
        theatrical_release: value
      }
    };
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
  }

  const validateForm = (): boolean => {
    const validationErrors = validateScreeningDetails(localFormData.screening_details, t, useSameAddress)
    setErrors(validationErrors)
    
    // Check if there are any errors
    const isValid = Object.keys(validationErrors).length === 0
    
    // If the form is invalid, scroll to the first error
    if (!isValid) {
      // Use setTimeout to ensure the DOM has updated with error messages
      setTimeout(() => {
        // Common field IDs in this form
        const fieldIds = [
          'screening_type',
          'venue_name',
          'format',
          'street_1',
          'city',
          'state',
          'postal_code',
          'country',
          'website_url',
          'screen_width',
          'screen_height'
        ]
        
        // Find the first field with an error
        for (const fieldId of fieldIds) {
          if (validationErrors[fieldId]) {
            const element = document.getElementById(fieldId)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              return
            }
          }
        }
        
        // If we couldn't find a specific error element, try to scroll to the form itself
        const formElement = document.getElementById('venue-information-form')
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
    
    return isValid
  }

  return {
    formData: localFormData,
    errors,
    handleInputChange,
    setScreeningType,
    setFormat,
    setDcpCapability,
    setHasWebsite,
    setTheatricalRelease,
    validateForm,
    useSameAddress,
    setUseSameAddress
  }
}

export default useFormValidation
