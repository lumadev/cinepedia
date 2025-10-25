"use client";

import { useState, useEffect } from "react";
import { MovieList } from "@/components/movies/MovieList";
import { AddMovieModal } from "@/components/movies/AddMovieModal";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Movie } from "@/components/movies/interfaces/movie";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { loadMovies } from "@/components/movies/helpers/loadMovies";

export default function Home() {
  const [movies, setMovies] = useState<Record<number, Movie[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMovies, setLoadingMovies] = useState(false); 

  const loadMoviesFn = () => {
    loadMovies(setMovies, setErrorMessage, setLoadingMovies);
  };

  useEffect(() => {
    loadMoviesFn()
  }, []);

  const onAfterSave = () => {
    loadMoviesFn()
    setIsEdit(false);
    setMovieToEdit(null);
  };

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

  return (
    <div className="min-h-screen p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Filmes</h1>
          <Button className="ml-4" variant="primary" onClick={handleAddMovie}>
            Adicionar Filme
          </Button>
        </div>

        <LogoutButton />
      </div>

      {loadingMovies ? (
        <SkeletonLoader count={10} columns={5} />
      ) : (
        <MovieList
          movies={movies}
          onAfterDeleteAction={loadMoviesFn}
          onEditMovieAction={handleEditMovie}
        />
      )}

      <AddMovieModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAfterSave={onAfterSave}
        isEdit={isEdit}
        movie={movieToEdit}
      />

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
