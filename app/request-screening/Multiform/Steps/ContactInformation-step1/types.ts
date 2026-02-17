import { FilmScreening, FilmScreenings, Screening, TicketInfo } from "@/lib/types";

// Define granular error structure
export interface GranularErrors {
  ticketCharge?: string;
  maxFilmsExceeded?: string;
  films: {
    [filmIndex: number]: {
      title?: string;
      year?: string;
      maxScreeningsExceeded?: string;
      screenings?: {
        [screeningIndex: number]: {
          date?: string;
          format?: string;
          maxTicketsExceeded?: string;
          tickets?: {
            [ticketIndex: number]: {
              type?: string;
              price?: string;
              customType?: string;
            }
          }
        }
      }
    }
  };
}

export interface DuplicateError {
  filmIndex: number;
  screeningIndex: number;
  ticketIndex: number;
  message: string;
}

export interface TicketChargingProps {
  chargingTickets: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  formSubmitted: boolean;
}

export interface FilmListProps {
  filmScreeningsData: FilmScreenings;
  onAddFilm: () => void;
  onUpdateFilmScreenings: (newData: FilmScreenings) => void;
  errors: GranularErrors;
  formSubmitted: boolean;
  duplicateError: DuplicateError | null;
  setDuplicateError: (error: DuplicateError | null) => void;
}

export interface FilmItemProps {
  film: FilmScreening;
  filmIndex: number;
  chargingTickets: boolean;
  onRemoveFilm: (filmIndex: number) => void;
  onFilmChange: (filmIndex: number, field: keyof FilmScreening, value: string | number) => void;
  onFilmSelect: (filmIndex: number, catalogData: { title: string; year: number; iva_id: string; poster_path: string; media_type: "SPECIAL_PERMISSION" | "DIGITAL_DOWNLOAD" }) => void;
  onAddScreening: (filmIndex: number) => void;
  onUpdateScreenings: (filmIndex: number, screenings: Screening[]) => void;
  errors: GranularErrors;
  formSubmitted: boolean;
  duplicateError: DuplicateError | null;
  setDuplicateError: (error: DuplicateError | null) => void;
}

export interface ScreeningItemProps {
  screening: Screening;
  filmIndex: number;
  screeningIndex: number;
  chargingTickets: boolean;
  mediaType?: "SPECIAL_PERMISSION" | "DIGITAL_DOWNLOAD";
  onRemoveScreening: (filmIndex: number, screeningIndex: number) => void;
  onScreeningDateChange: (filmIndex: number, screeningIndex: number, date: string) => void;
  onNumberOfScreeningsChange: (filmIndex: number, screeningIndex: number, value: number) => void;
  onFormatChange: (filmIndex: number, screeningIndex: number, format: string) => void;
  onAddTicketType: (filmIndex: number, screeningIndex: number) => void;
  onUpdateTickets: (filmIndex: number, screeningIndex: number, tickets: TicketInfo[]) => void;
  errors: GranularErrors;
  formSubmitted: boolean;
  duplicateError: DuplicateError | null;
  setDuplicateError: (error: DuplicateError | null) => void;
}

export interface TicketItemProps {
  ticket: TicketInfo;
  filmIndex: number;
  screeningIndex: number;
  ticketIndex: number;
  onRemoveTicketType: (filmIndex: number, screeningIndex: number, ticketIndex: number) => void;
  onTicketTypeChange: (
    filmIndex: number,
    screeningIndex: number,
    ticketIndex: number,
    key: string,
    customType?: string
  ) => void;
  onTicketPriceChange: (
    filmIndex: number,
    screeningIndex: number,
    ticketIndex: number,
    price: number
  ) => void;
  errors: GranularErrors;
  formSubmitted: boolean;
  duplicateError: DuplicateError | null;
  setDuplicateError: (error: DuplicateError | null) => void;
}
