import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

/**
 * Emplacement clairement identifié pour un contenu réel à fournir
 * (photos, avis, coordonnées…). Visible uniquement en mode préparation.
 */
export function Placeholder({
  title,
  children,
  icon = "image",
  className,
  tone = "light",
}: {
  title: string;
  children?: React.ReactNode;
  icon?: IconName;
  className?: string;
  tone?: "light" | "night";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-dashed p-6",
        tone === "night" ? "border-line-night text-on-night-2" : "border-line-strong bg-paper/60 text-ink-3",
        className,
      )}
    >
      <span className="t-caption inline-flex items-center gap-2 rounded-full bg-warning-soft px-2.5 py-1 text-warning">
        <Icon name={icon} size={14} />À compléter
      </span>
      <p className={cn("font-medium", tone === "night" ? "text-on-night" : "text-ink-2")}>{title}</p>
      {children && <div className="t-small">{children}</div>}
    </div>
  );
}
