"use client"

//comment

import { Button } from "@/components/ui/button"
import { useFormContext } from "../../context/FormContext"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useState, useEffect, useRef } from "react"
import { clearSecureStorage } from "@/lib/utils/secureStorage"

export default function ConfirmationStep() {
  const { submissionResult, resetForm } = useFormContext();
  const [isResetting, setIsResetting] = useState(false);
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Store the submission result in a ref to persist it even if context changes
  const submissionResultRef = useRef(submissionResult);
  
  // Store whether the submission was successful in state to persist it
  const [wasSuccessful, setWasSuccessful] = useState(false);
  
  // Initialize on first render and hydration
  useEffect(() => {
    setIsHydrated(true);
    
    // Store the initial submission result
    if (submissionResult && !submissionResultRef.current) {
      submissionResultRef.current = submissionResult;
    }
    
    // Determine if submission was successful based on presence of data and absence of error
    const successful = !!submissionResult?.data && !submissionResult?.error;
    setWasSuccessful(successful);
    
    // Clear all form data when leaving the confirmation page
    return () => {
      clearSecureStorage(['locale', 'lastActivityTimestamp', 'formLastAccessed']);
    };
  }, [submissionResult, isResetting]);
  
  // Use the stored submission result or the current one from context
  const effectiveSubmissionResult = submissionResultRef.current || submissionResult;
  
  // Determine if submission was successful based on our stored state
  const isSuccessful = wasSuccessful;

  const handleRequestAnother = () => {
    // Only proceed if component is hydrated
    if (!isHydrated) return;
    
    // Set resetting state
    setIsResetting(true);
    
    // Clear ALL secure storage to ensure a fresh start
    clearSecureStorage(['locale']);
    
    // Call resetForm directly without checking isResetting state
    // This ensures the form reset happens regardless of state batching
    resetForm();
  };

  return (
    <div className="space-y-8" data-resetting={isResetting ? "true" : "false"}>
      <h2 className="text-2xl font-semibold text-[#0288d1]">{t('form.confirmation.submissionStatus')}</h2>
      
      <div className="space-y-6">
        {!isHydrated ? (
          // During server rendering and before hydration, show a simple loading state
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg flex justify-center items-center min-h-[200px]">
            <p className="text-gray-600">{t('form.confirmation.loading')}</p>
          </div>
        ) : isResetting ? (
          // After hydration, show the appropriate content based on state
          // Show loading state during reset to prevent flash of error
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg flex justify-center items-center min-h-[200px]">
            <p className="text-gray-600">{t('form.confirmation.redirecting')}</p>
          </div>
        ) : isSuccessful ? (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-4">{t('form.confirmation.submissionSuccessful')}</h3>
            <p className="text-green-600 mb-4">{t('form.confirmation.requestSubmitted')}</p>
            {effectiveSubmissionResult?.data?.data?.timestamp && (
              <p className="text-sm text-green-600 mt-2">{t('form.confirmation.submissionDate')} {new Date(effectiveSubmissionResult.data.data.timestamp * 1000).toLocaleDateString()}</p>
            )}
            <p>&nbsp;</p>
            <p className="text-sm text-green-600">{t('form.confirmation.referenceId')} {effectiveSubmissionResult?.data?.data?.id}</p>
            <p className="mt-4 text-sm text-green-600 text-center">{t('form.confirmation.thankYouMessage')}</p>
          </div>
        ) : (
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-xl font-semibold text-red-700 mb-4">{t('form.confirmation.submissionFailed')}</h3>
            <p className="text-red-600 mb-4">{t('form.confirmation.errorSubmitting')}</p>
            {effectiveSubmissionResult?.error?.message && (
              <p className="text-sm text-red-600">{t('form.confirmation.error')} {effectiveSubmissionResult.error.message}</p>
            )}
            <p className="mt-2 text-sm text-red-600 text-center">{t('form.confirmation.tryAgainLater')}</p>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleRequestAnother}
            disabled={!isHydrated || isResetting}
            className="bg-[#0288d1] text-white hover:bg-[#0288d1]/90 disabled:opacity-50"
          >
            {isResetting ? t('form.confirmation.redirecting') : t('form.review.requestAnotherScreening')}
          </Button>
        </div>
      </div>
    </div>
  );
}
