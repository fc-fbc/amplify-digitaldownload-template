"use client"

import { useState, useEffect } from "react"
import { generateClient } from "aws-amplify/data"
import type { Schema } from "../../../amplify/data/resource"
import { ApiSubmissionData, ApiScreening, ApiFilmScreening } from "../components/ScreeningDetails"

export function useScreeningData(submissionId: string, screeningId: string | null) {
  const client = generateClient<Schema>()
  
  const [submissionData, setSubmissionData] = useState<ApiSubmissionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ticketsByIndex, setTicketsByIndex] = useState<{ [key: number]: number }>({})
  const [isSaving, setIsSaving] = useState(false)
  const [currentScreening, setCurrentScreening] = useState<ApiScreening | null>(null)
  const [currentFilmTitle, setCurrentFilmTitle] = useState<ApiFilmScreening | null>(null)
  const [screeningOptions, setScreeningOptions] = useState<Array<{
    filmTitle: string;
    screeningDate: string;
    screeningGuid: string;
  }>>([])
  
  // Track the current screeningId to detect changes
  const [currentScreeningId, setCurrentScreeningId] = useState<string | null>(screeningId)

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        // Fetching submission data
        const response = await client.models.Submission.get({ id: submissionId })
        
        if (response?.data) {
          // Submission data retrieved successfully
          const data = response.data as ApiSubmissionData
          setSubmissionData(data)
          
          // Collect all screenings from all films
          const options: Array<{
            filmTitle: string;
            screeningDate: string;
            screeningGuid: string;
          }> = [];
          
          data.film_screenings?.screenings_list?.forEach((filmScreening) => {
            if (filmScreening.title) {
              filmScreening.screenings?.forEach((screening) => {
                if (screening.screening_guid && screening.screening_date) {
                  options.push({
                    filmTitle: filmScreening.title || "Untitled Film",
                    screeningDate: screening.screening_date,
                    screeningGuid: screening.screening_guid
                  });
                }
              });
            }
          });
          
          setScreeningOptions(options);
          
          // If screeningId is provided, find that screening
          if (screeningId) {
            let foundScreening: ApiScreening | null = null;
            let foundFilmTitle: ApiFilmScreening | null = null;
            
            if (data.film_screenings?.screenings_list) {
              for (const filmScreening of data.film_screenings.screenings_list) {
                if (filmScreening.screenings) {
                  for (const screening of filmScreening.screenings) {
                    if (screening.screening_guid === screeningId) {
                      foundScreening = screening;
                      foundFilmTitle = filmScreening;
                      break;
                    }
                  }
                }
                if (foundScreening) break;
              }
            }
            
            if (!foundScreening || !foundFilmTitle) {
              setError(`Screening with ID ${screeningId} not found`);
              return;
            }
            
            setCurrentScreening(foundScreening);
            setCurrentFilmTitle(foundFilmTitle);
            
            // Check if the screeningId has changed
            const screeningIdChanged = currentScreeningId !== screeningId;
            
            // Initialize tickets if the screeningId has changed
            if (screeningIdChanged) {
              // Reinitialize tickets for the new screening
              const initialTicketsByIndex: { [key: number]: number } = {};
              foundScreening.ticket_info?.forEach((ticket, ticketIndex) => {
                initialTicketsByIndex[ticketIndex] = ticket.tickets_sold || 0;
              });
              
              setTicketsByIndex(initialTicketsByIndex);
              setCurrentScreeningId(screeningId);
            }
          } else if (options.length > 0) {
            // Set the first screening as default if available
            // Note: We don't set currentScreening here as we're just setting a default selection
          }
        } else {
          throw new Error('No data returned from API')
        }
      } catch (err) {
        console.error("Error fetching submission:", err)
        console.error("Error details:", JSON.stringify(err, null, 2))
        setError("Failed to fetch submission data")
      }
    }

    fetchSubmission()
  }, [submissionId, screeningId, client.models.Submission, currentScreeningId])

  const handleTicketSoldChange = (ticketIndex: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setTicketsByIndex(prev => ({
      ...prev,
      [ticketIndex]: numValue
    }));
  }

  const handleSave = async () => {
    if (!submissionData?.film_screenings?.screenings_list || !screeningId || !currentScreening) return;
    
    try {
      setIsSaving(true);
      
      // Create a deep copy of the film_screenings structure
      const updatedFilmScreenings = JSON.parse(JSON.stringify(submissionData.film_screenings.screenings_list));
      let screeningFound = false;
      
      // Update the tickets_sold for the specific screening
      for (let i = 0; i < updatedFilmScreenings.length; i++) {
        const filmScreening = updatedFilmScreenings[i];
        if (!filmScreening.screenings) continue;
        
        for (let j = 0; j < filmScreening.screenings.length; j++) {
          const screening = filmScreening.screenings[j];
          if (screening.screening_guid === screeningId) {
            screeningFound = true;
            
            if (screening.ticket_info) {
              for (let k = 0; k < screening.ticket_info.length; k++) {
                const ticket = screening.ticket_info[k];
                if (ticket) {
                  ticket.tickets_sold = ticketsByIndex[k] || ticket.tickets_sold || 0;
                }
              }
            }
            
            // Set box_office_return to true to lock the ability to change numbers
            screening.box_office_return = true;
          }
        }
      }
      
      if (!screeningFound) {
        setError(`Screening with ID ${screeningId} not found`);
        return;
      }
      
      const result = await client.models.Submission.update({
        id: submissionId,
        film_screenings: {
          ...submissionData.film_screenings,
          screenings_list: updatedFilmScreenings
        }
      });

      // Update local state
      if (result?.data) {
        setSubmissionData(result.data as ApiSubmissionData);
      }
    } catch (err) {
      console.error("Error saving box office returns:", err);
      setError("Failed to save box office returns");
    } finally {
      setIsSaving(false);
    }
  }

  return {
    submissionData,
    error,
    ticketsByIndex,
    isSaving,
    currentScreening,
    currentFilmTitle,
    screeningOptions,
    handleTicketSoldChange,
    handleSave
  }
}
