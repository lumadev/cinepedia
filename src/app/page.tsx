"use client";

import { MovieList } from "@/components/movies/MovieList";
import { AddMovieModal } from "@/components/movies/AddMovieModal";
import { Toast } from "@/components/ui/Toast";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { MoviesNavbar } from "@/components/layout/MoviesNavbar";

import { useMoviesPageController } from "@/hooks/pages/useMoviesPageController";

export default function Home() {
  const controller = useMoviesPageController();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <MoviesNavbar
        onSearchChange={controller.setSearchQuery}
        onAddMovie={controller.handleAddMovie}
      />

      <div className="p-6">
        {controller.loading ? (
          <SkeletonLoader count={10} />
        ) : (
          <>
            <MovieList
              movies={controller.filteredMovies}
              hasSearch={controller.hasSearch}
              onAfterDeleteAction={controller.onAfterDelete}
              onEditMovieAction={controller.handleEditMovie}
            />

            <AddMovieModal
              isOpen={controller.isModalOpen}
              onClose={controller.closeModal}
              onAfterSave={controller.onAfterSave}
              isEdit={controller.isEdit}
              movie={controller.movieToEdit}
              lastOrder={controller.lastOrder}
            />
          </>
        )}

        {controller.displayError && (
          <Toast
            message={controller.displayError}
            type="error"
            onClose={controller.closeModal}
          />
        )}
      </div>
    </div>
  );
}
