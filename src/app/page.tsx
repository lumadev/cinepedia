"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { MovieList } from "@/components/movies/MovieList";
import { AddMovieModal } from "@/components/movies/AddMovieModal";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Movie } from "@/components/movies/interfaces/movie";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { SearchMovieBar } from "@/components/movies/SearchMovieBar";

import { loadLastOrder } from "@/components/movies/helpers/loadLastOrder";
import { loadMovies } from "@/components/movies/helpers/loadMovies";

export default function Home() {
  const [movies, setMovies] = useState<Record<number, Movie[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [lastOrder, setLastOrder] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingLastOrder, setLoadingLastOrder] = useState(false);

  const loadMoviesFn = useCallback(() => {
    loadMovies(setMovies, setErrorMessage, setLoadingMovies);
    loadLastOrder(setLastOrder, setErrorMessage, setLoadingLastOrder);
  }, [])

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const lowerQuery = searchQuery.toLowerCase();

    return Object.fromEntries(
      Object.entries(movies).map(([order, movieArray]) => [
        order,
        movieArray.filter((m) => m.title.toLowerCase().includes(lowerQuery)),
      ])
    );
  }, [movies, searchQuery]);

  const onAfterSave = useCallback(() => {
    loadMoviesFn()
    setIsEdit(false);
    setMovieToEdit(null);
  }, [loadMoviesFn])

  const handleAddMovie = () => {
    setIsEdit(false);
    setMovieToEdit(null);
    setShowModal(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setIsEdit(true);
    setMovieToEdit(movie);
    setShowModal(true);
  };
  
  useEffect(() => {
    loadMoviesFn()
  }, []);

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
            onAfterDeleteAction={loadMoviesFn}
            onEditMovieAction={handleEditMovie}
          />

          <AddMovieModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onAfterSave={onAfterSave}
            isEdit={isEdit}
            movie={movieToEdit}
            lastOrder={lastOrder}
          />
        </>
      )}

      {errorMessage && (
        <Toast
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
}
