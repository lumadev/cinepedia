export interface Movie {
  id: number;
  title: string;
  poster: string;
  genres?: string[];
  rating?: number;
  description?: string;
  dateSeen: string
}
