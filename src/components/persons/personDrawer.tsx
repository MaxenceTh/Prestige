import apitmdb from "@/api/tmdbApi";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { Calendar, ChevronLeft, Film, MapPin, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FadeImage } from "../skeletons/fadeImage";

export function PersonDrawer({ personId, isOpen, onClose, onMovieClick, onViewProfile }: any) {
    const [person, setPerson] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (personId && isOpen) {
            const fetchPerson = async () => {
                setLoading(true);
                try {
                    const data = await apitmdb.getPersonDetails(personId);
                    setPerson(data);
                } catch (error) {
                    console.error("Erreur Star:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchPerson();
        }
    }, [personId, isOpen]);

    // 1. On récupère ses films en tant que Réalisateur (Director)
    const directedMovies = person?.movie_credits?.crew
        ?.filter((m: any) => m.job === "Director" && m.poster_path) || [];

    // 2. On récupère ses films en tant qu'Acteur (Cast)
    const actedMovies = person?.movie_credits?.cast
        ?.filter((m: any) => m.poster_path && m.character) || [];

    // 3. LOGIQUE DE SELECTION : 
    // Si la personne a réalisé des films, on affiche sa filmo de réalisateur.
    // Sinon, on affiche sa filmo d'acteur.
    let filmography = directedMovies.length > 0 ? directedMovies : actedMovies;

    const topMovies = filmography
        // Retirer les doublons
        ?.filter((movie: any, index: number, self: any[]) =>
            index === self.findIndex((t) => t.id === movie.id)
        )
        // Trier par les films les plus connus (nombre de votes)
        ?.sort((a: any, b: any) => b.vote_count - a.vote_count)
        .slice(0, 6);

    // On crée un petit label dynamique pour le titre de la section
    const sectionTitle = directedMovies.length > 0 ? "Filmographie (Réalisateur)" : "Filmographie Notoire";

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-md bg-background/80 backdrop-blur-2xl border-l border-white/10 p-0 overflow-hidden outline-none"
            >
                {/* BARRE DE NAVIGATION MOBILE (Retour & Fermer) */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-background/50 md:hidden">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 text-sm font-medium text-primary active:scale-95 transition-transform"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Retour au film
                    </button>
                    <button onClick={onClose} className="p-1 opacity-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="h-full flex items-center justify-center text-primary font-serif italic animate-pulse">
                        Chargement de la star...
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto custom-scrollbar p-6 pt-10 md:pt-6">

                        {/* Header Profil */}
                        <SheetHeader className="mb-8">
                            <div className="relative aspect-2/3 w-40 mx-auto mb-6 group">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-50" />
                                <div className="relative h-full w-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                                    {person && (
                                        <FadeImage
                                            src={`https://image.tmdb.org/t/p/h632${person.profile_path}`}
                                            alt={person.name}
                                            className="object-cover w-full h-full"
                                        />
                                    )}
                                </div>
                            </div>

                            <SheetTitle className="text-3xl font-serif font-bold text-center text-foreground tracking-tight cursor-pointer"
                                onClick={() => {
                                    if (person?.id) {
                                        // On détermine si c'est un réalisateur ou un acteur pour la vue
                                        const type = directedMovies.length > 0 ? 'director' : 'actor';
                                        onViewProfile(person.id, type);
                                        onClose(); // On ferme le drawer pour voir le profil en grand
                                    }
                                }}
                                >
                                {person?.name}
                            </SheetTitle>

                            <SheetDescription className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                                {person?.birthday && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {new Date(person.birthday).getFullYear()}
                                    </span>
                                )}
                                {person?.place_of_birth && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {person.place_of_birth.split(',').pop()}
                                    </span>
                                )}
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-10">
                            {/* Biographie */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest border-b border-primary/20 pb-2">
                                    La Star
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed italic font-light">
                                    {person?.biography || "Biographie non disponible."}
                                </p>
                            </div>

                            {/* Filmographie */}
                            <div className="space-y-4 pb-10">
                                <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                                    <Film className="w-3 h-3" /> {sectionTitle}
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {topMovies?.map((m: any) => (
                                        <div
                                            key={m.id}
                                            onClick={() => onMovieClick(m.id)}
                                            className="group cursor-pointer space-y-2 bg-white/5 p-2 rounded-xl border border-transparent active:bg-primary/10 transition-all duration-300"
                                        >
                                            <div className="aspect-2/3 overflow-hidden rounded-lg shadow-lg">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                                                    alt={m.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="px-1">
                                                <p className="text-[10px] font-bold truncate text-foreground group-hover:text-primary transition-colors">
                                                    {m.title}
                                                </p>
                                                <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
                                                    <Star className="w-2 h-2 fill-primary text-primary" /> {m.vote_average?.toFixed(1)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}