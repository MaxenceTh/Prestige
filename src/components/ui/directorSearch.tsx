import apitmdb from "@/api/tmdbApi";
import { Search, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SUGGESTED_DIRECTORS = [
  { id: 525, name: "Christopher Nolan", profile_path: "/caTo30vopoy9y98p7QvI1unp96.jpg" },
  { id: 138, name: "Quentin Tarantino", profile_path: "/1gj96jFwa9p0Fax3pSDoBc7vPbK.jpg" },
  { id: 1032, name: "Martin Scorsese", profile_path: "/9reG96BsJ9ST96ST96ST96ST96S.jpg" },
  { id: 5655, name: "Wes Anderson", profile_path: "/7b96jFwa9p0Fax3pSDoBc7vPbK.jpg" },
  { id: 488, name: "Steven Spielberg", profile_path: "/8699XFwa9p0Fax3pSDoBc7vPbK.jpg" }
];

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=?&background=0D0D0D&color=fff";

// 1. Définition de l'interface pour la prop onSelect
interface DirectorSearchProps {
  onSelect: (id: number) => void;
}

export function DirectorSearch({ onSelect }: DirectorSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        const data = await apitmdb.searchDirector(query);
        const directors = data.filter((p: any) => p.known_for_department === "Directing");
        setResults(directors);
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [query]);

  // 2. Utilisation de onSelect au lieu de navigate
  const handleSelect = (id: number) => {
    setIsOpen(false);
    setQuery("");
    onSelect(id); // On déclenche l'affichage du profil dans CatalogPage
  };

  const displayResults = query.length > 2 ? results : SUGGESTED_DIRECTORS;

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Rechercher un cinéaste..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-100 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {query.length <= 2 && (
            <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Les Incontournables</span>
            </div>
          )}

          <div className="max-h-75 overflow-y-auto custom-scrollbar">
            {displayResults.length > 0 ? (
              displayResults.map((person) => (
                <button
                  key={person.id}
                  onClick={() => handleSelect(person.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-0 group"
                >
                  <img
                    src={person.profile_path ? apitmdb.getImageUrl(person.profile_path, "w92") : DEFAULT_AVATAR}
                    className="h-8 w-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all bg-white/10"
                    alt={person.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_AVATAR;
                      target.onerror = null;
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white/90 group-hover:text-white">{person.name}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-tighter group-hover:text-primary/70 transition-colors">Réalisateur</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                Aucun réalisateur trouvé pour "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}