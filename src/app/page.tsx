"use client";

import { useState, useEffect } from "react";
import { MovieList } from "@/components/movies/MovieList";
import { AddMovieModal } from "@/components/movies/AddMovieModal";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Movie {
  id: number;
  title: string;
  year: number;
  poster: string; 
  genre?: string[];
  rating?: number;
  description?: string; 
}

// const mockMovies: Movie[] = [
//   {
//     id: 1,
//     title: "O Poderoso Chefão",
//     year: 1972,
//     poster: "/posters/godfather.jpg",
//     genre: ["Crime", "Drama"],
//     rating: 9.2,
//     description: "A história da família mafiosa Corleone."
//   },
//   {
//     id: 2,
//     title: "Star Wars: Episódio IV - Uma Nova Esperança",
//     year: 1977,
//     poster: "/posters/starwars.jpg",
//     genre: ["Ficção Científica", "Aventura"],
//     rating: 8.6,
//     description: "Um jovem herói luta contra o Império Galáctico."
//   },
//   {
//     id: 3,
//     title: "Titanic",
//     year: 1997,
//     poster: "/posters/titanic.jpg",
//     genre: ["Romance", "Drama"],
//     rating: 7.8,
//     description: "Romance a bordo do trágico navio Titanic."
//   },
// ];

async function fetchMovies() {
  
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showModal, setShowModal] = useState(false);

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
        console.log('erro', e)
        return []
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
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Adicionar Filme
        </button>
      </div>

      <MovieList movies={movies} />

      <AddMovieModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAfterSave={onAfterSave}
      />
    </div>
  );
}
