import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { TicketItemProps } from "../../ContactInformation-step1/types";
import { MAX_PRICE } from "../hooks/useFilmScreeningsValidation";

export default function TicketItem({
  ticket,
  filmIndex,
  screeningIndex,
  ticketIndex,
  onRemoveTicketType,
  onTicketTypeChange,
  onTicketPriceChange,
  errors,
  formSubmitted,
  duplicateError,
  setDuplicateError
}: TicketItemProps) {
  const { t } = useTranslation();

  // Define ticket type keys
  const ticketTypeKeys = [
    "ticketTypeAdult",
    "ticketTypeChild",
    "ticketTypeSenior",
    "ticketTypePremium",
    "ticketTypeStudent",
    "ticketTypeOther"
  ];
  
  // Map keys to translated values for display
  const getTicketTypeDisplay = (key: string): string => {
    if (key.startsWith("key:")) {
      const actualKey = key.substring(4);
      return t(`form.filmScreenings.${actualKey}`);
    }
    // For backward compatibility
    return key;
  };

  // Error checks
  const isDuplicateError = 
    duplicateError?.filmIndex === filmIndex && 
    duplicateError?.screeningIndex === screeningIndex && 
    duplicateError?.ticketIndex === ticketIndex;

  const hasTypeError = 
    formSubmitted && 
    !!errors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets?.[ticketIndex]?.type;

  const hasPriceError = 
    formSubmitted && 
    !!errors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets?.[ticketIndex]?.price;

  const hasCustomTypeError = 
    formSubmitted && 
    !!errors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets?.[ticketIndex]?.customType;

  // Handlers
  const handleRemoveTicketType = () => {
    onRemoveTicketType(filmIndex, screeningIndex, ticketIndex);
  };

  const handleTicketTypeChange = (key: string) => {
    onTicketTypeChange(filmIndex, screeningIndex, ticketIndex, key);
  };

  const handleCustomTypeChange = (value: string) => {
    onTicketTypeChange(filmIndex, screeningIndex, ticketIndex, "ticketTypeOther", value);
  };

  const handleTicketPriceChange = (price: number) => {
    onTicketPriceChange(filmIndex, screeningIndex, ticketIndex, price);
  };

  const handlePopoverChange = (open: boolean) => {
    if (!open) setDuplicateError(null);
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 border border-blue-300 rounded-lg relative bg-blue-50">
      {ticketIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleRemoveTicketType}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('form.filmScreenings.ticketType')} <span className="text-red-500">*</span>
        </label>
        <Popover 
          open={isDuplicateError}
          onOpenChange={handlePopoverChange}
        >
          <PopoverTrigger asChild>
            <div>
              <Select
                value={ticket.ticket_type.startsWith("key:") ? ticket.ticket_type.substring(4) : ticket.ticket_type}
                onValueChange={handleTicketTypeChange}
                required
              >
                <SelectTrigger className={cn(
                  "bg-white",
                  isDuplicateError || hasTypeError ? "border-yellow-400" : ""
                )}>
                  <SelectValue placeholder={t('form.filmScreenings.selectTicketType')}>
                    {ticket.ticket_type && getTicketTypeDisplay(ticket.ticket_type)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {ticketTypeKeys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {t(`form.filmScreenings.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverTrigger>
          {duplicateError && isDuplicateError && (
            <PopoverContent className="bg-red-50 border-red-200">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{duplicateError.message}</p>
              </div>
            </PopoverContent>
          )}
        </Popover>
        {hasTypeError && (
          <p className="text-yellow-700 text-xs mt-1">
            {errors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets?.[ticketIndex]?.type || ''}
          </p>
        )}
        {ticket.ticket_type.startsWith("key:ticketTypeOther") && (
          <div>
            <Input
              value={ticket.custom_ticket_type || ""}
              onChange={(e) => {
                handleCustomTypeChange(e.target.value);
              }}
              placeholder={t('form.filmScreenings.enterCustomType')}
              maxLength={30}
              className={`mt-2 bg-white ${hasCustomTypeError ? "border-yellow-400" : ""}`}
            />
            {hasCustomTypeError && (
              <p className="text-yellow-700 text-xs mt-1">
                {errors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets?.[ticketIndex]?.customType}
              </p>
            )}
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('form.filmScreenings.ticketPrice')} <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          max={MAX_PRICE}
          value={ticket.ticket_price || ""}
          onChange={(e) => {
            const value = e.target.value;
            // Limit to 6 digits before decimal point
            if (value !== '' && value.split('.')[0].length > 6) {
              return;
            }
            
            handleTicketPriceChange(value === "" ? 0 : parseFloat(value));
          }}
          placeholder={t('form.filmScreenings.enterPrice')}
          onWheel={(e) => e.currentTarget.blur()}
          className={`bg-white ${hasPriceError ? "border-yellow-400" : ""}`}
          required
        />
        {hasPriceError && (
          <p className="text-yellow-700 text-xs mt-1">
            {errors.films[filmIndex]?.screenings?.[screeningIndex]?.tickets?.[ticketIndex]?.price}
          </p>
        )}
      </div>
    </div>
  );
}
