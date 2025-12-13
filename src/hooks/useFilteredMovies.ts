import { Movie } from "@/components/movies/interfaces/movie";

import { useDeferredValue, useMemo } from "react";

export function useFilteredMovies(movies: Record<string, Movie[]>, query: string) {
  const deferredQuery = useDeferredValue(query);

  // robust search with deferredQuery
  return useMemo(() => {
    if (!deferredQuery.trim()) return movies;

    const lowerQuery = deferredQuery.toLowerCase();
    const result: Record<string, Movie[]> = {};

    Object.entries(movies).forEach(([order, movieArray]) => {
      const filtered = movieArray.filter((m) =>
        m.title.toLowerCase().includes(lowerQuery)
      );

      if (filtered.length > 0) {
        result[order] = filtered;
      }
    });

    return result;
  }, [movies, deferredQuery]);
}
