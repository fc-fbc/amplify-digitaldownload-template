import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InfoButton from "@/components/InfoButton"
import { FormData } from "@/lib/types"
import { useTranslation } from "@/lib/hooks/useTranslation"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useFormContext } from "@/app/request-screening/Multiform/context/FormContext"
import { LinkPreview } from "@/components/ui/link-preview"

interface InteractiveElementsProps {
  localFormData: FormData
  setLocalFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: { [key: string]: string }
  updateLocalAndContextData?: (data: FormData) => void
}

export const InteractiveElements = ({
  localFormData,
  setLocalFormData,
  errors,
  updateLocalAndContextData
}: InteractiveElementsProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { resetForm } = useFormContext(); // Access the resetForm function from FormContext
  // State for the confirmation dialog that appears when "Cancel booking & clear form" is clicked
  // Modal states for each question
  const [isFullLengthModalOpen, setIsFullLengthModalOpen] = useState(false);
  const [isAudienceParticipationModalOpen, setIsAudienceParticipationModalOpen] = useState(false);
  const [isLivePerformanceModalOpen, setIsLivePerformanceModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSpecialEffectsModalOpen, setIsSpecialEffectsModalOpen] = useState(false);
  const [isCharacterLiknessModalOpen, setIsCharacterLiknessModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('form.interactiveElements.title')}</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="full-length">{t('form.interactiveElements.fullLengthFilm')} <span className="text-red-500">*</span></Label>
          <div className="w-[10%]">
            <Select
              value={localFormData.interactive_elements?.full_length_film ? "yes" : "no"}
              required
              onValueChange={(value) => {
                if (value === "no") {
                  setIsFullLengthModalOpen(true);
                } else {
                  const updatedData = {
                    ...localFormData,
                    interactive_elements: {
                      ...localFormData.interactive_elements!,
                      full_length_film: value === "yes"
                    }
                  };
                  if (updateLocalAndContextData) {
                    updateLocalAndContextData(updatedData);
                  } else {
                    setLocalFormData(updatedData);
                  }
                }
              }}
            >
              <SelectTrigger id="full-length" className="border-[#81D4FA] focus:ring-[#0288d1]">
                <SelectValue placeholder={t('common.select')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="yes">{t('common.yes')}</SelectItem>
                <SelectItem value="no">{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.full_length_film && (
              <p className="text-red-500 text-sm">{errors.full_length_film}</p>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 w-[60%]">
            <Label htmlFor="audience-participation">{t('form.interactiveElements.audienceParticipation')} <span className="text-red-500">*</span></Label>
            <InfoButton content={t('form.capacityAndEvent.audienceParticipationExample')} />
          </div>
          <div className="w-[10%]">
            <Select
              value={localFormData.interactive_elements?.audience_participation ? "yes" : "no"}
              required
              onValueChange={(value) => {
                if (value === "yes") {
                  setIsAudienceParticipationModalOpen(true);
                } else {
                  const updatedData = {
                    ...localFormData,
                    interactive_elements: {
                      ...localFormData.interactive_elements!,
                      audience_participation: value === "yes"
                    }
                  };
                  if (updateLocalAndContextData) {
                    updateLocalAndContextData(updatedData);
                  } else {
                    setLocalFormData(updatedData);
                  }
                }
              }}
            >
              <SelectTrigger id="audience-participation" className="border-[#81D4FA] focus:ring-[#0288d1]">
                <SelectValue placeholder={t('common.select')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="yes">{t('common.yes')}</SelectItem>
                <SelectItem value="no">{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.audience_participation && (
              <p className="text-red-500 text-sm">{errors.audience_participation}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="live-performance">{t('form.interactiveElements.livePerformance')} <span className="text-red-500">*</span></Label>
          <div className="w-[10%]">
            <Select
              value={localFormData.interactive_elements?.live_performance ? "yes" : "no"}
              required
              onValueChange={(value) => {
                if (value === "yes") {
                  setIsLivePerformanceModalOpen(true);
                } else {
                  const updatedData = {
                    ...localFormData,
                    interactive_elements: {
                      ...localFormData.interactive_elements!,
                      live_performance: value === "yes"
                    }
                  };
                  if (updateLocalAndContextData) {
                    updateLocalAndContextData(updatedData);
                  } else {
                    setLocalFormData(updatedData);
                  }
                }
              }}
            >
              <SelectTrigger id="live-performance" className="border-[#81D4FA] focus:ring-[#0288d1]">
                <SelectValue placeholder={t('common.select')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="yes">{t('common.yes')}</SelectItem>
                <SelectItem value="no">{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.live_performance && (
              <p className="text-red-500 text-sm">{errors.live_performance}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-[60%]">
            <Label htmlFor="has-theme">{t('form.interactiveElements.hasTheme')} <span className="text-red-500">*</span></Label>
          </div>
          <div className="w-[10%]">
            <Select
              value={localFormData.interactive_elements?.has_theme ? "yes" : "no"}
              required
              onValueChange={(value) => {
                if (value === "yes") {
                  setIsThemeModalOpen(true);
                } else {
                  const updatedData = {
                    ...localFormData,
                    interactive_elements: {
                      ...localFormData.interactive_elements!,
                      has_theme: value === "yes"
                    }
                  };
                  if (updateLocalAndContextData) {
                    updateLocalAndContextData(updatedData);
                  } else {
                    setLocalFormData(updatedData);
                  }
                }
              }}
            >
              <SelectTrigger id="has-theme" className="border-[#81D4FA] focus:ring-[#0288d1]">
                <SelectValue placeholder={t('common.select')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="yes">{t('common.yes')}</SelectItem>
                <SelectItem value="no">{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.has_theme && (
              <p className="text-red-500 text-sm">{errors.has_theme}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="special-effects">{t('form.interactiveElements.specialEffects')} <span className="text-red-500">*</span></Label>
          <div className="w-[10%]">
            <Select
              value={localFormData.interactive_elements?.special_effects ? "yes" : "no"}
              required
              onValueChange={(value) => {
                if (value === "yes") {
                  setIsSpecialEffectsModalOpen(true);
                } else {
                  const updatedData = {
                    ...localFormData,
                    interactive_elements: {
                      ...localFormData.interactive_elements!,
                      special_effects: value === "yes"
                    }
                  };
                  if (updateLocalAndContextData) {
                    updateLocalAndContextData(updatedData);
                  } else {
                    setLocalFormData(updatedData);
                  }
                }
              }}
            >
              <SelectTrigger id="special-effects" className="border-[#81D4FA] focus:ring-[#0288d1]">
                <SelectValue placeholder={t('common.select')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="yes">{t('common.yes')}</SelectItem>
                <SelectItem value="no">{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.special_effects && (
              <p className="text-red-500 text-sm">{errors.special_effects}</p>
            )}
          </div>
        </div>


        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-[60%]">
            <Label htmlFor="character-likeness">{t('form.interactiveElements.characterLikness')} <span className="text-red-500">*</span></Label>
          </div>
          <div className="w-[10%]">
            <Select
              value={localFormData.interactive_elements?.character_likness ? "yes" : "no"}
              required
              onValueChange={(value) => {
                if (value === "yes") {
                  setIsCharacterLiknessModalOpen(true);
                } else {
                  const updatedData = {
                    ...localFormData,
                    interactive_elements: {
                      ...localFormData.interactive_elements!,
                      character_likness: value === "yes"
                    }
                  };
                  if (updateLocalAndContextData) {
                    updateLocalAndContextData(updatedData);
                  } else {
                    setLocalFormData(updatedData);
                  }
                }
              }}
            >
              <SelectTrigger id="character-likeness" className="border-[#81D4FA] focus:ring-[#0288d1]">
                <SelectValue placeholder={t('common.select')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="yes">{t('common.yes')}</SelectItem>
                <SelectItem value="no">{t('common.no')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.character_likness && (
              <p className="text-red-500 text-sm">{errors.character_likness}</p>
            )}
          </div>
        </div>
      </div>

      {/* Full Length Film Modal */}
      <Dialog open={isFullLengthModalOpen} onOpenChange={setIsFullLengthModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl border-[#81D4FA] p-6">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.fullLengthFilm.title')}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('confirmationModals.fullLengthFilm.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <p className="font-medium">{t('confirmationModals.confirmation.whatWouldYouLikeToDo')}</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-start justify-start mt-4 w-full !text-left !justify-start !items-start">
            <Button 
              type="button" 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
              onClick={() => {
                // Open the confirmation dialog when "Cancel booking" is clicked
                setIsConfirmationModalOpen(true);
                // Keep the modal open until user confirms in the second dialog
              }}
            >
              {t('confirmationModals.fullLengthFilm.cancelBooking')}
            </Button>
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-600"
              onClick={() => {
                // Reset to default value (yes)
                const updatedData = {
                  ...localFormData,
                  interactive_elements: {
                    ...localFormData.interactive_elements!,
                    full_length_film: true
                  }
                };
                if (updateLocalAndContextData) {
                  updateLocalAndContextData(updatedData);
                } else {
                  setLocalFormData(updatedData);
                }
                setIsFullLengthModalOpen(false);
              }}
            >
              {t('confirmationModals.fullLengthFilm.playFilmInFull')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* "Are you sure?" Confirmation Modal for Cancellation */}
      <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl border-[#81D4FA] p-6">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.confirmation.title')}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('confirmationModals.confirmation.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-start justify-start mt-4 w-full !text-left !justify-start !items-start">
            <Button 
              type="button" 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
              onClick={() => {
                // Properly clear the entire form context using the resetForm function
                resetForm();
                // Close all modals
                setIsFullLengthModalOpen(false);
                setIsAudienceParticipationModalOpen(false);
                setIsLivePerformanceModalOpen(false);
                setIsThemeModalOpen(false);
                setIsSpecialEffectsModalOpen(false);
                setIsCharacterLiknessModalOpen(false);
                setIsConfirmationModalOpen(false);
                // Redirect to the booking start page
                router.push('/request-screening');
              }}
            >
              {t('confirmationModals.confirmation.confirmCancel')}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="w-full sm:w-auto border-[#81D4FA] text-[#0288d1] hover:bg-[#81D4FA]/10 focus:ring-[#0288d1]"
              onClick={() => {
                setIsConfirmationModalOpen(false);
              }}
            >
              {t('confirmationModals.confirmation.goBack')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audience Participation Modal */}
      <Dialog open={isAudienceParticipationModalOpen} onOpenChange={setIsAudienceParticipationModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl border-[#81D4FA] p-6">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.audienceParticipation.title')}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('confirmationModals.audienceParticipation.description')}
              <LinkPreview 
                url="https://www.filmbankmedia.com/films/archive/?g=2093-singalong&s=productionyeardesc"
                className="font-bold text-[#0288d1]"
              >
                Sing-along titles
              </LinkPreview>.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <p className="font-medium">{t('confirmationModals.confirmation.whatWouldYouLikeToDo')}</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-start justify-start mt-4 w-full !text-left !justify-start !items-start">
            <Button 
              type="button" 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
              onClick={() => {
                // Open the confirmation dialog when "Cancel booking" is clicked
                setIsConfirmationModalOpen(true);
                // Keep the modal open until user confirms in the second dialog
              }}
            >
              {t('confirmationModals.fullLengthFilm.cancelBooking')}
            </Button>
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-600"
              onClick={() => {
                // Reset to default value (no)
                const updatedData = {
                  ...localFormData,
                  interactive_elements: {
                    ...localFormData.interactive_elements!,
                    audience_participation: false
                  }
                };
                if (updateLocalAndContextData) {
                  updateLocalAndContextData(updatedData);
                } else {
                  setLocalFormData(updatedData);
                }
                setIsAudienceParticipationModalOpen(false);
              }}
            >
              {t('confirmationModals.audienceParticipation.continueWithout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Performance Modal */}
      <Dialog open={isLivePerformanceModalOpen} onOpenChange={setIsLivePerformanceModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl border-[#81D4FA] p-6">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.livePerformance.title')}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('confirmationModals.livePerformance.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <p className="font-medium">{t('confirmationModals.confirmation.whatWouldYouLikeToDo')}</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-start justify-start mt-4 w-full !text-left !justify-start !items-start">
            <Button 
              type="button" 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
              onClick={() => {
                // Open the confirmation dialog when "Cancel booking" is clicked
                setIsConfirmationModalOpen(true);
                // Keep the modal open until user confirms in the second dialog
              }}
            >
              {t('confirmationModals.fullLengthFilm.cancelBooking')}
            </Button>
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-600"
              onClick={() => {
                // Reset to default value (no)
                const updatedData = {
                  ...localFormData,
                  interactive_elements: {
                    ...localFormData.interactive_elements!,
                    live_performance: false
                  }
                };
                if (updateLocalAndContextData) {
                  updateLocalAndContextData(updatedData);
                } else {
                  setLocalFormData(updatedData);
                }
                setIsLivePerformanceModalOpen(false);
              }}
            >
              {t('confirmationModals.livePerformance.continueWithout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Theme Modal */}
      <Dialog open={isThemeModalOpen} onOpenChange={setIsThemeModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl border-[#81D4FA] p-6">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.themedScreening.title')}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('confirmationModals.themedScreening.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <p className="font-medium">{t('confirmationModals.confirmation.whatWouldYouLikeToDo')}</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-start justify-start mt-4 w-full !text-left !justify-start !items-start">
            <Button 
              type="button" 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
              onClick={() => {
                // Open the confirmation dialog when "Cancel booking" is clicked
                setIsConfirmationModalOpen(true);
                // Keep the modal open until user confirms in the second dialog
              }}
            >
              {t('confirmationModals.fullLengthFilm.cancelBooking')}
            </Button>
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-600"
              onClick={() => {
                // Reset to default value (no)
                const updatedData = {
                  ...localFormData,
                  interactive_elements: {
                    ...localFormData.interactive_elements!,
                    has_theme: false
                  }
                };
                if (updateLocalAndContextData) {
                  updateLocalAndContextData(updatedData);
                } else {
                  setLocalFormData(updatedData);
                }
                setIsThemeModalOpen(false);
              }}
            >
              {t('confirmationModals.themedScreening.continueWithout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Special Effects Modal */}
      <Dialog open={isSpecialEffectsModalOpen} onOpenChange={setIsSpecialEffectsModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl border-[#81D4FA] p-6">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.specialEffects.title')}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('confirmationModals.specialEffects.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <p className="font-medium">{t('confirmationModals.confirmation.whatWouldYouLikeToDo')}</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-start justify-start mt-4 w-full !text-left !justify-start !items-start">
            <Button 
              type="button" 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
              onClick={() => {
                // Open the confirmation dialog when "Cancel booking" is clicked
                setIsConfirmationModalOpen(true);
                // Keep the modal open until user confirms in the second dialog
              }}
            >
              {t('confirmationModals.fullLengthFilm.cancelBooking')}
            </Button>
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-600"
              onClick={() => {
                // Reset to default value (no)
                const updatedData = {
                  ...localFormData,
                  interactive_elements: {
                    ...localFormData.interactive_elements!,
                    special_effects: false
                  }
                };
                if (updateLocalAndContextData) {
                  updateLocalAndContextData(updatedData);
                } else {
                  setLocalFormData(updatedData);
                }
                setIsSpecialEffectsModalOpen(false);
              }}
            >
              {t('confirmationModals.specialEffects.continueWithout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Character Likeness Modal */}
      <Dialog open={isCharacterLiknessModalOpen} onOpenChange={setIsCharacterLiknessModalOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl border-[#81D4FA] p-6">
          <DialogHeader>
            <DialogTitle className="text-[#0288d1]">{t('confirmationModals.characterLikeness.title')}</DialogTitle>
            <DialogDescription className="pt-4">
              {t('confirmationModals.characterLikeness.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <p className="font-medium">{t('confirmationModals.confirmation.whatWouldYouLikeToDo')}</p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 items-start justify-start mt-4 w-full !text-left !justify-start !items-start">
            <Button 
              type="button" 
              variant="destructive"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-700"
              onClick={() => {
                // Open the confirmation dialog when "Cancel booking" is clicked
                setIsConfirmationModalOpen(true);
                // Keep the modal open until user confirms in the second dialog
              }}
            >
              {t('confirmationModals.fullLengthFilm.cancelBooking')}
            </Button>
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium focus:ring-green-600"
              onClick={() => {
                // Reset to default value (no)
                const updatedData = {
                  ...localFormData,
                  interactive_elements: {
                    ...localFormData.interactive_elements!,
                    character_likness: false
                  }
                };
                if (updateLocalAndContextData) {
                  updateLocalAndContextData(updatedData);
                } else {
                  setLocalFormData(updatedData);
                }
                setIsCharacterLiknessModalOpen(false);
              }}
            >
              {t('confirmationModals.characterLikeness.continueWithout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
