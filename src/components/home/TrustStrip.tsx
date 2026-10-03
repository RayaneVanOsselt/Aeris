import { getI18n } from "@/i18n/server";
import { ClaimLabel } from "@/components/ui/Claim";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { isClaimVisible, type ClaimKey } from "@/lib/business";

/** Engagements dans l'ordre d'importance. Les non confirmés n'apparaissent qu'en mode préparation. */
const items: Array<{ id: ClaimKey; icon: IconName }> = [
  { id: "madeToMeasure", icon: "ruler" },
  { id: "instantPrice", icon: "sliders" },
  { id: "directPayment", icon: "lock" },
  { id: "humanSupport", icon: "chat" },
  { id: "checkedBeforeProduction", icon: "eye" },
  { id: "europeanMade", icon: "europe" },
  { id: "warranty", icon: "shield" },
];

/** Réassurance juste sous le film : ce qui compte avant d'acheter sur mesure en ligne. */
export function TrustStrip() {
  const { m } = getI18n();
  const visible = items.filter((i) => isClaimVisible(i.id));
  return (
    <section aria-label={m.homePage.trustLabel} className="pt-10 md:pt-14">
      <ul className="container-site grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 60} className="flex items-start gap-4 border-t border-line pt-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand-soft text-sand-deep">
              <Icon name={item.icon} size={20} />
            </span>
            <span>
              <ClaimLabel id={item.id} className="t-h4 block text-ink" />
              <ClaimLabel id={item.id} field="detail" className="t-small mt-1 block text-ink-3" />
            </span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
