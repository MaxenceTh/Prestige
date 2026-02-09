import apitmdb, { type Movie } from "@/api/tmdbApi";
import { useEffect, useMemo, useState } from "react";

import { Film, User } from "lucide-react";
import { MovieGrid } from "../ui/movieGrid";
import { formatActorCredits} from "@/lib/movie-utils";

interface Props {
  actorId: number;
  onMovieClick: (movie: Movie) => void;
}

export function ActorProfileView({ actorId, onMovieClick }: Props) {
  const [actor, setActor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await apitmdb.getPersonDetails(actorId);
        setActor(data);       
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [actorId]);

  const sortedMovies = useMemo(() => {
    if (!actor?.movie_credits?.cast) return [];
    return formatActorCredits(actor.movie_credits.cast);
  }, [actor]);

  if (loading) return <div className="py-20 text-center animate-pulse text-primary tracking-widest">CHARGEMENT DU PROFIL...</div>;

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER DU PROFIL */}
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
        <img
          src={apitmdb.getImageUrl(actor?.profile_path, "h632")}
          alt={actor?.name}
          className="w-48 h-72 rounded-2xl shadow-2xl object-cover border border-white/10"
        />
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div>
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Portrait</span>
            <h2 className="text-4xl font-serif font-bold text-white">{actor?.name}</h2>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[10px] text-muted-foreground uppercase tracking-widest border-y border-white/5 py-4">
            <span className="flex items-center gap-2"><User className="w-3 h-3 text-primary" /> Acteur</span>
            <span className="flex items-center gap-2"><Film className="w-3 h-3 text-primary" /> {sortedMovies.length} Films</span>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm italic max-w-2xl">
            {actor?.biography || "Aucune biographie disponible."}
          </p>
        </div>
      </div>

      {/* FILMOGRAPHIE */}
      <div className="space-y-8">
        <h3 className="text-2xl font-serif text-white">Filmographie</h3>
        <MovieGrid movies={sortedMovies} loading={false} onMovieClick={onMovieClick} />
      </div>
    </div>
  );
}