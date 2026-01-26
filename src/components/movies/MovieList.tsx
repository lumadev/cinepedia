'use client';

import { useState } from 'react';
import { Movie } from '@/components/movies/interfaces/movie';
import { formatDate } from '@/utils/date';

import { EditMovieButton } from './buttons/EditMovieButton';
import { DeleteMovieButton } from './buttons/DeleteMovieButton';

type MovieListProps = {
  movies: Record<number, Movie[]>;
  hasSearch: boolean;
  onAfterDeleteAction: () => void;
  onEditMovieAction: (movie: Movie) => void;
};

export const MovieList = ({
  movies,
  hasSearch,
  onAfterDeleteAction,
  onEditMovieAction,
}: MovieListProps) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Ordena os anos do mais recente para o mais antigo
  const sortedYears = Object.keys(movies)
    .map(Number)
    .sort((a, b) => b - a);

  const hasMovies = Object.values(movies).some(
    (movieList) => movieList.length > 0
  );

  return (
    <div className="p-4 space-y-8">
      {!hasMovies && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          {!hasSearch ? (
            <>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Ainda não há filmes por aqui
              </h2>

              <p className="text-gray-400 mb-6 max-w-md">
                Sua lista está vazia no momento. Comece adicionando filmes que você já assistiu
                ou quer assistir depois.
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-lg">
              Nenhum filme encontrado para essa busca
            </p>
          )}
        </div>
      )}

      {hasMovies &&
        sortedYears.map((year) => (
          <div key={year}>
            <h2 className="text-xl font-bold mb-4">{year}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies[year].map((movie) => (
                <div
                  key={movie.id}
                  className="relative group card shadow-lg transition-opacity duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                >
                  <figure>
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className={`h-88 w-full object-cover rounded-t-md transition-opacity duration-200 ${
                        loadingId === movie.id ? 'opacity-60' : ''
                      }`}
                    />
                  </figure>
                  <div
                    className={`card-body p-3 transition-opacity duration-200 ${loadingId === movie.id ? 'opacity-60' : ''}`}
                  >
                    <h2 className="card-title text-sm">{movie.title}</h2>
                    <p className="text-xs text-gray-400">
                      {movie.genres?.join(', ')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(movie.dateSeen)}
                    </p>
                  </div>

                  {loadingId === movie.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <EditMovieButton
                      movie={movie}
                      onEditMovieAction={(m) => onEditMovieAction(m)}
                    />
                    <DeleteMovieButton
                      movieId={movie.id}
                      onAfterDeleteAction={() => {
                        setLoadingId(movie.id);
                        onAfterDeleteAction();
                        setLoadingId(null);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  );
};
