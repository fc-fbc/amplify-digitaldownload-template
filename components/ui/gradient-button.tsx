import React from 'react'
import { cn } from "@/lib/utils"
import { useFormContext } from "@/app/request-screening/Multiform/context/FormContext"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'next' | 'previous'
  children: React.ReactNode
  className?: string
}

export function GradientButton({
  variant = 'next',
  children,
  className,
  ...props
}: GradientButtonProps) {
  // Try to get isTransitioning from form context
  // Wrap in try/catch to handle cases where the button is used outside the form context
  let isTransitioning = false;
  try {
    const formContext = useFormContext();
    isTransitioning = formContext.isTransitioning;
  } catch (error) {
    // Button is used outside of form context, isTransitioning remains false
  }
  
  const gradientClass = variant === 'next' 
    ? 'bg-gradient-to-r from-blue-400 to-blue-800'
    : 'bg-gradient-to-r from-slate-500 to-slate-800'

  return (
    <button 
      className={cn(
        "px-8 py-2 rounded-lg relative transition duration-300 text-white",
        gradientClass,
        "hover:opacity-90",
        "flex items-center justify-center gap-2",
        isTransitioning && "opacity-70 cursor-not-allowed",
        className
      )} 
      disabled={isTransitioning || props.disabled}
      {...props}
    >
      {isTransitioning ? (
        // Loading spinner when transitioning
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : variant === 'previous' ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-transform"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
      ) : null}
      
      {children}
      
      {!isTransitioning && variant === 'next' && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-transform"
        >
          <path d="m9 18 6-6-6-6"/>
        </svg>
      )}
    </button>
  )
}
