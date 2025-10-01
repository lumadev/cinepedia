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

export function AddMovieModal({ isOpen, onClose, onAfterSave }: AddMovieModalProps) {
  const { showError } = useToast();

  const [newMovie, setNewMovie] = useState<Omit<Movie, "id">>({
    title: "",
    poster: "",
    genres: [],
    rating: null,
    description: "",
    dateSeen: ""
  });

  const handleSave = async () => {
    try {
      await addDoc(collection(db, "movies"), newMovie);
      onAfterSave(newMovie);
      setNewMovie({
        title: "",
        poster: "",
        genres: [],
        rating: null,
        description: "",
        dateSeen: ""
      });
      onClose();
    } catch (e) {
      showError("Ocorreu um erro ao salvar o filme");
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div
        className="modal-box"
        style={{
          backgroundColor: "rgba(40, 40, 40, 0.95)", // cinza escuro para contraste
          color: "var(--foreground)",
        }}
      >
        <h3 className="font-bold text-lg">Novo Filme</h3>
        <div className="space-y-2 mt-4">
          <input
            type="text"
            placeholder="Título"
            className="input input-bordered w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400"
            value={newMovie.title}
            onChange={(e) =>
              setNewMovie({ ...newMovie, title: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Ano"
            className="input input-bordered w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400"
            value={newMovie.year}
            onChange={(e) =>
              setNewMovie({ ...newMovie, year: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="URL do Poster"
            className="input input-bordered w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400"
            value={newMovie.poster}
            onChange={(e) =>
              setNewMovie({ ...newMovie, poster: e.target.value })
            }
          />
          <textarea
            placeholder="Descrição"
            className="textarea textarea-bordered w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400"
            value={newMovie.description}
            onChange={(e) =>
              setNewMovie({ ...newMovie, description: e.target.value })
            }
          />
          <label
            htmlFor="dateSeen"
            className="label text-gray-300"
          >
            <span className="label-text text-gray-300">
              Data que eu vi o filme
            </span>
          </label>
          <input
            id="dateSeen"
            type="date"
            className="input input-bordered w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400"
            value={newMovie.dateSeen}
            onChange={(e) =>
              setNewMovie({ ...newMovie, dateSeen: e.target.value })
            }
          />
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost text-gray-300 border-gray-600" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="btn btn-primary bg-blue-600 border-blue-600 hover:bg-blue-700"
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </dialog>
  );
}
