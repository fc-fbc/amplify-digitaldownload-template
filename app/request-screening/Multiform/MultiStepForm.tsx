"use client"

import { lazy, Suspense, useMemo } from "react"
import ProgressIndicator from "../../../components/ProgressIndicator"
import { FormProvider, useFormContext } from "./context/FormContext"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/hooks/useTranslation";
import ClientOnly from "./components/ClientOnly"

// Lazy load step components to improve initial load time
const Step1 = lazy(() => import("./Steps/ContactInformation-step1/index"))
const Step2 = lazy(() => import("./Steps/VenueInformation-step3/index"))
const Step4 = lazy(() => import("./Steps/EventDetails-step4/index"))
const Step5 = lazy(() => import("./Steps/FilmScreenings-step2/index"))
const ReviewStep = lazy(() => import("./Steps/ReviewStep"))
const ConfirmationStep = lazy(() => import("./Steps/ConfirmationStep"))

// Step numbers:
// 1: Contact Information (Step1)
// 2: Film Screenings (Step5)
// 3: Screening Details (Step2)
// 4: Event Details (Step4)
// 5: Review (ReviewStep)
// 6: Confirmation (ConfirmationStep)

// Loading fallback for lazy-loaded components
const StepLoadingFallback = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
  </div>
)

export default function MultiStepForm() {
  return (
    <ClientOnly>
      <FormProvider>
        <MultiStepFormContent />
      </FormProvider>
    </ClientOnly>
  )
}

function MultiStepFormContent() {
  const { t } = useTranslation();
  const { currentStep } = useFormContext();
  
  // Memoize steps array to prevent unnecessary re-renders
  const steps = useMemo(() => [
    t('form.contactInfo.title'), 
    t('form.filmScreenings.title'), 
    t('form.screeningDetails.title'), 
    t('form.capacityAndEvent.steptitle'), 
    t('form.review.steptitle'), 
    t('form.confirmation.title')
  ], [t]);

  // Memoize the current step component to prevent unnecessary re-renders
  const CurrentStepComponent = useMemo(() => {
    switch (currentStep) {
      case 1: return Step1;
      case 2: return Step5;
      case 3: return Step2;
      case 4: return Step4;
      case 5: return ReviewStep;
      case 6: return ConfirmationStep;
      default: return null;
    }
  }, [currentStep]);

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0288d1] to-[#81D4FA]"></div>
      <ProgressIndicator steps={steps} currentStep={currentStep} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {CurrentStepComponent && (
            <Suspense fallback={<StepLoadingFallback />}>
              <CurrentStepComponent />
            </Suspense>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
