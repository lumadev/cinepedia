"use client";

import { useState, useRef, useEffect } from "react";

interface MultiSelectAutocompleteProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelectAutocomplete({
  options,
  selected,
  onChange,
  placeholder = "Select...",
}: MultiSelectAutocompleteProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    setSuggestions(
      options.filter(
        (o) => o.toLowerCase().includes(input.toLowerCase()) && !selected.includes(o)
      )
    );
  }, [input, options, selected]);

  const addItem = (item: string) => {
    onChange([...selected, item]);
    setInput("");
    setSuggestions([]);
  };

  const removeItem = (item: string) => {
    onChange(selected.filter((s) => s !== item));
  };

  // Close suggestions if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      <div className="flex flex-wrap gap-1 mb-2">
        {selected.map((item) => (
          <span
            key={item}
            className="bg-gray-700 text-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              className="text-gray-300 hover:text-red-400"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="input input-bordered w-full bg-gray-800 text-gray-100 border-gray-600 placeholder-gray-400"
      />

      {suggestions.length > 0 && (
        <ul className="bg-gray-700 text-gray-100 border border-gray-600 rounded-md mt-1 max-h-32 overflow-auto z-10">
          {suggestions.map((item) => (
            <li
              key={item}
              className="px-2 py-1 cursor-pointer hover:bg-gray-600"
              onClick={() => addItem(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
