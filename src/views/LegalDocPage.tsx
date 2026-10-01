import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { messages } from "@/i18n/messages";
import { getI18n } from "@/i18n/server";
import { LegalPage } from "@/components/legal/LegalPage";
import { payment } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";

/** Les quatre documents légaux partagent le même gabarit. */
export type LegalKey = "legalNotice" | "terms" | "privacy" | "cookies";

export const legalMeta = (locale: Locale, key: LegalKey) => {
  const doc = messages[locale].legal[key];
  return pageMetadata({ locale, target: { key }, title: doc.title, description: doc.description });
};

export function LegalDocPage({ docKey }: { docKey: LegalKey }) {
  const { m, href, f } = getI18n();
  const doc = m.legal[docKey];
  const methods = f.list(payment.methods.map((x) => m.payment.methods[x]));
  const sections = doc.sections.map((s) => ({ ...s, facts: s.facts?.map((fact) => fmt(fact, { methods })) }));
  return <LegalPage title={doc.title} path={href(docKey)} intro={doc.intro} sections={sections} />;
}
