import type { Movie } from "@/api/tmdbApi";
import { Film } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom"; // Import indispensable pour la navigation
import { MovieDialog } from "../movies/movieDialog";
import { SearchBar } from "../ui/navbar-custom";

// Liste des plateformes à afficher dans le menu
const STREAMING_PLATFORMS = [
  { id: 8, name: "Netflix" },
  { id: 337, name: "Disney+" },
  { id: 119, name: "Prime" },
  { id: 381, name: "Canal+" }, // 384
  { id: 531, name: "Paramount+" },
  { id: 2, name: "Apple TV" },
  { id: 1899, name: "Max" },

];

export function Navbar() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-background/80 backdrop-blur-md border-b border-white/5 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 text-primary font-serif font-bold text-2xl tracking-tighter shrink-0">
              <Film className="w-6 h-6" />
              <span>PRESTIGE</span>
            </Link>

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

          {/* Searchbar */}
          <SearchBar onMovieSelect={handleMovieSelect} />
        </div>
      </nav>

      <MovieDialog movie={selectedMovie} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default Navbar;