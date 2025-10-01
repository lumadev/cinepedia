"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

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

  const inputBase =
    "w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400 rounded-md";

  return (
    <dialog className="modal modal-open">
      <div
        className="modal-box"
        style={{
          backgroundColor: "rgba(40, 40, 40, 0.95)",
          color: "var(--foreground)",
        }}
      >
        <h3 className="font-bold text-lg">Novo Filme</h3>

        <div className="space-y-3 mt-4">
          <input
            type="text"
            placeholder="Título"
            aria-label="Título do filme"
            className={`input input-bordered ${inputBase}`}
            value={newMovie.title}
            onChange={(e) =>
              setNewMovie({ ...newMovie, title: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="URL do Poster"
            aria-label="Poster do filme"
            className={`input input-bordered ${inputBase}`}
            value={newMovie.poster}
            onChange={(e) =>
              setNewMovie({ ...newMovie, poster: e.target.value })
            }
          />

          <textarea
            placeholder="Descrição"
            aria-label="Descrição do filme"
            className={`textarea textarea-bordered ${inputBase}`}
            value={newMovie.description}
            onChange={(e) =>
              setNewMovie({ ...newMovie, description: e.target.value })
            }
          />

          <label htmlFor="dateSeen" className="label text-gray-300">
            <span className="label-text text-gray-300">
              Data que eu vi o filme
            </span>
          </label>
          <input
            id="dateSeen"
            type="date"
            aria-label="Data em que o filme foi visto"
            className={`input input-bordered ${inputBase}`}
            value={newMovie.dateSeen}
            onChange={(e) =>
              setNewMovie({ ...newMovie, dateSeen: e.target.value })
            }
          />
        </div>

        <div className="modal-action flex gap-2">
          <button
            className="btn btn-ghost text-gray-300 border-gray-600"
            onClick={onClose}
            aria-label="Cancelar"
            disabled={loadingSave}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary bg-blue-600 border-blue-600 hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSave}
            disabled={loadingSave}
            aria-label="Salvar filme"
          >
            {loadingSave ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </dialog>
  );
}