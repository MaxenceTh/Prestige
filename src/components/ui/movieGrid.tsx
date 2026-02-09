// components/movies/MovieGrid.tsx
import type { Movie } from "@/api/tmdbApi";
import { MovieCard } from "./movieCard/movieCard";
import { MovieGridSkeleton } from "../skeletons/movieGridSkeleton";



interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  onMovieClick: (movie: Movie) => void;
}

export function MovieGrid({ movies, loading, onMovieClick }: MovieGridProps) {

  if (loading)  return <MovieGridSkeleton /> ;

  return (

    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onClick={onMovieClick} 
        />
      ))}
    </div>
  );
}