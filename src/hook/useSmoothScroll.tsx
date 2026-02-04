import { useRef } from "react";

export function useSmoothScroll() {
  const shouldScrollRef = useRef(false);

  const triggerScroll = () => {
    shouldScrollRef.current = true;
  };

  const executeScroll = (elementId: string) => {
    if (shouldScrollRef.current) {
      // Un petit délai pour laisser au DOM le temps de se mettre à jour
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        shouldScrollRef.current = false;
      }, 100);
    }
  };

  return { triggerScroll, executeScroll };
}