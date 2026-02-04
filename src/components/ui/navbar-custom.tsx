import type { Movie } from "@/api/tmdbApi";
import apitmdb from "@/api/tmdbApi";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  onMovieSelect: (movie: Movie) => void;
}

export function SearchBar({ onMovieSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer les résultats si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      const data = await apitmdb.searchMovies(query);
      setResults(data.slice(0, 5));
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative flex-grow max-w-sm group" ref={containerRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-3">
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* RÉSULTATS DÉROULANTS */}
      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {results.map((movie) => (
            <button
              key={movie.id}
              onClick={() => {
                onMovieSelect(movie);
                setQuery("");
                setResults([]);
              }}
              className="w-full flex items-center gap-4 p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
            >
              <img
                src={apitmdb.getImageUrl(movie.poster_path, "w92")}
                alt={movie.title}
                className="w-10 h-14 object-cover rounded shadow-sm"
              />
              <div>
                <p className="font-medium text-sm line-clamp-1">{movie.title}</p>
                <p className="text-xs text-muted-foreground">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}