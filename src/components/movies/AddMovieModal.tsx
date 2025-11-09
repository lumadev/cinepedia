"use client";

import { useState, useEffect, useRef} from "react";
import { useToast } from "@/components/ui/ToastContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MultiSelectAutocomplete } from "@/components/ui/MultiSelectAutocomplete";
import { movieGenres } from "@/components/movies/constants/movieGenres";
import { saveMovie } from "@/components/movies/helpers/saveMovie";
import { updateMovie } from "@/components/movies/helpers/updateMovie";
import { FormError } from "@/components/ui/FormError";

import type { Movie } from "@/components/movies/interfaces/movie";

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAfterSave: () => void;
  isEdit: boolean;
  movie?: Movie | null;
  lastOrder: number
}

const emptyMovie: Omit<Movie, "id"> = {
  title: "",
  order: null,
  poster: "",
  genres: [],
  rating: null,
  description: "",
  dateSeen: "",
};

export function AddMovieModal({
  isOpen,
  onClose,
  onAfterSave,
  isEdit = false,
  movie,
  lastOrder
}: AddMovieModalProps) {
  const { showError, showSuccess } = useToast();

  const [newMovie, setNewMovie] = useState<Omit<Movie, "id">>(emptyMovie);
  const [loadingSave, setLoadingSave] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputBase =
    "w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400 rounded-md";

  const getCalculatedOrder = () => {
    if (isEdit && movie) {
      return movie.order ? movie.order : (lastOrder ?? 0) + 1;
    } else {
      return lastOrder ? lastOrder + 1 : 1;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    // só calcula uma vez ao abrir
    const order = getCalculatedOrder();

    if (isEdit && movie) {
      const { id, ...rest } = movie;
      setNewMovie({ ...rest, order });
    } else {
      setNewMovie({ ...emptyMovie, order });
    }

    setSubmitted(false);
  }, [isOpen]);

  const updateMovieField = (field: keyof Omit<Movie, "id">, value: any) => {
    setNewMovie((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!newMovie.title.trim()) errors.title = "O título é obrigatório";
    if (!newMovie.poster.trim()) errors.poster = "O poster é obrigatório";
    if (newMovie.genres.length === 0) errors.genres = "Selecione ao menos um gênero";
    if (!newMovie.dateSeen) errors.dateSeen = "Informe a data que você viu o filme";
    return errors;
  };
  const errors = submitted ? validate() : {};

  const handleSave = async () => {
    setSubmitted(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return;

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16).replace("T", " ");

    const movieWithDate = {
      ...newMovie,
      dateRegister: formattedDate,
    };

    try {
      setLoadingSave(true);

      if (isEdit && movie?.id) {
        await updateMovie({
          id: movie.id,
          movie: movieWithDate,
        });
      } else {
        await saveMovie({
          movie: movieWithDate,
          onClose,
          setMovie: setNewMovie,
          emptyMovie,
        });
      }
      showSuccess("Filme salvo com sucesso!");

      onAfterSave();
      onClose();
    } catch (error) {
      showError("Erro ao salvar o filme.");
    } finally {
      setLoadingSave(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div
        className="modal-box relative"
        style={{
          backgroundColor: "rgba(40, 40, 40, 0.95)",
          color: "var(--foreground)",
        }}
      >
        {/* Botão de fechar */}
        <button
          className="absolute top-2 mr-2 right-2 text-gray-400 hover:text-gray-200 hover:scale-110 transition-transform duration-200"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        {/* Título dinâmico */}
        <h3 className="font-bold text-lg">
          {isEdit ? "Editar Filme" : "Novo Filme"}
        </h3>

        <div className="space-y-3 mt-4">
          {/* Título */}
          <div>
            <Input
              placeholder="Título"
              aria-label="Título do filme"
              value={newMovie.title}
              onChange={(e) => updateMovieField("title", e.target.value)}
              className={inputBase}
            />
            {errors.title && <FormError>{errors.title}</FormError>}
          </div>

          {/* Ordem */}
          <div>
            <Input
              placeholder="Ordem"
              aria-label="Ordem do filme"
              value={newMovie.order ?? ""}
              disabled={true}
            />
          </div>

          {/* Poster */}
          <div>
            <Input
              placeholder="URL do Poster"
              aria-label="Poster do filme"
              value={newMovie.poster}
              onChange={(e) => updateMovieField("poster", e.target.value)}
              className={inputBase}
            />
            {errors.poster && <FormError>{errors.poster}</FormError>}
          </div>

          {/* Descrição */}
          <div>
            <textarea
              placeholder="Descrição"
              aria-label="Descrição do filme"
              className={`textarea textarea-bordered ${inputBase}`}
              value={newMovie.description}
              onChange={(e) => updateMovieField("description", e.target.value)}
            />
            {errors.description && <FormError>{errors.description}</FormError>}
          </div>

          {/* Gêneros */}
          <div>
            <MultiSelectAutocomplete
              options={movieGenres}
              selected={newMovie.genres}
              onChange={(genres) => updateMovieField("genres", genres)}
              placeholder="Adicionar gênero"
            />
            {errors.genres && <FormError>{errors.genres}</FormError>}
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
              onChange={(e) => updateMovieField("dateSeen", e.target.value)}
              className={inputBase}
            />
            {errors.dateSeen && <FormError>{errors.dateSeen}</FormError>}
          </div>
        </div>

        <div className="modal-action flex gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loadingSave}>
            Cancelar
          </Button>

          <Button variant="primary" onClick={handleSave} disabled={loadingSave}>
            {loadingSave ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
