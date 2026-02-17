"use client"

import { cn } from "../lib/utils"
import { useEffect, useState } from "react"

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  // Use a state variable to track if we're hydrated
  const [isHydrated, setIsHydrated] = useState(false)
  
  // After hydration, update the state
  useEffect(() => {
    setIsHydrated(true)
  }, [])
  return (
    <nav aria-label="Progress" className="mb-8 w-full">
      <ol role="list" className="flex items-center w-full">
        {steps.map((step, index) => (
          <li key={step} className="relative flex-1">
            {/* Step indicator and label container */}
            <div className="flex flex-col items-center">
              {/* Step indicator */}
              <div className="flex items-center justify-center">
                {/* Use a consistent rendering approach until hydration is complete */}
                <div
                  className={`${
                    isHydrated && index < currentStep ? "bg-[#0288d1]" : "bg-[#81D4FA]"
                  } h-8 w-8 ${index === steps.length - 1 ? "rounded-none" : "rounded-full"} flex items-center justify-center transition-colors duration-300 ease-in-out flex-shrink-0 z-10`}
                >
                  {!isHydrated ? (
                    // During server rendering and before hydration, always show the number
                    <span className="text-[#81D4FA] font-semibold">
                      {index + 1}
                    </span>
                  ) : index < currentStep ? (
                    // After hydration, show checkmark for completed steps
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    // After hydration, show number for future steps
                    <span className={`${index === currentStep - 1 ? "text-[#0288d1]" : "text-[#81D4FA]"} font-semibold`}>
                      {index + 1}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Step label */}
              <div className="mt-2 hidden sm:block text-center w-full max-w-[120px]">
                <span className="text-[10px] font-medium text-gray-500 whitespace-normal">{step}</span>
              </div>
            </div>
            
            {/* Connecting lines - also use isHydrated for consistent rendering */}
            {index !== 0 && (
              <div 
                className={`${
                  isHydrated && index <= currentStep - 1 ? "bg-[#0288d1]" : "bg-[#81D4FA]"
                } h-0.5 w-1/2 absolute top-4 left-0 transition-colors duration-300 ease-in-out`}
              />
            )}
            
            {index !== steps.length - 1 && (
              <div
                className={`${
                  isHydrated && index < currentStep - 1 ? "bg-[#0288d1]" : "bg-[#81D4FA]"
                } h-0.5 w-1/2 absolute top-4 right-0 transition-colors duration-300 ease-in-out`}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
