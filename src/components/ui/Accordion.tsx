import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/**
 * Accordéon basé sur <details>/<summary> : accessible au clavier et
 * aux lecteurs d'écran sans JavaScript, et indexable par les moteurs.
 */
export function Accordion({ items, className }: { items: Array<{ q: string; a: React.ReactNode }>; className?: string }) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <span className="t-h4 text-ink">{item.q}</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-[transform,background-color,color] duration-[var(--dur-base)] ease-[var(--ease-out)] group-open:rotate-45 group-open:bg-ink group-open:text-paper">
              <Icon name="plus" size={16} />
            </span>
          </summary>
          <div className="animate-[fade-up_var(--dur-slow)_var(--ease-out)] pb-6 pr-12 text-ink-2">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
