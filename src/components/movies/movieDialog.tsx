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

  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });

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
      <DialogContent 
        className="p-0 border-none bg-transparent max-w-full sm:max-w-[95vw] lg:max-w-6xl outline-none shadow-2xl [&>button]:hidden fixed top-[70px] sm:top-[50%] translate-y-0 sm:-translate-y-[50%]"
      >
        <VisuallyHidden>
          <DialogTitle>{movie?.title || "Détails"}</DialogTitle>
        </VisuallyHidden>

        <div
          id="dialog-scroll-viewport"
          className={`flex flex-col md:flex-row w-full h-[calc(100vh-70px)] md:h-[85vh] bg-background/95 backdrop-blur-3xl border-t sm:border border-white/10 sm:rounded-2xl overflow-y-auto relative custom-scrollbar transition-all duration-500 ease-in-out
            ${isTransitioning ? 'opacity-0 scale-[0.98] translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
          `}
        >
          {/* BOUTON FERMER FIXE - Positionné par rapport à la navbar mobile */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-[100] p-2 bg-black/60 hover:bg-primary text-white rounded-full backdrop-blur-md transition-all border border-white/10 active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>

          {/* SECTION GAUCHE : VISUEL / VIDEO */}
          <div className="w-full md:w-[42%] bg-black shrink-0 relative overflow-hidden">
            {showPlayer && trailerKey ? (
              <div className="aspect-video md:h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative aspect-[2/3] md:h-full w-full group">
                <FadeImage
                  src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`}
                  alt={movie?.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />
                
                {trailerKey && (
                  <button
                    onClick={() => setShowPlayer(true)}
                    className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl z-30"
                  >
                    <Play className="w-6 h-6 md:w-8 md:h-8 fill-primary-foreground text-primary-foreground ml-1" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* SECTION DROITE : INFOS */}
          <div className="w-full md:w-[58%] p-6 md:p-12 flex flex-col gap-10 bg-background md:bg-transparent pb-24 md:pb-12">
            
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                <span className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded">
                  <Star className="w-3 h-3 fill-primary" /> {movie?.vote_average?.toFixed(1)}
                </span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {movie?.runtime} MIN</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {movie?.release_date?.split('-')[0]}</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                {movie?.title}
              </h2>

              <div className="flex flex-wrap gap-2">
                {movie?.genres?.map((g: any) => (
                  <span key={g.id} className="text-[9px] border border-white/10 bg-white/5 px-3 py-1 rounded-full text-muted-foreground font-bold uppercase tracking-widest">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest">Synopsis</h4>
              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed font-light italic">
                "{movie?.overview || "Aucun résumé disponible."}"
              </p>
            </div>

            {(watchProviders?.flatrate || watchProviders?.rent) && (
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                  <Tv className="w-3 h-3" /> Streaming
                </h4>
                <div className="flex flex-wrap gap-3">
                  {[...(watchProviders?.flatrate || []), ...(watchProviders?.rent || [])]
                    .filter((v, i, a) => a.findIndex(t => t.provider_id === v.provider_id) === i)
                    .slice(0, 6)
                    .map((provider: any) => (
                      <div key={provider.provider_id} className="group relative">
                        <img
                          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-10 h-10 rounded-xl border border-white/5"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-8 border-t border-white/5">
              <div className="space-y-5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Users className="w-4 h-4" /> Casting
                </h4>
                <div className="flex flex-wrap gap-4">
                  {cast?.map((actor: any) => (
                    <button key={actor.id} onClick={() => handleActorClick(actor.id)} className="h-12 w-12 rounded-full ring-2 ring-white/5 overflow-hidden active:ring-primary">
                      <img
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://via.placeholder.com/185"}
                        alt={actor.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Réalisation</p>
                <button onClick={() => handleActorClick(director.id)} className="text-sm font-bold active:text-primary transition-colors">
                  {director?.name || "Non communiqué"}
                </button>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1 pt-4">Budget</p>
                <p className="text-sm font-mono flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-primary" /> {movie?.budget > 0 ? movie.budget.toLocaleString() : "Confidentiel"}
                </p>
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="pt-8 border-t border-white/5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-6">
                  Suggestions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {recommendations.map((rec) => (
                    <div key={rec.id} onClick={() => loadMovieData(rec.id)} className="group cursor-pointer">
                      <div className="relative aspect-video overflow-hidden rounded-lg border border-white/5 group-active:border-primary">
                        <FadeImage
                          src={`https://image.tmdb.org/t/p/w300${rec.backdrop_path || rec.poster_path}`}
                          alt={rec.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-[10px] mt-2 font-medium line-clamp-1">{rec.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <PersonDrawer
          personId={selectedPersonId}
          isOpen={isPersonOpen}
          onClose={() => setIsPersonOpen(false)}
          onMovieClick={(movieId: number) => {
            setIsPersonOpen(false);
            loadMovieData(movieId);
          }}
          onViewProfile={(id:any, type:any) => {
            onViewProfile(id, type);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}