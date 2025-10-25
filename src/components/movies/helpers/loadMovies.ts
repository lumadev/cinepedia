import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";
import { groupByYear } from "./groupByYear";
import type { Movie } from "../interfaces/movie";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export const loadMovies = (
  setMovies: SetState<Record<number, Movie[]>>,
  setErrorMessage: SetState<string | null>,
  setLoadingMovies: SetState<boolean>
) => {
  setMovies({});
  setLoadingMovies(true);

  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setLoadingMovies(false);
      return;
    }

    try {
      const moviesRef = collection(db, "movies");
      const queryRes = query(
        moviesRef,
        where("userId", "==", user.uid),
        orderBy("dateSeen", "desc")
      );

      const snapshot = await getDocs(queryRes);
      const moviesDatabase = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Movie)
      );

      const moviesByYear = groupByYear(moviesDatabase);
      setMovies(moviesByYear);
    } catch (e) {
      setErrorMessage("Ocorreu um erro ao carregar os filmes.");
    } finally {
      setLoadingMovies(false);
    }
  });
};
