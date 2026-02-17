"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback, useRef } from "react";
import { FormData } from "@/lib/types";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import type { Schema } from "../../../../amplify/data/resource";
import outputs from "../../../../amplify_outputs.json";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { secureGet, secureSet, initSecureStorage, clearSecureStorage } from "@/lib/utils/secureStorage";
import { MAX_CAPACITY, MAX_TEXT_LENGTH, MAX_SUMMARY_LENGTH } from "../Steps/EventDetails-step4/utils/validators";
import { translations } from "@/lib/translations";

// Configure Amplify once
Amplify.configure(outputs);
// Create client once outside component
const client = generateClient<Schema>();

/**
 * Get a nested value from an object using dot notation
 * Memoized to avoid recalculating the same paths
 */
const getNestedValueCache = new Map<string, any>();
function getNestedValue(obj: any, path: string): any {
  const cacheKey = `${JSON.stringify(obj)}_${path}`;
  if (getNestedValueCache.has(cacheKey)) {
    return getNestedValueCache.get(cacheKey);
  }
  
  const keys = path.split('.');
  const result = keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
  getNestedValueCache.set(cacheKey, result);
  return result;
}

interface FormContextType {
  formData: FormData;
  currentStep: number;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: (data?: Partial<FormData>) => Promise<void>;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetForm: () => void;
  submissionResult: any;
  setSubmissionResult: (result: any) => void;
  isSubmitting: boolean;
  isTransitioning: boolean;
}

// Complete initial form data with all possible fields - defined outside component to avoid recreation
const INITIAL_FORM_DATA: FormData = {
  startTime: new Date(),
  privacyConsent: false,
  
  // Contact Information
  contact_info: {
    first_name: "",
    last_name: "",
    company_name: "",
    // is_registered_company: false,
    // company_registration_number: "",
    // is_vat_registered: false,
    // vat_number: "",
    address: {
      street_1: "",
      street_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: ""
    },
    email: "",
    phone: ""
  },
  
  // Finance Information
  finance_details: {
    // finance_phone: "",
    // finance_email: "",
    stsl_account_number: ""
  },
  
  // Screening Details
  screening_details: {
    screening_type: "",
    screening_address: {
      street_1: "",
      street_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: ""
    },
    // venue: "",
    has_website: undefined,
    event_website: "",
    format: "",
    dcp_35mm_capability: false,
    theatrical_release: false,
    screen_size: {
      width_m: 0,
      height_m: 0
    }
  },
  
  // Capacity
  capacity: {
    max_legal_capacity: 0,
    // expected_audience: 0
  },
  
  // Promotion
  promotion: {
    is_promoted: false,
    promotion_methods: [],
    communication_responsible: "",
    third_party_advertising: false
  },
  
  // Event Summary
  event_summary: {
    summary: "",
    has_brand_activities: false,
    related_brand_activities: "",
    involved_parties: []
  },
  
  // Interactive Elements
  interactive_elements: {
    full_length_film: true,
    audience_participation: false,
    live_performance: false,
    has_theme: false,
    special_effects: false,
    character_likness: false
  },
  
  // Film Screenings
  film_screenings: {
    charging_tickets: true,
    screenings_list: [{
      title: "",
      year_of_release: 0,
      studios: [],
      screenings: [{
        screening_date: "",
        screening_guid: "",
        number_of_screenings: 1,
        box_office_return: false,
        approved: false,
        ticket_info: [{
          ticket_type: "",
          ticket_price: 0,
          tickets_sold: 0
        }],
        format: ""
      }],
      iva_id: undefined,
      poster_path: undefined,
      media_type: undefined
    }]
  },
  
  // Additional Information
  // how_did_you_hear: "",
  // how_did_you_hear_other: "",
  newsletter_subscription: false
};

const FormContext = createContext<FormContextType | undefined>(undefined);

// Helper function to generate UUID only on client side
const generateUUID = () => {
  return typeof window !== 'undefined' ? window.crypto.randomUUID() : '';
};

// Helper function to merge form data with initial data
const mergeWithInitialData = (savedData: any): FormData => {
  if (!savedData) return {...INITIAL_FORM_DATA, startTime: new Date()};
  
  // Fix any empty screening_guids in the saved data
  if (savedData.film_screenings?.screenings_list) {
    savedData.film_screenings.screenings_list = savedData.film_screenings.screenings_list.map((film: any) => ({
      ...film,
      screenings: film.screenings.map((screening: any) => ({
        ...screening,
        screening_guid: screening.screening_guid || generateUUID()
      }))
    }));
  }

  // Deep merge the saved data with the initial data
  return {
    ...INITIAL_FORM_DATA,
    ...savedData,
    // Ensure these objects are properly merged
    contact_info: { ...INITIAL_FORM_DATA.contact_info, ...savedData.contact_info },
    finance_details: { ...INITIAL_FORM_DATA.finance_details, ...savedData.finance_details },
    screening_details: { ...INITIAL_FORM_DATA.screening_details, ...savedData.screening_details },
    capacity: { ...INITIAL_FORM_DATA.capacity, ...savedData.capacity },
    promotion: { ...INITIAL_FORM_DATA.promotion, ...savedData.promotion },
    event_summary: { ...INITIAL_FORM_DATA.event_summary, ...savedData.event_summary },
    interactive_elements: { ...INITIAL_FORM_DATA.interactive_elements, ...savedData.interactive_elements },
    // Special handling for film_screenings
    film_screenings: {
      charging_tickets: savedData.film_screenings?.charging_tickets ?? true,
      screenings_list: savedData.film_screenings?.screenings_list ?? INITIAL_FORM_DATA.film_screenings?.screenings_list ?? []
    },
    // Ensure startTime is always a proper Date object
    startTime: savedData.startTime ? 
      (savedData.startTime instanceof Date ? savedData.startTime : new Date(savedData.startTime)) : 
      new Date()
  };
};

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get translation function
  const { t } = useTranslation();
  
  // State management with complete form data structure - initialize directly from localStorage
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window === 'undefined') return {...INITIAL_FORM_DATA};
    
    try {
      const savedData = secureGet('formData');
      return mergeWithInitialData(savedData);
    } catch (error) {
      console.error('Error loading saved form data:', error);
      return {...INITIAL_FORM_DATA, startTime: new Date()};
    }
  });
  
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window === 'undefined') return 1;
    const savedStep = secureGet('currentStep');
    return savedStep ? parseInt(savedStep) : 1;
  });
  
  const [submissionResult, setSubmissionResult] = useState<any>(() => {
    if (typeof window === 'undefined') return undefined;
    return secureGet('submissionResult');
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track if we're on the confirmation step
  const isOnConfirmationStep = currentStep === 6;
  
  // Reference to track if we've added the beforeunload event listener
  const beforeUnloadListenerRef = useRef<((e: BeforeUnloadEvent) => void) | null>(null);
  
  // Initialize secure storage and load saved data on mount
  useEffect(() => {
    // Initialize secure storage with timeout and activity tracking
    if (typeof window !== 'undefined') {
      initSecureStorage();
      
      // Listen for secure storage timeout events
      const handleTimeout = () => {
        // Reset form to initial state
        const freshFormData = {
          ...INITIAL_FORM_DATA,
          startTime: new Date()
        };
        setFormData(freshFormData);
        setCurrentStep(1);
        setSubmissionResult(undefined);
      };
      
      window.addEventListener('secureStorageTimeout', handleTimeout as EventListener);
      
      // Always reset the form to initial state on page load
      const freshFormData = {
        ...INITIAL_FORM_DATA,
        startTime: new Date()
      };
      setFormData(freshFormData);
      setCurrentStep(1);
      setSubmissionResult(undefined);
      
      return () => {
        window.removeEventListener('secureStorageTimeout', handleTimeout as EventListener);
      };
    }
  }, []);
  
  // Add beforeunload event listener for all steps
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create the handler function
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        // Standard way to show a confirmation dialog before leaving
        const confirmationMessage = 'You have unsaved changes. If you leave, your progress will be lost.';
        
        // Clear all form data when the user confirms leaving
        // This will be executed after the user confirms the dialog
        setTimeout(() => {
          // Only clear if we're actually navigating away (not on refresh)
          if (document.visibilityState === 'hidden') {
            clearSecureStorage(['locale', 'lastActivityTimestamp', 'formLastAccessed']);
          }
        }, 0);
        
        e.preventDefault();
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      };
      
      // Store reference to the handler
      beforeUnloadListenerRef.current = handleBeforeUnload;
      
      // Add the event listener
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Also listen for visibility change to detect when the page is hidden
      // This is more reliable for detecting actual navigation away
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          // Clear form data when the page is hidden (user navigated away)
          clearSecureStorage(['locale', 'lastActivityTimestamp', 'formLastAccessed']);
        }
      };
      
      // Add visibility change listener
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Cleanup function
      return () => {
        if (beforeUnloadListenerRef.current) {
          window.removeEventListener('beforeunload', beforeUnloadListenerRef.current);
          beforeUnloadListenerRef.current = null;
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  // Save to secure storage when formData changes - throttled to reduce writes
  useEffect(() => {
    // Use a more aggressive throttle for form data saves
    const timeoutId = setTimeout(() => {
      secureSet('formData', formData);
    }, 1000); // 1000ms throttle - more aggressive to reduce writes
    
    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Save to secure storage when currentStep changes
  useEffect(() => {
    secureSet('currentStep', currentStep);
  }, [currentStep]);

  // Save submission result to secure storage when it changes
  useEffect(() => {
    if (submissionResult) {
      secureSet('submissionResult', submissionResult);
    }
  }, [submissionResult]);

  // Optimized updateFormData function with batched updates
  const updateFormData = useCallback((data: Partial<FormData>) => {
    // Use a functional update to ensure we're working with the latest state
    setFormData(prev => {
      // Create a shallow copy of the previous state
      const newData = { ...prev };
      
      // Process each top-level key in the data object
      Object.keys(data).forEach(key => {
        const typedKey = key as keyof FormData;
        
        // Special handling for film_screenings
        if (typedKey === 'film_screenings') {
          const filmScreeningsData = data.film_screenings;
          if (filmScreeningsData) {
            newData.film_screenings = {
              charging_tickets: filmScreeningsData.charging_tickets ?? prev.film_screenings?.charging_tickets ?? true,
              screenings_list: filmScreeningsData.screenings_list ?? prev.film_screenings?.screenings_list ?? [{
                title: "",
                year_of_release: 0,
                studios: [],
                screenings: [{
                  screening_date: "",
                  screening_guid: generateUUID(),
                  number_of_screenings: 1,
                  box_office_return: false,
                  approved: false,
                  ticket_info: [{ ticket_type: "", ticket_price: 0, tickets_sold: 0 }],
                  format: ""
                }],
                iva_id: undefined,
                poster_path: undefined,
                media_type: undefined
              }]
            };
          }
        } 
        // Handle contact_info
        else if (typedKey === 'contact_info' && data.contact_info) {
          newData.contact_info = { 
            ...prev.contact_info, 
            ...data.contact_info 
          };
        }
        // Handle screening_details
        else if (typedKey === 'screening_details' && data.screening_details) {
          newData.screening_details = { 
            ...prev.screening_details, 
            ...data.screening_details 
          };
        }
        // Handle capacity
        else if (typedKey === 'capacity' && data.capacity) {
          newData.capacity = { 
            ...prev.capacity, 
            ...data.capacity 
          };
        }
        // Handle promotion
        else if (typedKey === 'promotion' && data.promotion) {
          newData.promotion = { 
            ...prev.promotion, 
            ...data.promotion 
          };
        }
        // Handle event_summary
        else if (typedKey === 'event_summary' && data.event_summary) {
          newData.event_summary = { 
            ...prev.event_summary, 
            ...data.event_summary 
          };
        }
        // Handle interactive_elements
        else if (typedKey === 'interactive_elements' && data.interactive_elements) {
          newData.interactive_elements = { 
            ...prev.interactive_elements, 
            ...data.interactive_elements 
          };
        }
        // Handle finance_details
        else if (typedKey === 'finance_details' && data.finance_details) {
          newData.finance_details = { 
            ...prev.finance_details, 
            ...data.finance_details 
          };
        }
        // Handle primitive values
        else if (
          typedKey === 'startTime' || 
          typedKey === 'privacyConsent' || 
          // typedKey === 'how_did_you_hear' || 
          // typedKey === 'how_did_you_hear_other' || 
          typedKey === 'newsletter_subscription'
        ) {
          (newData as any)[typedKey] = data[typedKey];
        }
      });
      
      return newData;
    });
  }, []);

  // Enhanced nextStep function that handles data processing and submission
  const nextStep = async (data?: Partial<FormData>) => {
    // Prevent multiple rapid calls during transition
    if (isTransitioning) {
      return;
    }
    
    setIsTransitioning(true);
    
    // Update form data if provided
    if (data) {
      updateFormData(data);
    }

    const newFormData = { ...formData, ...data };
    
    // Process data based on current step
    switch (currentStep) {
      case 1:
        // Step 1 completed - Contact Information
        setCurrentStep(currentStep + 1);
        break;
        
      case 2:
        // Step 2 completed - Screening Details
        setCurrentStep(currentStep + 1);
        break;
        
      case 3:
        // Step 3 completed - Event Details
        setCurrentStep(currentStep + 1);
        break;
        
      case 4:
        // Step 4 completed - Film Screenings
        setCurrentStep(currentStep + 1);
        break;
        
      case 5:
        try {
          setIsSubmitting(true);
          
          // Calculate form timing
          const endTime = new Date();
          // Ensure startTime is a proper Date object
          const startTime = newFormData.startTime instanceof Date ? 
            newFormData.startTime : 
            new Date(newFormData.startTime || Date.now());
          const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000) as number;

          // Validate and sanitize numeric fields
          const max_legal_capacity = typeof newFormData.capacity?.max_legal_capacity === 'string' 
            ? parseInt(newFormData.capacity.max_legal_capacity) 
            : (newFormData.capacity?.max_legal_capacity || 0);
            
          // const expected_audience = typeof newFormData.capacity?.expected_audience === 'string'
          //   ? parseInt(newFormData.capacity.expected_audience)
          //   : (newFormData.capacity?.expected_audience || 0);
            
          // Ensure values are within acceptable ranges
          const capacity = {
            max_legal_capacity: isNaN(max_legal_capacity) || !isFinite(max_legal_capacity) || max_legal_capacity <= 0 
              ? 0 
              : Math.min(max_legal_capacity, MAX_CAPACITY),
            // expected_audience: isNaN(expected_audience) || !isFinite(expected_audience) || expected_audience <= 0 
            //   ? 0 
            //   : Math.min(expected_audience, max_legal_capacity > 0 ? max_legal_capacity : MAX_CAPACITY)
          };
          
          // Helper function to sanitize text fields
          const sanitizeText = (text: string | undefined, maxLength: number): string => {
            if (!text) return '';
            return text.substring(0, maxLength);
          };

          // Ensure phone number is in E.164 format before submission
          const formattedPhone = newFormData.contact_info.phone.replace(/[^0-9+]/g, '');

          // Get the English country name for contact_info address
          let contactCountry = newFormData.contact_info.address.country || "";
          // Check if the country is one of our translated countries
          if (contactCountry === getNestedValue(translations.de, "form.contactInfo.countries.germany") ||
              contactCountry === getNestedValue(translations.de, "form.contactInfo.countries.austria") ||
              contactCountry === getNestedValue(translations.de, "form.contactInfo.countries.switzerland")) {
            // Convert to English
            if (contactCountry === getNestedValue(translations.de, "form.contactInfo.countries.germany")) {
              contactCountry = getNestedValue(translations.en, "form.contactInfo.countries.germany");
            } else if (contactCountry === getNestedValue(translations.de, "form.contactInfo.countries.austria")) {
              contactCountry = getNestedValue(translations.en, "form.contactInfo.countries.austria");
            } else if (contactCountry === getNestedValue(translations.de, "form.contactInfo.countries.switzerland")) {
              contactCountry = getNestedValue(translations.en, "form.contactInfo.countries.switzerland");
            }
          }

          // // Format finance phone number exactly like the regular phone number
          // const formattedFinancePhone = newFormData.finance_details?.finance_phone 
          //   ? newFormData.finance_details.finance_phone.replace(/[^0-9+]/g, '')
          //   : '';

          // Sanitize all text fields to prevent overflow
          const sanitizedContactInfo = {
            ...newFormData.contact_info,
            first_name: sanitizeText(newFormData.contact_info.first_name, MAX_TEXT_LENGTH),
            last_name: sanitizeText(newFormData.contact_info.last_name, MAX_TEXT_LENGTH),
            company_name: sanitizeText(newFormData.contact_info.company_name, MAX_TEXT_LENGTH),
            // company_registration_number: sanitizeText(newFormData.contact_info.company_registration_number, MAX_TEXT_LENGTH),
            // vat_number: sanitizeText(newFormData.contact_info.vat_number, MAX_TEXT_LENGTH),
            address: {
              street_1: sanitizeText(newFormData.contact_info.address.street_1, MAX_TEXT_LENGTH),
              street_2: sanitizeText(newFormData.contact_info.address.street_2, MAX_TEXT_LENGTH),
              city: sanitizeText(newFormData.contact_info.address.city, MAX_TEXT_LENGTH),
              state: sanitizeText(newFormData.contact_info.address.state, MAX_TEXT_LENGTH),
              postal_code: sanitizeText(newFormData.contact_info.address.postal_code, MAX_TEXT_LENGTH),
              country: sanitizeText(contactCountry, MAX_TEXT_LENGTH)
            },
            email: sanitizeText(newFormData.contact_info.email, MAX_TEXT_LENGTH),
            phone: formattedPhone
          };

          // Create a separate finance_info object for the finance details
          const sanitizedFinanceInfo = {
            // finance_phone: formattedFinancePhone,
            // finance_email: sanitizeText(newFormData.finance_details?.finance_email || '', MAX_TEXT_LENGTH),
            stsl_account_number: sanitizeText(newFormData.finance_details?.stsl_account_number || '', MAX_TEXT_LENGTH)
          };
          
          // Venue option keys that map to translation keys
          const venueOptionKeys = [
            "filmClubs", "mobileCinema", "schools", "artCentres", "council", "library", 
            "gallery", "restaurants", "hotel", "privateVenue", "park", "publicSquares", 
            "retail", "theatre", "corporate", "social", "worship", "charity", 
            "bookshop", "festivals", "outdoors", "other",
          ];

          // // Get the English translation for venue if it's a key
          // let venueValue = newFormData.screening_details?.venue || "";
          // if (venueValue.startsWith("Other - ")) {
          //   // Keep "Other - [custom value]" format
          //   venueValue = `Other - ${venueValue.substring(8)}`;
          // } else if (venueOptionKeys.includes(venueValue)) {
          //   // Convert key to English translation
          //   const englishTranslation = getNestedValue(translations.en, `form.venueTypes.${venueValue}`);
          //   if (typeof englishTranslation === 'string') {
          //     venueValue = englishTranslation;
          //   }
          // }
          
          // Ensure format is in English
          let formatValue = newFormData.screening_details?.format || "";
          if (formatValue === getNestedValue(translations.de, "form.screeningDetails.formatOwnCopy")) {
            formatValue = "user-owned copy";
          } else if (formatValue === getNestedValue(translations.de, "form.screeningDetails.rentACopy")) {
            formatValue = "rent a copy";
          } else if (formatValue === getNestedValue(translations.de, "form.screeningDetails.formatFBMDownload")) {
            formatValue = "filmbankmedia download";
          } else if (formatValue === getNestedValue(translations.de, "form.screeningDetails.vsr")) {
            formatValue = "virtual screening room";
          }

          // // Get the English translation for how_did_you_hear if it's a key
          // let howDidYouHearValue = newFormData.how_did_you_hear || "";
          // const howDidYouHearKeys = [
          //   "search", "social", "film-studio", "linkedin", "facebook", 
          //   "word-of-mouth", "prefer-not-to-say", "other"
          // ];
          
          // if (howDidYouHearKeys.includes(howDidYouHearValue)) {
          //   // Convert key to English translation
          //   const englishTranslation = getNestedValue(translations.en, `form.feedback.${howDidYouHearValue.replace(/-/g, '')}`);
          //   if (typeof englishTranslation === 'string') {
          //     howDidYouHearValue = englishTranslation;
          //   }
          // }

          // Process ticket types to convert keys to English translations
          if (newFormData.film_screenings?.screenings_list) {
            newFormData.film_screenings.screenings_list = newFormData.film_screenings.screenings_list.map(film => ({
              ...film,
              screenings: film.screenings.map(screening => ({
                ...screening,
                ticket_info: screening.ticket_info.map(ticket => {
                  let ticketType = ticket.ticket_type;
                  
                  // Check if ticket type is a key (starts with "key:")
                  if (ticketType && ticketType.startsWith("key:")) {
                    const key = ticketType.substring(4);
                    // Convert key to English translation
                    const englishTranslation = getNestedValue(translations.en, `form.filmScreenings.${key}`);
                    if (typeof englishTranslation === 'string') {
                      ticketType = englishTranslation;
                    }
                    
                    // For "Other" ticket type, just use "Other" as the ticket_type
                    // The custom value is already stored in custom_ticket_type
                    if (key === "ticketTypeOther") {
                      ticketType = englishTranslation;
                    }
                  }
                  
                  return {
                    ...ticket,
                    ticket_type: ticketType
                  };
                })
              }))
            }));
          }

          // Get the English country name for screening_details address
          let screeningCountry = newFormData.screening_details?.screening_address.country || "";
          // Check if the country is one of our translated countries
          if (screeningCountry === getNestedValue(translations.de, "form.contactInfo.countries.germany") ||
              screeningCountry === getNestedValue(translations.de, "form.contactInfo.countries.austria") ||
              screeningCountry === getNestedValue(translations.de, "form.contactInfo.countries.switzerland")) {
            // Convert to English
            if (screeningCountry === getNestedValue(translations.de, "form.contactInfo.countries.germany")) {
              screeningCountry = getNestedValue(translations.en, "form.contactInfo.countries.germany");
            } else if (screeningCountry === getNestedValue(translations.de, "form.contactInfo.countries.austria")) {
              screeningCountry = getNestedValue(translations.en, "form.contactInfo.countries.austria");
            } else if (screeningCountry === getNestedValue(translations.de, "form.contactInfo.countries.switzerland")) {
              screeningCountry = getNestedValue(translations.en, "form.contactInfo.countries.switzerland");
            }
          }

          const sanitizedScreeningDetails = newFormData.screening_details ? {
            ...newFormData.screening_details,
            screening_type: sanitizeText(newFormData.screening_details.screening_type, MAX_TEXT_LENGTH),
            // venue: sanitizeText(venueValue, MAX_TEXT_LENGTH),
            event_website: sanitizeText(newFormData.screening_details.event_website, MAX_TEXT_LENGTH),
            format: sanitizeText(formatValue, MAX_TEXT_LENGTH),
            screening_address: {
              street_1: sanitizeText(newFormData.screening_details.screening_address.street_1, MAX_TEXT_LENGTH),
              street_2: sanitizeText(newFormData.screening_details.screening_address.street_2, MAX_TEXT_LENGTH),
              city: sanitizeText(newFormData.screening_details.screening_address.city, MAX_TEXT_LENGTH),
              state: sanitizeText(newFormData.screening_details.screening_address.state, MAX_TEXT_LENGTH),
              postal_code: sanitizeText(newFormData.screening_details.screening_address.postal_code, MAX_TEXT_LENGTH),
              country: sanitizeText(screeningCountry, MAX_TEXT_LENGTH)
            },
            screen_size: {
              width_m: Math.max(0, Math.min(1000, newFormData.screening_details.screen_size.width_m || 0)),
              height_m: Math.max(0, Math.min(1000, newFormData.screening_details.screen_size.height_m || 0))
            }
          } : undefined;

          // Prepare submission data
          const submissionData: any = {
            timestamp: Math.floor(new Date().getTime() / 1000),
            form_timing: {
              start_time: startTime.toISOString(),
              end_time: endTime.toISOString(),
              duration_seconds: durationSeconds
            },
            contact_info: sanitizedContactInfo,
            screening_details: sanitizedScreeningDetails,
            capacity,
            promotion: newFormData.promotion,
            event_summary: {
              summary: sanitizeText(newFormData.event_summary?.summary || '', MAX_SUMMARY_LENGTH),
              has_brand_activities: newFormData.event_summary?.has_brand_activities || false,
              related_brand_activities: sanitizeText(newFormData.event_summary?.related_brand_activities || '', MAX_SUMMARY_LENGTH),
              involved_parties: newFormData.event_summary?.involved_parties?.map(party => sanitizeText(party, MAX_TEXT_LENGTH)) || []
            },
            interactive_elements: newFormData.interactive_elements,
            film_screenings: {
              charging_tickets: newFormData.film_screenings?.charging_tickets || false,
              screenings_list: newFormData.film_screenings?.screenings_list?.map(film => ({
                title: sanitizeText(film.title || '', MAX_TEXT_LENGTH),
                studios: film.studios?.map(studio => sanitizeText(studio, MAX_TEXT_LENGTH)) || [],
                year_of_release: Math.max(1800, Math.min(new Date().getFullYear() + 10, film.year_of_release || 0)),
                iva_id: film.iva_id ? sanitizeText(film.iva_id, MAX_TEXT_LENGTH) : undefined,
                poster_path: film.poster_path ? sanitizeText(film.poster_path, MAX_TEXT_LENGTH) : undefined,
                media_type: film.media_type || undefined,
                screenings: film.screenings?.map(screening => ({
                  screening_date: sanitizeText(screening.screening_date || '', MAX_TEXT_LENGTH),
                  screening_guid: screening.screening_guid,
                  number_of_screenings: Math.max(1, Math.min(100, screening.number_of_screenings || 1)),
                  box_office_return: screening.box_office_return || false,
                  approved: screening.approved || false,
                  ticket_info: screening.ticket_info?.map(ticket => ({
                    ticket_type: sanitizeText(ticket.ticket_type, MAX_TEXT_LENGTH),
                    custom_ticket_type: sanitizeText(ticket.custom_ticket_type || '', MAX_TEXT_LENGTH),
                    ticket_price: Math.max(0, Math.min(10000, ticket.ticket_price || 0)),
                    tickets_sold: Math.max(0, Math.min(MAX_CAPACITY, ticket.tickets_sold || 0))
                  })) || []
                })) || []
              })) || []
            },
            // how_did_you_hear: sanitizeText(howDidYouHearValue, MAX_TEXT_LENGTH),
            // how_did_you_hear_other: sanitizeText(newFormData.how_did_you_hear_other || '', MAX_TEXT_LENGTH),
            newsletter_subscription: newFormData.newsletter_subscription || false
          };

          // // Always include finance_info in the submission data
          submissionData.finance_info = sanitizedFinanceInfo;

          // Submit the data to the UK-specific table
          const result = await client.models.UKSubmission.create(submissionData);

          // Check if result contains any error indicators
          if (!result || (result as any).errors) {
            const errors = (result as any)?.errors;
            const errorMessage = errors && Array.isArray(errors) && errors.length > 0 
              ? errors[0].message 
              : 'Submission failed. Please try again later.';
            
            // Set the submission result with error
            setSubmissionResult({ 
              error: { message: errorMessage },
              // Include the result data for debugging
              data: result 
            });
          } else {
            // Form successfully submitted (without logging sensitive result data)
            setSubmissionResult({ data: result });
          }
          
          // Move to confirmation step
          setCurrentStep(6);
          
          // Now clear the form data for next submission, but preserve the submission result
          // This ensures we don't lose the result during navigation
          // Create a deep copy of the initial form data
          const freshFormDataCopy = JSON.parse(JSON.stringify(INITIAL_FORM_DATA));
          
          // Ensure startTime is a proper Date object (JSON.stringify converts it to a string)
          const freshFormData = {
            ...freshFormDataCopy,
            startTime: new Date()
          };
          
          // Clear secure storage but preserve the submission result and current step
          // This prevents the form from being reset during navigation
          clearSecureStorage(['submissionResult', 'currentStep', 'locale', 'lastActivityTimestamp']);
          
          // Update the secure storage with the new form data
          secureSet('formData', freshFormData);
          
          // Update form data with the fresh data - do this last to avoid race conditions
          setTimeout(() => {
            setFormData(freshFormData);
          }, 0);
          
        } catch (error) {
          console.error('Error submitting form:', error);
          setSubmissionResult({ 
            error: {
              message: error instanceof Error ? error.message : 'An unknown error occurred'
            }
          });
          setCurrentStep(6); // Still move to confirmation step to show error
        } finally {
          setIsSubmitting(false);
        }
        break;
        
      default:
        setCurrentStep(currentStep + 1);
    }
    
    // Add a small delay to ensure the transition state is maintained
    // long enough to prevent double-clicks
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const prevStep = () => {
    if (isTransitioning) {
      return;
    }
    setIsTransitioning(true);
    setCurrentStep(prev => prev - 1);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  const setStep = (step: number) => {
    if (isTransitioning) {
      return;
    }
    setIsTransitioning(true);
    setCurrentStep(step);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const resetForm = () => {
    // Store the current submission result to preserve it for the confirmation page
    const currentSubmissionResult = submissionResult;
    
    // Create a completely fresh form data object with default values
    // This ensures all nested objects are also reset
    // Create a deep copy of the initial form data
    const freshFormDataCopy = JSON.parse(JSON.stringify(INITIAL_FORM_DATA));
    
    // Ensure startTime is a proper Date object (JSON.stringify converts it to a string)
    const freshFormData = {
      ...freshFormDataCopy,
      startTime: new Date()
    };
    
    // Step 1: Update the form data first to ensure UI reflects the reset
    setFormData(freshFormData);
    
    // Step 2: Reset step to trigger navigation
    setCurrentStep(1);
    
    // Step 3: Clear submission result to prevent flash of error state
    setSubmissionResult(undefined);
    
    // Step 4: Clear storage with a try-catch to handle potential storage errors
    try {
      // Clear all secure storage but preserve locale and lastActivityTimestamp
      clearSecureStorage(['locale', 'lastActivityTimestamp']);
      
      // Update storage with new form data
      secureSet('formData', freshFormData);
      secureSet('currentStep', 1);
      
      // Force a complete reset of the form data by removing it from storage and setting it again
      // This ensures any cached values are also cleared
      localStorage.removeItem('formData');
      secureSet('formData', freshFormData);
    } catch (error) {
      console.error('Error clearing storage during form reset:', error);
      // Continue with reset even if storage operations fail
    }
    
    // Step 5: If we're currently on the confirmation step (step 6), 
    // restore the submission result for future reference
    if (currentStep === 6) {
      try {
        secureSet('submissionResult', currentSubmissionResult);
      } catch (error) {
        console.error('Error restoring submission result:', error);
      }
    }
  };

  return (
    <FormContext.Provider value={{
      formData,
      currentStep,
      updateFormData,
      nextStep,
      prevStep,
      setStep,
      resetForm,
      submissionResult,
      setSubmissionResult,
      isSubmitting,
      isTransitioning
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
