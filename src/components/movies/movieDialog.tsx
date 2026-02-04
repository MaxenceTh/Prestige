import { useEffect, useState } from "react";
import apitmdb from "@/api/tmdbApi";
import { Play, Clock, Star, Users, X, Calendar, DollarSign, Tv } from "lucide-react";
import { FadeImage } from "../skeletons/fadeImage";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { PersonDrawer } from "../persons/personDrawer";

export function MovieDialog({ movie: basicMovie, isOpen, onClose, onViewProfile }: any) {
  const [movie, setMovie] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [watchProviders, setWatchProviders] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // États de gestion des transitions et chargement
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // États pour le tiroir de l'acteur (PersonDrawer)
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [isPersonOpen, setIsPersonOpen] = useState(false);

  const loadMovieData = async (movieId: number) => {
    setIsTransitioning(true);

    setTimeout(async () => {
      setIsLoading(true);
      setShowPlayer(false);

      try {
        const [details, recs, videos, providers] = await Promise.all([
          apitmdb.getMovieDetails(movieId),
          apitmdb.getRecommendations(movieId),
          apitmdb.getMovieVideos(movieId),
          apitmdb.getWatchProviders(movieId)
        ]);

        setMovie(details);
        setRecommendations(recs.results.slice(0, 6));
        setWatchProviders(providers);

        const trailer = videos.find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);

        const container = document.getElementById("dialog-scroll-viewport");
        if (container) container.scrollTo({ top: 0 });

        setIsTransitioning(false);
      } catch (error) {
        console.error("Erreur globale modal:", error);
        setIsTransitioning(false);
      } finally {
        setIsLoading(false);
      }
    }, 250);
  };

  useEffect(() => {
    if (basicMovie && isOpen) {
      loadMovieData(basicMovie.id);
    }
    if (!isOpen) {
      setMovie(null);
      setIsTransitioning(false);
      setShowPlayer(false);
    }
  }, [basicMovie, isOpen]);

  const handleActorClick = (personId: number) => {
    setSelectedPersonId(personId);
    setIsPersonOpen(true);
  };

  if (!movie && !isLoading) return null;

  const director = movie?.credits?.crew?.find((p: any) => p.job === "Director");
  const cast = movie?.credits?.cast?.slice(0, 6);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-none bg-transparent sm:max-w-[95vw] lg:max-w-6xl outline-none overflow-hidden shadow-2xl [&>button]:hidden">

        <VisuallyHidden>
          <DialogTitle>{movie?.title || "Détails"}</DialogTitle>
        </VisuallyHidden>

        <div
          id="dialog-scroll-viewport"
          className={`flex flex-col md:flex-row w-full h-auto max-h-[92vh] md:h-[85vh] bg-background/95 backdrop-blur-3xl border border-white/10 rounded-xl overflow-y-auto md:overflow-hidden relative custom-scrollbar transition-all duration-500 ease-in-out
            ${isTransitioning ? 'opacity-0 scale-[0.98] translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
          `}
        >
          {/* BOUTON FERMER */}
          <button
            onClick={onClose}
            className="fixed md:absolute top-6 right-6 z-60 p-2 bg-black/40 hover:bg-primary hover:text-primary-foreground rounded-full backdrop-blur-md transition-all border border-white/10"
          >
            <X className="w-6 h-6 md:w-5 md:h-5" />
          </button>

          {/* SECTION GAUCHE : VISUEL / TRAILER */}
          <div className="w-full md:w-[40%] sticky top-0 z-10 md:relative md:h-full bg-black aspect-video md:aspect-auto shrink-0">
            {showPlayer && trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="relative h-full w-full overflow-hidden">
                <FadeImage
                  src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`}
                  alt={movie?.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent md:hidden" />

                {trailerKey && (
                  <button
                    onClick={() => setShowPlayer(true)}
                    className="absolute inset-0 m-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl z-20"
                  >
                    <Play className="w-8 h-8 fill-primary-foreground text-primary-foreground ml-1" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* SECTION DROITE : INFOS */}
          <div className="w-full md:w-[60%] p-6 md:p-12 overflow-y-auto custom-scrollbar flex flex-col gap-10 bg-background md:bg-transparent">

            {/* Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                <span className="flex items-center gap-1 text-primary">
                  <Star className="w-4 h-4 fill-primary" /> {movie?.vote_average?.toFixed(1)}
                </span>
                <span>|</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {movie?.runtime} MIN</span>
                <span>|</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {movie?.release_date?.split('-')[0]}</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight tracking-tight text-foreground">
                {movie?.title}
              </h2>

              <div className="flex flex-wrap gap-2">
                {movie?.genres?.map((g: any) => (
                  <span key={g.id} className="text-[10px] border border-primary/20 bg-primary/5 px-3 py-1 rounded-full text-primary/90 font-semibold uppercase tracking-widest">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis & Plateformes */}
            <div className="space-y-8">
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest">Synopsis</h4>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light italic">
                  "{movie?.overview || "Aucun résumé disponible."}"
                </p>
              </div>

              {/* Watch Providers */}
              {(watchProviders?.flatrate || watchProviders?.rent) && (
                <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-1000">
                  <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                    <Tv className="w-3.5 h-3.5" /> Disponible sur
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {[...(watchProviders?.flatrate || []), ...(watchProviders?.rent || [])]
                      .filter((v, i, a) => a.findIndex(t => t.provider_id === v.provider_id) === i)
                      .slice(0, 6)
                      .map((provider: any) => (
                        <div key={provider.provider_id} className="group relative" title={provider.provider_name}>
                          <img
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="w-10 h-10 rounded-xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Casting cliquable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-white/5">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Users className="w-4 h-4" /> Casting
                </h4>
                <div className="flex flex-wrap gap-3">
                  {cast?.map((actor: any) => (
                    <button
                      key={actor.id}
                      onClick={() => handleActorClick(actor.id)}
                      className="group relative focus:outline-none"
                    >
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full ring-2 ring-white/5 overflow-hidden transition-all group-hover:ring-primary group-hover:scale-110">
                        <img
                          src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://via.placeholder.com/185"}
                          alt={actor.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-[8px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-20">
                        {actor.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Réalisation</p>
                <button
                  onClick={() => handleActorClick(director.id)}
                  className="text-sm md:text-base font-bold text-foreground hover:text-primary transition-colors text-left cursor-pointer"
                >
                  <p className="text-sm md:text-base font-bold text-foreground">{director?.name || "Non communiqué"}</p>
                </button>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 pt-4">Budget</p>
                <p className="text-sm font-mono text-foreground flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-primary" /> {movie?.budget > 0 ? movie.budget.toLocaleString() : "Confidentiel"}
                </p>
              </div>
            </div>

            {/* Recommandations */}
            {recommendations.length > 0 && (
              <div className="pt-8 border-t border-white/5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                  Vous pourriez aussi aimer
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => loadMovieData(rec.id)}
                      className="group cursor-pointer space-y-2"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-md border border-white/5 group-hover:border-primary/50 transition-all">
                        <FadeImage
                          src={`https://image.tmdb.org/t/p/w300${rec.backdrop_path || rec.poster_path}`}
                          alt={rec.title}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <p className="text-[10px] font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {rec.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TIROIR DE L'ACTEUR (PersonDrawer) */}
        <PersonDrawer
          personId={selectedPersonId}
          isOpen={isPersonOpen}
          onClose={() => setIsPersonOpen(false)}
          onMovieClick={(movieId: number) => {
            setIsPersonOpen(false); // Ferme l'acteur
            loadMovieData(movieId); // Charge le nouveau film dans le modal actuel
          }}
          onViewProfile={(id:any, type:any) => {
           onViewProfile(id, type); // Change la vue dans CatalogPage
           onClose(); // Ferme la modal MovieDialog
         }}
        />

      </DialogContent>
    </Dialog>
  );
}