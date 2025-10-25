export interface Movie {
  id?: string | null;
  order?: number | null;
  title: string;
  poster: string;
  genres: string[];
  rating?: number | null;
  description?: string;
  dateSeen: string
}
