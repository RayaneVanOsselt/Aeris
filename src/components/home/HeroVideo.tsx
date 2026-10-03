"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/cn";
import { mediaUrl } from "@/lib/media";
import { Icon } from "@/components/ui/Icon";

/**
 * Film d'accueil, avec sa bande-son. L'affiche s'affiche immédiatement ; la
 * vidéo (version portrait sur téléphone) démarre dès que la page est prête et
 * apparaît en fondu — jamais d'écran noir.
 *
 * Son : les navigateurs (Safari, Chrome…) interdisent le son automatique
 * avant une action de la personne. On tente la lecture avec le son ; si elle
 * est refusée, le film démarre en silencieux et le bouton « Activer le son »
 * reste bien visible. Si même la lecture silencieuse est refusée (mode
 * économie d'énergie), un bouton « Lire le film » apparaît.
 * Pause hors écran ; boutons pause et son (WCAG 1.4.2 et 2.2.2).
 */
export function HeroVideo() {
  const { m } = useI18n();
  const h = m.home.hero;
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);
  const [muted, setMuted] = useState(true);
  const [blocked, setBlocked] = useState(false);
  // Choix explicite de la personne : prime sur la lecture automatique
  const userPaused = useRef(false);
  const inView = useRef(true);

  const load = (v: HTMLVideoElement) => {
    if (v.getAttribute("src")) return;
    const portrait = window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
    v.src = mediaUrl(portrait ? "film-portrait.mp4" : "film-1600.mp4");
  };

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    load(v);
    // 1) avec le son (rarement autorisé) ; 2) en silencieux ; 3) bouton « Lire le film »
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "NotAllowedError") setBlocked(true);
      });
    });

    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry!.isIntersecting;
      if (!entry!.isIntersecting) v.pause();
      else if (!userPaused.current) void v.play().catch(() => {});
    });
    io.observe(v);
    // Onglet en arrière-plan : le navigateur suspend la vidéo ; on la relance au retour
    const onVisible = () => {
      if (document.visibilityState === "visible" && inView.current && !userPaused.current) void v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Action de la personne : le navigateur autorise alors lecture et son
  const start = (withSound: boolean) => {
    const v = ref.current;
    if (!v) return;
    load(v);
    userPaused.current = false;
    if (withSound) v.muted = false;
    void v.play().then(() => setBlocked(false)).catch(() => {});
  };

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) start(false);
    else {
      userPaused.current = true;
      v.pause();
    }
  };

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    if (v.muted || v.paused) start(true);
    else v.muted = true;
  };

  const control =
    "flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors duration-[var(--dur-base)] hover:bg-white/20";

  return (
    <>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
        aria-hidden="true"
        onPlaying={() => {
          setPlaying(true);
          setShown(true);
        }}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-[var(--dur-slower)] ease-[var(--ease-out)]",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      <p className="sr-only">{h.film}</p>

      {blocked && !playing && (
        <button
          type="button"
          onClick={() => start(true)}
          className="absolute left-1/2 top-[38%] z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full border border-white/30 bg-white/15 py-2 pl-2 pr-6 text-white backdrop-blur-md transition-colors hover:bg-white/25"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-white text-ink">
            <Icon name="play" size={18} strokeWidth={2} className="translate-x-px fill-current" />
          </span>
          {h.playFilm}
        </button>
      )}

      <div
        className="animate-fade-in absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[var(--gutter)] z-10 flex items-center gap-2"
        style={{ "--delay": "500ms" } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? h.pause : h.play}
          title={playing ? h.pause : h.play}
          className={cn(control, "w-11")}
        >
          <Icon name={playing ? "pause" : "play"} size={16} strokeWidth={2} className={playing ? undefined : "translate-x-px fill-current"} />
        </button>
        <button type="button" onClick={toggleSound} className={cn(control, "pl-3.5 pr-4 text-sm")}>
          <Icon name={muted ? "volumeOff" : "volume"} size={18} />
          {muted ? h.soundOn : h.soundOff}
        </button>
      </div>
    </>
  );
}
