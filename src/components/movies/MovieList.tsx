import { Movie } from "@/components/movies/interfaces/movie";

type MovieListProps = {
  movies: Movie[];
};

export const MovieList = ({ movies }: MovieListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="card shadow-lg"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <figure>
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-48 w-full object-cover rounded-t-md"
            />
          </figure>
          <div className="card-body p-3">
            <h2 className="card-title text-sm">{movie.title}</h2>
            <p className="text-xs text-gray-400">
              {movie.genres?.join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
