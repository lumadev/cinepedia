import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export const loadLastOrder = (
  setLastOrder: SetState<number | null>,
  setErrorLastOrder: SetState<string | null>,
  setLoadingLastOrder: SetState<boolean>
) => {
  setLoadingLastOrder(true);

  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setLastOrder(null);
      setLoadingLastOrder(false);
      return;
    }

    try {
      const moviesRef = collection(db, "movies");
      const q = query(
        moviesRef,
        where("userId", "==", user.uid),
        orderBy("order", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setLastOrder(null);
      } else {
        const lastMovie = snapshot.docs[0].data();
        const lastOrder = lastMovie.order ?? 0;
        setLastOrder(lastOrder > 0 ? lastOrder : 1);
      }
    } catch {
      setErrorLastOrder("Ocorreu um erro ao buscar a última ordem.");
      setLastOrder(null);
    } finally {
      setLoadingLastOrder(false);
    }
  });
};
