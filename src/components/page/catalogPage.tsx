import apitmdb, { type Genre, type Movie } from "@/api/tmdbApi";
import { useEffect, useState } from "react";

// Composants
import { MovieDialog } from "@/components/movies/movieDialog";
import { Pagination } from "@/components/ui/pagination-custom";
import { X } from "lucide-react";
import { MovieGrid } from "../ui/movieGrid";

// Tes pages transformées en composants
import { useSmoothScroll } from "@/hook/useSmoothScroll";
import ToolBar from "../ui/toolBar";
import { ActorProfileView } from "../view/actorProfileView";
import { DirectorProfileView } from "../view/directorProfileView";

export default function CatalogPage() {
  // --- ÉTATS ---
  const [view, setView] = useState<{ type: 'all' | 'director' | 'actor', id: number | null }>({
    type: 'all',
    id: null
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState<Genre[]>([]);
  const { triggerScroll, executeScroll } = useSmoothScroll();


  // --- FETCH INITIAL ---
  useEffect(() => {
    apitmdb.getGenres().then(setGenres).catch(console.error);
  }, []);

  // --- FETCH FILMS (Seulement si vue 'all') ---
  useEffect(() => {
    if (view.type !== 'all') return;

    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await apitmdb.getAllMovies(page, selectedGenre);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        executeScroll("movie-section");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [page, selectedGenre, view.type]);

  // Handler pour les recherches
  const handleSelectPerson = (id: number, type: 'director' | 'actor') => {
    setView({ type, id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    triggerScroll();
    setPage(newPage);
  };
  return (
    <main className="min-h-screen bg-background py-24 px-8" id="movie-section">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-serif font-bold tracking-tighter text-white">
              {view.type === 'all' ? "Catalogue" : "Profil"}<span className="text-primary">.</span>
            </h1>
          </div>

          {view.type !== 'all' && (
            <button
              onClick={() => setView({ type: 'all', id: null })}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors border border-primary/20 px-4 py-2 rounded-full"
            >
              <X className="w-3 h-3" /> Fermer le profil
            </button>
          )}
        </div>

        {/* TOOLBAR */}
        <ToolBar handleSelectPerson={handleSelectPerson} selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre} setView={setView} setPage={setPage} genres={genres} />

        {/* CONTENU DYNAMIQUE */}
        <div className="transition-all duration-500">
          {view.type === 'all' && (
            <>
              <MovieGrid
                movies={movies}
                loading={loading}
                onMovieClick={(m) => { setSelectedMovie(m); setIsModalOpen(true); }}
              />
              <Pagination
                currentPage={page}
                onPrev={() => handlePageChange(Math.max(1, page - 1))}
                onNext={() => handlePageChange(page + 1)}
                disableNext={page >= totalPages}
                isLoading={loading}
              />
            </>
          )}

          {view.type === 'director' && (
            <DirectorProfileView
              directorId={view.id!}
              onMovieClick={(m) => {
                setSelectedMovie(m);
                setIsModalOpen(true);
              }}
            />
          )}

          {view.type === 'actor' && (
            <ActorProfileView
              actorId={view.id!}
              onMovieClick={(m) => {
                setSelectedMovie(m);
                setIsModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <MovieDialog movie={selectedMovie} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onViewProfile={handleSelectPerson} />
    </main>
  );
}