"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTranslation } from "@/lib/hooks/useTranslation"

interface ScreeningTypeProps {
  screeningType: string
  setScreeningType: (value: string) => void
  error?: string
}

export default function ScreeningType({ screeningType, setScreeningType, error }: ScreeningTypeProps) {
  const { t } = useTranslation();
  
  // Screening type options with translations
  const screeningTypes = [
    { value: "Indoors", label: t('form.screeningDetails.indoors') },
    { value: "Outdoors", label: t('form.screeningDetails.outdoors') },
    { value: "Drive In", label: t('form.screeningDetails.driveIn') }
  ];
  return (
    <div className="space-y-4">
      <Label className="text-lg">
        {t('form.screeningDetails.screeningType')} <span className="text-red-500">*</span>
      </Label>
      <RadioGroup
        onValueChange={setScreeningType}
        value={screeningType}
      >
        {screeningTypes.map((type) => (
          <div key={type.value} className="flex items-center space-x-2">
            <RadioGroupItem value={type.value} id={type.value} />
            <Label htmlFor={type.value}>{type.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
