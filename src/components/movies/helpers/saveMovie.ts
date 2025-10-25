import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

import type { Movie } from "@/components/movies/interfaces/movie";

interface SaveMovieParams {
  movie: Omit<Movie, "id">;
  onClose: () => void;
  setMovie: (movie: Omit<Movie, "id">) => void;
  emptyMovie: Omit<Movie, "id">;
}

export async function saveMovie({ 
  movie, onClose, setMovie, emptyMovie }: SaveMovieParams
) {
  const user = auth.currentUser;
  const movieFormatted = {
    ...movie,
    userId: user?.uid,
  };

  await addDoc(collection(db, "movies"), movieFormatted);

  setMovie(emptyMovie);
  onClose();
}
