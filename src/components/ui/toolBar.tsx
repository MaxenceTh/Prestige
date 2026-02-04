import { DirectorSearch } from "./directorSearch";
import { ActorSearch } from "./actorSearch";
import type { Genre } from "@/api/tmdbApi";
import { SlidersHorizontal } from "lucide-react";

interface Props {
    handleSelectPerson: (id: number,  type: "director" | "actor") => void;
    selectedGenre: string,
    setView: (view: { type: 'all' | 'director' | 'actor', id: number | null }) => void,
    setPage: (page: number) => void,
    setSelectedGenre: (genre: string) => void,
    genres: Genre[];
}


export default function ToolBar({handleSelectPerson, selectedGenre, setSelectedGenre, setView, setPage, genres}: Props) {


    return (
        <div className="relative z-50 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-16 p-4 bg-white/2 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <DirectorSearch onSelect={(id) => handleSelectPerson(id, 'director')} />
                <ActorSearch onSelect={(id) => handleSelectPerson(id, 'actor')} />
            </div>

            <div className="lg:block w-px h-10 bg-white/10 mx-2 hidden" />

            <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <select
                    className="bg-transparent text-[11px] font-bold focus:outline-none cursor-pointer uppercase tracking-widest"
                    value={selectedGenre}
                    onChange={(e) => {
                        setSelectedGenre(e.target.value);
                        setView({ type: 'all', id: null }); // Revient au catalogue si on change de genre
                        setPage(1);
                    }}
                >
                    <option value="" className="bg-background">Genres</option>
                    {genres.map((g) => <option key={g.id} value={g.id} className="bg-background">{g.name}</option>)}
                </select>
            </div>
        </div>
    );
}
