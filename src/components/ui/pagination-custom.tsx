import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
  disableNext?: boolean;
  isLoading?: boolean;
}

export function Pagination({ currentPage, onPrev, onNext, disableNext, isLoading }: PaginationProps) {

 return (
    // On réduit le gap sur mobile (gap-4) et on l'augmente sur PC (sm:gap-12)
    <div className="mt-10 sm:mt-20 flex items-center justify-center gap-4 sm:gap-12 border-t border-white/5 pt-8 sm:pt-12">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentPage === 1 || isLoading}
        // px-4 sur mobile, px-8 sur PC | h-10 mobile vs h-12 PC
        className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-4 sm:px-8 h-10 sm:h-12 transition-all text-xs sm:text-sm"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
       <div className="flex items-baseline"> {/* On groupe les deux parties dans un conteneur sans gap */}
    <span className="inline">PRÉC</span>
    <span className="hidden sm:inline">ÉDENT</span>
  </div>
      </Button>

      <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
        <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1">
          Page
        </span>
        <span className="text-xl sm:text-3xl font-serif font-bold text-primary tabular-nums">
          {currentPage}
        </span>
      </div>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={isLoading || disableNext}
        className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-4 sm:px-8 h-10 sm:h-12 transition-all text-xs sm:text-sm"
      >
        <span className="inline">SUIVANT</span>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:mr-2" />
      </Button>
    </div>
  );
}