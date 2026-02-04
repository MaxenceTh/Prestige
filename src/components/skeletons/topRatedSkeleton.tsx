import {Skeleton} from "@/components/ui/skeleton";

function TopRatedSkeleton() {
  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-center mb-16">
          <Skeleton className="h-12 w-80" /> {/* Titre section */}
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-8 md:gap-16 pb-12 border-b border-white/5">
            {/* Poster Skeleton */}
            <Skeleton className="w-48 md:w-64 h-72 md:h-96 flex-shrink-0" />
            
            {/* Infos Skeleton */}
            <div className="flex-grow space-y-6 pt-4">
              <div className="flex gap-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-10 w-3/4" /> {/* Titre film */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" /> {/* Description ligne 1 */}
                <Skeleton className="h-4 w-full" /> {/* Description ligne 2 */}
                <Skeleton className="h-4 w-2/3" /> {/* Description ligne 3 */}
              </div>
              <Skeleton className="h-10 w-40" /> {/* Bouton */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default TopRatedSkeleton;