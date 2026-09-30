import Link from "next/link";
import { company, payment, showPlaceholders } from "@/lib/business";
import { footerNav } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-night text-on-night">
      <div className="mesh-texture-night pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-site relative">
        <div className="grid grid-cols-1 gap-12 border-b border-line-night py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-xs text-on-night-2">
              Moustiquaires sur mesure pour fenêtres, portes et baies. L&apos;air frais entre, les insectes restent dehors.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              {company.email ? (
                <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-on-night hover:underline">
                  <Icon name="mail" size={18} className="text-sand" />
                  {company.email}
                </a>
              ) : (
                showPlaceholders && <p className="flex items-center gap-3 text-on-night-2"><Icon name="mail" size={18} className="text-sand" />E-mail : à compléter</p>
              )}
              {company.phone ? (
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-on-night hover:underline">
                  <Icon name="phone" size={18} className="text-sand" />
                  {company.phone}
                </a>
              ) : (
                showPlaceholders && <p className="flex items-center gap-3 text-on-night-2"><Icon name="phone" size={18} className="text-sand" />Téléphone : à compléter</p>
              )}
              <Link href="/contact" className="flex items-center gap-3 text-on-night hover:underline">
                <Icon name="chat" size={18} className="text-sand" />
                Formulaire de contact
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-8">
            {footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="t-caption mb-5 text-on-night-2">{col.title}</h2>
                <ul className="space-y-3 text-[0.9375rem]">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-underline text-on-night/90 hover:text-on-night">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  {col.title === "Informations légales" && (
                    <li>
                      <CookieSettingsLink className="link-underline text-left text-on-night/90 hover:text-on-night" />
                    </li>
                  )}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 py-8 text-sm text-on-night-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Icon name="lock" size={16} className="text-sand" />
            <span className="mr-2">Paiement direct&nbsp;:</span>
            {payment.methods.map((m) => (
              <span key={m} className="rounded-full border border-line-night px-3 py-1 text-xs text-on-night">
                {m}
              </span>
            ))}
          </div>
          <p>
            © {year} {company.legalName ?? company.name}
            {company.vatNumber ? ` · TVA ${company.vatNumber}` : ""}
          </p>
        </div>

        <p
          aria-hidden
          className="pointer-events-none -mb-[0.2em] select-none text-center text-[clamp(5rem,22vw,20rem)] font-extralight leading-[0.8] tracking-[-0.07em] text-white/[0.045]"
        >
          aéris
        </p>
      </div>
    </footer>
  );
}
