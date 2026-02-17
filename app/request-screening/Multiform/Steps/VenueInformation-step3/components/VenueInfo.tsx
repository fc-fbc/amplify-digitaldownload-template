"use client"

import { ChangeEvent, useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useFormContext } from "../../../context/FormContext"

interface VenueInfoProps {
  eventWebsite: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  setHasWebsite: (value: boolean) => void
  errors: {
    venue?: string
    event_website?: string
    has_website?: string
  }
}

export default function VenueInfo({ eventWebsite, handleInputChange, setHasWebsite, errors }: VenueInfoProps) {
  const { t } = useTranslation();
  const { formData } = useFormContext();
  // Use local state that's initialized from and synchronized with form context
  const [hasWebsite, setHasWebsiteLocal] = useState<boolean | undefined>(formData.screening_details?.has_website);
  
  // Keep local state in sync with form context
  useEffect(() => {
    // console.log("Form context has_website changed:", formData.screening_details?.has_website);
    setHasWebsiteLocal(formData.screening_details?.has_website);
  }, [formData.screening_details?.has_website]);
  
  // Log the current state of hasWebsite and RadioGroup value
  useEffect(() => {
    // console.log("Local hasWebsite state:", hasWebsite);
    // console.log("RadioGroup value:", hasWebsite === undefined ? "" : hasWebsite === true ? "yes" : "no");
  }, [hasWebsite]);
  
  // Custom handler for website URL to handle URLs without protocols
  const handleWebsiteChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    
    // Only process non-empty values
    if (value && !value.match(/^https?:\/\//i)) {
      // If URL doesn't start with http:// or https://, prepend https://
      // But don't modify the actual input value yet - this happens on blur
      // This allows users to type naturally without the cursor jumping
      const syntheticEvent = {
        target: {
          name: e.target.name,
          value: value
        }
      } as ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    } else {
      handleInputChange(e);
    }
  };

  // Handle blur event to format the URL properly when user leaves the field
  const handleWebsiteBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    
    if (value && !value.match(/^https?:\/\//i)) {
      // When the user leaves the field, update with the protocol added
      const syntheticEvent = {
        target: {
          name: e.target.name,
          value: `https://${value}`
        }
      } as ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
  };

  // Handle website option change
  const handleWebsiteOptionChange = (value: string) => {
    console.log("Website option changed to:", value);
    const hasWebsiteValue = value === "yes";
    
    // If user selects "No", clear the website field first
    if (!hasWebsiteValue) {
      console.log("Clearing website field because No was selected");
      const syntheticEvent = {
        target: {
          name: "event_website",
          value: ""
        }
      } as ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
    }
    
    // Update both local state and form context
    console.log("Setting has_website to:", hasWebsiteValue);
    setHasWebsiteLocal(hasWebsiteValue);
    setHasWebsite(hasWebsiteValue);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-4">
          <Label className="text-lg">
            {t('form.screeningDetails.hasEventWebsite') || "Do you have a website for your event?"}
          </Label>
          <RadioGroup
            key={`website-radio-${hasWebsite === undefined ? "undefined" : hasWebsite ? "yes" : "no"}`}
            onValueChange={handleWebsiteOptionChange}
            value={hasWebsite === undefined ? "" : hasWebsite === true ? "yes" : "no"}
            required
            name="has_website"
            defaultValue={hasWebsite === undefined ? "" : hasWebsite === true ? "yes" : "no"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="website-yes" />
              <Label htmlFor="website-yes">{t('common.yes') || "Yes"}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="website-no" />
              <Label htmlFor="website-no">{t('common.no') || "No"}</Label>
            </div>
          </RadioGroup>
          {errors.has_website && <p className="text-red-500 text-sm">{errors.has_website}</p>}
        </div>

        {hasWebsite && (
          <div className="space-y-4">
            <Label htmlFor="event_website" className="text-lg">
              {t('form.screeningDetails.eventWebsite')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="event_website"
              name="event_website"
              type="text"
              value={eventWebsite}
              onChange={handleWebsiteChange}
              onBlur={handleWebsiteBlur}
              maxLength={200}
              className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.event_website ? "border-red-500" : ""}`}
              placeholder={t('placeholders.https') || "https://"}
              required={hasWebsite === true}
            />
            {errors.event_website && <p className="text-red-500 text-sm">{errors.event_website}</p>}
          </div>
        )}
      </div>
    </>
  )
}
