import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Movie } from "@/components/movies/interfaces/movie";

interface UpdateMovieParams {
  id: string;
  movie: Omit<Movie, "id">;
}

export async function updateMovie({ id, movie }: UpdateMovieParams) {
  const movieRef = doc(db, "movies", id);
  await updateDoc(movieRef, movie);
}