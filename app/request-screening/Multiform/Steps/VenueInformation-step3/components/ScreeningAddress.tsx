"use client"

import { ChangeEvent } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CountryDropdown, Country } from "@/components/ui/country-dropdown"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ScreeningAddressProps {
  address: {
    street_1: string
    street_2: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  errors: {
    street_1?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  useSameAddress: boolean
  setUseSameAddress: (value: boolean) => void
}

export default function ScreeningAddress({ 
  address, 
  handleInputChange, 
  errors, 
  useSameAddress, 
  setUseSameAddress 
}: ScreeningAddressProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <Label className="text-lg">{t('form.screeningDetails.screeningAddress')} <span className="text-red-500">*</span></Label>
      
      <div className="mb-4">
        <Label className="text-base">{t('form.screeningDetails.useSameAddress')}</Label>
        <RadioGroup 
          className="mt-2" 
          value={useSameAddress ? "yes" : "no"}
          onValueChange={(value) => setUseSameAddress(value === "yes")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="same-address-yes" />
            <Label htmlFor="same-address-yes" className="cursor-pointer">{t('common.yes')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="same-address-no" />
            <Label htmlFor="same-address-no" className="cursor-pointer">{t('common.no')}</Label>
          </div>
        </RadioGroup>
      </div>
      
      {!useSameAddress && (
        <>
          <Input
            name="screening_address.street_1"
            value={address.street_1}
            onChange={handleInputChange}
            placeholder={t('form.contactInfo.street1')}
            maxLength={50}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.street_1 ? "border-red-500" : ""}`}
            required
          />
          {errors.street_1 && <p className="text-red-500 text-sm">{errors.street_1}</p>}
          
          <Input
            name="screening_address.street_2"
            value={address.street_2}
            onChange={handleInputChange}
            placeholder={t('form.contactInfo.street2')}
            maxLength={50}
            className="border-[#81D4FA] focus:ring-[#0288d1]"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                name="screening_address.city"
                value={address.city}
                onChange={handleInputChange}
                placeholder={t('form.contactInfo.city')}
                maxLength={50}
                className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.city ? "border-red-500" : ""}`}
                required
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>

            <div>
              <Input
                name="screening_address.state"
                value={address.state}
                onChange={handleInputChange}
                placeholder={t('form.contactInfo.state')}
                maxLength={50}
                className={`border-[#81D4FA] focus:ring-[#0288d1] ${errors.state ? "border-red-500" : ""}`}
                required
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>

            <div>
              <Input
                name="screening_address.postal_code"
                value={address.postal_code}
                onChange={handleInputChange}
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
                      name: 'screening_address.country',
                      value: country.name
                    }
                  } as ChangeEvent<HTMLInputElement>;
                  handleInputChange(event);
                }}
                t={t}
                error={!!errors.country}
                required
              />
              {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
