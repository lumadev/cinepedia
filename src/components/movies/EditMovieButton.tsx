"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { IconEdit } from "@tabler/icons-react";

import type { Movie } from "@/components/movies/interfaces/movie";

type EditMovieButtonProps = {
  movie: Movie;
  onEditMovieAction: (movie: Movie) => void;
};

export const EditMovieButton = ({ movie, onEditMovieAction }: EditMovieButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setLoading(true);
    try {
      onEditMovieAction(movie);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEdit}
      disabled={loading}
      className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/70 transition-colors shadow-md"
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
      ) : (
        <IconEdit size={24} className="text-white" />
      )}
    </button>
  );
};
