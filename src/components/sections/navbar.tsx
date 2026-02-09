import type { Movie } from "@/api/tmdbApi";
import { Film, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MovieDialog } from "../movies/movieDialog";
import { SearchBar } from "../ui/navbar-custom";

const STREAMING_PLATFORMS = [
  { id: 8, name: "Netflix" },
  { id: 337, name: "Disney+" },
  { id: 119, name: "Prime" },
  { id: 381, name: "Canal+" },
  { id: 531, name: "Paramount+" },
  { id: 2, name: "Apple TV" },
  { id: 1899, name: "Max" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Fermer le menu mobile lors d'un changement de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full h-[70px] z-[9999] bg-background/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
          
          {/* --- PARTIE GAUCHE : LOGO + DESKTOP LINKS --- */}
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 text-primary font-serif font-bold text-2xl tracking-tighter shrink-0">
              <Film className="w-6 h-6" />
              <span>PRESTIGE</span>
            </Link>

            {/* Ton Menu Desktop Original */}
            <div className="hidden lg:flex items-center gap-8">
              <NavLink to="/catalog" className={({ isActive }) => `text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-primary ${isActive ? "text-primary border-b border-primary pb-1" : "text-muted-foreground"}`}>
                Explorer
              </NavLink>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-6">
                {STREAMING_PLATFORMS.map((platform) => (
                  <NavLink key={platform.id} to={`/streaming/${platform.id}`} className={({ isActive }) => `text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-primary ${isActive ? "text-primary border-b border-primary pb-1" : "text-muted-foreground"}`}>
                    {platform.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* --- PARTIE DROITE : SEARCH + BURGER --- */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="hidden sm:block w-full max-w-[250px]">
              <SearchBar onMovieSelect={handleMovieSelect} />
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-primary"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* --- MENU MOBILE (DRAWER) --- */}
        <div className={`fixed inset-0 top-[70px] left-0 w-full h-[calc(100vh-70px)] bg-background z-[9998] transform transition-all duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
          <div className="flex flex-col p-6 gap-10 h-full overflow-y-auto">
            
            {/* Barre de recherche (Visible seulement sur petit mobile) */}
            <div className="sm:hidden">
              <SearchBar onMovieSelect={handleMovieSelect} />
            </div>

            {/* Navigation "Explorer" */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Navigation</p>
              <NavLink to="/catalog">
                {({ isActive }) => (
                  <div className={`flex items-center justify-between py-2 transition-all ${isActive ? "text-primary translate-x-2" : "text-foreground opacity-80"}`}>
                    <span className="text-4xl font-serif">Explorer</span>
                    <ArrowRight className={`w-6 h-6 transition-transform ${isActive ? "opacity-100" : "opacity-0"}`} />
                  </div>
                )}
              </NavLink>
            </div>

            {/* Grille des Plateformes */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Destinations</p>
              <div className="grid grid-cols-2 gap-3">
                {STREAMING_PLATFORMS.map((p) => (
                  <NavLink key={p.id} to={`/streaming/${p.id}`}>
                    {({ isActive }) => (
                      <div className={`flex flex-col p-4 rounded-xl border transition-all duration-300 ${isActive ? "bg-primary/10 border-primary/40" : "bg-white/5 border-white/5 active:scale-95"}`}>
                        <span className={`text-sm font-bold tracking-tight ${isActive ? "text-primary" : "text-foreground"}`}>
                          {p.name}
                        </span>
                        <span className="text-[9px] uppercase tracking-tighter opacity-30 mt-1">
                          {isActive ? "En cours" : "Accéder"}
                        </span>
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Petit rappel de marque en bas */}
            <div className="mt-auto pt-6 text-center border-t border-white/5">
              <p className="text-[9px] text-muted-foreground uppercase tracking-[0.4em] opacity-30">
                Prestige Streaming Experience
              </p>
            </div>
          </div>
        </div>
      </nav>

      <MovieDialog movie={selectedMovie} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default Navbar;