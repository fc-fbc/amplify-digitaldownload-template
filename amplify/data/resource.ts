import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  FormTiming: a.customType({
    start_time: a.datetime(),
    end_time: a.datetime(),
    duration_seconds: a.integer()
  }),

  Address: a.customType({
    street_1: a.string(),
    street_2: a.string(),
    city: a.string(),
    state: a.string(),
    postal_code: a.string(),
    country: a.string()
  }),

  ContactInfo: a.customType({
    first_name: a.string(),
    last_name: a.string(),
    company_name: a.string(),
    address: a.ref('Address'),
    email: a.email(),
    phone: a.phone()
  }),

  FinanceInfo: a.customType({
    stsl_account_number: a.string()
  }),

  ScreenSize: a.customType({
    width_m: a.float(),
    height_m: a.float()
  }),

  TicketInfo: a.customType({
    ticket_type: a.string(),
    ticket_price: a.float(),
    tickets_sold: a.integer(),
    custom_ticket_type: a.string() 
  }),

  Screening: a.customType({
    screening_date: a.date(),
    screening_guid: a.string(),
    number_of_screenings: a.integer(),
    box_office_return: a.boolean(),
    approved: a.boolean(),
    ticket_info: a.ref('TicketInfo').array(),
    format: a.string()
  }),

  ScreeningList: a.customType({
    title: a.string(),
    year_of_release: a.integer(),
    studios: a.string().array(),
    screenings: a.ref('Screening').array(),
    iva_id: a.string(),
    poster_path: a.string(),
    media_type: a.string()
  }),

  FilmScreenings: a.customType({
    charging_tickets: a.boolean(),
    screenings_list: a.ref('ScreeningList').array()
  }),

  ScreeningDetails: a.customType({
    screening_type: a.string(),
    screening_address: a.ref('Address'),
    has_website: a.boolean(),
    event_website: a.string(),
    format: a.string(),
    dcp_35mm_capability: a.boolean(),
    theatrical_release: a.boolean(),
    screen_size: a.ref('ScreenSize')
  }),

  Capacity: a.customType({
    max_legal_capacity: a.integer(),
  }),

  Promotion: a.customType({
    is_promoted: a.boolean(),
    promotion_methods: a.string().array(),
    communication_responsible: a.string(),
    third_party_advertising: a.boolean()
  }),

  EventSummary: a.customType({
    summary: a.string(),
    has_brand_activities: a.boolean(),
    related_brand_activities: a.string(),
    involved_parties: a.string().array()
  }),

  InteractiveElements: a.customType({
    full_length_film: a.boolean(),
    audience_participation: a.boolean(),
    live_performance: a.boolean(),
    has_theme: a.boolean(),
    special_effects: a.boolean(),
    character_likness: a.boolean()
  }),

  // Main Digital Download Submission model
  DigitalDownloadSubmission: a.model({
    submission_id: a.id(),
    timestamp: a.timestamp(),
    form_timing: a.ref('FormTiming'),
    contact_info: a.ref('ContactInfo'),
    finance_info: a.ref('FinanceInfo'),
    screening_details: a.ref('ScreeningDetails'),
    capacity: a.ref('Capacity'),
    promotion: a.ref('Promotion'),
    event_summary: a.ref('EventSummary'),
    interactive_elements: a.ref('InteractiveElements'),
    film_screenings: a.ref('FilmScreenings'), 
    newsletter_subscription: a.boolean()
  }).authorization(allow => [allow.publicApiKey()]),
  
  // UK-specific Digital Download Submission model
  UKDigitalDownloadSubmission: a.model({
    submission_id: a.id(),
    timestamp: a.timestamp(),
    form_timing: a.ref('FormTiming'),
    contact_info: a.ref('ContactInfo'),
    finance_info: a.ref('FinanceInfo'),
    screening_details: a.ref('ScreeningDetails'),
    capacity: a.ref('Capacity'),
    promotion: a.ref('Promotion'),
    event_summary: a.ref('EventSummary'),
    interactive_elements: a.ref('InteractiveElements'),
    film_screenings: a.ref('FilmScreenings'), 
    newsletter_subscription: a.boolean()
  }).authorization(allow => [allow.publicApiKey()])
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});
