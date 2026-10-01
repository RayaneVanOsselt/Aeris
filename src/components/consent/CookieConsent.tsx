"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const KEY = "aeris_consent";
const VERSION = 1;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Consent = { analytics: boolean; date: string; version: number };

function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) ?? "null") as Consent | null;
    return c && c.version === VERSION ? c : null;
  } catch {
    return null;
  }
}

const consentListeners = new Set<() => void>();
const subscribeConsent = (cb: () => void) => {
  consentListeners.add(cb);
  return () => consentListeners.delete(cb);
};
/** Instantané stable (chaîne) du consentement enregistré. */
const consentSnapshot = () => {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};

function loadAnalytics() {
  if (!GA_ID || document.getElementById("ga-script")) return;
  window.__aerisAnalyticsConsent = true;
  window.dataLayer = window.dataLayer ?? [];
  const gtag = (...args: unknown[]) => window.dataLayer!.push(args);
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
  const s = document.createElement("script");
  s.id = "ga-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);
}

/**
 * Consentement RGPD. Sans outil de mesure configuré, aucun bandeau n'est
 * imposé (seul le stockage strictement nécessaire est utilisé). Avec un
 * outil, « Refuser » est aussi accessible qu'« Accepter ».
 */
export function CookieConsent() {
  const { m, href } = useI18n();
  const c = m.consent;
  const stored = useSyncExternalStore(subscribeConsent, consentSnapshot, () => "server");
  const [manual, setManual] = useState<boolean | null>(null);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const visible = manual ?? (Boolean(GA_ID) && stored === "");

  useEffect(() => {
    if (readConsent()?.analytics) loadAnalytics();
    const onOpen = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setDetails(true);
      setManual(true);
    };
    window.addEventListener("aeris:open-consent", onOpen);
    return () => window.removeEventListener("aeris:open-consent", onOpen);
  }, []);

  const save = (value: boolean) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ analytics: value, date: new Date().toISOString(), version: VERSION } satisfies Consent));
    } catch {
      /* stockage indisponible : le choix vaut pour la session */
    }
    window.__aerisAnalyticsConsent = value;
    if (value) loadAnalytics();
    consentListeners.forEach((l) => l());
    setManual(false);
  };

  if (!visible) return null;

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-3 bottom-3 z-[60] animate-[fade-up_var(--dur-slow)_var(--ease-out)] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[420px]">
      <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 shadow-[var(--shadow-lg)]">
        <p id="consent-title" className="flex items-center gap-2 text-ink">
          <Icon name="lock" size={18} className="text-sky" /> {c.title}
        </p>
        {!GA_ID ? (
          <>
            <p className="t-small mt-3 text-ink-2">
              {c.noTracking}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <Link href={href("cookies")} className="t-small text-ink-2 underline underline-offset-2">
                {c.policy}
              </Link>
              <Button size="sm" onClick={() => setManual(false)}>
                {c.understood}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="t-small mt-3 text-ink-2">
              {c.ask}{" "}
              <Link href={href("cookies")} className="underline underline-offset-2">
                {c.learnMore}
              </Link>
            </p>
            {details && (
              <div className="mt-4 space-y-3 rounded-[var(--radius-md)] border border-line bg-paper p-4 text-sm">
                <label className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-ink">{c.necessary}</span>
                    <span className="t-small text-ink-3">{c.necessaryHint}</span>
                  </span>
                  <input type="checkbox" checked disabled className="mt-1 size-5 accent-[var(--color-ink)]" />
                </label>
                <label className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-ink">{c.analytics}</span>
                    <span className="t-small text-ink-3">{c.analyticsHint}</span>
                  </span>
                  <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 size-5 accent-[var(--color-ink)]" />
                </label>
              </div>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button size="sm" variant="secondary" onClick={() => save(false)}>
                {c.refuse}
              </Button>
              <Button size="sm" onClick={() => save(details ? analytics : true)}>
                {details ? c.save : c.accept}
              </Button>
            </div>
            {!details && (
              <button type="button" onClick={() => setDetails(true)} className="t-small mt-3 w-full text-center text-ink-2 underline underline-offset-2">
                {c.customize}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
