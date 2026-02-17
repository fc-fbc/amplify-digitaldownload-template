import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangeEvent } from "react"
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { useTranslation } from "@/lib/hooks/useTranslation"
import { MAX_TEXT_LENGTH } from "../utils/validators"

interface ContactInfoProps {
  email: string
  phone: string
  financeEmail?: string
  financePhoneN?: string
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  onPhoneChange: (phone: string) => void
  onFinancePhoneChange?: (phone: string) => void
  setPhoneInteraction: () => void
  emailError?: string
  phoneError?: string
  financeEmailError?: string
  financePhoneNError?: string
}

export const ContactInfo = ({
  email,
  phone,
  financeEmail,
  financePhoneN,
  onInputChange,
  onPhoneChange,
  onFinancePhoneChange,
  setPhoneInteraction,
  emailError,
  phoneError,
  financeEmailError,
  financePhoneNError
}: ContactInfoProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="space-y-4 w-1/2">
          <Label htmlFor="email" className="text-lg">
            {t('form.contactInfo.email')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            value={email}
            onChange={onInputChange}
            type="email"
            maxLength={100}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${
              emailError 
                ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "focus:border-[#0288d1]"
            }`}
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>

        <div className="space-y-4 w-1/2">
          <Label htmlFor="phone" className="text-lg">
            {t('form.contactInfo.phone')} <span className="text-red-500">*</span>
          </Label>
          <PhoneInput
            required
            defaultCountry="gb"
            value={phone}
            onChange={onPhoneChange}
            onFocus={setPhoneInteraction}
            // We don't need to validate on blur anymore since we'll validate on form submission
            inputClassName={`w-full !border-[#81D4FA] border-2 focus:ring-[#0288d1] ${
              phoneError 
                ? "!border-red-500 focus:border-red-500 focus:ring-red-500" 
                : "focus:border-[#0288d1]"
            }`}
            className="!border-[#81D4FA]"
            forceDialCode={true}
            placeholder=""
          />
          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
        </div>
      </div>

    </>
  )
}
