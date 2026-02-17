"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/app/box-office/utils/pricing"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TicketReview {
  ticketType: string;
  ticketPrice: number;
  ticketsSold: number;
  revenue: number;
  fee: number;
}

interface BoxOfficeReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  tickets: TicketReview[];
  totalRevenue: number;
  totalFee: number;
  minimumGuarantee: number;
}

export function BoxOfficeReviewDialog({
  isOpen,
  onClose,
  onConfirm,
  tickets,
  totalRevenue,
  totalFee,
  minimumGuarantee
}: BoxOfficeReviewDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Track dialog open state
  useEffect(() => {
    // Dialog open state changed
  }, [isOpen]);

  const handleConfirm = async () => {
    // Handle confirmation action
    setIsSubmitting(true)
    try {
      await onConfirm()
      // Box office returns submitted successfully
    } catch (error) {
      console.error("Error submitting box office returns:", error)
    } finally {
      setIsSubmitting(false)
      onClose()
    }
  }

  // Initialize component
  useEffect(() => {
    // Component mounted
  }, []);
  
  // Force dialog to be visible when isOpen is true
  return (
    <Dialog 
      open={isOpen}
      modal={true}
      onOpenChange={(open) => {
        // Handle dialog open state change
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Review Box Office Returns</DialogTitle>
          <DialogDescription>
            Please review the ticket information below.
          </DialogDescription>
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            <strong>Warning:</strong> Once submitted, these numbers cannot be changed.
          </div>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Ticket Type</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Price</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Sold</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Revenue</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-3 text-sm text-gray-900">{ticket.ticketType}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(ticket.ticketPrice)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{ticket.ticketsSold}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(ticket.revenue)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(ticket.fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total Net Revenue:</span>
              <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">License Fee to be Paid:</span>
              <span className="font-semibold">{formatCurrency(totalFee)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              (Minimum Guarantee {formatCurrency(minimumGuarantee)})
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isSubmitting}
            className="bg-[#0288d1] text-white hover:bg-[#0288d1]/90 font-semibold"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm and Submit Box Office Returns'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
