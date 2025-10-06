import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
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
  setLoading(true);
  try {
    const user = auth.currentUser;
    const movieFormatted = {
      ...movie,
      userId: user.uid,
    };

    await addDoc(collection(db, "movies"), movieFormatted);

    onAfterSave(movieFormatted);
    setMovie(emptyMovie);
    onClose();
  } catch (e) {
    showError("Ocorreu um erro ao salvar o filme");
  } finally {
    setLoading(false);
  }
}
