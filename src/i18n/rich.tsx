import { Fragment, type CSSProperties, type ReactNode } from "react";

type Props = {
  text: string;
  /** Classes du mot mis en valeur (*texte*) */
  accentClassName?: string;
  /** Classes du gras (**texte**) */
  strongClassName?: string;
  /** Rendu des liens ([texte]) : la destination est fixée par le code, jamais par le dictionnaire */
  link?: (label: string, index: number) => ReactNode;
  /**
   * Découpe en mots pour une révélation mot à mot :
   * - "rise" : chaque mot monte derrière un masque quand le bloc parent devient visible ;
   * - "scroll" : chaque mot s'éclaire en traversant l'écran (défilement piloté).
   */
  words?: "rise" | "scroll";
};

const TOKENS = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]|\n)/g;

/**
 * Affiche un texte du dictionnaire avec sa mise en forme légère :
 * *accent*, **gras**, [lien] et retours à la ligne. Aucun HTML n'est
 * interprété : les traductions restent du texte pur.
 */
export function Rich({ text, accentClassName = "accent text-sand-deep", strongClassName, link, words }: Props) {
  let links = 0;
  let index = 0;
  const split = (chunk: string, key: string) => {
    if (!words) return chunk;
    return chunk.split(/(\s+)/).map((w, j) => {
      if (!w) return null;
      if (/^\s+$/.test(w)) return <Fragment key={`${key}-${j}`}> </Fragment>;
      const i = index++;
      return words === "scroll" ? (
        <span key={`${key}-${j}`} className="sd-word">
          {w}
        </span>
      ) : (
        <span key={`${key}-${j}`} className="rt-word">
          <span style={{ "--i": i } as CSSProperties}>{w}</span>
        </span>
      );
    });
  };
  return (
    <>
      {text.split(TOKENS).map((part, i) => {
        if (!part) return null;
        if (part === "\n") return <br key={i} />;
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className={strongClassName}>
              {split(part.slice(2, -2), `b${i}`)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <span key={i} className={accentClassName}>
              {split(part.slice(1, -1), `a${i}`)}
            </span>
          );
        }
        if (part.startsWith("[") && part.endsWith("]")) {
          const label = part.slice(1, -1);
          return <Fragment key={i}>{link ? link(label, links++) : label}</Fragment>;
        }
        return <Fragment key={i}>{split(part, `t${i}`)}</Fragment>;
      })}
    </>
  );
}

/** Version texte brut (attributs alt, aria-label, métadonnées) : retire les marqueurs. */
export function plain(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]/g, (_, a: string, b: string, c: string) => a ?? b ?? c).replace(/\n/g, " ");
}
