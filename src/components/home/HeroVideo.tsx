"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";
import { mediaUrl, prefersStill } from "@/lib/media";
import { Icon } from "@/components/ui/Icon";

/**
 * Film d'accueil. L'affiche s'affiche immédiatement (élément LCP) ; la vidéo,
 * adaptée à l'orientation de l'écran, se charge ensuite et apparaît en fondu
 * dès qu'elle joue — jamais d'écran noir. Bouton pause (WCAG 2.2.2), pause
 * hors écran ; avec « réduire les animations » ou l'économiseur de données,
 * rien n'est téléchargé tant que la personne ne lance pas la lecture.
 */
export function HeroVideo() {
  const { m } = useI18n();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);
  // Choix explicite de la personne : prime sur la lecture automatique
  const userPaused = useRef(false);
  const inView = useRef(true);

  const load = (v: HTMLVideoElement) => {
    if (v.getAttribute("src")) return;
    const portrait = window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
    v.muted = true;
    v.src = mediaUrl(portrait ? "film-portrait.mp4" : "film-1600.mp4");
  };

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (prefersStill()) {
      userPaused.current = true;
      return;
    }
    // La vidéo se charge une fois la page prête et l'ouverture en arche terminée :
    // texte, polices et affiche d'abord, la bande passante ensuite
    const begin = () => {
      if (userPaused.current) return;
      load(v);
      if (!inView.current) return;
      void v.play().catch((error: unknown) => {
        // Lecture automatique refusée par le navigateur (économie d'énergie…) : l'affiche reste, le bouton propose « Lire ».
        // Une lecture simplement interrompue (mise en pause hors écran) n'est pas un refus.
        if (error instanceof DOMException && error.name === "NotAllowedError") userPaused.current = true;
      });
    };
    let timer: number | undefined;
    const start = () => {
      timer = window.setTimeout(begin, 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry!.isIntersecting;
      if (!entry!.isIntersecting) v.pause();
      else if (!userPaused.current && v.getAttribute("src")) void v.play().catch(() => {});
    });
    io.observe(v);
    // Onglet en arrière-plan : le navigateur suspend la vidéo ; on la relance au retour
    const onVisible = () => {
      if (document.visibilityState === "visible" && inView.current && !userPaused.current && v.getAttribute("src")) void v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      io.disconnect();
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      load(v);
      void v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          setPlaying(true);
          setShown(true);
        }}
        onPause={() => setPlaying(false)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-[var(--dur-cinematic)] ease-[var(--ease-out)]",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      <p className="sr-only">{m.home.hero.film}</p>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? m.home.hero.pause : m.home.hero.play}
        title={playing ? m.home.hero.pause : m.home.hero.play}
        className="animate-fade-in absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[var(--gutter)] z-10 flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors duration-[var(--dur-base)] hover:bg-white/20"
        style={{ "--delay": "1400ms" } as React.CSSProperties}
      >
        <Icon name={playing ? "pause" : "play"} size={16} strokeWidth={2} className={playing ? undefined : "translate-x-px fill-current"} />
      </button>
    </>
  );
}
