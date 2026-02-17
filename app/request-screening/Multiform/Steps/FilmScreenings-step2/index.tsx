"use client"

import { FormEvent, useState, useEffect, useRef } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import { useFormContext } from "../../context/FormContext";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { FilmScreenings } from "@/lib/types";
import { DuplicateError } from "../ContactInformation-step1/types";
import { useFilmScreeningsValidation, MAX_FILMS } from "./hooks/useFilmScreeningsValidation";
import TicketCharging from "./components/TicketCharging";
import FilmList from "./components/FilmList";

export default function Step5() {
  const { formData: contextFormData, updateFormData, nextStep, prevStep } = useFormContext();
  const { t } = useTranslation();
  
  // Initialize validation hooks
  const {
    formSubmitted,
    setFormSubmitted,
    errors,
    setErrors,
    validateForm,
    getAllErrors
  } = useFilmScreeningsValidation();
  
  // Duplicate ticket error is a special case that needs to show immediately
  const [duplicateError, setDuplicateError] = useState<DuplicateError | null>(null);
  
  // Default film screenings data structure
  const defaultFilmScreeningsData: FilmScreenings = {
    charging_tickets: true,
    screenings_list: [{
      title: "",
      year_of_release: 0,
      studios: [],
      screenings: [{
        screening_date: "",
        screening_guid: typeof window !== 'undefined' ? window.crypto.randomUUID() : '',
        number_of_screenings: 1,
        box_office_return: false,
        approved: false,
        ticket_info: [{ ticket_type: "", ticket_price: 0, tickets_sold: 0 }],
        format: ""
      }]
    }]
  };

  // Initialize film screenings data from context or with defaults
  const [filmScreeningsData, setFilmScreeningsData] = useState<FilmScreenings>(
    contextFormData?.film_screenings || defaultFilmScreeningsData
  );

  // Use a ref to track when we're making local changes to prevent sync conflicts
  const isLocalUpdateRef = useRef(false);

  // Keep local data in sync with context - one-way data flow
  useEffect(() => {
    // Skip sync if we just made a local update
    if (isLocalUpdateRef.current) {
      isLocalUpdateRef.current = false;
      return;
    }

    if (contextFormData?.film_screenings) {
      // Check if this is a fresh form (after submission/reset)
      const isFreshForm = contextFormData.film_screenings.screenings_list.every(film => 
        film.title === "" && film.year_of_release === 0 &&
        film.screenings.every(screening => 
          screening.screening_date === "" && 
          (screening.ticket_info.length === 0 || screening.ticket_info.every(ticket => 
            ticket.ticket_type === "" && ticket.ticket_price === 0
          ))
        )
      );
      
      if (isFreshForm) {
        // If it's a fresh form, use the default data structure without triggering a context update
        const freshData = {
          charging_tickets: true,
          screenings_list: [{
            title: "",
            year_of_release: 0,
            studios: [],
            screenings: [{
              screening_date: "",
              screening_guid: typeof window !== 'undefined' ? window.crypto.randomUUID() : '',
              number_of_screenings: 1,
              box_office_return: false,
              approved: false,
              ticket_info: [{ ticket_type: "", ticket_price: 0, tickets_sold: 0 }],
              format: ""
            }]
          }]
        };
        setFilmScreeningsData(freshData);
        return;
      }
      
      // Check for and update any empty screening_guids
      const updatedScreeningsList = contextFormData.film_screenings.screenings_list.map((film) => ({
        ...film,
        screenings: film.screenings.map((screening) => ({
          ...screening,
          screening_guid: screening.screening_guid || (typeof window !== 'undefined' ? window.crypto.randomUUID() : '')
        }))
      }));

      const updatedFilmScreenings = {
        ...contextFormData.film_screenings,
        screenings_list: updatedScreeningsList
      };

      setFilmScreeningsData(updatedFilmScreenings);
      
      // Update the context if we had to fix any empty screening_guids
      const hasEmptyGuids = contextFormData.film_screenings.screenings_list.some(film => 
        film.screenings.some(screening => !screening.screening_guid)
      );
      
      if (hasEmptyGuids) {
        updateFormData({ film_screenings: updatedFilmScreenings });
      }
    } else {
      // If film_screenings is not in the context, reset to default
      const freshData = {
        charging_tickets: true,
        screenings_list: [{
          title: "",
          year_of_release: 0,
          studios: [],
          screenings: [{
            screening_date: "",
            screening_guid: typeof window !== 'undefined' ? window.crypto.randomUUID() : '',
            number_of_screenings: 1,
            box_office_return: false,
            approved: false,
            ticket_info: [{ ticket_type: "", ticket_price: 0, tickets_sold: 0 }],
            format: ""
          }]
        }]
      };
      setFilmScreeningsData(freshData);
    }
  }, [contextFormData, updateFormData]);

  // Handle ticket charging change
  const handleTicketChargingChange = (value: boolean) => {
    // Mark that we're making a local update to prevent sync conflicts
    isLocalUpdateRef.current = true;
    
    // Clear ticket charge error
    setErrors(prev => ({ ...prev, ticketCharge: undefined }));
    
    const newFilmScreeningsData = {
      ...filmScreeningsData,
      charging_tickets: value,
      screenings_list: filmScreeningsData.screenings_list.map(film => ({
        ...film,
        screenings: film.screenings.map(screening => ({
          ...screening,
          box_office_return: screening.box_office_return || false,
          approved: screening.approved || false,
          ticket_info: value ? 
            screening.ticket_info.length > 0 ? screening.ticket_info : 
            [{ ticket_type: "", ticket_price: 0, tickets_sold: 0 }] : []
        }))
      }))
    };
    
    // Update both local state and context
    setFilmScreeningsData(newFilmScreeningsData);
    updateFormData({ film_screenings: newFilmScreeningsData });
  };

  // Handle adding a new film
  const handleAddFilm = () => {
    // Check if we've reached the maximum number of films
    if (filmScreeningsData.screenings_list.length >= MAX_FILMS) {
      // Set the max films exceeded error
      setErrors(prev => ({
        ...prev,
        maxFilmsExceeded: t('validation.maxFilmsExceeded', { max: MAX_FILMS })
      }));
      return;
    }
    
    // Mark that we're making a local update to prevent sync conflicts
    isLocalUpdateRef.current = true;
    
    // Do not validate or show errors when adding a new film
    const newFilmScreeningsData = {
      ...filmScreeningsData,
      screenings_list: [...filmScreeningsData.screenings_list, {
        title: "",
        year_of_release: 0,
        studios: [],
        screenings: [{
          screening_date: "",
          screening_guid: typeof window !== 'undefined' ? window.crypto.randomUUID() : '',
          number_of_screenings: 1,
          box_office_return: false,
          approved: false,
          ticket_info: filmScreeningsData.charging_tickets ? [
            { ticket_type: "", ticket_price: 0, tickets_sold: 0 }
          ] : [],
          format: ""
        }]
      }]
    };
    
    // Update both local state and context
    setFilmScreeningsData(newFilmScreeningsData);
    updateFormData({ film_screenings: newFilmScreeningsData });
    
    // Reset validation states when adding new elements
    setFormSubmitted(false);
    setErrors({ films: {} }); // Reset ALL errors
  };

  // Handle updating film screenings data
  const handleUpdateFilmScreenings = (newData: FilmScreenings) => {
    // Mark that we're making a local update to prevent sync conflicts
    isLocalUpdateRef.current = true;
    
    setFilmScreeningsData(newData);
    updateFormData({ film_screenings: newData });
  };

  // Prevent form submission when Enter is pressed in input fields
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true); // Mark form as submitted only when Next Step is clicked
    
    if (validateForm(filmScreeningsData)) {
      await nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6 max-w-4xl mx-auto">
      <TicketCharging 
        chargingTickets={filmScreeningsData.charging_tickets}
        onChange={handleTicketChargingChange}
        error={errors.ticketCharge}
        formSubmitted={formSubmitted}
      />

      {formSubmitted && getAllErrors().length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="text-yellow-700 text-sm space-y-1">
            {getAllErrors().map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        </div>
      )}

      <FilmList 
        filmScreeningsData={filmScreeningsData}
        onAddFilm={handleAddFilm}
        onUpdateFilmScreenings={handleUpdateFilmScreenings}
        errors={errors}
        formSubmitted={formSubmitted}
        duplicateError={duplicateError}
        setDuplicateError={setDuplicateError}
      />

      <div className="flex justify-between mt-8">
        <GradientButton
          type="button"
          onClick={prevStep}
          variant="previous"
        >
          {t('common.previous')}
        </GradientButton>
        <GradientButton
          type="submit"
          variant="next"
        >
          {t('common.next')}
        </GradientButton>
      </div>
    </form>
  );
}
