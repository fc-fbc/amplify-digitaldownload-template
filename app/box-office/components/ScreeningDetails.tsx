"use client"

import { useState, ChangeEvent } from "react"
import { 
  formatCurrency, 
  getApplicableTier,
  MINIMUM_COMMERCIAL_GUARANTEE
} from "../utils/pricing"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BoxOfficeReviewDialog } from "@/components/BoxOfficeReviewDialog"

type Nullable<T> = T | null;

export interface ApiTicketInfo {
  ticket_type: Nullable<string>;
  custom_ticket_type: Nullable<string>;
  ticket_price: Nullable<number>;
  tickets_sold: Nullable<number>;
}

export interface ApiScreening {
  screening_date: Nullable<string>;
  screening_guid: Nullable<string>;
  ticket_info: Nullable<ApiTicketInfo[]>;
  box_office_return?: Nullable<boolean>;
  approved?: Nullable<boolean>;
}

export interface ApiFilmScreening {
  title: Nullable<string>;
  year_of_release: Nullable<number>;
  studios: Nullable<string[]>;
  approved: Nullable<boolean>;
  screenings: Nullable<ApiScreening[]>;
}

export interface ApiFilmScreenings {
  charging_tickets: Nullable<boolean>;
  screenings_list: Nullable<ApiFilmScreening[]>;
}

export interface ApiSubmissionData {
  id: string;
  film_screenings: Nullable<ApiFilmScreenings>;
}

interface ScreeningDetailsProps {
  submissionId: string;
  currentScreening: ApiScreening;
  currentFilmTitle: ApiFilmScreening;
  ticketsByIndex: { [key: number]: number };
  handleTicketSoldChange: (ticketIndex: number, value: string) => void;
  handleSave: () => Promise<void>;
  isSaving: boolean;
}

export const calculateTotals = (screening: ApiScreening, ticketsByIndex: { [key: number]: number }) => {
  if (!screening) {
    return { totalRevenue: 0, totalFee: 0 };
  }
  
  let screeningRevenue = 0;
  let totalTicketFees = 0;
  
  screening.ticket_info?.forEach((ticket, ticketIndex) => {
    if (ticket.ticket_price) {
      const currentTicketsSold = ticketsByIndex[ticketIndex] || ticket.tickets_sold || 0;
      const ticketRevenue = ticket.ticket_price * currentTicketsSold;
      screeningRevenue += ticketRevenue;
      
      // Calculate fee using pricing tier
      const tier = getApplicableTier(ticket.ticket_price);
      totalTicketFees += ticketRevenue * tier.percentage;
    }
  });
  
  // Use the higher of total ticket fees or minimum guarantee
  const screeningFee = Math.max(totalTicketFees, MINIMUM_COMMERCIAL_GUARANTEE);
  return { totalRevenue: screeningRevenue, totalFee: screeningFee };
};

export default function ScreeningDetails({
  submissionId,
  currentScreening,
  currentFilmTitle,
  ticketsByIndex,
  handleTicketSoldChange,
  handleSave,
  isSaving
}: ScreeningDetailsProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  
  // Define the TicketReview interface to match what BoxOfficeReviewDialog expects
  interface TicketReview {
    ticketType: string;
    ticketPrice: number;
    ticketsSold: number;
    revenue: number;
    fee: number;
  }
  
  // Prepare ticket data for the review dialog
  const ticketReviewData = (currentScreening.ticket_info?.map((ticket, index) => {
    if (!ticket?.ticket_price) return null;
    
    const currentTicketsSold = ticketsByIndex[index] || ticket.tickets_sold || 0;
    const revenue = ticket.ticket_price * currentTicketsSold;
    const tier = getApplicableTier(ticket.ticket_price);
    const fee = revenue * tier.percentage;
    
    return {
      ticketType: ticket.ticket_type === 'Other' ? ticket.custom_ticket_type || 'Other' : ticket.ticket_type || 'Unknown',
      ticketPrice: ticket.ticket_price,
      ticketsSold: currentTicketsSold,
      revenue: revenue,
      fee: fee
    };
  }).filter((item): item is TicketReview => item !== null) || []) as TicketReview[];
  
  const totals = calculateTotals(currentScreening, ticketsByIndex);
  
  const handleOpenReviewDialog = () => {
    setIsReviewDialogOpen(true);
  };
  
  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
  };
  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0288d1] to-[#81D4FA]" />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Link href={`/box-office/${submissionId}`} className="text-[#0288d1] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to screening selection
          </Link>
        </div>
        
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-semibold mb-4">Film Details</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <p><span className="font-medium">Title:</span> {currentFilmTitle.title}</p>
              <p><span className="font-medium">Screening Date:</span> {new Date(currentScreening.screening_date || '').toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Box Office Returns</h3>
        
        <div className="space-y-4">
          {currentScreening.ticket_info?.map((ticket, index) => {
            if (!ticket?.ticket_price) return null;
            
            const tier = getApplicableTier(ticket.ticket_price);
            const currentTicketsSold = ticketsByIndex[index] || ticket.tickets_sold || 0;
            const revenue = ticket.ticket_price * currentTicketsSold;
            // Calculate fee using pricing tier
            const fee = revenue * tier.percentage;
            
            return (
              <div key={index} className="p-4 border border-[#81D4FA] rounded">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="font-medium">{ticket.ticket_type === 'Other' ? ticket.custom_ticket_type : ticket.ticket_type}</p>
                    <p className="text-gray-600">{formatCurrency(ticket.ticket_price)} per ticket</p>
                  </div>
                  <div>
                    <label className="font-medium block mb-2">Tickets Sold:</label>
                    <Input
                      type="number"
                      min="0"
                      value={currentTicketsSold || ''}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleTicketSoldChange(index, e.target.value)}
                      className="w-full"
                      disabled={currentScreening.box_office_return === true}
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">Calculations:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <p>Price Tier Rate:</p>
                    <p>{(tier.percentage * 100).toFixed(0)}%</p>
                    <p>Total net (€)</p>
                    <p>{formatCurrency(revenue)}</p>
                    <p>To be paid (€):</p>
                    <p>{formatCurrency(fee)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Screening Details</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">TOTAL NET CASH REVENUE (excluding VAT):</p>
              <p className="text-lg font-semibold">{formatCurrency(calculateTotals(currentScreening, ticketsByIndex).totalRevenue)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">LICENSE FEE TO BE PAID TO FILMBANKMEDIA:</p>
              <p className="text-lg font-semibold">{formatCurrency(calculateTotals(currentScreening, ticketsByIndex).totalFee)}</p>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              (MINIMUM GUARANTEE {formatCurrency(MINIMUM_COMMERCIAL_GUARANTEE)})
            </div>
          </div>
        </div>

        {currentScreening.box_office_return === true ? (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 font-medium">Box office returns have been submitted and cannot be changed. Please reach out to info@filmbankmedia.de if any issues. </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleOpenReviewDialog}
              disabled={isSaving}
              className="bg-[#0288d1] text-white hover:bg-[#0288d1]/90"
            >
              {isSaving ? 'Saving...' : 'Save Box Office Returns'}
            </Button>
          </div>
        )}
        
        <BoxOfficeReviewDialog
          isOpen={isReviewDialogOpen}
          onClose={handleCloseReviewDialog}
          onConfirm={handleSave}
          tickets={ticketReviewData}
          totalRevenue={totals.totalRevenue}
          totalFee={totals.totalFee}
          minimumGuarantee={MINIMUM_COMMERCIAL_GUARANTEE}
        />
      </div>
    </div>
  )
}
