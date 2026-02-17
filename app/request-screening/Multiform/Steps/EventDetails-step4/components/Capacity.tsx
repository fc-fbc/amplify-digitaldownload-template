import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import InfoButton from "@/components/InfoButton"
import { FormData } from "@/lib/types"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { MAX_CAPACITY } from "../utils/validators"
import { LinkPreview } from "@/components/ui/link-preview"

const MAX_DIGITS = 8;

interface CapacityProps {
  localFormData: FormData
  setLocalFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: { [key: string]: string }
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  updateLocalAndContextData?: (data: FormData) => void
}

export const Capacity = ({
  localFormData,
  setLocalFormData,
  errors,
  setErrors,
  updateLocalAndContextData
}: CapacityProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>{t('form.capacityAndEvent.maxLegalCapacity')} <span className="text-red-500">*</span></Label>
            <InfoButton 
              content={
                <>
                  {t('form.capacityAndEvent.infobuttonmaxcapacity')}{' '}
                  <LinkPreview 
                    url="https://www.gov.uk/find-licences/temporary-events-notice"
                    className="font-bold text-[#0288d1]"
                  >
                    gov.uk
                  </LinkPreview>
                </>
              } 
            />
          </div>
          <Input
            id="max_legal_capacity"
            type="number"
            value={localFormData.capacity?.max_legal_capacity || ""}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue !== '' && (inputValue.length > MAX_DIGITS || isNaN(Number(inputValue)))) {
                return;
              }
              const value = parseInt(inputValue) || 0;
              const updatedData = {
                ...localFormData,
                capacity: {
                  ...localFormData.capacity!,
                  max_legal_capacity: value
                }
              };
              if (updateLocalAndContextData) {
                updateLocalAndContextData(updatedData);
              } else {
                setLocalFormData(updatedData);
              }
              
              // Validate the input
              if (value <= 0) {
                setErrors(prev => ({
                  ...prev,
                  max_legal_capacity: t('validation.positive')
                }));
              } else if (value > MAX_CAPACITY) {
                setErrors(prev => ({
                  ...prev,
                  max_legal_capacity: t('validation.max', { max: MAX_CAPACITY })
                }));
              } else {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.max_legal_capacity;
                  return newErrors;
                });
              }
            }}
            className="w-32 min-w-0 flex-shrink-0 border-[#81D4FA] focus:ring-[#0288d1]"
            maxLength={MAX_DIGITS}
            onWheel={(e) => e.currentTarget.blur()}
            min="1"
            max={MAX_CAPACITY}
            required
          />
          {errors.max_legal_capacity && (
            <p className="text-red-500 text-sm">{errors.max_legal_capacity}</p>
          )}
        </div>
      </div>

      {/* <div>
        <Label>{t('form.capacityAndEvent.expectedAudience')} <span className="text-red-500">*</span></Label>
        <Input
          type="number"
          value={localFormData.capacity?.expected_audience || ""}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue !== '' && (inputValue.length > MAX_DIGITS || isNaN(Number(inputValue)))) {
              return;
            }
            const expectedAudience = parseInt(inputValue) || 0;
            const updatedData = {
              ...localFormData,
              capacity: {
                ...localFormData.capacity!,
                expected_audience: expectedAudience
              }
            };
            if (updateLocalAndContextData) {
              updateLocalAndContextData(updatedData);
            } else {
              setLocalFormData(updatedData);
            }
            
            // Validate the input
            if (expectedAudience <= 0) {
              setErrors(prev => ({
                ...prev,
                expected_audience: t('validation.positive')
              }));
            } else if (expectedAudience > MAX_CAPACITY) {
              setErrors(prev => ({
                ...prev,
                expected_audience: t('validation.max', { max: MAX_CAPACITY })
              }));
            } else if (expectedAudience > localFormData.capacity?.max_legal_capacity!) {
              setErrors(prev => ({
                ...prev,
                expected_audience: t('validation.max', { max: localFormData.capacity?.max_legal_capacity || 0 })
              }));
            } else {
              setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.expected_audience;
                return newErrors;
              });
            }
          }}
          className="w-32 min-w-0 flex-shrink-0 border-[#81D4FA] focus:ring-[#0288d1]"
          maxLength={MAX_DIGITS}
          onWheel={(e) => e.currentTarget.blur()}
          min="1"
          max={localFormData.capacity?.max_legal_capacity || MAX_CAPACITY}
          required
        />
        {errors.expected_audience && (
          <p className="text-red-500 text-sm">{errors.expected_audience}</p>
        )}
      </div> */}
    </div>
  )
}
