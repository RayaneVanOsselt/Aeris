import { cn } from "@/lib/cn";

/** Marque Aéris : un cadre et sa trame — la moustiquaire réduite à l'essentiel. */
export function Logo({ className, tone = "ink" }: { className?: string; tone?: "ink" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", tone === "light" ? "text-on-night" : "text-ink", className)}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" fill="none">
        <rect x="1.25" y="1.25" width="23.5" height="23.5" rx="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 5.5v15M13 5.5v15M17 5.5v15M5.5 9h15M5.5 13h15M5.5 17h15" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
        <circle cx="19.5" cy="6.5" r="2" fill="#c8a57a" />
      </svg>
      <span className="text-[1.3125rem] font-medium leading-none tracking-[-0.035em]">Aéris</span>
    </span>
  );
}
