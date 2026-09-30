"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getProduct } from "@/lib/catalog";
import { parseParams, toConfiguration } from "@/lib/configurator";
import { formatPrice } from "@/lib/format";
import { describeConfig } from "@/lib/order";
import { computePrice } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { useSubmit } from "@/lib/use-submit";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, FormAlert, Honeypot, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

export function QuoteForm() {
  const params = useSearchParams();
  const config = toConfiguration(parseParams(params));
  const onlyModel = !config ? getProduct(params.get("modele") ?? "") : undefined;
  const [attach, setAttach] = useState(true);
  const { submit, status, message, fields } = useSubmit("quote");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const err = (k: string) => errors[k] ?? fields[k];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const next: Record<string, string> = {};
    if (!get("name")) next.name = "Nom requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) next.email = "Adresse e-mail invalide";
    if (get("phone") && !/^[+0-9 ().-]{6,30}$/.test(get("phone"))) next.phone = "Numéro de téléphone invalide";
    if (get("message").length < 10) next.message = "Décrivez votre projet en quelques mots (10 caractères minimum)";
    if (!f.get("consent")) next.consent = "Votre accord est nécessaire pour que nous puissions vous répondre";
    setErrors(next);
    if (Object.keys(next).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    const res = await submit({
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
      postalCode: get("postalCode") || undefined,
      openings: get("openings") || undefined,
      message: get("message"),
      configuration: attach && config ? config : undefined,
      source: config ? "configurateur" : onlyModel ? "produit" : "devis",
      consent: true,
      website: get("website"),
    });
    if (res.ok) track("quote_requested", { source: config ? "configurateur" : "devis" });
  };

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-8 text-center sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" size={26} strokeWidth={2.4} />
        </span>
        <h2 className="t-h3 mt-6 text-ink">Demande envoyée</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-2">Merci. Nous étudions votre projet et revenons vers vous personnellement par e-mail.</p>
        <ButtonLink href="/" variant="secondary" className="mt-8">
          Retour à l&apos;accueil
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-[var(--radius-xl)] border border-line bg-surface p-6 sm:p-8">
      <Honeypot />
      {config && (
        <div className="rounded-[var(--radius-md)] border border-sky/25 bg-sky-soft p-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} className="mt-0.5 size-5 accent-[var(--color-ink)]" />
            <span>
              <span className="block text-ink">Joindre ma configuration</span>
              <span className="mt-1 block text-ink-2">{describeConfig(config)}</span>
              <span className="t-num mt-1 block text-ink">Estimation : {formatPrice(computePrice(config).total)} TTC</span>
            </span>
          </label>
        </div>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField label="Nom complet" name="name" autoComplete="name" required error={err("name")} />
        <TextField label="E-mail" name="email" type="email" autoComplete="email" required error={err("email")} />
        <TextField label="Téléphone" name="phone" type="tel" autoComplete="tel" optional error={err("phone")} />
        <TextField label="Code postal" name="postalCode" autoComplete="postal-code" optional hint="Utile pour la livraison ou la pose." />
      </div>
      <SelectField label="Nombre d'ouvertures à équiper" name="openings" defaultValue="1">
        {["1", "2 à 3", "4 à 6", "7 ou plus"].map((o) => (
          <option key={o}>{o}</option>
        ))}
      </SelectField>
      <TextArea
        label="Votre projet"
        name="message"
        required
        maxLength={3000}
        error={err("message")}
        defaultValue={onlyModel ? `Bonjour, je souhaite un devis pour : ${onlyModel.name}.\n` : ""}
        placeholder="Types d'ouvertures, dimensions approximatives, coloris, besoin de pose…"
      />
      <Checkbox name="consent" error={err("consent")} label="J'accepte qu'Aéris utilise ces informations pour répondre à ma demande. Elles ne sont jamais revendues." />
      {status === "error" && <FormAlert tone="error">{message}</FormAlert>}
      <Button type="submit" size="lg" block arrow disabled={status === "loading"}>
        {status === "loading" ? "Envoi en cours…" : "Envoyer ma demande de devis"}
      </Button>
    </form>
  );
}
