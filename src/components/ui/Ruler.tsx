import { cn } from "@/lib/cn";

/** Règle graduée : motif signature « au millimètre ». Purement décoratif. */
export function Ruler({ className, tone = "light" }: { className?: string; tone?: "light" | "night" }) {
  const color = tone === "night" ? "rgb(241 238 231 / 0.28)" : "rgb(13 26 46 / 0.22)";
  return (
    <div aria-hidden className={cn("relative h-9 overflow-hidden", className)}>
      <div
        className="absolute inset-x-0 top-0 h-2"
        style={{ backgroundImage: `repeating-linear-gradient(to right, ${color} 0 1px, transparent 1px 8px)` }}
      />
      <div
        className="absolute inset-x-0 top-0 h-3.5"
        style={{ backgroundImage: `repeating-linear-gradient(to right, ${color} 0 1px, transparent 1px 40px)` }}
      />
      <div
        className="absolute inset-x-0 top-0 h-5"
        style={{ backgroundImage: `repeating-linear-gradient(to right, ${color} 0 1px, transparent 1px 80px)` }}
      />
      <div className={cn("t-num absolute left-0 top-5 flex text-[10px]", tone === "night" ? "text-on-night-2" : "text-ink-3")}>
        {Array.from({ length: 40 }, (_, i) => (
          <span key={i} className="w-20 shrink-0 pl-1">
            {i * 100}
          </span>
        ))}
      </div>
    </div>
  );
}
