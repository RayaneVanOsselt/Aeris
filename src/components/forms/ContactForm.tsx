"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { track } from "@/lib/analytics";
import { contactSubjects } from "@/lib/form-options";
import { useSubmit } from "@/lib/use-submit";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormAlert, Honeypot, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

export function ContactForm() {
  const { m, locale } = useI18n();
  const c = m.forms.contact;
  const ck = m.checkout;
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const { submit, status, message, fields, reset } = useSubmit("contact");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const err = (k: string) => errors[k] ?? fields[k];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const next: Record<string, string> = {};
    const errs = m.errors;
    if (!get("firstName")) next.firstName = errs.firstName;
    if (!get("lastName")) next.lastName = errs.lastName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) next.email = errs.email;
    if (get("phone") && !/^[+0-9 ().-]{6,30}$/.test(get("phone"))) next.phone = errs.phone;
    if (get("message").length < 10) next.message = errs.messageShort;
    if (!f.get("consent")) next.consent = errs.consent;
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    const res = await submit({
      firstName: get("firstName"),
      lastName: get("lastName"),
      email: get("email"),
      phone: get("phone"),
      subject: get("subject"),
      orderRef: get("orderRef") || undefined,
      message: get("message"),
      consent: true,
      locale,
      website: get("website"),
    });
    if (res.ok) {
      track("contact_form_submitted", { subject: get("subject") });
      form.reset();
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-8 text-center sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" size={26} strokeWidth={2.4} />
        </span>
        <h2 className="t-h3 mt-6 text-ink">{c.sentTitle}</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-2">{c.sentText}</p>
        <Button variant="secondary" className="mt-8" onClick={reset}>
          {c.another}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-[var(--radius-xl)] border border-line bg-surface p-6 sm:p-8">
      <Honeypot />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField label={ck.firstName} name="firstName" autoComplete="given-name" required error={err("firstName")} />
        <TextField label={ck.lastName} name="lastName" autoComplete="family-name" required error={err("lastName")} />
        <TextField label={ck.email} name="email" type="email" autoComplete="email" required error={err("email")} />
        <TextField label={ck.phone} name="phone" type="tel" autoComplete="tel" optional error={err("phone")} />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SelectField label={c.subject} name="subject" defaultValue={ref ? "Suivi de commande" : contactSubjects[0]}>
          {contactSubjects.map((s) => (
            <option key={s} value={s}>
              {c.subjects[s]}
            </option>
          ))}
        </SelectField>
        <TextField label={c.orderRef} name="orderRef" optional defaultValue={ref} placeholder="AER-…" />
      </div>
      <TextArea label={c.message} name="message" required maxLength={3000} error={err("message")} placeholder={c.messagePlaceholder} />
      <Checkbox name="consent" error={err("consent")} label={c.consent} />
      {status === "error" && <FormAlert tone="error">{message}</FormAlert>}
      <Button type="submit" size="lg" block arrow disabled={status === "loading"}>
        {status === "loading" ? m.common.sendingLong : c.submit}
      </Button>
    </form>
  );
}
