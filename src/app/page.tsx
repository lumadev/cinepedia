"use client";

import { useState, useEffect, useCallback, useDeferredValue, useMemo } from "react";
import { MovieList } from "@/components/movies/MovieList";
import { AddMovieModal } from "@/components/movies/AddMovieModal";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Movie } from "@/components/movies/interfaces/movie";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { SearchMovieBar } from "@/components/movies/SearchMovieBar";

import { useMovies } from "@/hooks/useMovies";
import { loadLastOrder } from "@/components/movies/helpers/loadLastOrder";

export default function Home() {
  // loading movies hook
  const { movies, loading: loadingMovies, error: errorLoadingMovies, fetchMovies } = useMovies();
  
  const [loadingLastOrder, setLoadingLastOrder] = useState(false);

  const [lastOrder, setLastOrder] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  
  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  
  // robust search with deferredQuery
  const filteredMovies = useMemo(() => {
    if (!deferredQuery.trim()) return movies;

    const lowerQuery = deferredQuery.toLowerCase();

    const result: Record<string, Movie[]> = {};

    Object.entries(movies).forEach(([order, movieArray]) => {
      const filtered = movieArray.filter((m) => m.title.toLowerCase().includes(lowerQuery));
      if (filtered.length > 0) {
        result[order] = filtered;
      }
    });

    return result;
  }, [movies, deferredQuery]);

  const loadInitialData = useCallback(() => {
    loadLastOrder(setLastOrder, setErrorMessage, setLoadingLastOrder);
  }, []);

  const onAfterDeleteAction = useCallback(() => {
    fetchMovies()
     // Atualiza a última ordem
    loadInitialData();
    setMovieToEdit(null);
  }, [fetchMovies, loadInitialData]);

  const onAfterSaveAction = useCallback(() => {
    fetchMovies()
    setIsEdit(false);
    setMovieToEdit(null);
  }, [])

  const handleAddMovie = () => {
    setIsEdit(false);
    setMovieToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setIsEdit(true);
    setMovieToEdit(movie);
    setIsModalOpen(true);
  };
  
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData]);

  const displayError = errorLoadingMovies || errorMessage;

  return (
    <div className="min-h-screen p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Filmes</h1>
          <Button className="ml-4" variant="primary" onClick={handleAddMovie}>
            Adicionar Filme
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <SearchMovieBar onSearchChange={setSearchQuery} />
          <LogoutButton />
        </div>
      </div>

      {loadingMovies || loadingLastOrder ? (
        <SkeletonLoader count={10} />
      ) : (
        <>
          <MovieList
            movies={filteredMovies}
            onAfterDeleteAction={onAfterDeleteAction}
            onEditMovieAction={handleEditMovie}
          />

          <AddMovieModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAfterSave={onAfterSaveAction}
            isEdit={isEdit}
            movie={movieToEdit}
            lastOrder={lastOrder}
          />
        </>
      )}

      {displayError && (
        <Toast
          message={displayError}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
}
