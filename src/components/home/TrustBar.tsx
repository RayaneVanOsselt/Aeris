import type { ClaimKey } from "@/lib/business";
import { ClaimLabel, isClaimVisible } from "@/components/ui/Claim";
import { Icon, type IconName } from "@/components/ui/Icon";

const items: Array<{ id: ClaimKey; icon: IconName }> = [
  { id: "madeToMeasure", icon: "ruler" },
  { id: "checkedBeforeProduction", icon: "eye" },
  { id: "europeanMade", icon: "europe" },
  { id: "warranty", icon: "shield" },
  { id: "directPayment", icon: "lock" },
];

/** Réassurance immédiate, juste sous le hero. */
export function TrustBar() {
  const visible = items.filter((i) => isClaimVisible(i.id));
  return (
    <section aria-label="Nos engagements" className="border-y border-line bg-surface">
      <ul className="container-site scroll-row flex gap-8 overflow-x-auto py-6 lg:grid lg:grid-cols-5 lg:gap-6">
        {visible.map((item) => (
          <li key={item.id} className="flex min-w-[15rem] shrink-0 snap-start items-start gap-3.5 lg:min-w-0">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink">
              <Icon name={item.icon} size={19} />
            </span>
            <span>
              <ClaimLabel id={item.id} className="block text-[0.9375rem] font-medium text-ink" />
              <ClaimLabel id={item.id} field="detail" className="t-small mt-0.5 block text-ink-3" />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
