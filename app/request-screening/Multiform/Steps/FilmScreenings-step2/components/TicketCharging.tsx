import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { TicketChargingProps } from "../../ContactInformation-step1/types";

export default function TicketCharging({ 
  chargingTickets, 
  onChange, 
  error, 
  formSubmitted 
}: TicketChargingProps) {
  const { t } = useTranslation();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
      <CardHeader>
        <CardTitle>{t('form.filmScreenings.title')}</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          {t('form.filmScreenings.description')}
        </p>
      </CardHeader>
      <CardContent>
        <div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">
              {t('form.filmScreenings.chargingTicketsQuestion')} <span className="text-red-500">*</span>
            </h4>
            <RadioGroup
              value={chargingTickets ? "yes" : "no"}
              onValueChange={(value) => onChange(value === "yes")}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="charging-yes" />
                <label htmlFor="charging-yes" className="text-sm font-medium">{t('common.yes')}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="charging-no" />
                <label htmlFor="charging-no" className="text-sm font-medium">{t('common.no')}</label>
              </div>
            </RadioGroup>
          </div>
          {error && formSubmitted && (
            <div className="text-red-500 text-sm mt-1">{error}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
