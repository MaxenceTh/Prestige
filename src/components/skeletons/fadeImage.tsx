import { useState } from "react";
import { cn } from "@/lib/utils";

interface FadeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

export function FadeImage({ src, alt, className, ...props }: FadeImageProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative h-full w-full overflow-hidden bg-white/5">
            <img
                src={src}
                alt={alt}
                width={342}
                height={513}
                loading="lazy"
                className={cn(
                    "h-full w-full object-cover transition-opacity duration-1000 ease-in-out",
                    loaded ? "opacity-100" : "opacity-0",
                    className
                )}
                onLoad={() => {
                    setLoaded(true)
                }
                }

                // onLoad={() => {
                //     setTimeout(() => {
                //         setLoaded(true);
                //     }, 2000); // L'image apparaîtra seulement après 2 secondes
                // }}

                {...props}
            />
        </div>
    );
}