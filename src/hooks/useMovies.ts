import { useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Movie } from "@/components/movies/interfaces/movie";

import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { groupByYear } from "@/components/movies/helpers/groupByYear";

export function useMovies() {
  const [movies, setMovies] = useState<Record<number, Movie[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async (userId?: string) => {
    const auth = getAuth();
    const uid = userId || auth.currentUser?.uid;

    if (!uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const moviesRef = collection(db, "movies");
        const queryRes = query(
          moviesRef,
          where("userId", "==", uid),
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
      
      const data = groupByYear(moviesDatabase);
      setMovies(data);
    } catch (e) {
      setError("Erro ao carregar filmes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMovies(user.uid);
      } else {
        setMovies({});
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchMovies]);

  return { movies, loading, error, fetchMovies };
}