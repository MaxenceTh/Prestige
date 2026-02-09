// components/movies/MovieCard.tsx
import { Star, Info } from "lucide-react";
import type { Movie } from "@/api/tmdbApi";
import apitmdb from "@/api/tmdbApi";
import { FadeImage } from "../../skeletons/fadeImage";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      className="group cursor-pointer space-y-3"
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-white/5 group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
        <FadeImage
          // src={apitmdb.getImageUrl(movie.poster_path, "w500")}
           src={apitmdb.getImageUrl(movie.poster_path, "w342")}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay style "Prestige" */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-primary text-primary-foreground p-3 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Info className="w-5 h-5" />
          </div>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-md px-2 py-1 rounded text-primary text-[10px] font-bold border border-primary/20">
          <Star className="w-3 h-3 fill-primary" />
          {movie.vote_average.toFixed(1)}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors italic">
          {movie.title}
        </h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
        </p>
      </div>
    </div>
  );
}