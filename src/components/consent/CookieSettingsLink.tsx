"use client";

import { useI18n } from "@/i18n/provider";

/** Rouvre le panneau de préférences cookies (géré par <CookieConsent />). */
export function CookieSettingsLink({ className }: { className?: string }) {
  const { m } = useI18n();
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("aeris:open-consent"))}>
      {m.consent.manage}
    </button>
  );
}
