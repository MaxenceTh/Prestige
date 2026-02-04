import type { Movie } from "@/api/tmdbApi";
import apitmdb from "@/api/tmdbApi";
import { useSmoothScroll } from "@/hook/useSmoothScroll";
import { useEffect, useState } from "react";
import { MovieDialog } from "../movies/movieDialog";
import PopularMoviesSkeleton from "../skeletons/popularMoviesSkeleton";
import { MovieGrid } from "../ui/movieGrid";
import { Pagination } from "../ui/pagination-custom";

function PopularMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const { triggerScroll, executeScroll } = useSmoothScroll();

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      try {
        const data = await apitmdb.getPopularMovies(page);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        // On ne scroll que si l'utilisateur a cliqué sur Suivant/Précédent
        executeScroll("popular-section");
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    triggerScroll();
    setPage(newPage);
  };

  return (
    <section className="py-24 px-8 max-w-7xl mx-auto" id="popular-section">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">
            Tendances
          </span>
          <h2 className="text-4xl font-serif font-bold text-foreground tracking-tighter">
            Les Succès du Moment
          </h2>
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full">
          Page {page}
        </div>
      </div>

      {loading && page === 1 ? (
        <PopularMoviesSkeleton />
      ) : (
        <MovieGrid
          movies={movies}
          loading={loading}
          onMovieClick={(movie) => {
            setSelectedMovie(movie);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* PAGINATION */}
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

export default PopularMovies;