"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { getProduct } from "@/lib/catalog";
import { parseParams, toConfiguration } from "@/lib/configurator";
import { openingCounts } from "@/lib/form-options";
import { describeConfig } from "@/lib/order";
import { computePrice } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { useSubmit } from "@/lib/use-submit";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, FormAlert, Honeypot, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

export function QuoteForm() {
  const { m, href, f, t, locale } = useI18n();
  const q = m.forms.quote;
  const params = useSearchParams();
  const config = toConfiguration(parseParams(params));
  const onlyModel = !config ? getProduct(params.get("modele") ?? "") : undefined;
  const [attach, setAttach] = useState(true);
  const { submit, status, message, fields } = useSubmit("quote");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const err = (k: string) => errors[k] ?? fields[k];

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const next: Record<string, string> = {};
    const errs = m.errors;
    if (!get("name")) next.name = errs.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) next.email = errs.email;
    if (get("phone") && !/^[+0-9 ().-]{6,30}$/.test(get("phone"))) next.phone = errs.phone;
    if (get("message").length < 10) next.message = errs.projectShort;
    if (!data.get("consent")) next.consent = errs.consent;
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
      locale,
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
        <h2 className="t-h3 mt-6 text-ink">{q.sentTitle}</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-2">{q.sentText}</p>
        <ButtonLink href={href("home")} variant="secondary" className="mt-8">
          {m.common.backHome}
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
              <span className="block text-ink">{q.attach}</span>
              <span className="mt-1 block text-ink-2">{describeConfig(config, m, f)}</span>
              <span className="t-num mt-1 block text-ink">{t(q.estimate, { price: f.price(computePrice(config).total) })}</span>
            </span>
          </label>
        </div>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField label={q.fullName} name="name" autoComplete="name" required error={err("name")} />
        <TextField label={m.checkout.email} name="email" type="email" autoComplete="email" required error={err("email")} />
        <TextField label={m.checkout.phone} name="phone" type="tel" autoComplete="tel" optional error={err("phone")} />
        <TextField label={m.checkout.postalCode} name="postalCode" autoComplete="postal-code" optional hint={q.postalHint} />
      </div>
      <SelectField label={q.openings} name="openings" defaultValue="1">
        {openingCounts.map((o) => (
          <option key={o} value={o}>
            {q.openingChoices[o]}
          </option>
        ))}
      </SelectField>
      <TextArea
        label={q.project}
        name="message"
        required
        maxLength={3000}
        error={err("message")}
        defaultValue={onlyModel ? t(q.prefill, { name: m.catalog.products[onlyModel.id].name }) : ""}
        placeholder={q.projectPlaceholder}
      />
      <Checkbox name="consent" error={err("consent")} label={q.consent} />
      {status === "error" && <FormAlert tone="error">{message}</FormAlert>}
      <Button type="submit" size="lg" block arrow disabled={status === "loading"}>
        {status === "loading" ? m.common.sendingLong : q.submit}
      </Button>
    </form>
  );
}
