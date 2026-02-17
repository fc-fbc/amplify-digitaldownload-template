"use client"

import { FormEvent } from "react"
import { GradientButton } from "@/components/ui/gradient-button"
import useFormValidation from "./hooks/useFormValidation"
import ScreeningType from "./components/ScreeningType"
import ScreeningAddress from "./components/ScreeningAddress"
import VenueInfo from "./components/VenueInfo"
import ScreenDetails from "./components/ScreenDetails"
import { useFormContext } from "../../context/FormContext"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function Step2() {
  const { t } = useTranslation();
  const { nextStep, prevStep } = useFormContext();
  
  const {
    formData: localFormData,
    errors,
    handleInputChange,
    setScreeningType,
    setHasWebsite,
    validateForm,
    useSameAddress,
    setUseSameAddress
  } = useFormValidation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      await nextStep()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h2 className="text-2xl font-semibold text-[#0288d1]">{t('form.screeningDetails.title')}</h2>

      <ScreeningType
        screeningType={localFormData.screening_details?.screening_type || ""}
        setScreeningType={setScreeningType}
        error={errors.screening_type}
      />

      <ScreeningAddress
        address={localFormData.screening_details?.screening_address || {
          street_1: "",
          street_2: "",
          city: "",
          state: "",
          postal_code: "",
          country: ""
        }}
        handleInputChange={handleInputChange}
        errors={{
          street_1: errors.street_1,
          city: errors.city,
          state: errors.state,
          postal_code: errors.postal_code,
          country: errors.country
        }}
        useSameAddress={useSameAddress}
        setUseSameAddress={setUseSameAddress}
      />

      <VenueInfo
        // venue={localFormData.screening_details?.venue || ""}
        eventWebsite={localFormData.screening_details?.event_website || ""}
        handleInputChange={handleInputChange}
        setHasWebsite={setHasWebsite}
        errors={{
          venue: errors.venue,
          event_website: errors.event_website,
          has_website: errors.has_website
        }}
      />

      <ScreenDetails
        screenSize={localFormData.screening_details?.screen_size || { width_m: 0, height_m: 0 }}
        handleInputChange={handleInputChange}
        errors={{
          width_m: errors.width_m,
          height_m: errors.height_m
        }}
      />

      <div className="flex justify-between">
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
  )
}
