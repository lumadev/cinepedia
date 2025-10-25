"use client";

import { useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { useToast } from "@/components/ui/ToastContext";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type DeleteMovieButtonProps = {
  movieId: string;
  onAfterDeleteAction: () => void;
};

export const DeleteMovieButton = ({ movieId, onAfterDeleteAction }: DeleteMovieButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const handleDelete = async () => {
    const confirmed = window.confirm("Tem certeza que deseja excluir este filme?");
    if (!confirmed) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, "movies", movieId));

      onAfterDeleteAction();
      showSuccess("Filme deletado com sucesso!");
    } catch (e) {
      showError("Ocorreu um erro ao excluir o filme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/70 transition-colors shadow-md"
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
      ) : (
        <IconTrash size={24} className="text-white" />
      )}
    </button>
  );
};
