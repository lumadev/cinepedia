"use client";

import { useState } from "react";
import { Movie } from "@/components/movies/interfaces/movie";
import { IconTrash } from "@tabler/icons-react";
import { useToast } from "@/components/ui/ToastContext";
import { formatDate } from "@/utils/date"

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type MovieListProps = {
  movies: Movie[];
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="relative group card shadow-lg transition-opacity duration-200 hover:opacity-80"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          {/* Conteúdo do card */}
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

          {/* Loader circular centralizado */}
          {loadingId === movie.id && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Ícones aparecem apenas no hover */}
          <div className="absolute top-3 right-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleDelete(movie.id)}
              disabled={loadingId === movie.id}
              className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/70 transition-colors shadow-md"
            >
              <IconTrash size={24} className="text-white" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
