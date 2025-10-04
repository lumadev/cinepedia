"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MultiSelectAutocomplete } from "@/components/ui/MultiSelectAutocomplete";
import { movieGenres } from "@/components/movies/constants/movieGenres";
import { saveMovie } from "@/components/movies/helpers/saveMovie";
import { FormError } from "@/components/ui/FormError";

import type { Movie } from "@/components/movies/interfaces/movie";

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
  const [submitted, setSubmitted] = useState(false);

  const updateMovie = (field: keyof Omit<Movie, "id">, value: any) => {
    setNewMovie((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = () => {
    setSubmitted(true);

    // validação simples
    if (
      !newMovie.title.trim() ||
      !newMovie.poster.trim() ||
      !newMovie.description.trim() ||
      newMovie.genres.length === 0 ||
      !newMovie.dateSeen
    ) {
      return;
    }

    saveMovie({
      movie: newMovie,
      onAfterSave,
      onClose,
      setMovie: setNewMovie,
      setLoading: setLoadingSave,
      showError,
      emptyMovie
    });
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
          {/* Título */}
          <div>
            <Input
              placeholder="Título"
              aria-label="Título do filme"
              value={newMovie.title}
              onChange={(e) => updateMovie("title", e.target.value)}
              required
              className={inputBase}
            />
            {submitted && !newMovie.title 
              && <FormError>O título é obrigatório</FormError>}
          </div>

          {/* Poster */}
          <div>
            <Input
              placeholder="URL do Poster"
              aria-label="Poster do filme"
              value={newMovie.poster}
              onChange={(e) => updateMovie("poster", e.target.value)}
              required
              className={inputBase}
            />
            {submitted && !newMovie.poster 
              && <FormError>O poster é obrigatório</FormError>}
          </div>

          {/* Descrição */}
          <div>
            <textarea
              placeholder="Descrição"
              aria-label="Descrição do filme"
              className={`textarea textarea-bordered ${inputBase}`}
              value={newMovie.description}
              onChange={(e) => updateMovie("description", e.target.value)}
              required
            />
            {submitted && !newMovie.description 
              && <FormError>A descrição é obrigatória</FormError>}
          </div>

          {/* Gêneros */}
          <div>
            <MultiSelectAutocomplete
              options={movieGenres}
              selected={newMovie.genres}
              onChange={(genres) => updateMovie("genres", genres)}
              placeholder="Adicionar gênero"
            />
            {submitted && newMovie.genres.length === 0 && <FormError>Selecione ao menos um gênero</FormError>}
            <p className="text-xs text-gray-500 mt-1">
              Gêneros disponíveis: {movieGenres.join(", ")}
            </p>
          </div>

          {/* Data vista */}
          <div>
            <Input
              type="date"
              aria-label="Data em que o filme foi visto"
              label="Data que eu vi o filme"
              value={newMovie.dateSeen}
              onChange={(e) => updateMovie("dateSeen", e.target.value)}
              required
              className={inputBase}
            />
            {submitted && !newMovie.dateSeen 
              && <FormError>Informe a data que você viu o filme</FormError>}
          </div>
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
            onClick={handleSaveClick}
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
