import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { FilmItemProps } from "../../ContactInformation-step1/types";
import ScreeningItem from "./ScreeningItem";
import { TicketInfo } from "@/lib/types";
import { MAX_SCREENINGS } from "../hooks/useFilmScreeningsValidation";
import { FilmSearchInput } from "./FilmSearchInput";
import { CatalogTitle } from "@/lib/types/catalog";

export default function FilmItem({
  film,
  filmIndex,
  chargingTickets,
  onRemoveFilm,
  onFilmChange,
  onFilmSelect,
  onAddScreening,
  onUpdateScreenings,
  errors,
  formSubmitted,
  duplicateError,
  setDuplicateError
}: FilmItemProps) {
  const { t } = useTranslation();
  const [showScreenings, setShowScreenings] = useState(true);

  const handleFilmSelect = (catalogFilm: CatalogTitle) => {
    onFilmSelect(filmIndex, {
      title: catalogFilm.title,
      year: catalogFilm.year,
      iva_id: catalogFilm.ivaId,
      poster_path: catalogFilm.posterPath,
      media_type: catalogFilm.mediaType
    });
  };

  const handleManualEntry = (title: string, year: number) => {
    onFilmSelect(filmIndex, {
      title,
      year,
      iva_id: "",
      poster_path: "",
      media_type: "SPECIAL_PERMISSION"
    });
  };

  const handleClear = () => {
    onFilmSelect(filmIndex, {
      title: "",
      year: 0,
      iva_id: "",
      poster_path: "",
      media_type: "SPECIAL_PERMISSION"
    });
  };

  const handleRemoveScreening = (filmIndex: number, screeningIndex: number) => {
    const updatedScreenings = [...film.screenings];
    updatedScreenings.splice(screeningIndex, 1);
    onUpdateScreenings(filmIndex, updatedScreenings);
  };

  const handleScreeningDateChange = (filmIndex: number, screeningIndex: number, date: string) => {
    const updatedScreenings = [...film.screenings];
    updatedScreenings[screeningIndex].screening_date = date;
    onUpdateScreenings(filmIndex, updatedScreenings);
  };

  const handleNumberOfScreeningsChange = (filmIndex: number, screeningIndex: number, value: number) => {
    const updatedScreenings = [...film.screenings];
    updatedScreenings[screeningIndex].number_of_screenings = value;
    onUpdateScreenings(filmIndex, updatedScreenings);
  };

  const handleAddTicketType = (filmIndex: number, screeningIndex: number) => {
    const updatedScreenings = [...film.screenings];
    updatedScreenings[screeningIndex].ticket_info.push({
      ticket_type: "",
      ticket_price: 0,
      tickets_sold: 0
    });
    onUpdateScreenings(filmIndex, updatedScreenings);
  };

  const handleUpdateTickets = (filmIndex: number, screeningIndex: number, tickets: TicketInfo[]) => {
    const updatedScreenings = [...film.screenings];
    updatedScreenings[screeningIndex].ticket_info = tickets;
    onUpdateScreenings(filmIndex, updatedScreenings);
  };

  const handleFormatChange = (filmIndex: number, screeningIndex: number, format: string) => {
    const updatedScreenings = [...film.screenings];
    updatedScreenings[screeningIndex].format = format;
    onUpdateScreenings(filmIndex, updatedScreenings);
  };

  const hasFilmSelected = film.title && film.year_of_release > 0;

  return (
    <div className="rounded-xl border-2 border-blue-200 shadow-md overflow-visible">
      {/* Header */}
      <div style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }} className="px-5 py-3 flex items-center justify-between rounded-t-lg">
        <h3 className="text-lg font-bold text-white">
          {t('form.filmScreenings.film')} {filmIndex + 1}
        </h3>
        <Button
          type="button"
          size="sm"
          onClick={() => onRemoveFilm(filmIndex)}
          className="bg-red-500 hover:bg-red-600 text-white border-0"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Remove
        </Button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5 bg-white overflow-visible">
        {/* Film Search */}
        <div>
          <FilmSearchInput
            value={film.title}
            year={film.year_of_release}
            posterPath={film.poster_path}
            mediaType={film.media_type}
            onChange={(value) => onFilmChange(filmIndex, "title", value)}
            onSelect={handleFilmSelect}
            onManualEntry={handleManualEntry}
            onClear={handleClear}
            error={formSubmitted && !!errors.films[filmIndex]?.title}
          />
          {formSubmitted && errors.films[filmIndex]?.title && (
            <p className="text-red-600 text-sm mt-2 font-medium">{errors.films[filmIndex].title}</p>
          )}
          {formSubmitted && errors.films[filmIndex]?.year && (
            <p className="text-red-600 text-sm mt-2 font-medium">{errors.films[filmIndex].year}</p>
          )}
        </div>

        {/* Screenings Section */}
        {hasFilmSelected && (
          <div className="pt-6 border-t-2 border-blue-100">
            <button
              type="button"
              onClick={() => setShowScreenings(!showScreenings)}
              className="flex items-center justify-between w-full text-left mb-4 p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <h4 className="text-base font-bold text-blue-800">
                {t('form.filmScreenings.screenings')} ({film.screenings.length})
              </h4>
              {showScreenings ? (
                <ChevronUp className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600" />
              )}
            </button>

            {showScreenings && (
              <div className="space-y-4">
                {formSubmitted && errors.films[filmIndex]?.maxScreeningsExceeded && (
                  <p className="text-red-600 text-sm font-medium">{errors.films[filmIndex].maxScreeningsExceeded}</p>
                )}

                {film.screenings.map((screening, screeningIndex) => (
                  <ScreeningItem
                    key={screening.screening_guid || screeningIndex}
                    screening={screening}
                    filmIndex={filmIndex}
                    screeningIndex={screeningIndex}
                    chargingTickets={chargingTickets}
                    mediaType={film.media_type}
                    onRemoveScreening={handleRemoveScreening}
                    onScreeningDateChange={handleScreeningDateChange}
                    onNumberOfScreeningsChange={handleNumberOfScreeningsChange}
                    onFormatChange={handleFormatChange}
                    onAddTicketType={handleAddTicketType}
                    onUpdateTickets={handleUpdateTickets}
                    errors={errors}
                    formSubmitted={formSubmitted}
                    duplicateError={duplicateError}
                    setDuplicateError={setDuplicateError}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onAddScreening(filmIndex)}
                  className="w-full h-12 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 font-semibold"
                  disabled={film.screenings.length >= MAX_SCREENINGS}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('form.filmScreenings.addScreening')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
