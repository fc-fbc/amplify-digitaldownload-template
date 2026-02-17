import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FormData } from "@/lib/types"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { MAX_SUMMARY_LENGTH } from "../utils/validators"

interface EventSummaryProps {
  localFormData: FormData
  setLocalFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: { [key: string]: string }
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  updateLocalAndContextData?: (data: FormData) => void
}

export const EventSummary = ({
  localFormData,
  setLocalFormData,
  errors,
  setErrors,
  updateLocalAndContextData
}: EventSummaryProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <Label>{t('form.capacityAndEvent.eventSummary')} <span className="text-red-500">*</span></Label>
        <div></div>
        <p className="text-sm text-gray-500">{t('form.capacityAndEvent.evemtSummarySubtitle')}</p>

        <Textarea
          id="summary"
          value={localFormData.event_summary?.summary || ""}
          onChange={(e) => {
            const summary = e.target.value;
            const updatedData = {
              ...localFormData,
              event_summary: {
                ...localFormData.event_summary!,
                summary,
                related_brand_activities: localFormData.event_summary!.related_brand_activities
              }
            };
            if (updateLocalAndContextData) {
              updateLocalAndContextData(updatedData);
            } else {
              setLocalFormData(updatedData);
            }
            
            // Clear error if value is now valid
            if (summary) {
              setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.summary;
                return newErrors;
              });
            }
            
            // Add error if exceeding max length
            if (summary.length > MAX_SUMMARY_LENGTH) {
              setErrors(prev => ({
                ...prev,
                summary: t('validation.maxLength', { max: MAX_SUMMARY_LENGTH })
              }));
            }
          }}
          className="border-[#81D4FA] focus:ring-[#0288d1]"
          maxLength={MAX_SUMMARY_LENGTH}
          required
        />
        <div className="flex justify-end mt-1 text-sm text-gray-500">
          <span className={`${(localFormData.event_summary?.summary?.length || 0) >= MAX_SUMMARY_LENGTH ? 'text-red-500 font-medium' : ''}`}>
            {localFormData.event_summary?.summary?.length || 0}/{MAX_SUMMARY_LENGTH}
          </span>
        </div>
        {errors.summary && (
          <p className="text-red-500 text-sm">{errors.summary}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-lg">{t('form.capacityAndEvent.brandActivities')} <span className="text-red-500">*</span></Label>
        </div>
        <RadioGroup
          id="has_brand_activities"
          value={localFormData.event_summary?.has_brand_activities === undefined ? "" : localFormData.event_summary?.has_brand_activities ? "yes" : "no"}
          onValueChange={(value) => {
            const updatedData = {
              ...localFormData,
              event_summary: {
                ...localFormData.event_summary!,
                has_brand_activities: value === "" ? undefined as unknown as boolean : value === "yes",
                related_brand_activities: value === "no" ? "" : localFormData.event_summary!.related_brand_activities
              }
            };
            if (updateLocalAndContextData) {
              updateLocalAndContextData(updatedData);
            } else {
              setLocalFormData(updatedData);
            }
            // Clear error when value is selected
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.has_brand_activities;
              return newErrors;
            });
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="brand-activities-yes" />
            <Label htmlFor="brand-activities-yes">{t('common.yes')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="brand-activities-no" />
            <Label htmlFor="brand-activities-no">{t('common.no')}</Label>
          </div>
        </RadioGroup>
        {errors.has_brand_activities && (
          <p className="text-red-500 text-sm">{errors.has_brand_activities}</p>
        )}

        {localFormData.event_summary?.has_brand_activities && (
          <div>
            <Label>{t('form.capacityAndEvent.relatedBrandActivities')} <span className="text-red-500">*</span></Label>
            <Textarea
              id="related_brand_activities"
              value={localFormData.event_summary?.related_brand_activities || ""}
              onChange={(e) => {
                const relatedActivities = e.target.value;
                const updatedData = {
                  ...localFormData,
                  event_summary: {
                    ...localFormData.event_summary!,
                    related_brand_activities: relatedActivities,
                    summary: localFormData.event_summary!.summary
                  }
                };
                if (updateLocalAndContextData) {
                  updateLocalAndContextData(updatedData);
                } else {
                  setLocalFormData(updatedData);
                }
                
                // Clear error if value is now valid
                if (relatedActivities) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.related_brand_activities;
                    return newErrors;
                  });
                }
                
                // Add error if exceeding max length
                if (relatedActivities.length > MAX_SUMMARY_LENGTH) {
                  setErrors(prev => ({
                    ...prev,
                    related_brand_activities: t('validation.maxLength', { max: MAX_SUMMARY_LENGTH })
                  }));
                }
              }}
              className="border-[#81D4FA] focus:ring-[#0288d1]"
              placeholder={t('common.pleaseSpecify')}
              maxLength={MAX_SUMMARY_LENGTH}
              required
            />
            <div className="flex justify-end mt-1 text-sm text-gray-500">
              <span className={`${(localFormData.event_summary?.related_brand_activities?.length || 0) >= MAX_SUMMARY_LENGTH ? 'text-red-500 font-medium' : ''}`}>
                {localFormData.event_summary?.related_brand_activities?.length || 0}/{MAX_SUMMARY_LENGTH}
              </span>
            </div>
            {errors.related_brand_activities && (
              <p className="text-red-500 text-sm">{errors.related_brand_activities}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
