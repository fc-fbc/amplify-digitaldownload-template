"use client"

import { useState } from "react"
import { Amplify } from "aws-amplify"
import outputs from "../../../amplify_outputs.json"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import ScreeningDetails from "./ScreeningDetails"
import { useScreeningData } from "../hooks/useScreeningData"

// Configure Amplify
Amplify.configure(outputs)

export default function BoxOfficeClient({ 
  submissionid 
}: { 
  submissionid: string 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const screeningId = searchParams.get('screeningId')
  const [selectedScreeningGuid, setSelectedScreeningGuid] = useState<string>("")
  
  const {
    submissionData,
    error,
    ticketsByIndex,
    isSaving,
    currentScreening,
    currentFilmTitle,
    screeningOptions,
    handleTicketSoldChange,
    handleSave
  } = useScreeningData(submissionid, screeningId)

  const handleScreeningSelect = (value: string) => {
    setSelectedScreeningGuid(value)
  }

  const handleGoToScreening = () => {
    if (selectedScreeningGuid) {
      router.push(`/box-office/${submissionid}?screeningId=${selectedScreeningGuid}`)
    }
  }

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
  if (!submissionData) {
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

  // Screening selection view (no screeningId provided)
  if (!screeningId) {
    return (
      <div className="bg-white shadow-2xl rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0288d1] to-[#81D4FA]" />
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4">Box Office Returns</h3>
          
          <div className="space-y-4">
            <div className="p-6 border border-[#81D4FA] rounded-lg">
              <h4 className="text-lg font-semibold mb-4">Select a Screening</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-medium block">Screening:</label>
                  <Select value={selectedScreeningGuid} onValueChange={handleScreeningSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a screening" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {screeningOptions.map((option) => (
                        <SelectItem key={option.screeningGuid} value={option.screeningGuid}>
                          {option.filmTitle} - {new Date(option.screeningDate).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={handleGoToScreening}
                    disabled={!selectedScreeningGuid}
                    className="bg-[#0288d1] text-white hover:bg-[#0288d1]/90"
                  >
                    Go to Screening
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading screening data
  if (!currentScreening || !currentFilmTitle) {
    return (
      <div className="bg-white shadow-2xl rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0288d1] to-[#81D4FA]" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0288d1]"></div>
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
