"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { useSubmit } from "@/lib/use-submit";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormAlert, Honeypot, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

const subjects = ["Question sur un produit", "Aide pour mes mesures", "Suivi de commande", "Service après-vente", "Autre"] as const;

export function ContactForm() {
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
    if (!get("firstName")) next.firstName = "Prénom requis";
    if (!get("lastName")) next.lastName = "Nom requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) next.email = "Adresse e-mail invalide";
    if (get("phone") && !/^[+0-9 ().-]{6,30}$/.test(get("phone"))) next.phone = "Numéro de téléphone invalide";
    if (get("message").length < 10) next.message = "Message trop court (10 caractères minimum)";
    if (!f.get("consent")) next.consent = "Votre accord est nécessaire pour que nous puissions vous répondre";
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
        <h2 className="t-h3 mt-6 text-ink">Message envoyé</h2>
        <p className="mx-auto mt-3 max-w-md text-ink-2">Merci, nous vous répondons personnellement par e-mail.</p>
        <Button variant="secondary" className="mt-8" onClick={reset}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-[var(--radius-xl)] border border-line bg-surface p-6 sm:p-8">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Prénom" name="firstName" autoComplete="given-name" required error={err("firstName")} />
        <TextField label="Nom" name="lastName" autoComplete="family-name" required error={err("lastName")} />
        <TextField label="E-mail" name="email" type="email" autoComplete="email" required error={err("email")} />
        <TextField label="Téléphone" name="phone" type="tel" autoComplete="tel" optional error={err("phone")} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Sujet" name="subject" defaultValue={ref ? "Suivi de commande" : subjects[0]}>
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </SelectField>
        <TextField label="Référence de commande" name="orderRef" optional defaultValue={ref} placeholder="AER-…" />
      </div>
      <TextArea label="Message" name="message" required maxLength={3000} error={err("message")} placeholder="Votre question, vos dimensions, une photo à décrire…" />
      <Checkbox name="consent" error={err("consent")} label="J'accepte qu'Aéris utilise ces informations pour répondre à mon message." />
      {status === "error" && <FormAlert tone="error">{message}</FormAlert>}
      <Button type="submit" size="lg" block arrow disabled={status === "loading"}>
        {status === "loading" ? "Envoi en cours…" : "Envoyer le message"}
      </Button>
    </form>
  );
}
