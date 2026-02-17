import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { FormData } from "@/lib/types"

interface AdditionalInfoProps {
  // howDidYouHear: string
  // howDidYouHearOther: string
  newsletterSubscription: boolean
  onSelectChange: (name: string, value: string) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCheckboxChange: (name: string, checked: boolean) => void
  // howDidYouHearError?: string
  // howDidYouHearOtherError?: string
}

export const AdditionalInfo = ({
  // howDidYouHear,
  // howDidYouHearOther,
  newsletterSubscription,
  onSelectChange,
  onInputChange,
  onCheckboxChange,
  // howDidYouHearError,
  // howDidYouHearOtherError
}: AdditionalInfoProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <Label className="text-lg">{t('form.feedback.title')}</Label>
      
      {/* <div className="space-y-2">
        <Label>{t('form.feedback.howDidYouHear')} <span className="text-red-500">*</span></Label>
        <Select
          value={howDidYouHear || ""}
          onValueChange={(value) => {
            onSelectChange("how_did_you_hear", value);
          }}
          required
        >
          <SelectTrigger className="border-[#81D4FA] focus:ring-[#0288d1]">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="search">{t('form.feedback.search')}</SelectItem>
            <SelectItem value="social">{t('form.feedback.social')}</SelectItem>
            <SelectItem value="film-studio">{t('form.feedback.filmStudio')}</SelectItem>
            <SelectItem value="linkedin">{t('form.feedback.linkedin')}</SelectItem>
            <SelectItem value="facebook">{t('form.feedback.facebook')}</SelectItem>
            <SelectItem value="word-of-mouth">{t('form.feedback.wordOfMouth')}</SelectItem>
            <SelectItem value="prefer-not-to-say">{t('form.feedback.preferNotToSay')}</SelectItem>
            <SelectItem value="other">{t('form.feedback.other')}</SelectItem>
          </SelectContent>
        </Select>
        {howDidYouHearError && (
          <p className="text-red-500 text-sm">{howDidYouHearError}</p>
        )}
        {howDidYouHear === "other" && (
          <>
            <Input
              placeholder={t('placeholders.pleaseSpecify')}
              value={howDidYouHearOther || ""}
              name="how_did_you_hear_other"
              onChange={onInputChange}
              required
              className="border-[#81D4FA] focus:ring-[#0288d1] mt-2"
            />
            {howDidYouHearOtherError && (
              <p className="text-red-500 text-sm">{howDidYouHearOtherError}</p>
            )}
          </>
        )}
      </div> */}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          checked={newsletterSubscription}
          onCheckedChange={(checked) => {
            onCheckboxChange("newsletter_subscription", checked as boolean);
          }}
        />
        <Label htmlFor="newsletter">{t('form.feedback.newsletter')}</Label>
      </div>
    </div>
  )
}
