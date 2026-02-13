import type { Genre, Movie } from "@/api/tmdbApi";
import apitmdb from "@/api/tmdbApi";
import { MovieDialog } from "@/components/movies/movieDialog";
import { useSmoothScroll } from "@/hook/useSmoothScroll";
import { Filter, PlayCircle, X } from "lucide-react"; // Ajout de X pour le bouton fermer
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieGrid } from "../ui/movieGrid";
import { Pagination } from "../ui/pagination-custom";

// Imports des vues de profil
import { ActorProfileView } from "../view/actorProfileView";
import { DirectorProfileView } from "../view/directorProfileView";

const PROVIDER_CONFIG: Record<string, { name: string; color: string; gradient: string }> = {
  "8": { name: "Netflix", color: "text-red-600", gradient: "from-red-600/20" },
  "337": { name: "Disney+", color: "text-blue-400", gradient: "from-blue-600/20" },
  "119": { name: "Prime Video", color: "text-cyan-400", gradient: "from-cyan-600/20" },
  "381": { name: "Canal+", color: "text-white", gradient: "from-gray-600/20" },
  "531": { name: "Paramount+", color: "text-blue-600", gradient: "from-blue-700/20" },
  "2": { name: "Apple TV", color: "text-gray-300", gradient: "from-gray-400/20" },
  "1899": { name: "Max", color: "text-indigo-500", gradient: "from-indigo-600/20" },
};

export function StreamingPage() {
  const { providerId } = useParams();

  // --- ÉTAT DE LA VUE (Gestion Profil vs Catalogue) ---
  const [view, setView] = useState<{ type: 'all' | 'director' | 'actor', id: number | null }>({
    type: 'all',
    id: null
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { triggerScroll, executeScroll } = useSmoothScroll();


  const config = PROVIDER_CONFIG[providerId || ""] || {
    name: "Streaming",
    color: "text-primary",
    gradient: "from-primary/20"
  };

  // Handler pour le changement de vue depuis le MovieDialog/PersonDrawer
  const handleSelectPerson = (id: number, type: 'director' | 'actor') => {
    setView({ type, id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    apitmdb.getGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    // On ne charge les films de la plateforme que si on est en vue "all"
    if (view.type !== 'all') return;

    const fetchStreamingMovies = async () => {
      setLoading(true);
      try {
        const data = await apitmdb.getMoviesByProvider(Number(providerId), page, selectedGenre);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        executeScroll("movie-section");
      } catch (error) {
        console.error("Erreur chargement plateforme:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStreamingMovies();
  }, [providerId, page, selectedGenre, view.type]);

  // Reset quand on change de plateforme
  useEffect(() => {
    setPage(1);
    setSelectedGenre(null);
    setView({ type: 'all', id: null });
  }, [providerId]);

  const handlePageChange = (newPage: number) => {
    triggerScroll(); 
    setPage(newPage);
  };
  return (
    <main className="min-h-screen bg-background " id="movie-section">

      {/* 1. CONTENU CATALOGUE (Affiche si view.type === 'all') */}
      {view.type === 'all' ? (
        <>
          <div className={`relative h-[40vh] flex items-center px-8 border-b border-white/5 overflow-hidden`}>
            <div className={`absolute inset-0 bg-linear-to-br ${config.gradient} to-transparent opacity-30`} />
            <div className="relative max-w-7xl mx-auto w-full pt-16">
              <span className={`text-[10px] font-bold uppercase tracking-[0.5em] ${config.color} mb-4 block`}>
                Exclusivité Catalogue
              </span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-4">
                {config.name}<span className="text-primary">.</span>
              </h1>
              <p className="max-w-xl text-muted-foreground text-sm md:text-base leading-relaxed italic">
                Une sélection rigoureuse des chefs-d'œuvre disponibles sur {config.name}.
              </p>
            </div>
          </div>

          {/* ToolBar */}
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest font-semibold">Filtrer par genre</span>
              </div>

              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => { setSelectedGenre(null); setPage(1); }}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-all border ${selectedGenre === null ? `${config.color} border-current bg-white/5` : "border-white/10 text-muted-foreground hover:border-white/20"
                    }`}
                >
                  Tous
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => { setSelectedGenre(genre.id); setPage(1); }}
                    className={`px-5 py-2 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${selectedGenre === genre.id ? `${config.color} border-current bg-white/5` : "border-white/10 text-muted-foreground hover:border-white/20"
                      }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <PlayCircle className={`w-6 h-6 ${config.color}`} />
                <h2 className="text-xl font-serif font-medium">
                  {selectedGenre ? `${genres.find(g => g.id === selectedGenre)?.name} sur ${config.name}` : "Les Incontournables"}
                </h2>
              </div>
              <div className="h-px grow mx-8 bg-white/5 hidden md:block" />
            </div>

            <MovieGrid
              movies={movies}
              loading={loading}
              onMovieClick={(movie) => { setSelectedMovie(movie); setIsModalOpen(true); }}
            />

            <Pagination
              currentPage={page}
              onPrev={() => handlePageChange(Math.max(1, page - 1))}
              onNext={() => handlePageChange(page + 1)}
              disableNext={page >= totalPages}
              isLoading={loading}
            />
          </div>
        </>
      ) : (
        /* 2. VUE PROFIL (Affiche si view.type est 'actor' ou 'director') */
        <div className="max-w-7xl mx-auto px-8 py-24">
          <button
            onClick={() => setView({ type: 'all', id: null })}
            className="mb-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors border border-primary/20 px-6 py-3 rounded-full"
          >
            <X className="w-3 h-3" /> Retour au catalogue {config.name}
          </button>

          {view.type === 'actor' && (
            <ActorProfileView
              actorId={view.id!}
              onMovieClick={(m) => { setSelectedMovie(m); setIsModalOpen(true); }}
            />
          )}

          {view.type === 'director' && (
            <DirectorProfileView
              directorId={view.id!}
              onMovieClick={(m) => { setSelectedMovie(m); setIsModalOpen(true); }}
            />
          )}
        </div>
      )}

      {/* MODAL COMMUNE */}
      <MovieDialog
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onViewProfile={handleSelectPerson}
      />
    </main>
  );
}

export default StreamingPage;