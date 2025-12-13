"use client";

import { useState, useEffect, useCallback, useDeferredValue } from "react";
import { MovieList } from "@/components/movies/MovieList";
import { AddMovieModal } from "@/components/movies/AddMovieModal";
import { Movie } from "@/components/movies/interfaces/movie";
import { Toast } from "@/components/ui/Toast";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { MoviesNavbar } from "@/components/layout/MoviesNavbar";

import { useMovies } from "@/hooks/useMovies";
import { useFilteredMovies } from "@/hooks/useFilteredMovies";

import { loadLastOrder } from "@/components/movies/helpers/loadLastOrder";

export default function Home() {
  // loading movies hook
  const { movies, loading: loadingMovies, error: errorLoadingMovies, fetchMovies } = useMovies();
  
  const [loadingLastOrder, setLoadingLastOrder] = useState(false);

  const [lastOrder, setLastOrder] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const filteredMovies = useFilteredMovies(movies, searchQuery);
  
  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <MoviesNavbar
        onSearchChange={setSearchQuery}
        onAddMovie={handleAddMovie}
      />

      <div className="p-6">
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
    </div>
  );
}
