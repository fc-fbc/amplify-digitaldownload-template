import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangeEvent, useEffect } from "react"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { MAX_TEXT_LENGTH } from "../utils/validators"
import { CountryDropdown, Country } from "@/components/ui/country-dropdown"

interface AddressInfoProps {
  address: {
    street_1: string
    street_2: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  errors: {
    street_1?: string
    street_2?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
}

export const AddressInfo = ({
  address,
  onInputChange,
  errors
}: AddressInfoProps) => {
  const { t } = useTranslation();
  
  // No default country selection to avoid bias
  return (
    <div className="space-y-4">
      <Label className="text-lg">{t('form.contactInfo.address')} <span className="text-red-500">*</span></Label>
      <Input
        name="address.street_1"
        value={address.street_1}
        onChange={onInputChange}
        placeholder={t('form.contactInfo.street1')}
        maxLength={100}
        className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.street_1 ? "border-red-500" : ""}`}
        required
      />
      {errors.street_1 && <p className="text-red-500 text-sm">{errors.street_1}</p>}
      
      <Input
        name="address.street_2"
        value={address.street_2}
        onChange={onInputChange}
        placeholder={t('form.contactInfo.street2')}
        maxLength={100}
        className="border-[#81D4FA] focus:ring-[#0288d1]"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            name="address.city"
            value={address.city}
            onChange={onInputChange}
            placeholder={t('form.contactInfo.city')}
            maxLength={50}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.city ? "border-red-500" : ""}`}
            required
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        <div>
          <Input
            name="address.state"
            value={address.state}
            onChange={onInputChange}
            placeholder={t('form.contactInfo.state')}
            maxLength={50}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.state ? "border-red-500" : ""}`}
            required
          />
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        </div>

        <div>
          <Input
            name="address.postal_code"
            value={address.postal_code}
            onChange={onInputChange}
            placeholder={t('form.contactInfo.postalCode')}
            maxLength={20}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.postal_code ? "border-red-500" : ""}`}
            required
          />
          {errors.postal_code && <p className="text-red-500 text-sm">{errors.postal_code}</p>}
        </div>

        <div>
          <CountryDropdown
            placeholder={t('form.contactInfo.country')}
            defaultValue={address.country}
            onChange={(country: Country) => {
              const event = {
                target: {
                  name: 'address.country',
                  value: country.name
                }
              } as ChangeEvent<HTMLInputElement>;
              onInputChange(event);
            }}
            t={t}
            error={!!errors.country}
            required
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>
      </div>
    </div>
  )
}
