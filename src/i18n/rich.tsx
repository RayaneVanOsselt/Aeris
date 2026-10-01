import { Fragment, type ReactNode } from "react";

type Props = {
  text: string;
  /** Classes du mot mis en valeur (*texte*) */
  accentClassName?: string;
  /** Classes du gras (**texte**) */
  strongClassName?: string;
  /** Rendu des liens ([texte]) : la destination est fixée par le code, jamais par le dictionnaire */
  link?: (label: string, index: number) => ReactNode;
};

const TOKENS = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]|\n)/g;

/**
 * Affiche un texte du dictionnaire avec sa mise en forme légère :
 * *accent*, **gras**, [lien] et retours à la ligne. Aucun HTML n'est
 * interprété : les traductions restent du texte pur.
 */
export function Rich({ text, accentClassName = "accent text-sand-deep", strongClassName, link }: Props) {
  let links = 0;
  return (
    <>
      {text.split(TOKENS).map((part, i) => {
        if (!part) return null;
        if (part === "\n") return <br key={i} />;
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className={strongClassName}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <span key={i} className={accentClassName}>
              {part.slice(1, -1)}
            </span>
          );
        }
        if (part.startsWith("[") && part.endsWith("]")) {
          const label = part.slice(1, -1);
          return <Fragment key={i}>{link ? link(label, links++) : label}</Fragment>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** Version texte brut (attributs alt, aria-label, métadonnées) : retire les marqueurs. */
export function plain(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]/g, (_, a: string, b: string, c: string) => a ?? b ?? c).replace(/\n/g, " ");
}
