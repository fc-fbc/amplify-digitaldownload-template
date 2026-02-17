import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormData } from "@/lib/types"
import { useTranslation } from "@/lib/hooks/useTranslation"

interface FeedbackInfoProps {
  localFormData: FormData
  setLocalFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: { [key: string]: string }
  updateLocalAndContextData?: (data: FormData) => void
}

export const FeedbackInfo = ({
  localFormData,
  setLocalFormData,
  errors,
  updateLocalAndContextData
}: FeedbackInfoProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      {/* <div className="space-y-2">
        <Label>{t('form.feedback.howDidYouHear')} <span className="text-red-500">*</span></Label>
        <Select
          value={localFormData.how_did_you_hear || ""}
          onValueChange={(value) => {
            const updatedData = {
              ...localFormData,
              how_did_you_hear: value,
              how_did_you_hear_other: value !== "other" ? "" : localFormData.how_did_you_hear_other
            };
            if (updateLocalAndContextData) {
              updateLocalAndContextData(updatedData);
            } else {
              setLocalFormData(updatedData);
            }
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
        {errors.how_did_you_hear && (
          <p className="text-red-500 text-sm">{errors.how_did_you_hear}</p>
        )}
        {localFormData.how_did_you_hear === "other" && (
          <>
            <Input
              placeholder={t('placeholders.pleaseSpecify')}
              value={localFormData.how_did_you_hear_other || ""}
              required
              onChange={(e) => {
                const updatedData = {
                  ...localFormData,
                  how_did_you_hear_other: e.target.value
                };
                if (updateLocalAndContextData) {
                  updateLocalAndContextData(updatedData);
                } else {
                  setLocalFormData(updatedData);
                }
              }}
              className="border-[#81D4FA] focus:ring-[#0288d1] mt-2"
            />
            {errors.how_did_you_hear_other && (
              <p className="text-red-500 text-sm">{errors.how_did_you_hear_other}</p>
            )}
          </>
        )}
      </div> */}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="newsletter"
          checked={localFormData.newsletter_subscription}
          onCheckedChange={(checked) => {
            const updatedData = {
              ...localFormData,
              newsletter_subscription: checked as boolean
            };
            if (updateLocalAndContextData) {
              updateLocalAndContextData(updatedData);
            } else {
              setLocalFormData(updatedData);
            }
          }}
        />
        <Label htmlFor="newsletter">{t('form.feedback.newsletter')}</Label>
      </div>
    </div>
  )
}
