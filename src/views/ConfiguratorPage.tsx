import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { messages } from "@/i18n/messages";
import { getI18n } from "@/i18n/server";
import { Configurator } from "@/components/configurator/Configurator";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { pageMetadata } from "@/lib/seo";

export const configuratorMeta = (locale: Locale) => pageMetadata({ locale, target: { key: "configurator" }, ...messages[locale].meta.configurator });

export function ConfiguratorPage() {
  const { m, href } = getI18n();
  const p = m.pages.configurator;
  return (
    <div className="container-site pb-[var(--section-y)] pt-8">
      <Breadcrumb items={[{ name: p.crumb, href: href("configurator") }]} />
      <h1 className="sr-only">{p.title}</h1>
      <div className="mt-8">
        <Suspense fallback={<div className="skeleton h-[600px] rounded-[var(--radius-xl)]" aria-label={p.loading} />}>
          <Configurator />
        </Suspense>
      </div>
    </div>
  );
}
