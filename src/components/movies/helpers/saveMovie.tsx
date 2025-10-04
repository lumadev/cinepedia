import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

import type { Movie } from "@/components/movies/interfaces/movie";

interface SaveMovieParams {
  movie: Omit<Movie, "id">;
  onAfterSave: (movie: Omit<Movie, "id">) => void;
  onClose: () => void;
  setMovie: (movie: Omit<Movie, "id">) => void;
  setLoading: (loading: boolean) => void;
  showError: (message: string) => void;
  emptyMovie: Omit<Movie, "id">;
}

export async function saveMovie({ 
  movie, onAfterSave, onClose, setMovie, setLoading, showError, emptyMovie }: SaveMovieParams
) {
  if (!movie.title.trim()) {
    showError("O título é obrigatório");
    return;
  }

  setLoading(true);
  try {
    await addDoc(collection(db, "movies"), movie);
    onAfterSave(movie);
    setMovie(emptyMovie);
    onClose();
  } catch (e) {
    showError("Ocorreu um erro ao salvar o filme");
  } finally {
    setLoading(false);
  }
}
