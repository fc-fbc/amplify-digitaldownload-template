"use client"

import { useFormContext } from "../../context/FormContext"
import { GradientButton } from "@/components/ui/gradient-button"
import { FilmScreening } from "@/lib/types"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FilmPoster } from "../FilmScreenings-step2/components/FilmPoster"


// Ticket type keys that map to translation keys
const ticketTypeKeys = [
  "ticketTypeAdult",
  "ticketTypeChild",
  "ticketTypeSenior",
  "ticketTypePremium",
  "ticketTypeStudent",
  "ticketTypeOther"
];

// Collapsible text component for handling long text content
interface CollapsibleTextProps {
  text?: string;
  maxHeight?: number;
}

function CollapsibleText({ text = '', maxHeight = 100 }: CollapsibleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > maxHeight);
    }
  }, [text, maxHeight]);

  return (
    <div>
      <div
        ref={textRef}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isExpanded ? `${textRef.current?.scrollHeight || 1000}px` : `${maxHeight}px` }}
      >
        <p className="text-gray-800 whitespace-pre-wrap">{text || ''}</p>
      </div>
      
      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-[#0288d1] text-sm font-medium hover:underline focus:outline-none"
        >
          {isExpanded ? t('form.review.showLess') : t('form.review.showMore')}
        </button>
      )}
    </div>
  );
}

// Film card component with collapsible screenings
interface FilmCardProps {
  film: FilmScreening;
  chargingTickets: boolean;
}

function FilmCard({ film, chargingTickets }: FilmCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const screeningsCount = film.screenings?.length || 0;

  return (
    <div className="border border-[#81D4FA] rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
      {/* Film header - always visible */}
      <div className="p-4 flex items-center justify-between">
        <FilmPoster posterPath={film.poster_path} title={film.title} size="medium" />
        <div className="flex flex-1 gap-4 ml-4">
          <div className="flex-1 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.filmScreenings.filmTitle')}</p>
            <p className="text-lg font-medium mt-1 text-gray-800">{film.title}</p>
          </div>
          <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.filmScreenings.yearOfRelease')}</p>
            <p className="text-lg font-medium mt-1 text-gray-800">{film.year_of_release}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 px-3 py-2 bg-white rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-[#0288d1] font-medium mr-2">
              {t('form.filmScreenings.moreDetails')}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
      </div>
      
      {/* Screenings - collapsible */}
      {isExpanded && (
        <div className="p-4 pt-4 border-t border-[#81D4FA] bg-blue-50">
          <div className="space-y-4">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide mb-3">{t('form.filmScreenings.screenings')}</p>
            {film.screenings?.map((screening, screeningIndex) => (
              <div key={screeningIndex} className="p-4 bg-white rounded border border-gray-200 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.filmScreenings.screeningDate')}</p>
                    <p className="mt-1 text-gray-800">{new Date(screening.screening_date).toLocaleDateString('en-GB')}</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.filmScreenings.numberOfScreenings')}</p>
                    <p className="mt-1 text-gray-800">{screening.number_of_screenings || 1}</p>
                  </div>
                </div>
                
                {chargingTickets && screening.ticket_info && screening.ticket_info.length > 0 && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="font-semibold text-[#0288d1] text-sm tracking-wide mb-2">{t('form.filmScreenings.ticketInfo')}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {screening.ticket_info.map((ticket, ticketIndex) => (
                        <div key={ticketIndex} className="p-3 bg-white rounded border border-gray-200 shadow-sm">
                          <p className="font-semibold text-[#0288d1] text-sm tracking-wide">
                            {t('form.filmScreenings.ticketType')}
                          </p>
                          <p className="mt-1 text-gray-800">
                            {ticket.ticket_type.startsWith("key:") 
                              ? (() => {
                                  const key = ticket.ticket_type.substring(4);
                                  if (key === "ticketTypeOther" && ticket.custom_ticket_type) {
                                    return ticket.custom_ticket_type;
                                  }
                                  return t(`form.filmScreenings.${key}`);
                                })()
                              : ticket.ticket_type === t('form.filmScreenings.ticketTypeOther') || ticket.ticket_type === "Other"
                                ? ticket.custom_ticket_type 
                                : ticket.ticket_type
                            }
                          </p>
                          <p className="font-semibold text-[#0288d1] text-sm tracking-wide mt-2">
                            {t('form.filmScreenings.ticketPrice')}
                          </p>
                          <p className="mt-1 text-gray-800">€{ticket.ticket_price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewStep() {
  const { formData, nextStep, prevStep, isSubmitting, resetForm } = useFormContext();
  const { t } = useTranslation();
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleSubmit = async () => {
    // Show the legal confirmation modal instead of immediately submitting
    setIsLegalModalOpen(true);
  };

  const confirmSubmit = async () => {
    // Close the modal
    setIsLegalModalOpen(false);
    // The nextStep function will handle all the submission logic
    await nextStep();
  };

  const handleCancelBooking = () => {
    // Show the confirmation dialog
    setIsConfirmationModalOpen(true);
  };

  const confirmCancelBooking = () => {
    // Clear the form and redirect to the start page
    resetForm();
    // Close both modals
    setIsLegalModalOpen(false);
    setIsConfirmationModalOpen(false);
    // Redirect to the booking start page
    window.location.href = '/request-screening';
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-[#0288d1]">{t('form.review.title')}</h2>
      
      <div className="space-y-6">
        {/* Contact Information Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t('form.contactInfo.title')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.contactInfo.contactPerson')}</p>
              <p className="mt-1 text-gray-800">{formData.contact_info.first_name} {formData.contact_info.last_name}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.contactInfo.companyName')}</p>
              <p className="mt-1 text-gray-800">{formData.contact_info.company_name}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.contactInfo.email')}</p>
              <p className="mt-1 text-gray-800">{formData.contact_info.email}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.contactInfo.phone')}</p>
              <p className="mt-1 text-gray-800">{formData.contact_info.phone}</p>
            </div>
            {formData.finance_details?.stsl_account_number && (
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.contactInfo.stslAccountNumber')}</p>
                <p className="mt-1 text-gray-800">{formData.finance_details.stsl_account_number}</p>
              </div>
            )}
            {formData.finance_details?.finance_email && (
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.contactInfo.financeEmail')}</p>
                <p className="mt-1 text-gray-800">{formData.finance_details.finance_email}</p>
              </div>
            )}
            {formData.finance_details?.finance_phone && (
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.contactInfo.financePhone')}</p>
                <p className="mt-1 text-gray-800">{formData.finance_details.finance_phone}</p>
              </div>
            )}
            {/* {formData.contact_info.is_registered_company && (
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.companyNumber')}</p>
                <p className="mt-1 text-gray-800">{formData.contact_info.company_registration_number}</p>
              </div>
            )}
            {formData.contact_info.is_vat_registered && (
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.vatNumber')}</p>
                <p className="mt-1 text-gray-800">{formData.contact_info.vat_number}</p>
              </div>
            )} */}
          </div>
          <div className="mt-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.address')}</p>
            <div className="mt-1 text-gray-800">
              <p>{formData.contact_info.address.street_1}</p>
              {formData.contact_info.address.street_2 && <p>{formData.contact_info.address.street_2}</p>}
              <p>
                {formData.contact_info.address.city}, {formData.contact_info.address.state} {formData.contact_info.address.postal_code}
              </p>
              <p>
                {formData.contact_info.address.country === "Germany" ? t('form.contactInfo.countries.germany') :
                 formData.contact_info.address.country === "Austria" ? t('form.contactInfo.countries.austria') :
                 formData.contact_info.address.country === "Switzerland" ? t('form.contactInfo.countries.switzerland') :
                 formData.contact_info.address.country}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">{t('form.filmScreenings.title')}</h3>
          <div className="mb-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.filmScreenings.chargingTickets')}</p>
            <p className="mt-1 text-gray-800">{formData.film_screenings?.charging_tickets ? t('common.yes') : t('common.no')}</p>
          </div>
          <div className="space-y-6">
            {formData.film_screenings?.screenings_list?.map((film: FilmScreening, index: number) => (
              <FilmCard 
                key={index} 
                film={film} 
                chargingTickets={formData.film_screenings?.charging_tickets || false} 
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">{t('form.screeningDetails.title')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.screeningType')}</p>
              <p className="mt-1 text-gray-800">{formData.screening_details?.screening_type}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.format')}</p>
              <p className="mt-1 text-gray-800">
                {formData.screening_details?.format === "user-owned copy" 
                  ? t('form.screeningDetails.formatOwnCopy')
                  : formData.screening_details?.format === "rent a copy"
                    ? t('form.screeningDetails.rentACopy')
                    : formData.screening_details?.format === "filmbankmedia download"
                      ? t('form.screeningDetails.formatFBMDownload')
                      : formData.screening_details?.format === "virtual screening room"
                        ? t('form.screeningDetails.vsr')
                        : formData.screening_details?.format}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.dcp35mmCapability')}</p>
              <p className="mt-1 text-gray-800">{formData.screening_details?.dcp_35mm_capability ? t('common.yes') : t('common.no')}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.theatricalRelease')}</p>
              <p className="mt-1 text-gray-800">{formData.screening_details?.theatrical_release ? t('common.yes') : t('common.no')}</p>
            </div>
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.screeningDetails.screenSizeSimple')}</p>
              <p className="mt-1 text-gray-800">{formData.screening_details?.screen_size.width_m}{t('form.screeningDetails.meters')} × {formData.screening_details?.screen_size.height_m}{t('form.screeningDetails.meters')}</p>
            </div>
            {formData.screening_details?.event_website && (
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.screeningDetails.eventWebsite')}</p>
                <p className="mt-1 text-gray-800 break-words overflow-hidden">{formData.screening_details.event_website}</p>
              </div>
            )}
          </div>
          <div className="mt-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.screeningDetails.screeningAddress')}</p>
            <div className="mt-1 text-gray-800">
              <p>{formData.screening_details?.screening_address.street_1}</p>
              {formData.screening_details?.screening_address.street_2 && 
                <p>{formData.screening_details.screening_address.street_2}</p>
              }
              <p>
                {formData.screening_details?.screening_address.city}, {formData.screening_details?.screening_address.state} {formData.screening_details?.screening_address.postal_code}
              </p>
              <p>
                {formData.screening_details?.screening_address.country === "Germany" ? t('form.contactInfo.countries.germany') :
                 formData.screening_details?.screening_address.country === "Austria" ? t('form.contactInfo.countries.austria') :
                 formData.screening_details?.screening_address.country === "Switzerland" ? t('form.contactInfo.countries.switzerland') :
                 formData.screening_details?.screening_address.country}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">{t('form.capacityAndEvent.title')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.maxLegalCapacity')}</p>
              <p className="mt-1 text-gray-800">{formData.capacity?.max_legal_capacity}</p>
            </div>
            {/* <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.expectedAudience')}</p>
              <p className="mt-1 text-gray-800">{formData.capacity?.expected_audience}</p>
            </div> */}
          </div>

          <div className="mt-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.eventSummary')}</p>
            <div className="mt-1">
              <CollapsibleText text={formData.event_summary?.summary} maxHeight={80} />
            </div>
          </div>
          
          <div className="mt-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <div>
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.brandActivities')}</p>
              <p className="mt-1 text-gray-800">{formData.event_summary?.has_brand_activities ? t('common.yes') : t('common.no')}</p>
            </div>
            
            {formData.event_summary?.has_brand_activities && formData.event_summary?.related_brand_activities && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.relatedBrandActivities')}</p>
                <div className="mt-1">
                  <CollapsibleText text={formData.event_summary.related_brand_activities} maxHeight={80} />
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.promotion')}</p>
            <p className="mt-1 text-gray-800">{formData.promotion?.is_promoted ? t('common.yes') : t('common.no')}</p>
            
            {formData.promotion?.is_promoted && formData.promotion?.communication_responsible && (
              <div className="mt-3 border-t border-gray-100 pt-3 required">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide required">{t('form.review.communicationResponsible')}</p>
                <div className="mt-1">
                  <CollapsibleText text={formData.promotion.communication_responsible} maxHeight={80} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.thirdPartyAdvertising')}</p>
            <p className="mt-1 text-gray-800">{formData.promotion?.third_party_advertising ? t('common.yes') : t('common.no')}</p>
            
            {formData.event_summary?.involved_parties.length ? (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.involvedParties')}</p>
                <ul className="list-disc list-inside mt-1 text-gray-800">
                  {formData.event_summary.involved_parties.map((party: string, index: number) => (
                    <li key={index}>{party}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
            <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.interactiveElements.title')}</p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.interactiveElements.fullLengthFilm')}</p>
                <p className="mt-1 text-gray-800">{formData.interactive_elements?.full_length_film ? t('common.yes') : t('common.no')}</p>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.interactiveElements.audienceParticipation')}</p>
                <p className="mt-1 text-gray-800">{formData.interactive_elements?.audience_participation ? t('common.yes') : t('common.no')}</p>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.interactiveElements.livePerformance')}</p>
                <p className="mt-1 text-gray-800">{formData.interactive_elements?.live_performance ? t('common.yes') : t('common.no')}</p>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.interactiveElements.hasTheme')}</p>
                <p className="mt-1 text-gray-800">{formData.interactive_elements?.has_theme ? t('common.yes') : t('common.no')}</p>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.interactiveElements.specialEffects')}</p>
                <p className="mt-1 text-gray-800">{formData.interactive_elements?.special_effects ? t('common.yes') : t('common.no')}</p>
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.interactiveElements.characterLikness')}</p>
                <p className="mt-1 text-gray-800">{formData.interactive_elements?.character_likness ? t('common.yes') : t('common.no')}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">{t('form.feedback.title')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.feedback.howDidYouHear')}</p>
              <p className="mt-1 text-gray-800">
                {formData.how_did_you_hear === "search" && t('form.feedback.search')}
                {formData.how_did_you_hear === "social" && t('form.feedback.social')}
                {formData.how_did_you_hear === "film-studio" && t('form.feedback.filmStudio')}
                {formData.how_did_you_hear === "linkedin" && t('form.feedback.linkedin')}
                {formData.how_did_you_hear === "facebook" && t('form.feedback.facebook')}
                {formData.how_did_you_hear === "word-of-mouth" && t('form.feedback.wordOfMouth')}
                {formData.how_did_you_hear === "other" && `${t('form.feedback.other')} ${formData.how_did_you_hear_other}`}
                {formData.how_did_you_hear === "prefer-not-to-say" && t('form.feedback.preferNotToSay')}
              </p>
            </div> */}
            <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <p className="font-semibold text-[#0288d1] text-sm tracking-wide">{t('form.review.newsletter')}</p>
              <p className="mt-1 text-gray-800">{formData.newsletter_subscription ? t('common.yes') : t('common.no')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <GradientButton
          type="button"
          onClick={prevStep}
          variant="previous"
          className="mr-4"
          disabled={isSubmitting}
        >
          {t('common.previous')}
        </GradientButton>
        <GradientButton
          onClick={handleSubmit}
          variant="next"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('common.submitting') : t('common.submit')}
        </GradientButton>
      </div>

      {/* Legal Confirmation Modal */}
      <Dialog open={isLegalModalOpen} onOpenChange={setIsLegalModalOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl border-[#81D4FA] p-8">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.legal_text.title')}</DialogTitle>
          </DialogHeader>
          <div className="pt-4 space-y-4">
            <p className="text-sm text-gray-500">
              {t('confirmationModals.legal_text.submissionConfirmation')}
            </p>
            <p className="text-sm text-gray-500">
              {t('confirmationModals.legal_text.legalCopy')}
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-4 w-full">
            <Button 
              type="button" 
              variant="outline"
              className="w-full sm:w-auto border-[#81D4FA] text-[#0288d1] hover:bg-[#81D4FA]/10 focus:ring-[#0288d1]"
              onClick={() => setIsLegalModalOpen(false)}
            >
              {t('confirmationModals.legal_text.goBackAndReview')}
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
              onClick={handleCancelBooking}
            >
              {t('confirmationModals.fullLengthFilm.cancelBooking')}
            </Button>
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-[#0288d1] hover:bg-[#0288d1]/90 focus:ring-[#0288d1]"
              onClick={confirmSubmit}
            >
              {t('confirmationModals.legal_text.confirmAccurate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* "Are you sure?" Confirmation Modal for Cancellation */}
      <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl border-[#81D4FA] p-8">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.confirmation.title')}</DialogTitle>
          </DialogHeader>
          <div className="pt-4 space-y-4">
            <p className="text-sm text-gray-500">
              {t('confirmationModals.confirmation.description')}
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-4 w-full">
            <Button 
              type="button" 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
              onClick={confirmCancelBooking}
            >
              {t('confirmationModals.confirmation.confirmCancel')}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="w-full sm:w-auto border-[#81D4FA] text-[#0288d1] hover:bg-[#81D4FA]/10 focus:ring-[#0288d1]"
              onClick={() => setIsConfirmationModalOpen(false)}
            >
              {t('confirmationModals.confirmation.goBack')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
