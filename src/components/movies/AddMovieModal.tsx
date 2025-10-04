"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MultiSelectAutocomplete } from "@/components/ui/MultiSelectAutocomplete";
import { movieGenres } from "@/components/movies/movieGenres";

import type { Movie } from "@/components/movies/movie";

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAfterSave: (movie: Omit<Movie, "id">) => void;
}

const emptyMovie: Omit<Movie, "id"> = {
  title: "",
  poster: "",
  genres: [],
  rating: null,
  description: "",
  dateSeen: "",
};

export function AddMovieModal({ isOpen, onClose, onAfterSave }: AddMovieModalProps) {
  const { showError } = useToast();
  const [newMovie, setNewMovie] = useState<Omit<Movie, "id">>(emptyMovie);
  const [loadingSave, setLoadingSave] = useState(false);

  const updateMovie = (field: keyof Omit<Movie, "id">, value: any) => {
    setNewMovie((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!newMovie.title.trim()) {
      showError("O título é obrigatório");
      return;
    }

    setLoadingSave(true);
    try {
      await addDoc(collection(db, "movies"), newMovie);
      onAfterSave(newMovie);
      setNewMovie(emptyMovie);
      onClose();
    } catch (e) {
      showError("Ocorreu um erro ao salvar o filme");
    } finally {
      setLoadingSave(false);
    }
  };

  if (!isOpen) return null;

  const inputBase = "w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400 rounded-md";

  return (
    <dialog className="modal modal-open">
      <div className="modal-box" style={{ 
        backgroundColor: "rgba(40, 40, 40, 0.95)", 
        color: "var(--foreground)" 
      }}>
        <h3 className="font-bold text-lg">Novo Filme</h3>

        <div className="space-y-3 mt-4">
          <Input
            placeholder="Título"
            aria-label="Título do filme"
            value={newMovie.title}
            onChange={(e) => updateMovie("title", e.target.value)}
          />

          <Input
            placeholder="URL do Poster"
            aria-label="Poster do filme"
            value={newMovie.poster}
            onChange={(e) => updateMovie("poster", e.target.value)}
          />

          <textarea
            placeholder="Descrição"
            aria-label="Descrição do filme"
            className={`textarea textarea-bordered ${inputBase}`}
            value={newMovie.description}
            onChange={(e) => updateMovie("description", e.target.value)}
          />

          <MultiSelectAutocomplete
            options={movieGenres}
            selected={newMovie.genres}
            onChange={(genres) => updateMovie("genres", genres)}
            placeholder="Adicionar gênero"
          />

          <p className="text-xs text-gray-500 mt-1">
            Gêneros disponíveis: {movieGenres.join(", ")}
          </p>

          <Input
            type="date"
            aria-label="Data em que o filme foi visto"
            label="Data que eu vi o filme"
            value={newMovie.dateSeen}
            onChange={(e) => updateMovie("dateSeen", e.target.value)}
          />
        </div>

        <div className="modal-action flex gap-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={loadingSave} 
            aria-label="Cancelar"
          >
            Cancelar
          </Button>

          <Button 
            variant="primary" 
            onClick={handleSave} 
            disabled={loadingSave} 
            aria-label="Salvar filme"
          >
            {loadingSave ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
