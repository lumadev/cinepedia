import type { Movie } from "@/components/movies/interfaces/movie";

/**
 * Agrupa uma lista de filmes por ano de visualização.
 */
export function groupByYear(movies: Movie[]): Record<number, Movie[]> {
  return movies.reduce((acc, movie) => {
    const year = new Date(movie.dateSeen).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(movie);
    return acc;
  }, {} as Record<number, Movie[]>);
}
