"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Décalage en ms pour échelonner les éléments d'une même rangée */
  delay?: number;
  id?: string;
};

/**
 * Révèle un bloc quand il entre dans l'écran. Raison UX : guider
 * l'œil dans l'ordre de lecture. Un seul IntersectionObserver
 * partagé ; sans JS ou avec « réduire les animations », tout est visible.
 */
let observer: IntersectionObserver | null = null;
function getObserver() {
  if (observer || typeof window === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.visible = "true";
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -4% 0px", threshold: 0 },
  );
  return observer;
}

export function Reveal({ as: Tag = "div", children, className, delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    const io = getObserver();
    if (!el || !io) return;
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return (
    <Tag ref={ref} id={id} className={cn("reveal", className)} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
