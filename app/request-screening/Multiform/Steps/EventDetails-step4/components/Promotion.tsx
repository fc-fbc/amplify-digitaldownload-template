import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import InfoButton from "@/components/InfoButton"
import { FormData } from "@/lib/types"
import { useFormContext } from "../../../context/FormContext"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { MAX_PARTIES } from "../utils/validators"

interface PromotionProps {
  localFormData: FormData
  setLocalFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: { [key: string]: string }
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  promotionMethods: string[]
  handlePromotionMethodChange: (method: string, checked: boolean) => void
  newParty: string
  setNewParty: React.Dispatch<React.SetStateAction<string>>
  handleAddParty: () => void
  handleRemoveParty: (party: string) => void
}

export const Promotion = ({
  localFormData,
  setLocalFormData,
  errors,
  setErrors,
  promotionMethods,
  handlePromotionMethodChange,
  newParty,
  setNewParty,
  handleAddParty,
  handleRemoveParty
}: PromotionProps) => {
  const { t } = useTranslation();
  const { updateFormData } = useFormContext();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-lg">{t('form.capacityAndEvent.isPromoted')} <span className="text-red-500">*</span></Label>
        <InfoButton content={t('form.capacityAndEvent.promotionInfobutton')} />
      </div>
      <RadioGroup
        id="is_promoted"
        value={localFormData.promotion?.is_promoted === undefined ? "" : localFormData.promotion?.is_promoted ? "yes" : "no"}
        onValueChange={(value) => {
          // First create the updated data
          const updatedData = {
            ...localFormData,
            promotion: {
              ...localFormData.promotion!,
              is_promoted: value === "" ? undefined as unknown as boolean : value === "yes"
            }
          };
          
          // Then update both local state and context
          setLocalFormData(updatedData);
          updateFormData(updatedData);
          
          // Clear error when value is selected
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.is_promoted;
            return newErrors;
          });
        }}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="promotion-yes" />
          <Label htmlFor="promotion-yes">{t('common.yes')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="promotion-no" />
          <Label htmlFor="promotion-no">{t('common.no')}</Label>
        </div>
      </RadioGroup>
      {errors.is_promoted && (
        <p className="text-red-500 text-sm">{errors.is_promoted}</p>
      )}

      {localFormData.promotion?.is_promoted && (
        <div className="space-y-4">
          <Label>{t('form.capacityAndEvent.promotionMethods')} <span className="text-red-500">*</span></Label>
          <div id="promotion_methods" className="grid grid-cols-2 gap-4">
            {promotionMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                  id={`method-${method}`}
                  checked={localFormData.promotion?.promotion_methods.includes(method)}
                  onCheckedChange={(checked) => {
                    // First update local state
                    const updatedData = {
                      ...localFormData,
                      promotion: {
                        ...localFormData.promotion!,
                        promotion_methods: checked
                          ? [...localFormData.promotion!.promotion_methods, method]
                          : localFormData.promotion!.promotion_methods.filter(m => m !== method)
                      }
                    };
                    // Then update both local state and context
                    setLocalFormData(updatedData);
                    updateFormData(updatedData);
                    
                    // Clear error if at least one method is selected
                    if (checked) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.promotion_methods;
                        return newErrors;
                      });
                    }
                  }}
                />
                <Label htmlFor={`method-${method}`}>{method}</Label>
              </div>
            ))}
          </div>
          {errors.promotion_methods && (
            <p className="text-red-500 text-sm">{errors.promotion_methods}</p>
          )}

          <div>
            <Label htmlFor="communication_responsible">{t('form.capacityAndEvent.communicationResponsible')} <span className="text-red-500">*</span></Label>
            <div>
              <Input
                id="communication_responsible"
                value={localFormData.promotion?.communication_responsible || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  // First create the updated data
                  const updatedData = {
                    ...localFormData,
                    promotion: {
                      ...localFormData.promotion!,
                      communication_responsible: value
                    }
                  };
                  // Then update both local state and context
                  setLocalFormData(updatedData);
                  updateFormData(updatedData);
                  
                  // Clear error if value is now valid
                  if (value) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.communication_responsible;
                      return newErrors;
                    });
                  }
                }}
                maxLength={500}
                className="border-[#81D4FA] focus:ring-[#0288d1]"
              />
              <div className="flex justify-end mt-1 text-sm text-gray-500">
                <span className={`${(localFormData.promotion?.communication_responsible?.length || 0) >= 500 ? 'text-red-500 font-medium' : ''}`}>
                  {localFormData.promotion?.communication_responsible?.length || 0}/500
                </span>
              </div>
              {errors.communication_responsible && (
                <p className="text-red-500 text-sm">{errors.communication_responsible}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-6">
              <Checkbox
                id="third-party"
                checked={localFormData.promotion?.third_party_advertising}
                onCheckedChange={(checked) => {
                  // First create the updated data
                  const updatedData = {
                    ...localFormData,
                    promotion: {
                      ...localFormData.promotion!,
                      third_party_advertising: checked as boolean
                    }
                  };
                  // Then update both local state and context
                  setLocalFormData(updatedData);
                  updateFormData(updatedData);
                }}
              />
            <Label
              htmlFor="third-party"
              className="leading-[1.5]"
            >
              {t('form.capacityAndEvent.thirdPartyAdvertising')}
            </Label>
            </div>

            {localFormData.promotion?.third_party_advertising && (
              <div id="involved_parties" className="ml-6 space-y-2">
                <Label>{t('form.capacityAndEvent.involvedParties')} <span className="text-red-500">*</span></Label>
                <div className="flex space-x-2">
                  <Input
                    value={newParty}
                    onChange={(e) => setNewParty(e.target.value)}
                    className="border-[#81D4FA] focus:ring-[#0288d1]"
                    placeholder={t('form.capacityAndEvent.addpartyname')}
                  />
                  <Button
                    type="button"
                    onClick={handleAddParty}
                    className="bg-[#0288d1] text-white hover:bg-[#0288d1]/90"
                    disabled={(localFormData.event_summary?.involved_parties?.length || 0) >= MAX_PARTIES}
                    title={(localFormData.event_summary?.involved_parties?.length || 0) >= MAX_PARTIES ? 
                      t('validation.maxPartiesExceeded', { max: MAX_PARTIES }) : 
                      t('common.select')}
                  >
                    {t('common.select')}
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {localFormData.event_summary?.involved_parties.map((party) => (
                    <div key={party} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{party}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveParty(party)}
                        className="h-8 px-2"
                      >
                        {t('common.clear')}
                      </Button>
                    </div>
                  ))}
                </div>
                {errors.involved_parties && (
                  <p className="text-red-500 text-sm">{errors.involved_parties}</p>
                )}
                {errors.max_parties_exceeded && (
                  <p className="text-red-500 text-sm">{errors.max_parties_exceeded}</p>
                )}
                {errors.party_exists && (
                  <p className="text-red-500 text-sm">{errors.party_exists}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
