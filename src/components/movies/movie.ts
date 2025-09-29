export interface Movie {
  id: number;
  title: string;
  year: number;
  poster: string;
  genre?: string[];
  rating?: number;
  description?: string;
}
