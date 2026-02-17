import { useState, useEffect } from "react"
import { FormData } from "@/lib/types"
import { validateStep4, MAX_PARTIES } from "../utils/validators"
import { useFormContext } from "../../../context/FormContext"
import { useTranslation } from "@/lib/hooks/useTranslation"

export const useFormValidation = () => {
  const { t, locale } = useTranslation();
  const { formData: contextFormData, updateFormData, nextStep, prevStep } = useFormContext();
  
  const [localFormData, setLocalFormData] = useState<FormData>(contextFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newParty, setNewParty] = useState("");
  
  // Use translated promotion methods
  const promotionMethods = [
    t('form.capacityAndEvent.promotionSocialMedia'),
    t('form.capacityAndEvent.promotionNewsletter'),
    t('form.capacityAndEvent.promotionWebsite'),
    t('form.capacityAndEvent.promotionPrint'),
    t('form.capacityAndEvent.promotionRadio'),
    t('form.capacityAndEvent.promotionTV')
  ];

  // Keep local form data in sync with context - one-way data flow
  useEffect(() => {
    setLocalFormData(contextFormData);
  }, [contextFormData]);

  // Helper function to update both local state and context
  const updateLocalAndContextData = (newData: FormData) => {
    setLocalFormData(newData);
    updateFormData(newData);
  };


  const handlePromotionMethodChange = (method: string, checked: boolean) => {
    const updatedData = {
      ...localFormData,
      promotion: {
        ...localFormData.promotion!,
        promotion_methods: checked
          ? [...localFormData.promotion!.promotion_methods, method]
          : localFormData.promotion!.promotion_methods.filter(m => m !== method)
      }
    };
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
  }

  const handleAddParty = () => {
    const trimmedParty = newParty.trim();
    
    // Check if we've reached the maximum number of parties and the party name is not empty
    if (trimmedParty && (localFormData.event_summary?.involved_parties?.length || 0) < MAX_PARTIES) {
      // Check if the party already exists (case insensitive)
      const partyExists = localFormData.event_summary?.involved_parties?.some(
        existingParty => existingParty.toLowerCase() === trimmedParty.toLowerCase()
      );
      
      if (partyExists) {
        // Set error message for duplicate party
        setErrors(prev => ({
          ...prev,
          party_exists: t('validation.partyExists', { party: trimmedParty })
        }));
      } else {
        // Add the party if it doesn't exist and we haven't reached the limit
        const updatedData = {
          ...localFormData,
          event_summary: {
            ...localFormData.event_summary!,
            involved_parties: [...(localFormData.event_summary?.involved_parties || []), trimmedParty],
            related_brand_activities: localFormData.event_summary?.related_brand_activities || ""
          }
        };
        
        // Update both local state and context
        setLocalFormData(updatedData);
        updateFormData(updatedData);
        
        // Clear any max parties exceeded error
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.max_parties_exceeded;
          delete newErrors.party_exists; // Also clear any duplicate party error
          return newErrors;
        });
      }
      
      // Clear the input field regardless of whether the party was added
      setNewParty("");
    }
  }

  const handleRemoveParty = (party: string) => {
    const updatedData = {
      ...localFormData,
      event_summary: {
        ...localFormData.event_summary!,
        involved_parties: localFormData.event_summary!.involved_parties.filter(p => p !== party),
        related_brand_activities: localFormData.event_summary!.related_brand_activities
      }
    };
    
    // Update both local state and context
    setLocalFormData(updatedData);
    updateFormData(updatedData);
    
    // Clear errors when a party is removed
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.max_parties_exceeded;
      delete newErrors.party_exists;
      return newErrors;
    });
  }

  const validateForm = () => {
    const newErrors = validateStep4(localFormData, locale);
    setErrors(newErrors);
    
    // Check if there are any errors
    const isValid = Object.keys(newErrors).length === 0;
    
    // If the form is invalid, scroll to the first error
    if (!isValid) {
      // Use setTimeout to ensure the DOM has updated with error messages
      setTimeout(() => {
        // Map of error keys to their corresponding HTML element IDs
        const errorToElementMap: Record<string, string> = {
          // Capacity section
          'max_legal_capacity': 'max_legal_capacity',
          'expected_audience': 'expected_audience',
          
          // Promotion section
          'is_promoted': 'is_promoted',
          'promotion_methods': 'promotion_methods', // Updated ID
          'communication_responsible': 'communication_responsible',
          'third_party_advertising': 'third-party', // Updated ID
          'involved_parties': 'involved_parties',
          'max_parties_exceeded': 'involved_parties',
          'party_exists': 'new_party',
          
          // Event summary section
          'summary': 'summary',
          'has_brand_activities': 'has_brand_activities',
          'related_brand_activities': 'related_brand_activities',
          
          // Interactive elements section
          'full_length_film': 'full_length_film',
          'audience_participation': 'audience_participation',
          'live_performance': 'live_performance',
          'has_theme': 'has_theme',
          'special_effects': 'special_effects',
          'character_likness': 'character_likness',
          
          // Feedback section
          'feedback_collection': 'feedback_collection',
          
          // Confirmation section
          'confirmation_statements': 'confirmation_statements'
        };
        
        // Find the first field with an error
        for (const [errorKey, elementId] of Object.entries(errorToElementMap)) {
          if (newErrors[errorKey]) {
            const element = document.getElementById(elementId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              return;
            }
          }
        }
        
        // If we couldn't find a specific error element, try to scroll to the form itself
        const formElement = document.getElementById('event-details-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    
    return isValid;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await nextStep();
    }
  }

  return {
    localFormData,
    setLocalFormData,
    errors,
    setErrors,
    newParty,
    setNewParty,
    promotionMethods,
    handlePromotionMethodChange,
    handleAddParty,
    handleRemoveParty,
    validateForm,
    handleSubmit,
    prevStep,
    updateLocalAndContextData
  }
}
