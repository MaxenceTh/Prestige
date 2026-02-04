import type { Movie } from "@/api/tmdbApi";
import apitmdb from "@/api/tmdbApi";
import { Info, Play, X } from "lucide-react"; // Import des icônes
import { useEffect, useState } from "react";
import { MovieDialog } from "../movies/movieDialog";

function Hero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la vidéo et le modal
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apitmdb.getNowPlayingMovies(1);
        const movie = data.results[0];
        setMovies(data.results);

        if (movie) {
          // On récupère la vidéo immédiatement pour qu'elle soit prête au clic
          const videos = await apitmdb.getMovieVideos(movie.id);
          const trailer = videos.find(
            (v: any) => v.type === "Trailer" && v.site === "YouTube"
          );
          setTrailerKey(trailer ? trailer.key : null);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredMovie = movies?.[0];

  if (loading || !featuredMovie) {
    return <section className="h-screen bg-background" />;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-start bg-black">
      
      {/* 1. Zone Média (Background) */}
      <div className="absolute inset-0 z-0">
        {showTrailer && trailerKey ? (
          // LECTEUR VIDÉO PLEIN ÉCRAN
          <div className="relative w-full h-full scale-105"> 
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=0&rel=0&showinfo=0&modestbranding=1`}
              title="Trailer"
              className="absolute inset-0 w-full h-full pointer-events-none"
              allow="autoplay; encrypted-media"
            />
            {/* Bouton pour fermer la vidéo */}
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute top-28 right-10 z-50 bg-black/50 hover:bg-primary hover:text-primary-foreground text-white p-3 rounded-full backdrop-blur-md transition-all group"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Overlay sombre pour garder le bouton fermer visible */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        ) : (
          // IMAGE DE FOND CLASSIQUE
          <>
            <img
              // src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
              // Utilisation d'une résolution plus basse pour de meilleures performances
              src={`https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title}
              className="h-full w-full object-cover transition-transform duration-[10s] ease-out scale-100 hover:scale-110"
            />
            {/* Dégradés sémantiques pour le texte */}
            <div 
              className="absolute inset-0" 
              style={{
                background: `linear-gradient(to right, var(--background) 0%, transparent 100%), 
                             linear-gradient(to top, var(--background) 0%, transparent 40%)`
              }}
            />
          </>
        )}
      </div>

      {/* 2. Contenu Texte (S'efface si la vidéo joue) */}
      <div className={`relative z-10 px-8 md:px-16 max-w-3xl transition-all duration-700 ${showTrailer ? 'opacity-0 -translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase border border-primary text-primary rounded-sm bg-primary/5">
          À l'affiche ce mois-ci
        </span>
        
        <h1 className="text-5xl md:text-8xl font-serif font-bold text-foreground mb-4 leading-tight">
          {featuredMovie.title}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 line-clamp-3 font-light leading-relaxed max-w-2xl italic">
          "{featuredMovie.overview}"
        </p>

        <div className="flex flex-wrap gap-5">
          {/* Bouton Voir la fiche (Ouvre le Modal) */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-md hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <Info className="w-5 h-5" />
            Fiche Film
          </button>
          
          {/* Bouton Bande-annonce (Lance la vidéo en fond) */}
          <button 
            onClick={() => setShowTrailer(true)}
            disabled={!trailerKey}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-lg border border-white/10 text-foreground font-bold rounded-md hover:bg-white/10 transition-all disabled:opacity-20"
          >
            <Play className="w-5 h-5 fill-current" />
            Bande-annonce
          </button>
        </div>
      </div>

      {/* 3. Modal de détails (Le même que pour la liste) */}
      <MovieDialog 
        movie={featuredMovie} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </section>
  );
}

export default Hero;