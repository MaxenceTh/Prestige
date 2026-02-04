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
    <div className="mt-20 flex items-center justify-center gap-12 border-t border-white/5 pt-12">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentPage === 1 || isLoading}
        className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-8 h-12 transition-all"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        PRÉCÉDENT
      </Button>

      <div className="flex flex-col items-center min-w-[80px]">
        <span className="text-[10px] font-bold text-muted-foreground tracking-[0.3em] uppercase mb-1">
          Page
        </span>
        <span className="text-3xl font-serif font-bold text-primary tabular-nums">
          {currentPage}
        </span>
      </div>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={isLoading || disableNext}
        className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-8 h-12 transition-all"
      >
        SUIVANT
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}