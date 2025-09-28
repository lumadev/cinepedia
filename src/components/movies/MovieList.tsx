export interface Movie {
  id: number;
  title: string;
  year: number;
  poster: string;        // URL da imagem
  genre?: string[];      // opcional: gêneros do filme
  rating?: number;       // opcional: nota do filme
  description?: string;  // opcional: sinopse
}

type MovieListProps = {
  movies: Movie[];
};

export const MovieList = ({ movies }: MovieListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {movies.map((movie) => (
        <div key={movie.id} className="card bg-base-100 shadow-xl">
          <figure>
            <img src={movie.poster} alt={movie.title} className="h-72 w-full object-cover" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{movie.title}</h2>
            <p>{movie.year}</p>
            {/* <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Ver detalhes</button>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
};
