import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  tone?: "light" | "night";
};

/** En-tête de section : repère (mono) + titre léger + chapeau. */
export function SectionHeading({ eyebrow, title, intro, align = "left", className, as: H = "h2", tone = "light" }: Props) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "t-caption mb-5 inline-flex items-center gap-2",
            tone === "night" ? "text-on-night-2" : "text-ink-3",
          )}
        >
          <span aria-hidden className={cn("h-px w-6", tone === "night" ? "bg-on-night-2" : "bg-sand")} />
          {eyebrow}
        </p>
      )}
      <H className={cn(H === "h1" ? "t-h1" : "t-h2", tone === "night" ? "text-on-night" : "text-ink")}>{title}</H>
      {intro && (
        <p className={cn("t-lead mt-6", tone === "night" ? "text-on-night-2" : "text-ink-2", align === "center" && "mx-auto max-w-2xl")}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}
