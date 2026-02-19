import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChangeEvent } from "react"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { MAX_TEXT_LENGTH } from "../utils/validators"

interface CompanyInfoProps {
  companyName: string
  stslAccountNumber: string
  stslUserName: string
  // isRegisteredCompany: boolean
  // companyRegistrationNumber: string
  // isVatRegistered: boolean
  // vatNumber: string
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  onRadioChange: (name: string, value: any) => void
  companyNameError?: string
  stslAccountNumberError?: string
  stslUserNameError?: string
  companyRegistrationNumberError?: string
  vatNumberError?: string
}

export const CompanyInfo = ({
  companyName,
  stslAccountNumber,
  stslUserName,
  // isRegisteredCompany,
  // companyRegistrationNumber,
  // isVatRegistered,
  // vatNumber,
  onInputChange,
  onRadioChange,
  companyNameError,
  stslAccountNumberError,
  stslUserNameError,
  companyRegistrationNumberError,
  vatNumberError
}: CompanyInfoProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="space-y-4">
        {/* First row - Company Name and STSL Account Number */}
        <div className="flex flex-row gap-4">
          <div className="w-1/2">
            <Label htmlFor="business" className="text-lg">
              {t('form.contactInfo.companyName')} <span className="text-red-500">*</span>
            </Label>
          </div>
          <div className="w-1/2">
            <Label htmlFor="stsl_account_number" className="text-lg">
              {t('form.contactInfo.stslAccountNumber')} <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              {t('form.contactInfo.stslAccountInfo')} <a href="https://imaccs.filmbankmedia.com/imaccs/?customer_type=S" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{t('form.contactInfo.here')}</a>
            </p>
          </div>
        </div>

        {/* First row inputs */}
        <div className="flex flex-row gap-4">
          <div className="w-1/2">
            <Input
              id="business"
              name="company_name"
              value={companyName}
              onChange={onInputChange}
              maxLength={160}
              className={`border-[#81D4FA] focus:ring-[#0288d1] ${
                companyNameError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "focus:border-[#0288d1]"
              }`}
              required
            />
            {companyNameError && <p className="text-red-500 text-sm mt-1">{companyNameError}</p>}
          </div>
          <div className="w-1/2">
            <Input
              id="stsl_account_number"
              name="stsl_account_number"
              value={stslAccountNumber}
              onChange={onInputChange}
              maxLength={40}
              className={`border-[#81D4FA] focus:ring-[#0288d1] ${
                stslAccountNumberError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "focus:border-[#0288d1]"
              }`}
              required
            />
            {stslAccountNumberError && <p className="text-red-500 text-sm mt-1">{stslAccountNumberError}</p>}
          </div>
        </div>

        {/* Second row - STSL User Name */}
        <div className="w-1/2">
          <Label htmlFor="stsl_user_name" className="text-lg">
            {t('form.contactInfo.stslUserName')} <span className="text-red-500">*</span>
          </Label>
        </div>

        {/* Second row input */}
        <div className="w-1/2">
          <Input
            id="stsl_user_name"
            name="stsl_user_name"
            value={stslUserName}
            onChange={onInputChange}
            maxLength={160}
            className={`border-[#81D4FA] focus:ring-[#0288d1] ${
              stslUserNameError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "focus:border-[#0288d1]"
            }`}
            required
          />
          {stslUserNameError && <p className="text-red-500 text-sm mt-1">{stslUserNameError}</p>}
        </div>
      </div>


      
      {/* <div className="space-y-4">
        <Label className="text-lg">{t('form.contactInfo.isRegisteredCompany')} <span className="text-red-500">*</span></Label>
        <RadioGroup
          onValueChange={(value) => onRadioChange("is_registered_company", value === "yes")}
          value={isRegisteredCompany ? "yes" : "no"}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="reg-yes" />
            <Label htmlFor="reg-yes">{t('common.yes')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="reg-no" />
            <Label htmlFor="reg-no">{t('common.no')}</Label>
          </div>
        </RadioGroup>
      </div>

      {isRegisteredCompany && (
        <div className="space-y-4">
          <Label htmlFor="company_registration_number" className="text-lg">
            {t('form.contactInfo.companyRegistrationNumber')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="company_registration_number"
            name="company_registration_number"
            value={companyRegistrationNumber}
            onChange={onInputChange}
            maxLength={40}
            className={`border-[#81D4FA] w-1/2 focus:ring-[#0288d1] ${
              companyRegistrationNumberError ? "border-red-500" : ""
            }`}
            required
          />
          {companyRegistrationNumberError && (
            <p className="text-red-500 text-sm">{companyRegistrationNumberError}</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <Label className="text-lg">{t('form.contactInfo.isVatRegistered')} <span className="text-red-500">*</span></Label>
        <RadioGroup
          onValueChange={(value) => onRadioChange("is_vat_registered", value === "yes")}
          value={isVatRegistered ? "yes" : "no"}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="vat-yes" />
            <Label htmlFor="vat-yes">{t('common.yes')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="vat-no" />
            <Label htmlFor="vat-no">{t('common.no')}</Label>
          </div>
        </RadioGroup>
      </div>

      {isVatRegistered && (
        <div className="space-y-4">
          <Label htmlFor="vat_number" className="text-lg">
            {t('form.contactInfo.vatNumber')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vat_number"
            name="vat_number"
            value={vatNumber}
            onChange={onInputChange}
            maxLength={40}
            className={`border-[#81D4FA] focus:ring-[#0288d1]  w-1/2 ${vatNumberError ? "border-red-500" : ""}`}
            required
          />
          {vatNumberError && <p className="text-red-500 text-sm">{vatNumberError}</p>}
        </div>
      )} */}
    </>
  )
}
