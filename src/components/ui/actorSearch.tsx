import { useState, useEffect, useRef } from "react";
import { Search, Star } from "lucide-react";
import apitmdb from "@/api/tmdbApi";

const SUGGESTED_ACTORS = [
  { id: 287, name: "Brad Pitt", profile_path: "/cckcYpSsySfsS7p99H60vWyQHO0.jpg" },
  { id: 1136406, name: "Tom Holland", profile_path: "/bU7W79MF9m96v6vO7vPbK1gj96j.jpg" },
  { id: 31, name: "Tom Hanks", profile_path: "/m7S96v6vO7vPbK1gj96jFwa9p0F.jpg" },
  { id: 62, name: "Bruce Willis", profile_path: "/A1uS96v6vO7vPbK1gj96jFwa9p0.jpg" },
  { id: 11701, name: "Angelina Jolie", profile_path: "/k3S96v6vO7vPbK1gj96jFwa9p0F.jpg" },
  { id: 18918, name: "Dwayne Johnson", profile_path: "/cgS96v6vO7vPbK1gj96jFwa9p0F.jpg" },
  { id: 974169, name: "Margot Robbie", profile_path: "/euS96v6vO7vPbK1gj96jFwa9p0F.jpg" },
  { id: 3223, name: "Robert Downey Jr.", profile_path: "/imS96v6vO7vPbK1gj96jFwa9p0F.jpg" }
];

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=?&background=0D0D0D&color=fff";

// 1. On définit l'interface pour la prop onSelect
interface ActorSearchProps {
  onSelect: (id: number) => void;
}

export function ActorSearch({ onSelect }: ActorSearchProps) {
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
        const data = await apitmdb.searchActor(query);
        setResults(data);
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [query]);

  // 2. On utilise onSelect au lieu de navigate
  const handleSelect = (id: number) => {
    setIsOpen(false);
    setQuery("");
    onSelect(id); // On informe le parent (CatalogPage) du choix
  };

  const displayResults = query.length > 2 ? results : SUGGESTED_ACTORS;

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
          placeholder="Rechercher un acteur..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2">
          {query.length <= 2 && (
            <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center gap-2">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Les Incontournables</span>
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
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
                    <span className="text-[9px] text-muted-foreground uppercase tracking-tighter group-hover:text-primary/70 transition-colors">Acteur</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                Aucun acteur trouvé pour "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}




// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search, Star } from "lucide-react";
// import apitmdb from "@/api/tmdbApi";

// // IDs réels TMDB pour les suggestions par défaut
// const SUGGESTED_ACTORS = [
//   { 
//     id: 287, 
//     name: "Brad Pitt", 
//     profile_path: "/cckcYpSsySfsS7p99H60vWyQHO0.jpg" 
//   },
//   { 
//     id: 1136406, 
//     name: "Tom Holland", 
//     profile_path: "/bU7W79MF9m96v6vO7vPbK1gj96j.jpg" 
//   },
//   { 
//     id: 31, 
//     name: "Tom Hanks", 
//     profile_path: "/m7S96v6vO7vPbK1gj96jFwa9p0F.jpg" 
//   },
//   { 
//     id: 62, 
//     name: "Bruce Willis", 
//     profile_path: "/A1uS96v6vO7vPbK1gj96jFwa9p0.jpg" 
//   },
//   { 
//     id: 11701, 
//     name: "Angelina Jolie", 
//     profile_path: "/k3S96v6vO7vPbK1gj96jFwa9p0F.jpg" 
//   },
//   { 
//     id: 18918, 
//     name: "Dwayne Johnson", 
//     profile_path: "/cgS96v6vO7vPbK1gj96jFwa9p0F.jpg" 
//   },
//   { 
//     id: 974169, 
//     name: "Margot Robbie", 
//     profile_path: "/euS96v6vO7vPbK1gj96jFwa9p0F.jpg" 
//   },
//   { 
//     id: 3223, 
//     name: "Robert Downey Jr.", 
//     profile_path: "/imS96v6vO7vPbK1gj96jFwa9p0F.jpg" 
//   }
// ];

// const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=?&background=0D0D0D&color=fff";


// export function ActorSearch() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<any[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const searchRef = useRef<HTMLDivElement>(null);

//   // Fermer le menu au clic extérieur
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Recherche API avec Debounce
//   useEffect(() => {
//     if (query.length > 2) {
//       const delayDebounceFn = setTimeout(async () => {
//         const data = await apitmdb.searchActor(query);
//         setResults(data);
//         setIsOpen(true);
//       }, 300);
//       return () => clearTimeout(delayDebounceFn);
//     } else {
//       setResults([]);
//     }
//   }, [query]);

//   const handleSelect = (id: number) => {
//     setIsOpen(false);
//     setQuery("");
//     navigate(`/actor/${id}`);
//   };

//   const displayResults = query.length > 2 ? results : SUGGESTED_ACTORS;

//   return (
//     <div ref={searchRef} className="relative w-full md:w-[320px]">
//       <div className="relative group">
//         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
//         <input
//           type="text"
//           value={query}
//           onFocus={() => setIsOpen(true)}
//           onChange={(e) => {
//             setQuery(e.target.value);
//             setIsOpen(true);
//           }}
//           placeholder="Rechercher un acteur..."
//           className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
//         />
//       </div>

//       {isOpen && (
//         <div className="absolute top-full mt-2 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2">

//           {/* Label si suggestions par défaut */}
//           {query.length <= 2 && (
//             <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center gap-2">
//               <Star className="w-3 h-3 text-primary fill-primary" />
//               <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Les Incontournables</span>
//             </div>
//           )}

//           <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
//             {displayResults.length > 0 ? (
//               displayResults.map((person) => (
//                 <button
//                   key={person.id}
//                   onClick={() => handleSelect(person.id)}
//                   className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-0 group"
//                 >
//                   <img
//                     src={person.profile_path ? apitmdb.getImageUrl(person.profile_path, "w92") : DEFAULT_AVATAR}
//                     className="h-8 w-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all bg-white/10"
//                     alt={person.name}
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.src = DEFAULT_AVATAR;
//                       target.onerror = null; // Évite une boucle infinie si l'image par défaut échoue aussi
//                     }}
//                   />
//                   <div className="flex flex-col">
//                     <span className="text-sm font-medium text-white/90 group-hover:text-white">{person.name}</span>
//                     <span className="text-[9px] text-muted-foreground uppercase tracking-tighter group-hover:text-primary/70 transition-colors">Acteur</span>
//                   </div>
//                 </button>
//               ))
//             ) : (
//               <div className="px-4 py-8 text-center text-xs text-muted-foreground">
//                 Aucun acteur trouvé pour "{query}"
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }