"use client";

/** Rouvre le panneau de préférences cookies (géré par <CookieConsent />). */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("aeris:open-consent"))}>
      Gérer les cookies
    </button>
  );
}
