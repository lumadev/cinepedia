"use client";

import { useState } from "react";
import { Movie } from "@/components/movies/interfaces/movie";
import { useToast } from "@/components/ui/ToastContext";
import { formatDate } from "@/utils/date"

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { DeleteMovieButton } from "./DeleteMovieButton";

type MovieListProps = {
  movies: Record<number, Movie[]>; // Alterado para agrupar por ano
  onAfterDeleteAction: () => void;
};

export const MovieList = ({ movies, onAfterDeleteAction }: MovieListProps) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();

  const handleDelete = async (movieId: string) => {
    try {
      setLoadingId(movieId);
      await deleteDoc(doc(db, "movies", movieId));
      onAfterDeleteAction();
      showSuccess("Filme deletado com sucesso!");
    } catch (e) {
      showError("Ocorreu um erro ao excluir o filme");
    } finally {
      setLoadingId(null);
    }
  };

  // Ordena os anos do mais recente para o mais antigo
  const sortedYears = Object.keys(movies)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="p-4 space-y-8">
      {sortedYears.map((year) => (
        <div key={year}>
          <h2 className="text-xl font-bold mb-4">{year}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies[year].map((movie) => (
              <div
                key={movie.id}
                className="relative group card shadow-lg transition-opacity duration-200 hover:opacity-80"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
              >
                <figure>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className={`h-88 w-full object-cover rounded-t-md transition-opacity duration-200 ${
                      loadingId === movie.id ? "opacity-60" : ""
                    }`}
                  />
                </figure>
                <div className={`card-body p-3 transition-opacity duration-200 ${loadingId === movie.id ? "opacity-60" : ""}`}>
                  <h2 className="card-title text-sm">{movie.title}</h2>
                  <p className="text-xs text-gray-400">{movie.genres?.join(", ")}</p>
                  <p className="text-xs text-gray-400">{formatDate(movie.dateSeen)}</p>
                </div>

                {loadingId === movie.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
                  </div>
                )}

                <div className="absolute top-3 right-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DeleteMovieButton
                    movieId={movie.id}
                    onAfterDeleteAction={() => {
                      setLoadingId(movie.id);
                      onAfterDeleteAction();
                      setLoadingId(null);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
