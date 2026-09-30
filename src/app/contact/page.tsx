import Link from "next/link";
import { Suspense } from "react";
import { company, showPlaceholders } from "@/lib/business";
import { faq } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { Accordion } from "@/components/ui/Accordion";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Une question sur une moustiquaire, vos mesures ou votre commande ? Écrivez à l'équipe Aéris.",
  path: "/contact",
});

export default function ContactPage() {
  const details: Array<{ icon: IconName; label: string; value: string | null; href?: string }> = [
    { icon: "mail", label: "E-mail", value: company.email, href: company.email ? `mailto:${company.email}` : undefined },
    { icon: "phone", label: "Téléphone", value: company.phone, href: company.phone ? `tel:${company.phone.replace(/\s/g, "")}` : undefined },
    { icon: "clock", label: "Horaires", value: company.openingHours },
    { icon: "pin", label: "Adresse", value: company.address ? `${company.address.street}, ${company.address.postalCode} ${company.address.city}` : null },
  ];
  const known = details.filter((d) => d.value);
  const missing = details.filter((d) => !d.value);
  const quick = [...(faq.find((c) => c.id === "mesures")?.items.slice(0, 1) ?? []), ...(faq.find((c) => c.id === "commande")?.items.slice(1, 3) ?? [])];

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Contact", href: "/contact" }]}
        eyebrow="Contact"
        title={
          <>
            Une question&nbsp;? <span className="accent text-sand-deep">Écrivez-nous.</span>
          </>
        }
        intro="Sur un modèle, vos mesures ou votre commande : un membre de l'équipe vous répond personnellement."
      />
      <section className="container-site grid grid-cols-1 gap-12 pb-[var(--section-y)] pt-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Suspense fallback={<div className="skeleton h-[560px] rounded-[var(--radius-xl)]" />}>
            <ContactForm />
          </Suspense>
        </div>
        <aside className="space-y-4 lg:col-span-5">
          <div className="rounded-[var(--radius-xl)] bg-night p-7 text-on-night">
            <p className="t-caption text-on-night-2">Nous joindre</p>
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
                  <span className="block text-sm text-on-night-2">Assistant en ligne</span>
                  Réponses immédiates, en bas à droite de l&apos;écran
                </span>
              </li>
            </ul>
            {!company.responseTime.toConfirm || showPlaceholders ? (
              <p className="mt-6 border-t border-line-night pt-5 text-sm text-on-night-2">
                {company.responseTime.label}
                {company.responseTime.toConfirm && <sup className="ml-0.5 text-sand">◆</sup>}
              </p>
            ) : null}
          </div>
          {showPlaceholders && missing.length > 0 && (
            <Placeholder title="Coordonnées de l'entreprise" icon="info">
              À renseigner dans src/lib/business.ts : {missing.map((m) => m.label.toLowerCase()).join(", ")}. L&apos;ancien site affichait des valeurs d&apos;exemple, retirées.
            </Placeholder>
          )}
          <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-7">
            <p className="t-h4 text-ink">Réponses rapides</p>
            <Accordion items={quick} className="mt-3 border-b-0" />
            <Link href="/faq" className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink underline-offset-4 hover:underline">
              Toutes les questions <Icon name="arrowRight" size={15} />
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
