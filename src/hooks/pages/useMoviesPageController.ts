import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/components/movies/interfaces/movie";

import { useMovies } from "@/hooks/data/useMovies";
import { useFilteredMovies } from "@/hooks/ui/useFilteredMovies";

import { loadLastOrder } from "@/components/movies/helpers/loadLastOrder";

export function useMoviesPageController() {
  const { movies, loading: loadingMovies, error: errorLoadingMovies, fetchMovies } = useMovies();

  const [lastOrder, setLastOrder] = useState(1);
  const [loadingLastOrder, setLoadingLastOrder] = useState(false);
  const [errorLastOrder, setErrorLastOrder] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const filteredMovies = useFilteredMovies(movies, searchQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  // update last order
  const loadInitialData = useCallback(() => {
    loadLastOrder(setLastOrder, setErrorLastOrder, setLoadingLastOrder);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const onAfterDelete = useCallback(() => {
    fetchMovies();
    loadInitialData();
    setMovieToEdit(null);
  }, [fetchMovies, loadInitialData]);

  const onAfterSave = useCallback(() => {
    fetchMovies();
    setIsEdit(false);
    setMovieToEdit(null);
  }, [fetchMovies]);

  const handleAddMovie = () => {
    setIsEdit(false);
    setMovieToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setIsEdit(true);
    setMovieToEdit(movie);
    setIsModalOpen(true);
  };

  return {
    filteredMovies,
    loading: loadingMovies || loadingLastOrder,
    displayError: errorLoadingMovies || errorLastOrder,
    hasSearch: searchQuery.trim().length > 0,

    setSearchQuery,
    handleAddMovie,
    handleEditMovie,
    onAfterDelete,
    onAfterSave,

    isModalOpen,
    closeModal: () => setIsModalOpen(false),
    isEdit,
    movieToEdit,
    lastOrder,
    clearError: () => setErrorLastOrder(null),
  };
}