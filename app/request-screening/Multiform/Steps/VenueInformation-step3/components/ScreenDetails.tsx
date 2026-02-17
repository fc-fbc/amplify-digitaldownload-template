"use client"

import { ChangeEvent } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/hooks/useTranslation"


// Maximum number of digits allowed for width and height
const MAX_DIGITS = 2;

interface ScreenDetailsProps {
  screenSize: {
    width_m: number
    height_m: number
  }
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: {
    width_m?: string
    height_m?: string
  }
}

export default function ScreenDetails({ screenSize, handleInputChange, errors }: ScreenDetailsProps) {
  const { t } = useTranslation();

  const handleScreenSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (value.length <= MAX_DIGITS && !isNaN(Number(value)))) {
      handleInputChange(e);
    }
  };
  return (
    <div className="space-y-4">
      <Label className="text-lg">
        {t('form.screeningDetails.screenSize')} <span className="text-red-500">*</span>
      </Label>
      <div className="flex items-center space-x-4">
        <div className="w-24">
          <Input
            name="screen_size.width_m"
            type="number"
            value={screenSize.width_m || ""}
            onChange={handleScreenSizeChange}
            maxLength={MAX_DIGITS}
            placeholder={t('form.screeningDetails.width')}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.width_m ? "border-red-500" : ""}`}
            onWheel={(e) => e.currentTarget.blur()}
            required
          />
          {errors.width_m && <p className="text-red-500 text-sm">{errors.width_m}</p>}
        </div>
        <span className="text-xl">×</span>
        <div className="w-24">
          <Input
            name="screen_size.height_m"
            type="number"
            value={screenSize.height_m || ""}
            onChange={handleScreenSizeChange}
            maxLength={MAX_DIGITS}
            placeholder={t('form.screeningDetails.height')}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.height_m ? "border-red-500" : ""}`}
            onWheel={(e) => e.currentTarget.blur()}
            required
          />
          {errors.height_m && <p className="text-red-500 text-sm">{errors.height_m}</p>}
        </div>
      </div>
    </div>
  )
}
