import { getI18n } from "@/i18n/server";
import { ClaimLabel } from "@/components/ui/Claim";
import { Icon, type IconName } from "@/components/ui/Icon";
import { isClaimVisible, type ClaimKey } from "@/lib/business";

const items: Array<{ id: ClaimKey; icon: IconName }> = [
  { id: "madeToMeasure", icon: "ruler" },
  { id: "checkedBeforeProduction", icon: "eye" },
  { id: "europeanMade", icon: "europe" },
  { id: "warranty", icon: "shield" },
  { id: "directPayment", icon: "lock" },
  { id: "instantPrice", icon: "eye" },
  { id: "humanSupport", icon: "chat" },
];

/** Réassurance immédiate, juste sous le hero. */
export function TrustBar() {
  const { m } = getI18n();
  const visible = items.filter((i) => isClaimVisible(i.id)).slice(0, 5);
  return (
    <section aria-label={m.homePage.trustLabel} className="border-y border-line bg-surface">
      <ul
        className="container-site scroll-row flex gap-8 overflow-x-auto py-6 lg:grid lg:gap-6"
        style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))` }}
      >
        {visible.map((item) => (
          <li key={item.id} className="flex w-[16.5rem] shrink-0 snap-start items-start gap-3.5 lg:w-auto">
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
