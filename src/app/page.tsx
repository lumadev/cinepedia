"use client";

import { useState, useEffect } from "react";
import { MovieList } from "@/components/movies/MovieList";
import { AddMovieModal } from "@/components/movies/AddMovieModal";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Movie } from "@/components/movies/interfaces/movie";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { groupByYear } from "@/components/movies/helpers/groupByYear";

import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";

export default function Home() {
  const [movies, setMovies] = useState<Record<number, Movie[]>>({});
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMovies = async () => {
    setMovies({})

    try {
      const auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
        if (!user) return

        const moviesRef = collection(db, "movies");

        // filtra os filmes do usuário logado
        const queryRes = query(
          moviesRef,
          where("userId", "==", user?.uid),
          orderBy("dateSeen", "desc")
        );
        const snapshot = await getDocs(queryRes);

        const moviesDatabase = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Movie[];

        const moviesByYear = groupByYear(moviesDatabase);

        setMovies(moviesByYear);
      })
    } catch(e) {
      setErrorMessage("Ocorreu um erro ao carregar os filmes.");
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const onAfterSave = () => {
    loadMovies()
  };

  return (
    <div className="min-h-screen p-6 bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Filmes</h1>
          <Button
            className="ml-4"
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            Adicionar Filme
          </Button>
        </div>
        
        <LogoutButton />
      </div>

      <MovieList 
        movies={movies}
        onAfterDeleteAction={() => {
          loadMovies()
        }}
      />

      <AddMovieModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAfterSave={onAfterSave}
      />

      {errorMessage && (
        <Toast
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
}
