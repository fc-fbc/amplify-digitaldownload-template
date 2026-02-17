export interface PricingTier {
  minPrice: number;
  percentage: number;
}

export interface TicketType {
  ticket_type: string;
  custom_ticket_type?: string;
  ticket_price: number;
}

export interface ScreeningSalesTicket {
  updated_at: string;
  ticket_type: string;
  custom_ticket_type?: string;
  ticket_price: number;
  tickets_sold: number;
}

export interface Screening {
  screening_id: string;
  screening_date: string;
  tickets: ScreeningSalesTicket[];
}

export interface FilmTitle {
  title: string;
  title_id: string;
  screenings: Screening[];
}

export interface ScreeningSales {
  charging_tickets: boolean;
  titles: FilmTitle[];
}

export const COMMERCIAL_PRICING_TIERS: PricingTier[] = [
  { minPrice: 5.00, percentage: 0.40 }, // 40%
  { minPrice: 4.50, percentage: 0.45 }, // 45%
  { minPrice: 4.00, percentage: 0.50 }, // 50%
  { minPrice: 3.50, percentage: 0.57 }, // 57%
  { minPrice: 3.00, percentage: 0.67 }, // 67%
  { minPrice: 2.50, percentage: 0.80 }, // 80%
  { minPrice: 2.00, percentage: 1.00 }, // 100%
];

export const MINIMUM_COMMERCIAL_GUARANTEE = 105;
export const MINIMUM_NON_COMMERCIAL_PRICE = 100;
export const NON_COMMERCIAL_PER_VIEWER = 2;
export const REGISTRATION_FEE = 30;

export function calculateCommercialFee(ticketPrice: number, ticketsSold: number): number {
  // Find the applicable pricing tier
  const tier = COMMERCIAL_PRICING_TIERS.find(t => ticketPrice >= t.minPrice) || COMMERCIAL_PRICING_TIERS[COMMERCIAL_PRICING_TIERS.length - 1];
  
  // Calculate the fee based on ticket price and percentage
  const fee = ticketPrice * ticketsSold * tier.percentage;
  
  // Return the higher of the calculated fee or minimum guarantee
  return Math.max(fee, MINIMUM_COMMERCIAL_GUARANTEE);
}

export function calculateNonCommercialFee(viewerCount: number): number {
  const fee = viewerCount * NON_COMMERCIAL_PER_VIEWER;
  return Math.max(fee, MINIMUM_NON_COMMERCIAL_PRICE);
}

export function formatCurrency(amount: number): string {
  return `€${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function getApplicableTier(ticketPrice: number): PricingTier {
  return COMMERCIAL_PRICING_TIERS.find(t => ticketPrice >= t.minPrice) || COMMERCIAL_PRICING_TIERS[COMMERCIAL_PRICING_TIERS.length - 1];
}

export function calculateTicketRevenue(ticket: ScreeningSalesTicket): number {
  return ticket.ticket_price * ticket.tickets_sold;
}
