"use client"

import { GradientButton } from "@/components/ui/gradient-button"
import { useFormValidation } from "./hooks/useFormValidation"
import { Capacity } from "./components/Capacity"
import { EventSummary } from "./components/EventSummary"
import { Promotion } from "./components/Promotion"
import { InteractiveElements } from "./components/ConfirmationStatements"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function Step4() {
  const { t } = useTranslation();
  const {
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
    handleSubmit,
    prevStep,
    updateLocalAndContextData
  } = useFormValidation()

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h2 className="text-2xl font-semibold text-[#0288d1]">{t('form.capacityAndEvent.title')}</h2>

      <Capacity 
        localFormData={localFormData}
        setLocalFormData={setLocalFormData}
        errors={errors}
        setErrors={setErrors}
        updateLocalAndContextData={updateLocalAndContextData}
      />

      <EventSummary 
        localFormData={localFormData}
        setLocalFormData={setLocalFormData}
        errors={errors}
        setErrors={setErrors}
        updateLocalAndContextData={updateLocalAndContextData}
      />

      <Promotion 
        localFormData={localFormData}
        setLocalFormData={setLocalFormData}
        errors={errors}
        setErrors={setErrors}
        promotionMethods={promotionMethods}
        handlePromotionMethodChange={handlePromotionMethodChange}
        newParty={newParty}
        setNewParty={setNewParty}
        handleAddParty={handleAddParty}
        handleRemoveParty={handleRemoveParty}
      />

      <InteractiveElements 
        localFormData={localFormData}
        setLocalFormData={setLocalFormData}
        errors={errors}
        updateLocalAndContextData={updateLocalAndContextData}
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
          {t('common.review')}
        </GradientButton>
      </div>
    </form>
  )
}
