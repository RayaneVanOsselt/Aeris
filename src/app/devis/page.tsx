import { Suspense } from "react";
import { claims } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { ClaimLabel, isClaimVisible } from "@/components/ui/Claim";
import { Icon } from "@/components/ui/Icon";

export const metadata = pageMetadata({
  title: "Demander un devis gratuit",
  description: "Plusieurs ouvertures, grande dimension, forme spéciale ou besoin de pose ? Décrivez votre projet de moustiquaires sur mesure : nous vous répondons personnellement.",
  path: "/devis",
});

export default function QuotePage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Devis", href: "/devis" }]}
        eyebrow="Devis sans engagement"
        title={
          <>
            Parlez-nous de <span className="accent text-sand-deep">votre projet.</span>
          </>
        }
        intro="Plusieurs ouvertures, une grande baie, une forme spéciale ou une question de pose : décrivez-nous tout, nous revenons vers vous avec une proposition."
      />
      <section className="container-site grid gap-12 pb-[var(--section-y)] pt-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Suspense fallback={<div className="skeleton h-[560px] rounded-[var(--radius-xl)]" />}>
            <QuoteForm />
          </Suspense>
        </div>
        <aside className="space-y-4 lg:col-span-5">
          {[
            { icon: "ruler" as const, title: "Joignez vos dimensions", text: "Même approximatives : nous vous aidons à les affiner." },
            { icon: "eye" as const, title: claims.checkedBeforeProduction.label, text: claims.checkedBeforeProduction.detail, claim: true },
            { icon: "chat" as const, title: "Une réponse personnelle", text: "Pas de relance automatique, pas de revente de vos données." },
          ]
            .filter((b) => !b.claim || isClaimVisible("checkedBeforeProduction"))
            .map((b) => (
            <div key={b.title} className="flex gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-6">
              <Icon name={b.icon} size={22} className="mt-0.5 shrink-0 text-sky" />
              <div>
                <p className="text-ink">{b.claim ? <ClaimLabel id="checkedBeforeProduction" /> : b.title}</p>
                <p className="t-small mt-1 text-ink-2">{b.text}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </>
  );
}
