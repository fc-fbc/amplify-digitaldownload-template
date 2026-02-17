import { useState } from "react";
import { FilmScreenings } from "@/lib/types";
import { GranularErrors } from "../../ContactInformation-step1/types";
import { useTranslation } from "@/lib/hooks/useTranslation";

export const MAX_PRICE = 1000000; // 1 million as maximum ticket price
export const MAX_FILMS = 15;      // Maximum number of films allowed
export const MAX_SCREENINGS = 10; // Maximum number of screenings per film
export const MAX_TICKETS = 10;    // Maximum number of tickets per screening

export const useFilmScreeningsValidation = () => {
  const { t } = useTranslation();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<GranularErrors>({ films: {} });

  // Clear errors for specific fields
  const clearFilmErrors = (filmIndex: number) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.films[filmIndex];
      return newErrors;
    });
  };
  
  const clearScreeningErrors = (filmIndex: number, screeningIndex: number) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors.films[filmIndex]?.screenings) {
        delete newErrors.films[filmIndex].screenings![screeningIndex];
      }
      return newErrors;
    });
  };
  
  const clearTicketErrors = (filmIndex: number, screeningIndex: number, ticketIndex: number) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets) {
        delete newErrors.films[filmIndex].screenings![screeningIndex].tickets![ticketIndex];
      }
      return newErrors;
    });
  };

  // Helpers to check if a specific field has an error
  const hasFilmError = (filmIndex: number) => {
    return formSubmitted && 
           (errors.films[filmIndex]?.title !== undefined || 
            errors.films[filmIndex]?.year !== undefined);
  };
  
  const hasScreeningError = (filmIndex: number, screeningIndex: number) => {
    return formSubmitted && 
           errors.films[filmIndex]?.screenings?.[screeningIndex]?.date !== undefined;
  };
  
  const hasTicketTypeError = (filmIndex: number, screeningIndex: number, ticketIndex: number) => {
    return formSubmitted && 
           errors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets?.[ticketIndex]?.type !== undefined;
  };
  
  const hasTicketPriceError = (filmIndex: number, screeningIndex: number, ticketIndex: number) => {
    return formSubmitted && 
           errors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets?.[ticketIndex]?.price !== undefined;
  };
  
  const hasTicketCustomTypeError = (filmIndex: number, screeningIndex: number, ticketIndex: number) => {
    return formSubmitted && 
           errors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets?.[ticketIndex]?.customType !== undefined;
  };

  // Validate all fields when form is submitted, with highly granular error handling
  const validateForm = (filmScreeningsData: FilmScreenings): boolean => {
    const newErrors: GranularErrors = { films: {} };
    let isValid = true;
    let firstErrorId: string | null = null;
    
    // Check if ticket charging question is answered
    if (filmScreeningsData.charging_tickets === undefined) {
      newErrors.ticketCharge = t('validation.ticketCharge');
      isValid = false;
    }

    // Check if the number of films exceeds the maximum limit
    if (filmScreeningsData.screenings_list.length > MAX_FILMS) {
      newErrors.maxFilmsExceeded = t('validation.maxFilmsExceeded', { max: MAX_FILMS });
      isValid = false;
    }

    // Check if at least one film is present with a title
    if (filmScreeningsData.screenings_list.length === 0) {
      newErrors.films[0] = { title: t('validation.atLeastOneFilm') };
      isValid = false;
    } else {
      // Check if any film has a title (only if we have at least one film)
      const hasAnyFilmTitle = filmScreeningsData.screenings_list.some(film => film.title.trim());
      if (!hasAnyFilmTitle) {
        newErrors.films[0] = { title: t('validation.atLeastOneFilmWithTitle') };
        isValid = false;
      }
    }

    // Validate each film individually
    filmScreeningsData.screenings_list.forEach((film, filmIndex) => {
      // Initialize film errors if needed
      if (!newErrors.films[filmIndex]) {
        newErrors.films[filmIndex] = {};
      }
      
      // Check film title
      if (!film.title.trim()) {
        newErrors.films[filmIndex].title = t('validation.filmTitleRequired');
        isValid = false;
      }
      
      // Check year of release
      if (!film.year_of_release) {
        newErrors.films[filmIndex].year = t('validation.yearRequired');
        isValid = false;
      }
      
      // Check if the number of screenings exceeds the maximum limit
      if (film.screenings.length > MAX_SCREENINGS) {
        if (!newErrors.films[filmIndex].screenings) {
          newErrors.films[filmIndex].screenings = {};
        }
        
        newErrors.films[filmIndex].maxScreeningsExceeded = t('validation.maxScreeningsExceeded', { max: MAX_SCREENINGS });
        isValid = false;
      }
      
      // Check if film has any screenings
      if (film.screenings.length === 0) {
        // If no screenings structure exists, create it
        if (!newErrors.films[filmIndex].screenings) {
          newErrors.films[filmIndex].screenings = {};
        }
        
  // Add a generic screening error at index 0
  newErrors.films[filmIndex].screenings![0] = { date: t('validation.atLeastOneScreeningRequired') };
  isValid = false;
      } else {
        // Validate each screening individually
        film.screenings.forEach((screening, screeningIndex) => {
          // Initialize screening errors if needed
          if (!newErrors.films[filmIndex].screenings) {
            newErrors.films[filmIndex].screenings = {};
          }
          
          if (!newErrors.films[filmIndex].screenings![screeningIndex]) {
            newErrors.films[filmIndex].screenings![screeningIndex] = {};
          }
          
          // Check screening date
          if (!screening.screening_date) {
            newErrors.films[filmIndex].screenings![screeningIndex].date = t('validation.screeningDateRequired');
            isValid = false;
          }

          // Check format selection
          if (!screening.format) {
            newErrors.films[filmIndex].screenings![screeningIndex].format = t('validation.formatRequired');
            isValid = false;
          }

          // Only validate tickets if we're charging for tickets
          if (filmScreeningsData.charging_tickets) {
            // Check if screening has any tickets
            if (screening.ticket_info.length === 0) {
              // Initialize tickets error structure if needed
              if (!newErrors.films[filmIndex].screenings![screeningIndex].tickets) {
                newErrors.films[filmIndex].screenings![screeningIndex].tickets = {};
              }
              
              // Add a generic ticket error at index 0
              newErrors.films[filmIndex].screenings![screeningIndex].tickets![0] = { 
                type: t('validation.atLeastOneTicketType')
              };
              isValid = false;
            } else if (screening.ticket_info.length > MAX_TICKETS) {
              // Check if the number of tickets exceeds the maximum limit
              if (!newErrors.films[filmIndex].screenings![screeningIndex].tickets) {
                newErrors.films[filmIndex].screenings![screeningIndex].tickets = {};
              }
              
              newErrors.films[filmIndex].screenings![screeningIndex].maxTicketsExceeded = 
                t('validation.maxTicketsExceeded', { max: MAX_TICKETS });
              isValid = false;
            } else {
              // Validate each ticket individually
              screening.ticket_info.forEach((ticket, ticketIndex) => {
                // Initialize ticket errors if needed
                if (!newErrors.films[filmIndex].screenings![screeningIndex].tickets) {
                  newErrors.films[filmIndex].screenings![screeningIndex].tickets = {};
                }
                
                if (!newErrors.films[filmIndex].screenings![screeningIndex].tickets![ticketIndex]) {
                  newErrors.films[filmIndex].screenings![screeningIndex].tickets![ticketIndex] = {};
                }
                
                // Check ticket type
                if (!ticket.ticket_type) {
                  newErrors.films[filmIndex].screenings![screeningIndex].tickets![ticketIndex].type = 
                    t('validation.selectTicketType');
                  isValid = false;
                }
                
                // Check ticket price
                if (ticket.ticket_price <= 0) {
                  newErrors.films[filmIndex].screenings![screeningIndex].tickets![ticketIndex].price = 
                    t('validation.ticketPriceRequired');
                  isValid = false;
                } else if (ticket.ticket_price > MAX_PRICE) {
                  newErrors.films[filmIndex].screenings![screeningIndex].tickets![ticketIndex].price = 
                    t('validation.ticketPriceExceedsMax');
                  isValid = false;
                }
                
                // Check custom ticket type if ticketTypeOther is selected
                if (ticket.ticket_type.startsWith("key:ticketTypeOther") && !ticket.custom_ticket_type) {
                  newErrors.films[filmIndex].screenings![screeningIndex].tickets![ticketIndex].customType = 
                    t('validation.customTicketTypeRequired');
                  isValid = false;
                }
              });
            }
          }
        });
      }
    });

    // Update the errors state
    setErrors(newErrors);
    
    // If the form is invalid, scroll to the first error
    if (!isValid) {
      // Use setTimeout to ensure the DOM has updated with error messages
      setTimeout(() => {
        // Try to find the first error element
        // First check if we have a ticketCharge error
        if (newErrors.ticketCharge) {
          const element = document.getElementById('charging_tickets');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
          }
        }
        
        // Then check for film errors
        for (let filmIndex = 0; filmIndex < filmScreeningsData.screenings_list.length; filmIndex++) {
          const filmErrors = newErrors.films[filmIndex];
          if (!filmErrors) continue;
          
          // Check for film title or year errors
          if (filmErrors.title) {
            const element = document.getElementById(`film_title_${filmIndex}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              return;
            }
          }
          
          if (filmErrors.year) {
            const element = document.getElementById(`film_year_${filmIndex}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              return;
            }
          }
          
          // Check for screening errors
          if (filmErrors.screenings) {
            for (let screeningIndex = 0; screeningIndex < (filmScreeningsData.screenings_list[filmIndex]?.screenings.length || 0); screeningIndex++) {
              const screeningErrors = filmErrors.screenings[screeningIndex];
              if (!screeningErrors) continue;
              
              if (screeningErrors.date) {
                const element = document.getElementById(`screening_date_${filmIndex}_${screeningIndex}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  return;
                }
              }
              
              // Check for ticket errors
              if (screeningErrors.tickets) {
                for (let ticketIndex = 0; ticketIndex < (filmScreeningsData.screenings_list[filmIndex]?.screenings[screeningIndex]?.ticket_info.length || 0); ticketIndex++) {
                  const ticketErrors = screeningErrors.tickets[ticketIndex];
                  if (!ticketErrors) continue;
                  
                  if (ticketErrors.type) {
                    const element = document.getElementById(`ticket_type_${filmIndex}_${screeningIndex}_${ticketIndex}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                  }
                  
                  if (ticketErrors.price) {
                    const element = document.getElementById(`ticket_price_${filmIndex}_${screeningIndex}_${ticketIndex}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                  }
                  
                  if (ticketErrors.customType) {
                    const element = document.getElementById(`custom_ticket_type_${filmIndex}_${screeningIndex}_${ticketIndex}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                  }
                }
              }
            }
          }
        }
        
        // If we couldn't find a specific error element, try to scroll to the form itself
        const formElement = document.getElementById('film-screenings-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    
    return isValid;
  };

  // Helper function to get all errors as a flat array for display
  const getAllErrors = (): string[] => {
    const allErrors: string[] = [];
    
    if (errors.ticketCharge) {
      allErrors.push(errors.ticketCharge);
    }
    
    if (errors.maxFilmsExceeded) {
      allErrors.push(errors.maxFilmsExceeded);
    }
    
    Object.entries(errors.films).forEach(([filmIndex, filmErrors]) => {
      const filmIdx = parseInt(filmIndex);
      
      if (filmErrors.title) {
        allErrors.push(`Film ${filmIdx + 1}: ${filmErrors.title}`);
      }
      
      if (filmErrors.year) {
        allErrors.push(`Film ${filmIdx + 1}: ${filmErrors.year}`);
      }
      
      if (filmErrors.maxScreeningsExceeded) {
        allErrors.push(`Film ${filmIdx + 1}: ${filmErrors.maxScreeningsExceeded}`);
      }
      
      if (filmErrors.screenings) {
        Object.entries(filmErrors.screenings).forEach(([screeningIndex, screeningErrors]) => {
          const screeningIdx = parseInt(screeningIndex);

          if (screeningErrors.date) {
            allErrors.push(`Film ${filmIdx + 1}, Screening ${screeningIdx + 1}: ${screeningErrors.date}`);
          }

          if (screeningErrors.format) {
            allErrors.push(`Film ${filmIdx + 1}, Screening ${screeningIdx + 1}: ${screeningErrors.format}`);
          }

          if (screeningErrors.maxTicketsExceeded) {
            allErrors.push(`Film ${filmIdx + 1}, Screening ${screeningIdx + 1}: ${screeningErrors.maxTicketsExceeded}`);
          }
          
          if (screeningErrors.tickets) {
            Object.entries(screeningErrors.tickets).forEach(([ticketIndex, ticketErrors]) => {
              const ticketIdx = parseInt(ticketIndex);
              
              if (ticketErrors.type) {
                allErrors.push(`Film ${filmIdx + 1}, Screening ${screeningIdx + 1}, Ticket ${ticketIdx + 1}: ${ticketErrors.type}`);
              }
              
              if (ticketErrors.price) {
                allErrors.push(`Film ${filmIdx + 1}, Screening ${screeningIdx + 1}, Ticket ${ticketIdx + 1}: ${ticketErrors.price}`);
              }
              
              if (ticketErrors.customType) {
                allErrors.push(`Film ${filmIdx + 1}, Screening ${screeningIdx + 1}, Ticket ${ticketIdx + 1}: ${ticketErrors.customType}`);
              }
            });
          }
        });
      }
    });
    
    return allErrors;
  };

  return {
    formSubmitted,
    setFormSubmitted,
    errors,
    setErrors,
    clearFilmErrors,
    clearScreeningErrors,
    clearTicketErrors,
    hasFilmError,
    hasScreeningError,
    hasTicketTypeError,
    hasTicketPriceError,
    hasTicketCustomTypeError,
    validateForm,
    getAllErrors
  };
};
