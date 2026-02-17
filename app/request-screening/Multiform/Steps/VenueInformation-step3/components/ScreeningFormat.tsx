"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTranslation } from "@/lib/hooks/useTranslation"
import InfoButton from "@/components/InfoButton"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Info } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface FormatOption {
  value: string;
  label: string;
  price?: string;
  notes?: string[];
  info?: string;
} 

interface ScreeningFormatProps {
  format: string;
  setFormat: (value: string) => void;
  dcpCapability: boolean;
  setDcpCapability: (value: boolean) => void;
  theatricalRelease: boolean;
  setTheatricalRelease: (value: boolean) => void;
  error?: string;
  theatricalVenue?: string;
}

export default function ScreeningFormat({ 
  format, 
  setFormat, 
  dcpCapability, 
  setDcpCapability, 
  theatricalRelease,
  setTheatricalRelease,
  error,
  theatricalVenue
}: ScreeningFormatProps) {
  const { t } = useTranslation();
  const [isTheatricalReleaseModalOpen, setIsTheatricalReleaseModalOpen] = useState(false);
  const [isDcpCapabilityModalOpen, setIsDcpCapabilityModalOpen] = useState(false);
  
  // Format options with translations
  const formatOptions: FormatOption[] = [
    { 
      value: "user-owned copy", 
      label: t('form.screeningDetails.formatOwnCopy'),
      notes: [t('form.screeningDetails.alreadyOwn')]
    },
    { 
      value: "rent a copy", 
      label: t('form.screeningDetails.rentACopy'),
      price: t('form.screeningDetails.priceRentCopy'),
      notes: [t('form.screeningDetails.subjectToAvail')]
    },
    { 
      value: "filmbankmedia download", 
      label: t('form.screeningDetails.formatFBMDownload'),
      price: t('form.screeningDetails.fbmDownloadPrice'),
      notes: [t('form.screeningDetails.subjectToAvail')]
    },
    { 
      value: "virtual screening room", 
      label: t('form.screeningDetails.vsr'),
      // price: "Varies",
      price: "Price on Request",
      // price: "To be Determined",
      notes: [
        t('form.screeningDetails.subjectToAvail'),
        t('form.screeningDetails.additionalFees')
      ]
    }
  ];
  return (
    <>
      <div className="space-y-4">
        <Label className="text-lg">
          {t('form.screeningDetails.format')} <span className="text-red-500">*</span>
        </Label>
        
        <RadioGroup
          onValueChange={setFormat}
          value={format}
        >
          <Card className="mt-2">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#E1F5FE] text-[#0288d1]">
                      <th className="p-3 text-left font-medium border-b"></th>
                      <th className="p-3 text-left font-medium border-b">Option</th>
                      <th className="p-3 text-left font-medium border-b">Price</th>
                      <th className="p-3 text-left font-medium border-b">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formatOptions.map((formatOption) => (
                      <tr 
                        key={formatOption.value} 
                        className={`border-b hover:bg-[#F5F5F5] ${format === formatOption.value ? 'bg-[#E1F5FE]/50' : ''}`}
                      >
                        <td className="p-3 align-top">
                          <RadioGroupItem 
                            value={formatOption.value} 
                            id={formatOption.value} 
                            className="mt-1"
                          />
                        </td>
                        <td className="p-3 align-top">
                          <Label htmlFor={formatOption.value} className="font-medium cursor-pointer">
                            {formatOption.label}
                          </Label>
                        </td>
                        <td className="p-3 align-top">
                          {formatOption.price || "—"}
                        </td>
                        <td className="p-3 align-top">
                          {formatOption.notes && formatOption.notes.map((note, index) => (
                            <div key={index} className="flex items-start mb-1 text-sm">
                              <span>{note}</span>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>
        
                    
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="space-y-4">
        <Label className="text-lg flex items-center">
          {t('form.screeningDetails.dcp35mmCapability')} <span className="text-red-500">*</span>
          <span className="ml-2">
          </span>
        </Label>
        <RadioGroup
          onValueChange={(value) => {
            if (value === "yes") {
              setIsDcpCapabilityModalOpen(true);
            } else {
              setDcpCapability(false);
            }
          }}
          value={dcpCapability ? "yes" : "no"}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="dcp-yes" />
            <Label htmlFor="dcp-yes">{t('common.yes')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="dcp-no" />
            <Label htmlFor="dcp-no">{t('common.no')}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* DCP Capability Warning Modal */}
      <Dialog open={isDcpCapabilityModalOpen} onOpenChange={setIsDcpCapabilityModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl border-[#81D4FA] p-6">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.dcpCapability.title') || "DCP/35mm Capability Warning"}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('confirmationModals.dcpCapability.description') || t('form.screeningDetails.dcp35mmCapabilityInfo')}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <p className="font-medium">{t('confirmationModals.confirmation.whatWouldYouLikeToDo')}</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-start justify-start mt-4 w-full !text-left !justify-start !items-start">
            <Button 
              type="button" 
              variant="outline"
              className="w-full sm:w-auto border-[#81D4FA] text-[#0288d1] hover:bg-[#81D4FA]/10 focus:ring-[#0288d1]"
              onClick={() => {
                setDcpCapability(false);
                setIsDcpCapabilityModalOpen(false);
              }}
            >
              {t('confirmationModals.dcpCapability.goBack') || t('common.no')}
            </Button>
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-600"
              onClick={() => {
                setDcpCapability(true);
                setIsDcpCapabilityModalOpen(false);
              }}
            >
              {t('confirmationModals.dcpCapability.continue') || t('common.yes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <Label className="text-lg flex items-center">
          {t('form.screeningDetails.theatricalRelease')} <span className="text-red-500">*</span>
          <span className="ml-2">
          </span>
        </Label>
        <RadioGroup
          onValueChange={(value) => {
            if (value === "yes") {
              setIsTheatricalReleaseModalOpen(true);
            } else {
              setTheatricalRelease(false);
            }
          }}
          value={theatricalRelease ? "yes" : "no"}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="theatrical-yes" />
            <Label htmlFor="theatrical-yes">{t('common.yes')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="theatrical-no" />
            <Label htmlFor="theatrical-no">{t('common.no')}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Theatrical Release Warning Modal */}
      <Dialog open={isTheatricalReleaseModalOpen} onOpenChange={setIsTheatricalReleaseModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl border-[#81D4FA] p-6">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.theatricalRelease.title')}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('confirmationModals.dcpCapability.description') || t('form.screeningDetails.dcp35mmCapabilityInfo')}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <p className="font-medium">{t('confirmationModals.confirmation.whatWouldYouLikeToDo')}</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-start justify-start mt-4 w-full !text-left !justify-start !items-start">
            <Button 
              type="button" 
              variant="outline"
              className="w-full sm:w-auto border-[#81D4FA] text-[#0288d1] hover:bg-[#81D4FA]/10 focus:ring-[#0288d1]"
              onClick={() => {
                setTheatricalRelease(false);
                setIsTheatricalReleaseModalOpen(false);
              }}
            >
              {t('confirmationModals.dcpCapability.goBack') || t('common.no')}
            </Button>
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-600"
              onClick={() => {
                setTheatricalRelease(true);
                setIsTheatricalReleaseModalOpen(false);
              }}
            >
              {t('confirmationModals.dcpCapability.continue') || t('common.yes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
