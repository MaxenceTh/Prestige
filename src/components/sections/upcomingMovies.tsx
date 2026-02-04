import type { Movie } from "@/api/tmdbApi";
import apitmdb from "@/api/tmdbApi";
import { CalendarDays, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { MovieDialog } from "../movies/movieDialog";
import { FadeImage } from "../skeletons/fadeImage";

function UpcomingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apitmdb.getDiscoverMovies(1);
        setMovies(data.results.slice(0, 4));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
 
  return (
    <main className="bg-background text-foreground py-16 px-8">
      <div className="max-w-6xl mx-auto mb-12 border-l-4 border-primary pl-6">
        <h2 className="text-4xl font-serif font-bold tracking-tight">Prochaines Sorties</h2>
        <p className="text-muted-foreground uppercase tracking-widest text-sm mt-2">Sélection exclusive des mois à venir</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleOpenModal(movie)}
            className="group relative flex flex-col md:flex-row bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-500 cursor-pointer"
          >
            <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
              <FadeImage
                src={apitmdb.getImageUrl(movie.backdrop_path || movie.poster_path, "w500")}
                alt={movie.title}
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              {/* Badge Date de sortie précise */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] flex items-center gap-1 border border-white/10">
                <CalendarDays className="w-3 h-3 text-primary" />
                {new Date(movie.release_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>

            <div className="p-6 md:w-3/5 flex flex-col justify-center relative">
              {/* Indicateur de Hype (Popularité) */}
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                  Score d'attente : {Math.round(movie.popularity / 10)}%
                </span>
              </div>

              <h3 className="text-xl font-serif font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {movie.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4 italic">
                {movie.overview || "Le synopsis secret sera bientôt révélé..."}
              </p>

              <button className="text-xs uppercase tracking-widest font-bold text-primary w-fit hover:translate-x-2 transition- cursor-pointer">
                Découvrir l'univers →
              </button>
            </div>
          </div>
        ))}
      </div>

      <MovieDialog
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

export default UpcomingMovies;