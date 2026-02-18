import type { Movie } from "@/api/tmdbApi";
import apitmdb from "@/api/tmdbApi";
import { CalendarDays, TrendingUp, Plus, ChevronUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { MovieDialog } from "../movies/movieDialog";
import { FadeImage } from "../skeletons/fadeImage";

function UpcomingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // États pour la pagination 8 par 8
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  // Ref pour scroller au début de la grille lors de la réduction
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await apitmdb.getDiscoverMovies(1);
        
        // Sécurité DA : On ne garde que les films avec visuel
        const validMovies = data.results.filter(
          (m: Movie) => m.backdrop_path || m.poster_path
        );
        
        setMovies(validMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const showLess = () => {
    setVisibleCount(8);
    // Scroll fluide vers le début de la section pour ne pas perdre l'utilisateur
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const displayedMovies = movies.slice(0, visibleCount);

  return (
    <main className="bg-background text-foreground py-16 px-4 md:px-8 min-h-screen">
      
      {/* HEADER SECTION */}
      <div ref={gridTopRef} className="max-w-6xl mx-auto mb-16 border-l-4 border-primary pl-6 scroll-mt-24">
        <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white">
          Prochaines Sorties
        </h2>
        <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] md:text-xs font-medium mt-3">
          Le calendrier exclusif des avant-premières
        </p>
      </div>

      {/* GRILLE DE FILMS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {displayedMovies.map((movie, index) => (
          <div
            key={movie.id}
            onClick={() => handleOpenModal(movie)}
            className="group relative flex flex-col md:flex-row bg-card/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-500 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${(index % 8) * 50}ms` }}
          >
            {/* VISUEL */}
            <div className="md:w-[45%] relative h-56 md:h-auto overflow-hidden">
              <FadeImage
                src={apitmdb.getImageUrl(movie.backdrop_path || movie.poster_path, "w500")}
                alt={movie.title}
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 border border-white/10">
                <CalendarDays className="w-3 h-3 text-primary" />
                {new Date(movie.release_date).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </div>

            {/* CONTENU INFOS */}
            <div className="p-6 md:p-8 md:w-[55%] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">
                  Popularité : {Math.round(movie.popularity)}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors leading-tight text-white">
                {movie.title}
              </h3>

              <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-6 font-light italic">
                {movie.overview || "Les détails de cette production sont encore tenus secrets par le studio..."}
              </p>

              <div className="flex items-center text-[10px] uppercase font-bold tracking-[0.2em] text-primary group-hover:gap-4 gap-2 transition-all">
                <span>Explorer l'œuvre</span>
                <div className="h-[1px] w-4 bg-primary group-hover:w-8 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION BOUTONS (Pagination) */}
      {!isLoading && (
        <div className="flex flex-col items-center justify-center mt-20 gap-6">
          <div className="flex flex-wrap justify-center gap-4">
            
            {/* BOUTON VOIR PLUS */}
            {visibleCount < movies.length && (
              <button
                onClick={loadMore}
                className="group relative flex items-center gap-3 px-10 py-4 bg-transparent rounded-full border border-primary/20 hover:border-primary transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Plus className="relative z-10 w-4 h-4 text-primary group-hover:text-black transition-colors" />
                <span className="relative z-10 text-xs font-bold uppercase tracking-[0.3em] text-primary group-hover:text-black transition-colors">
                  En voir plus
                </span>
              </button>
            )}

            {/* BOUTON RÉDUIRE */}
            {visibleCount > 8 && (
              <button
                onClick={showLess}
                className="group flex items-center gap-3 px-10 py-4 bg-transparent rounded-full border border-white/10 hover:border-white/20 transition-all duration-500"
              >
                <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-white transition-colors">
                  Réduire
                </span>
              </button>
            )}
          </div>

          <p className="text-[9px] uppercase tracking-widest text-muted-foreground opacity-50">
            {Math.min(visibleCount, movies.length)} affichés sur {movies.length} au total
          </p>
        </div>
      )}

      {/* DIALOGUE */}
      <MovieDialog
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

export default UpcomingMovies;