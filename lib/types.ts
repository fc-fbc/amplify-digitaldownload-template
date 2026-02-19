export interface ContactInfo {
  first_name: string;
  last_name: string;
  company_name: string;
  // is_registered_company: boolean;
  // company_registration_number: string;
  // is_vat_registered: boolean;
  // vat_number: string;
  address: {
    street_1: string;
    street_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  email: string;
  phone: string;
}

export interface ScreeningDetails {
  screening_type: string;
  screening_address: {
    street_1: string;
    street_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  // venue: string;
  has_website?: boolean;
  event_website: string;
  format: string;
  dcp_35mm_capability: boolean;
  theatrical_release: boolean;
  screen_size: {
    width_m: number;
    height_m: number;
  };
}

export interface FinanceDetails{
  finance_phone?: string,
  finance_email?: string,
  stsl_account_number?: string,
  stsl_user_name?: string
}
export interface Capacity {
  max_legal_capacity: number;
  // expected_audience: number;
}

export interface Promotion {
  is_promoted: boolean;
  promotion_methods: string[];
  communication_responsible: string;
  third_party_advertising: boolean;
}

export interface EventSummary {
  summary: string;
  has_brand_activities: boolean;
  related_brand_activities: string;
  involved_parties: string[];
}

export interface InteractiveElements {
  full_length_film: boolean;
  audience_participation: boolean;
  live_performance: boolean;
  has_theme: boolean;
  special_effects: boolean;
  character_likness: boolean;
}

// --- New Film Screening Structure ---

export interface TicketInfo {
  ticket_type: string; // e.g., "Adult", "Other", "Senior"
  ticket_price: number;
  tickets_sold: number;
  // Populated only when ticket_type is "Other"
  custom_ticket_type?: string;
}

export interface Screening {
  screening_date: string;
  screening_guid: string;
  number_of_screenings: number;
  approved: boolean;
  box_office_return: boolean;
  ticket_info: TicketInfo[];
  format?: string;
}

export interface FilmScreening {
  title: string;
  year_of_release: number;
  studios: string[];
  screenings: Screening[];
  iva_id?: string;
  poster_path?: string;
  media_type?: "SPECIAL_PERMISSION" | "DIGITAL_DOWNLOAD";
}

// A wrapper for all film screenings with a global charging_tickets flag.
export interface FilmScreenings {
  charging_tickets: boolean;
  screenings_list: FilmScreening[];
}

// --- Aggregated Form Data ---

export interface FormData {
  // Form Timing
  startTime?: Date;
  endTime?: Date;

  // Privacy Consent
  privacyConsent: boolean;
  
  // Contact Information
  contact_info: ContactInfo;
  
  // Finance Information
  finance_details?: FinanceDetails;

  // Screening Details
  screening_details?: ScreeningDetails;

  // Capacity and Event Details
  capacity?: Capacity;
  promotion?: Promotion;
  event_summary?: EventSummary;
  interactive_elements?: InteractiveElements;

  // Film Screenings (new structure replacing previous ticketing and screening sales)
  film_screenings?: FilmScreenings;

  // Additional Information
  // how_did_you_hear?: string;
  // how_did_you_hear_other?: string;
  newsletter_subscription?: boolean;
}

export interface StepProps {
  onNextStep: (data: Partial<FormData>) => void;
  onPrevStep?: () => void;
  formData?: Partial<FormData>;
}
