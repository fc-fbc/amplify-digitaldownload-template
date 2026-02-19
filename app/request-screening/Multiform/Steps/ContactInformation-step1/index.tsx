"use client"

import { FormEvent } from "react"
import { GradientButton } from "@/components/ui/gradient-button"
import { useFormValidation } from "./hooks/useFormValidation"
import { PrivacyConsent } from "./components/PrivacyConsent"
import { ContactPersonInfo } from "./components/ContactPersonInfo"
import { CompanyInfo } from "./components/CompanyInfo"
import { AddressInfo } from "./components/AddressInfo"
import { ContactInfo } from "./components/ContactInfo"
import { AdditionalInfo } from "./components/AdditionalInfo"
import { useFormContext } from "../../context/FormContext"
import { useTranslation } from "@/lib/hooks/useTranslation"

export default function Step1() {
  const { t } = useTranslation();
  const { nextStep, updateFormData } = useFormContext();
  
  const {
    formData,
    errors,
    handleInputChange,
    handleRadioChange,
    handleCheckboxChange,
    handlePhoneChange,
    handleFinancePhoneChange,
    setPhoneInteraction,
    validateFormData,
    focusFirstError
  } = useFormValidation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form data before proceeding
    const isValid = validateFormData()
    
    if (!isValid) {
      focusFirstError()
      return
    }

    try {
      await nextStep()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PrivacyConsent
        checked={formData.privacyConsent}
        onCheckedChange={(checked) => handleCheckboxChange("privacyConsent", checked)}
        error={errors.privacyConsent}
      />

      <ContactPersonInfo
        firstName={formData.contact_info.first_name}
        lastName={formData.contact_info.last_name}
        onInputChange={handleInputChange}
        firstNameError={errors.first_name}
        lastNameError={errors.last_name}
      />

      <CompanyInfo
        companyName={formData.contact_info.company_name}
        stslAccountNumber={formData.finance_details?.stsl_account_number || ""}
        stslUserName={formData.finance_details?.stsl_user_name || ""}
        onInputChange={handleInputChange}
        onRadioChange={handleRadioChange}
        companyNameError={errors.company_name}
        stslAccountNumberError={errors.stsl_account_number}
        stslUserNameError={errors.stsl_user_name}
        companyRegistrationNumberError={errors.company_registration_number}
        vatNumberError={errors.vat_number}
      />

      <AddressInfo
        address={formData.contact_info.address}
        onInputChange={handleInputChange}
        errors={{
          street_1: errors.street_1,
          street_2: errors.street_2,
          city: errors.city,
          state: errors.state,
          postal_code: errors.postal_code,
          country: errors.country
        }}
      />

      <ContactInfo
        email={formData.contact_info.email}
        phone={formData.contact_info.phone}
        financeEmail={formData.finance_details?.finance_email}
        financePhoneN={formData.finance_details?.finance_phone}
        onInputChange={handleInputChange}
        onPhoneChange={handlePhoneChange}
        onFinancePhoneChange={handleFinancePhoneChange}
        setPhoneInteraction={setPhoneInteraction}
        emailError={errors.email}
        phoneError={errors.phone}
        financeEmailError={errors.finance_email}
        financePhoneNError={errors.finance_phone}
      />

      <AdditionalInfo 
        // howDidYouHear={formData.how_did_you_hear || ""}
        // howDidYouHearOther={formData.how_did_you_hear_other || ""}
        newsletterSubscription={formData.newsletter_subscription || false}
        onSelectChange={(name, value) => {
          const updatedData = {
            ...formData,
            [name]: value,
            // how_did_you_hear_other: value !== "other" ? "" : formData.how_did_you_hear_other
          };
          updateFormData(updatedData);
        }}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
        // howDidYouHearError={errors.how_did_you_hear}
        // howDidYouHearOtherError={errors.how_did_you_hear_other}
      />

      <GradientButton
        type="submit"
        className="w-full"
      >
        {t('common.next')}
      </GradientButton>
    </form>
  )
}
