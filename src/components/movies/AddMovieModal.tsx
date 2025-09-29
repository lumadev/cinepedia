"use client";

import { useState } from "react";
import type { Movie } from "@/app/page";

import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAfterSave: (movie: Omit<Movie, "id">) => void;
}

export function AddMovieModal({ isOpen, onClose, onAfterSave }: AddMovieModalProps) {
  const [newMovie, setNewMovie] = useState<Omit<Movie, "id">>({
    title: "",
    year: new Date().getFullYear(),
    poster: "",
    genre: [],
    rating: null,
    description: "",
  });

  const handleSave = async () => {
    try {
      const teste = await addDoc(collection(db, "movies"), newMovie);

      onAfterSave(newMovie);
      setNewMovie({
        title: "",
        year: new Date().getFullYear(),
        poster: "",
        genre: [],
        rating: null,
        description: "",
      });
      onClose();
    } catch(e) {
      console.log(e)
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Novo Filme</h3>
        <div className="space-y-2 mt-4">
          <input
            type="text"
            placeholder="Título"
            className="input input-bordered w-full"
            value={newMovie.title}
            onChange={(e) =>
              setNewMovie({ ...newMovie, title: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Ano"
            className="input input-bordered w-full"
            value={newMovie.year}
            onChange={(e) =>
              setNewMovie({ ...newMovie, year: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="URL do Poster"
            className="input input-bordered w-full"
            value={newMovie.poster}
            onChange={(e) =>
              setNewMovie({ ...newMovie, poster: e.target.value })
            }
          />
          <textarea
            placeholder="Descrição"
            className="textarea textarea-bordered w-full"
            value={newMovie.description}
            onChange={(e) =>
              setNewMovie({ ...newMovie, description: e.target.value })
            }
          />
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </dialog>
  );
}
