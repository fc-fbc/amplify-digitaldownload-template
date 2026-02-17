import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import InfoButton from "@/components/InfoButton";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { ScreeningItemProps } from "../../ContactInformation-step1/types";
import TicketItem from "./TicketItem";
import ScreeningFormatSelect from "./ScreeningFormatSelect";
import { MAX_TICKETS } from "../hooks/useFilmScreeningsValidation";

export default function ScreeningItem({
  screening,
  filmIndex,
  screeningIndex,
  chargingTickets,
  mediaType,
  onRemoveScreening,
  onScreeningDateChange,
  onNumberOfScreeningsChange,
  onFormatChange,
  onAddTicketType,
  onUpdateTickets,
  errors,
  formSubmitted,
  duplicateError,
  setDuplicateError
}: ScreeningItemProps) {
  const { t } = useTranslation();

  const handleRemoveTicketType = (filmIndex: number, screeningIndex: number, ticketIndex: number) => {
    const updatedTickets = [...screening.ticket_info];
    updatedTickets.splice(ticketIndex, 1);
    onUpdateTickets(filmIndex, screeningIndex, updatedTickets);
  };

  const handleTicketTypeChange = (
    filmIndex: number,
    screeningIndex: number,
    ticketIndex: number,
    key: string,
    customType?: string
  ) => {
    const updatedTickets = [...screening.ticket_info];
    
    // Format the key with prefix
    const formattedKey = `key:${key}`;
    
    // Check for duplicates
    const isDuplicate = screening.ticket_info.some((ticket, idx) => {
      if (idx === ticketIndex) return false; // Skip current ticket
      
      if (key === "ticketTypeOther") {
        // For "ticketTypeOther" type, check custom_ticket_type
        return ticket.ticket_type.startsWith("key:ticketTypeOther") && 
               ticket.custom_ticket_type?.toLowerCase() === customType?.toLowerCase();
      } else {
        // For predefined types, check ticket_type
        return ticket.ticket_type === formattedKey;
      }
    });

    if (isDuplicate) {
      setDuplicateError({
        filmIndex,
        screeningIndex,
        ticketIndex,
        message: key === "ticketTypeOther" 
          ? t("validation.customTicketTypeExists", { customType: customType || "" })
          : t("validation.ticketTypeExists", { value: t(`form.filmScreenings.${key}`) })
      });
      return;
    }

    // Clear duplicate error if exists
    setDuplicateError(null);

    const ticketInfo = updatedTickets[ticketIndex];
    ticketInfo.ticket_type = formattedKey;
    if (key === "ticketTypeOther") {
      ticketInfo.custom_ticket_type = customType || "";
    } else {
      delete ticketInfo.custom_ticket_type;
    }
    
    onUpdateTickets(filmIndex, screeningIndex, updatedTickets);
  };

  const handleTicketPriceChange = (
    filmIndex: number,
    screeningIndex: number,
    ticketIndex: number,
    price: number
  ) => {
    const updatedTickets = [...screening.ticket_info];
    updatedTickets[ticketIndex].ticket_price = price;
    onUpdateTickets(filmIndex, screeningIndex, updatedTickets);
  };

  return (
    <Card className="relative bg-gradient-to-r from-blue-200 to-blue-300 border-blue-400">
      {screeningIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => onRemoveScreening(filmIndex, screeningIndex)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <CardHeader>
        <CardTitle className="text-sm">{t('form.filmScreenings.screening')} {screeningIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('form.filmScreenings.screeningDate')} <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={screening.screening_date}
            onChange={(e) => onScreeningDateChange(filmIndex, screeningIndex, e.target.value)}
            className={`mt-1 bg-white ${formSubmitted && errors.films[filmIndex]?.screenings?.[screeningIndex]?.date ? "border-red-500" : ""}`}
            required
          />
          {formSubmitted && errors.films[filmIndex]?.screenings?.[screeningIndex]?.date && (
            <p className="text-red-500 text-xs mt-1">
              {errors.films[filmIndex]?.screenings?.[screeningIndex]?.date}
            </p>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">
              {t('form.filmScreenings.numberOfScreenings')}
            </label>
            <InfoButton content={t('form.filmScreenings.multipleScreeningsInfo')} />
          </div>
          <div className="w-12">
            <Input
              type="number"
              min="1"
              value={screening.number_of_screenings || 1}
              onChange={(e) => onNumberOfScreeningsChange(
                filmIndex,
                screeningIndex,
                parseInt(e.target.value) || 1
              )}
              onWheel={(e) => e.currentTarget.blur()}
              className="mt-1 bg-white"
            />
          </div>
        </div>

        {chargingTickets && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">{t('form.filmScreenings.ticketTypes')}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddTicketType(filmIndex, screeningIndex)}
                  className="h-8"
                  disabled={screening.ticket_info.length >= MAX_TICKETS}
                  title={screening.ticket_info.length >= MAX_TICKETS ? 
                    t('validation.maxTicketsExceeded', { max: MAX_TICKETS }) : 
                    t('form.filmScreenings.addTicketType')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('form.filmScreenings.addTicketType')}
                </Button>
              </div>
              {formSubmitted && errors.films[filmIndex]?.screenings?.[screeningIndex]?.maxTicketsExceeded && (
                <p className="text-red-500 text-xs">
                  {errors.films[filmIndex]?.screenings?.[screeningIndex]?.maxTicketsExceeded}
                </p>
              )}
            </div>
            {screening.ticket_info.map((ticket, ticketIndex) => (
              <TicketItem
                key={ticketIndex}
                ticket={ticket}
                filmIndex={filmIndex}
                screeningIndex={screeningIndex}
                ticketIndex={ticketIndex}
                onRemoveTicketType={handleRemoveTicketType}
                onTicketTypeChange={handleTicketTypeChange}
                onTicketPriceChange={handleTicketPriceChange}
                errors={errors}
                formSubmitted={formSubmitted}
                duplicateError={duplicateError}
                setDuplicateError={setDuplicateError}
              />
            ))}
          </div>
        )}

        {/* Screening Format Selection */}
        <ScreeningFormatSelect
          format={screening.format || ""}
          mediaType={mediaType}
          onFormatChange={(format) => onFormatChange(filmIndex, screeningIndex, format)}
          error={formSubmitted ? errors.films[filmIndex]?.screenings?.[screeningIndex]?.format : undefined}
          screeningId={`${filmIndex}-${screeningIndex}`}
        />
      </CardContent>
    </Card>
  );
}
