export interface CatalogTitle {
  id: string;           // "movie-209968"
  ivaId: string;        // "Movie/209968"
  title: string;
  title_norm: string;
  year: number;
  posterPath: string;   // IVA image ID - use with existing /api/Images/[id] route
  mediaType: "SPECIAL_PERMISSION" | "DIGITAL_DOWNLOAD";
}
