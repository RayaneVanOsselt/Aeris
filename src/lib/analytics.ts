/**
 * Suivi d'événements. Rien n'est envoyé sans consentement « mesure d'audience ».
 * Aucune donnée personnelle : seules des valeurs techniques (modèle, étape…)
 * sont autorisées. Compatible Google Tag Manager / GA4 via dataLayer.
 */
export type AnalyticsEvent =
  | "view_product"
  | "configurator_started"
  | "configurator_step_completed"
  | "quote_requested"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase"
  | "chatbot_opened"
  | "chatbot_question"
  | "contact_form_submitted"
  | "finder_completed";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    __aerisAnalyticsConsent?: boolean;
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined" || !window.__aerisAnalyticsConsent) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props });
}
