import {Skeleton} from "@/components/ui/skeleton";

function PopularMoviesSkeleton() {
  return (
    <section className="py-16 px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" /> {/* Titre */}
          <Skeleton className="h-4 w-48" /> {/* Sous-titre */}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full" /> {/* Poster */}
            <Skeleton className="h-4 w-3/4" /> {/* Titre film */}
            <Skeleton className="h-3 w-1/2" /> {/* Année */}
          </div>
        ))}
      </div>
    </section>
  );
}
export default PopularMoviesSkeleton;