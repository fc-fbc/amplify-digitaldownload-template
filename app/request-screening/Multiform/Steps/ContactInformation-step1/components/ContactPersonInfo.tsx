import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangeEvent } from "react"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { MAX_TEXT_LENGTH } from "../utils/validators"

interface ContactPersonInfoProps {
  firstName: string
  lastName: string
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  firstNameError?: string
  lastNameError?: string
}

export const ContactPersonInfo = ({
  firstName,
  lastName,
  onInputChange,
  firstNameError,
  lastNameError
}: ContactPersonInfoProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <Label className="text-lg">
        {t('form.contactInfo.contactPerson')} <span className="text-red-500">*</span>
      </Label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            id="first_name"
            name="first_name"
            autoComplete="given-name"
            placeholder={t('form.contactInfo.firstName')}
            value={firstName}
            onChange={onInputChange}
            maxLength={50}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${
              firstNameError 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "focus:border-[#0288d1]"
            }`}
            required
          />
          {firstNameError && <p className="text-red-500 text-sm">{firstNameError}</p>}
        </div>
        <div>
          <Input
            id="last_name"
            name="last_name"
            autoComplete="family-name"
            placeholder={t('form.contactInfo.lastName')}
            value={lastName}
            onChange={onInputChange}
            maxLength={50}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${
              lastNameError 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "focus:border-[#0288d1]"
            }`}
            required
          />
          {lastNameError && <p className="text-red-500 text-sm">{lastNameError}</p>}
        </div>
      </div>
    </div>
  )
}
