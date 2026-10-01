import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { ClaimLabel } from "@/components/ui/Claim";
import { Icon, type IconName } from "@/components/ui/Icon";
import { isClaimVisible } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";

export const quoteMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "quote" }, ...messages[locale].meta.quote });

export function QuotePage() {
  const { m, href } = getI18n();
  const p = m.pages.quote;
  const blocks: Array<{ icon: IconName; title: React.ReactNode; text: string; claim?: boolean }> = [
    { icon: "ruler", title: p.dimensionsTitle, text: p.dimensionsText },
    { icon: "eye", title: <ClaimLabel id="checkedBeforeProduction" />, text: m.claims.checkedBeforeProduction.detail, claim: true },
    { icon: "chat", title: p.personalTitle, text: p.personalText },
  ];
  return (
    <>
      <PageHeader crumbs={[{ name: p.crumb, href: href("quote") }]} eyebrow={p.eyebrow} title={<Rich text={p.title} />} intro={p.intro} />
      <section className="container-site grid grid-cols-1 gap-12 pb-[var(--section-y)] pt-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Suspense fallback={<div className="skeleton h-[560px] rounded-[var(--radius-xl)]" />}>
            <QuoteForm />
          </Suspense>
        </div>
        <aside className="space-y-4 lg:col-span-5">
          {blocks
            .filter((b) => !b.claim || isClaimVisible("checkedBeforeProduction"))
            .map((b) => (
              <div key={b.text} className="flex gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-6">
                <Icon name={b.icon} size={22} className="mt-0.5 shrink-0 text-sky" />
                <div>
                  <p className="text-ink">{b.title}</p>
                  <p className="t-small mt-1 text-ink-2">{b.text}</p>
                </div>
              </div>
            ))}
        </aside>
      </section>
    </>
  );
}
