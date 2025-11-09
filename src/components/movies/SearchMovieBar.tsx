"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "use-debounce";

interface SearchMovieBarProps {
  onSearchChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

export function SearchMovieBar({
  onSearchChange,
  placeholder = "Buscar filme...",
  delay = 300,
}: SearchMovieBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, delay);

  useEffect(() => {
    onSearchChange(debouncedQuery);
  }, [debouncedQuery, onSearchChange]);

  return (
    <div className="w-full sm:w-64">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="border rounded-lg px-3 py-2 w-full bg-[var(--background-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
