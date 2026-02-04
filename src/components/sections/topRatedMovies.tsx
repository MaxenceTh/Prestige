import type { Movie } from "@/api/tmdbApi";
import apitmdb from "@/api/tmdbApi";
import { Award, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { MovieDialog } from "../movies/movieDialog";
import { FadeImage } from "../skeletons/fadeImage";
import TopRatedSkeleton from "../skeletons/topRatedSkeleton";
import { Pagination } from "../ui/pagination-custom";
import { useSmoothScroll } from "@/hook/useSmoothScroll";

function TopRatedMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { triggerScroll, executeScroll } = useSmoothScroll();


  useEffect(() => {
    const fetchTopRated = async () => {
      setLoading(true);
      try {
        const data = await apitmdb.getTopRatedMovies(page);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        // Remonter doucement au début de la section lors du changement de page
        executeScroll("pantheon-section");
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, [page]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    triggerScroll();
    setPage(newPage);
  };

  if (loading && page === 1) return <TopRatedSkeleton />;

  return (
    <section id="pantheon-section" className="py-20 px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header avec icône Award */}
        <div className="flex flex-col items-center gap-4 mb-20 justify-center">
          <div className="flex items-center gap-4">
            <Award className="text-primary w-8 h-8 md:w-12 md:h-12" />
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-center tracking-tighter">
              Le Panthéon du Cinéma
            </h2>
            <Award className="text-primary w-8 h-8 md:w-12 md:h-12" />
          </div>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs font-bold">
            Les chefs-d'œuvre absolus selon la critique
          </p>
        </div>

        <div className="space-y-16">
          {movies.map((movie, index) => {
            // CALCUL DU RANG GLOBAL
            const globalRank = (page - 1) * 20 + index + 1;

            return (
              <div
                key={movie.id}
                className="group relative flex flex-col md:flex-row items-center gap-8 md:gap-12 border-b border-white/5 pb-16 last:border-0 cursor-pointer"
                onClick={() => handleMovieClick(movie)}
              >
                {/* 1. INDEX STYLISÉ : Largeur fixe pour éviter le décalage (w-48) */}
                <div className="shrink-0 w-full md:w-48 flex justify-center md:justify-start">
                  <span className="text-8xl md:text-9xl font-serif font-black opacity-10 group-hover:opacity-40 group-hover:text-primary transition-all duration-700 tabular-nums select-none">
                    {globalRank}
                  </span>
                </div>

                {/* 2. POSTER */}
                <div className="w-48 md:w-64 shrink-0 relative z-10">
                  <div className="overflow-hidden rounded-sm shadow-2xl shadow-black/60 border border-white/5 group-hover:border-primary/30 transition-colors">
                    <FadeImage
                      src={apitmdb.getImageUrl(movie.poster_path, "w500")}
                      alt={movie.title}
                      className="w-full h-auto transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* 3. INFOS DU FILM */}
                <div className="grow text-center md:text-left z-10 flex flex-col justify-center">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20">
                      <Star className="w-3 h-3 fill-primary" />
                      {movie.vote_average.toFixed(1)} / 10
                    </div>
                    <span className="text-muted-foreground text-sm font-medium tracking-widest">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-serif font-bold mb-6 group-hover:text-primary transition-colors leading-tight">
                    {movie.title}
                  </h3>

                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-8 font-light italic line-clamp-3">
                    "{movie.overview || "Aucune description disponible pour ce chef-d'œuvre."}"
                  </p>

                  <div>
                    <button className="px-8 py-3 border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold tracking-[0.2em] uppercase text-[10px] bg-primary/5">
                      Explorer le film
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SYSTÈME DE PAGINATION */}
      <Pagination
        currentPage={page}
        onPrev={() => handlePageChange(Math.max(1, page - 1))}
        onNext={() => handlePageChange(page + 1)}
        disableNext={page >= totalPages}
        isLoading={loading}
      />

      <MovieDialog
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

export default TopRatedMovies;