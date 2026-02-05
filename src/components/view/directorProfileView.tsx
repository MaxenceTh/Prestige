import apitmdb, { type Movie } from "@/api/tmdbApi";
import { Clapperboard, Film } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MovieGrid } from "../ui/movieGrid";
import { formatDirectorCredits } from "@/lib/movie-utils";

interface Props {
  directorId: number;
  onMovieClick: (movie: Movie) => void;
}

export function DirectorProfileView({ directorId, onMovieClick }: Props) {
  const [director, setDirector] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await apitmdb.getPersonDetails(directorId);
        setDirector(data);
      } catch (error) {
        console.error("Erreur DirectorView:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [directorId]);

 const sortedMovies = useMemo(() => {
  return director?.movie_credits?.crew 
    ? formatDirectorCredits(director.movie_credits.crew) 
    : [];
}, [director]);


  if (loading) {
    return (
      <div className="py-40 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-4"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">Analyse de la filmographie...</p>
      </div>
    );
  }

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">

      {/* SECTION IDENTITÉ */}
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start border-b border-white/5 pb-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-b from-primary/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <img
            src={director?.profile_path ? apitmdb.getImageUrl(director.profile_path, "h632") : "https://ui-avatars.com/api/?name=?&background=0D0D0D&color=fff"}
            alt={director?.name}
            className="relative w-56 h-80 rounded-2xl shadow-2xl object-cover border border-white/10"
          />
        </div>

        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-2">
              <Clapperboard className="w-3 h-3" /> Visionnaire
            </span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tighter">
              {director?.name}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-8 py-2">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Rôle</span>
              <span className="text-sm text-white font-medium italic">Réalisateur</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Réalisations</span>
              <span className="text-sm text-white font-medium flex items-center gap-2">
                <Film className="w-3 h-3 text-primary" /> {sortedMovies.length} Films
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Biographie</h4>
            <p className="text-muted-foreground leading-relaxed text-sm italic max-w-3xl">
              {director?.biography || "L'histoire de ce cinéaste reste à écrire."}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION FILMS */}
      <div className="space-y-10 pb-20">
        <div className="flex items-center gap-4">
          <h3 className="text-3xl font-serif text-white">Œuvres majeures</h3>
          <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent"></div>
        </div>

        {sortedMovies.length > 0 ? (
          <MovieGrid movies={sortedMovies} loading={false} onMovieClick={onMovieClick} />
        ) : (
          <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-muted-foreground text-sm italic">Aucun film trouvé en tant que réalisateur.</p>
          </div>
        )}
      </div>
    </div>
  );
}