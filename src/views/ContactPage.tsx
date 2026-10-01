import Link from "next/link";
import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { faqItems } from "@/i18n/faq";
import { messages } from "@/i18n/messages";
import { Rich } from "@/i18n/rich";
import { getI18n } from "@/i18n/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { Accordion } from "@/components/ui/Accordion";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { company, showPlaceholders } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";

export const contactMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "contact" }, ...messages[locale].meta.contact });

export function ContactPage() {
  const { m, href, locale } = getI18n();
  const p = m.pages.contact;
  const details: Array<{ icon: IconName; label: string; value: string | null; href?: string }> = [
    { icon: "mail", label: p.email, value: company.email, href: company.email ? `mailto:${company.email}` : undefined },
    { icon: "phone", label: p.phone, value: company.phone, href: company.phone ? `tel:${company.phone.replace(/\s/g, "")}` : undefined },
    { icon: "clock", label: p.hours, value: company.openingHours },
    { icon: "pin", label: p.address, value: company.address ? `${company.address.street}, ${company.address.postalCode} ${company.address.city}` : null },
  ];
  const known = details.filter((d) => d.value);
  const missing = details.filter((d) => !d.value);
  const quick = [...faqItems(locale, "mesures").slice(0, 1), ...faqItems(locale, "commande").slice(1, 3)];

  return (
    <>
      <PageHeader crumbs={[{ name: p.crumb, href: href("contact") }]} eyebrow={p.eyebrow} title={<Rich text={p.title} />} intro={p.intro} />
      <section className="container-site grid grid-cols-1 gap-12 pb-[var(--section-y)] pt-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Suspense fallback={<div className="skeleton h-[560px] rounded-[var(--radius-xl)]" />}>
            <ContactForm />
          </Suspense>
        </div>
        <aside className="space-y-4 lg:col-span-5">
          <div className="rounded-[var(--radius-xl)] bg-night p-7 text-on-night">
            <p className="t-caption text-on-night-2">{p.reachUs}</p>
            <ul className="mt-5 space-y-4">
              {known.map((d) => (
                <li key={d.label} className="flex gap-4">
                  <Icon name={d.icon} size={20} className="mt-0.5 text-sand" />
                  <span>
                    <span className="block text-sm text-on-night-2">{d.label}</span>
                    {d.href ? (
                      <a href={d.href} className="hover:underline">
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </span>
                </li>
              ))}
              <li className="flex gap-4">
                <Icon name="chat" size={20} className="mt-0.5 text-sand" />
                <span>
                  <span className="block text-sm text-on-night-2">{p.assistant}</span>
                  {p.assistantHint}
                </span>
              </li>
            </ul>
            {!company.responseTimeToConfirm || showPlaceholders ? (
              <p className="mt-6 border-t border-line-night pt-5 text-sm text-on-night-2">
                {m.company.responseTime}
                {company.responseTimeToConfirm && <sup className="ml-0.5 text-sand">◆</sup>}
              </p>
            ) : null}
          </div>
          {showPlaceholders && missing.length > 0 && (
            <Placeholder title="Coordonnées de l'entreprise" icon="info">
              À renseigner dans src/lib/business.ts : {missing.map((d) => d.label.toLowerCase()).join(", ")}. L&apos;ancien site affichait des valeurs d&apos;exemple, retirées.
            </Placeholder>
          )}
          <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-7">
            <p className="t-h4 text-ink">{p.quickAnswers}</p>
            <Accordion items={quick} className="mt-3 border-b-0" />
            <Link href={href("faq")} className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink underline-offset-4 hover:underline">
              {m.common.allQuestions} <Icon name="arrowRight" size={15} />
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
