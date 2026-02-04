export function MovieGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {Array.from({ length: 20 }).map((_, index) => (
                <div 
                    key={index}
                    className="bg-white/5 animate-pulse h-64 rounded-lg"
                />  
            ))}
        </div>
    );
}