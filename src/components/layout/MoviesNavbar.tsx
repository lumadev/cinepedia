"use client";

import { SearchMovieBar } from "@/components/movies/SearchMovieBar";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/Button";

interface MoviesNavbarProps {
  onSearchChange: (value: string) => void;
  onAddMovie: () => void;
}

export function MoviesNavbar({
  onSearchChange,
  onAddMovie,
}: MoviesNavbarProps) {
  return (
    <nav className="
      w-full
      flex
      items-center
      justify-between
      px-6
      py-4
      mb-6
      bg-neutral-900
      border-b
      border-neutral-800
      text-neutral-100
    ">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight">
          Lista de Filmes
        </h1>

        <Button variant="primary" onClick={onAddMovie}>
          Adicionar Filme
        </Button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <SearchMovieBar onSearchChange={onSearchChange} />
        <LogoutButton />
      </div>
    </nav>
  );
}
