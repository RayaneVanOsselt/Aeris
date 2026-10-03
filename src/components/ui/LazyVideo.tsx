"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { mediaUrl, prefersStill } from "@/lib/media";

type Props = {
  /** Nom du clip dans public/media (sans extension) : <nom>.mp4 + affiche <nom>.webp */
  name: string;
  className?: string;
  /** Lecture souhaitée (ex. étape active d'un récit). La vidéo ne se charge qu'à la première lecture. */
  playing?: boolean;
  /** Point d'intérêt horizontal conservé au recadrage (ex. « 40% ») */
  focus?: string;
};

/**
 * Vidéo d'ambiance, muette et en boucle. Chargée seulement quand elle
 * approche de l'écran ET doit jouer ; mise en pause hors écran. Avec
 * « réduire les animations » ou l'économiseur de données, seule l'affiche
 * (image fixe) est affichée. Décorative : le sens est porté par le texte.
 */
export function LazyVideo({ name, className, playing = true, focus = "50%" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useRef(false);
  const wanted = useRef(playing);
  const still = useRef(true);
  const [shown, setShown] = useState(false);

  const sync = () => {
    const v = ref.current;
    if (!v || still.current) return;
    if (inView.current && wanted.current) {
      if (!v.getAttribute("src")) {
        v.muted = true;
        v.src = mediaUrl(`${name}.mp4`);
      }
      void v.play().catch(() => {});
    } else if (!v.paused) {
      v.pause();
    }
  };

  useEffect(() => {
    const v = ref.current;
    still.current = prefersStill();
    if (!v || still.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry!.isIntersecting;
        sync();
      },
      { rootMargin: "25% 0px" },
    );
    io.observe(v);
    // Onglet en arrière-plan : le navigateur suspend la vidéo ; on la relance au retour
    const onVisible = () => document.visibilityState === "visible" && sync();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    wanted.current = playing;
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const position = { objectPosition: `${focus} 50%` };
  return (
    <span className={cn("relative block size-full", className)}>
      {/* Affiche en image à chargement différé : rien n'est téléchargé loin de l'écran */}
      {/* eslint-disable-next-line @next/next/no-img-element -- site statique : affiches déjà optimisées en WebP */}
      <img src={mediaUrl(`${name}.webp`)} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={position} />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setShown(true)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-out)]",
          shown ? "opacity-100" : "opacity-0",
        )}
        style={position}
      />
    </span>
  );
}
