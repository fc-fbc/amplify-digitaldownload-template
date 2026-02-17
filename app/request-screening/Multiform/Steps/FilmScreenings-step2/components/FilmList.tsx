import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { FilmListProps } from "../../ContactInformation-step1/types";
import FilmItem from "./FilmItem";
import { FilmScreening, Screening } from "@/lib/types";
import { MAX_FILMS, MAX_SCREENINGS } from "../hooks/useFilmScreeningsValidation";

export default function FilmList({
  filmScreeningsData,
  onAddFilm,
  onUpdateFilmScreenings,
  errors,
  formSubmitted,
  duplicateError,
  setDuplicateError
}: FilmListProps) {
  const { t } = useTranslation();

  const handleRemoveFilm = (filmIndex: number) => {
    const updatedScreenings = filmScreeningsData.screenings_list.filter((_, i) => i !== filmIndex);
    const newFilmScreeningsData = {
      ...filmScreeningsData,
      screenings_list: updatedScreenings
    };
    onUpdateFilmScreenings(newFilmScreeningsData);
  };

  const handleFilmChange = (filmIndex: number, field: keyof FilmScreening, value: string | number) => {
    const updatedScreenings = [...filmScreeningsData.screenings_list];
    updatedScreenings[filmIndex] = {
      ...updatedScreenings[filmIndex],
      [field]: field === "year_of_release" ? parseInt(value as string) || 0 : value
    };

    const newFilmScreeningsData = {
      ...filmScreeningsData,
      screenings_list: updatedScreenings
    };

    onUpdateFilmScreenings(newFilmScreeningsData);
  };

  const handleFilmSelect = (filmIndex: number, catalogData: {
    title: string;
    year: number;
    iva_id: string;
    poster_path: string;
    media_type: "SPECIAL_PERMISSION" | "DIGITAL_DOWNLOAD"
  }) => {
    const updatedScreenings = [...filmScreeningsData.screenings_list];

    // If media type is DIGITAL_DOWNLOAD, set format to filmbankmedia download for all screenings
    const defaultFormat = catalogData.media_type === "DIGITAL_DOWNLOAD" ? "filmbankmedia download" : "";
    const screeningsWithFormat = updatedScreenings[filmIndex].screenings.map(screening => ({
      ...screening,
      format: catalogData.media_type === "DIGITAL_DOWNLOAD" ? "filmbankmedia download" : (screening.format || "")
    }));

    updatedScreenings[filmIndex] = {
      ...updatedScreenings[filmIndex],
      title: catalogData.title,
      year_of_release: catalogData.year,
      iva_id: catalogData.iva_id,
      poster_path: catalogData.poster_path,
      media_type: catalogData.media_type,
      screenings: screeningsWithFormat
    };

    const newFilmScreeningsData = {
      ...filmScreeningsData,
      screenings_list: updatedScreenings
    };

    onUpdateFilmScreenings(newFilmScreeningsData);
  };

  const handleAddScreening = (filmIndex: number) => {
    const film = filmScreeningsData.screenings_list[filmIndex];

    if (film.screenings.length >= MAX_SCREENINGS) {
      return;
    }

    // Default format to filmbankmedia download if media type is DIGITAL_DOWNLOAD
    const defaultFormat = film.media_type === "DIGITAL_DOWNLOAD" ? "filmbankmedia download" : "";

    const updatedScreenings = [...filmScreeningsData.screenings_list];
    updatedScreenings[filmIndex].screenings.push({
      screening_date: "",
      screening_guid: typeof window !== 'undefined' ? window.crypto.randomUUID() : '',
      number_of_screenings: 1,
      box_office_return: false,
      approved: false,
      ticket_info: filmScreeningsData.charging_tickets ? [
        { ticket_type: "", ticket_price: 0, tickets_sold: 0 }
      ] : [],
      format: defaultFormat
    });

    const newFilmScreeningsData = {
      ...filmScreeningsData,
      screenings_list: updatedScreenings
    };

    onUpdateFilmScreenings(newFilmScreeningsData);
  };

  const handleUpdateScreenings = (filmIndex: number, screenings: Screening[]) => {
    const updatedScreenings = [...filmScreeningsData.screenings_list];
    updatedScreenings[filmIndex].screenings = screenings;

    const newFilmScreeningsData = {
      ...filmScreeningsData,
      screenings_list: updatedScreenings
    };

    onUpdateFilmScreenings(newFilmScreeningsData);
  };

  return (
    <div className="space-y-6">
      {filmScreeningsData.screenings_list.map((film, filmIndex) => (
        <FilmItem
          key={filmIndex}
          film={film}
          filmIndex={filmIndex}
          chargingTickets={filmScreeningsData.charging_tickets}
          onRemoveFilm={handleRemoveFilm}
          onFilmChange={handleFilmChange}
          onFilmSelect={handleFilmSelect}
          onAddScreening={handleAddScreening}
          onUpdateScreenings={handleUpdateScreenings}
          errors={errors}
          formSubmitted={formSubmitted}
          duplicateError={duplicateError}
          setDuplicateError={setDuplicateError}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={onAddFilm}
        className="w-full h-14 border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 text-blue-600 hover:text-blue-700 font-bold text-base transition-all rounded-xl"
        disabled={filmScreeningsData.screenings_list.length >= MAX_FILMS}
      >
        <Plus className="w-6 h-6 mr-2" />
        {t('form.filmScreenings.addAnotherFilm')}
      </Button>
    </div>
  );
}
