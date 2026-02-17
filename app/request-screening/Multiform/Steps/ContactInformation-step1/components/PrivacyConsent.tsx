import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/lib/hooks/useTranslation"

interface PrivacyConsentProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  error?: string
}

export const PrivacyConsent = ({
  checked,
  onCheckedChange,
  error
}: PrivacyConsentProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox
          id="privacyConsent"
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(checked === true)}
          className="mt-1"
        />
        <div>
          <Label htmlFor="privacyConsent" className="text-lg font-semibold">
            {t('privacy.consentText')} <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-gray-600 mt-1">
            {t('privacy.readPolicy')}{" "}
            <a
              href="https://www.filmbankmedia.com/privacy-notice/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0288d1] hover:underline"
            >
              {t('privacy.policyLink')}
            </a>
            .
          </p>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
