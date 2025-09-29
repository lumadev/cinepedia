"use client";

import { useState, useEffect } from "react";
import { MovieList } from "@/components/movies/MovieList";
import { AddMovieModal } from "@/components/movies/AddMovieModal";
import { Movie } from "@/components/movies/movie";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const snapshot = await getDocs(collection(db, "movies"));
        const moviesDatabase = snapshot.docs.map(doc => ({ 
          id: Number(doc.id), 
          ...doc.data() 
        })) as Movie[];

        setMovies(moviesDatabase);
      } catch(e) {
        setToastMessage("Ocorreu um erro ao carregar os filmes.");
      }
    };

    loadMovies();
  }, []);

  const onAfterSave = (newMovie: Omit<Movie, "id">) => {
    const movie: Movie = {
      id: movies.length + 1,
      ...newMovie,
    };
    setMovies([...movies, movie]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista de Filmes</h1>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
        >
          Adicionar Filme
        </Button>
      </div>

      <MovieList movies={movies} />

      <AddMovieModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAfterSave={onAfterSave}
      />

      {/* Toast container */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
