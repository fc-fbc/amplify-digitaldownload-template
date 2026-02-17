"use client"

import { Amplify } from "aws-amplify"
import outputs from "../../../amplify_outputs.json"
import ScreeningDetails from "../components/ScreeningDetails"
import { useScreeningData } from "../hooks/useScreeningData"

// Configure Amplify
Amplify.configure(outputs)

export default function BoxOfficeScreeningClient({ 
  submissionid,
  screeningid
}: { 
  submissionid: string;
  screeningid: string;
}) {
  const {
    submissionData,
    error,
    ticketsByIndex,
    isSaving,
    currentScreening,
    currentFilmTitle,
    handleTicketSoldChange,
    handleSave
  } = useScreeningData(submissionid, screeningid)

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow-2xl rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0288d1] to-[#81D4FA]" />
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-xl font-semibold text-red-700 mb-4">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  // Loading state
  if (!submissionData || !currentScreening || !currentFilmTitle) {
    return (
      <div className="bg-white shadow-2xl rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0288d1] to-[#81D4FA]" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0288d1]"></div>
        </div>
      </div>
    )
  }

  // Non-commercial screening
  if (!submissionData.film_screenings?.charging_tickets) {
    return (
      <div className="bg-white shadow-2xl rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0288d1] to-[#81D4FA]" />
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-700 mb-4">Non-Commercial Screening</h3>
          <p className="text-yellow-600">This screening is non-commercial and does not require box office returns.</p>
        </div>
      </div>
    )
  }

  // Show the screening details using the shared component
  return (
    <ScreeningDetails
      submissionId={submissionid}
      currentScreening={currentScreening}
      currentFilmTitle={currentFilmTitle}
      ticketsByIndex={ticketsByIndex}
      handleTicketSoldChange={handleTicketSoldChange}
      handleSave={handleSave}
      isSaving={isSaving}
    />
  )
}
