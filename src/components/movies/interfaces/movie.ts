export interface Movie {
  id?: string;
  order?: number;
  title: string;
  poster: string;
  genres?: string[];
  rating?: number;
  description?: string;
  dateSeen: string
}
