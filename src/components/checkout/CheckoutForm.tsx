"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getProduct } from "@/lib/catalog";
import { cart, useCart } from "@/lib/cart-store";
import { payment, shipping } from "@/lib/business";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { describeConfig } from "@/lib/order";
import { localOrders } from "@/lib/orders-store";
import { computePrice } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { useHydrated } from "@/lib/use-hydrated";
import { useSubmit } from "@/lib/use-submit";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, FormAlert, Honeypot, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

const countries = ["Belgique", "France", "Luxembourg", "Pays-Bas", "Allemagne", "Autre pays de l'UE"] as const;
type Method = (typeof payment.methods)[number];

type OrderResponse = { reference: string; total: number; summary: string[] };

export function CheckoutForm() {
  const items = useCart();
  const hydrated = useHydrated();
  const router = useRouter();
  const { submit, status, message, fields } = useSubmit<OrderResponse>("order");
  const [method, setMethod] = useState<Method>("Revolut");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const total = items.reduce((s, i) => s + safeTotal(i.config), 0);

  useEffect(() => {
    if (items.length) track("begin_checkout", { value: total, items: items.length });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hydrated) return <div className="skeleton h-[640px] rounded-[var(--radius-xl)]" aria-label="Chargement" />;

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-line-strong px-6 py-16 text-center">
        <h2 className="t-h3 text-ink">Votre panier est vide</h2>
        <p className="mt-2 text-ink-2">Ajoutez une moustiquaire avant de passer commande.</p>
        <ButtonLink href="/configurateur" arrow className="mt-8">
          Configurer une moustiquaire
        </ButtonLink>
      </div>
    );
  }

  const errorFor = (name: string) => localErrors[name] ?? fields[`customer.${name}`] ?? fields[name];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    const errors: Record<string, string> = {};
    if (!get("firstName")) errors.firstName = "Prénom requis";
    if (!get("lastName")) errors.lastName = "Nom requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) errors.email = "Adresse e-mail invalide";
    if (!/^[+0-9 ().-]{6,30}$/.test(get("phone"))) errors.phone = "Numéro de téléphone invalide";
    if (!get("street")) errors.street = "Adresse requise";
    if (!/^[A-Za-z0-9 -]{3,12}$/.test(get("postalCode"))) errors.postalCode = "Code postal invalide";
    if (!get("city")) errors.city = "Ville requise";
    if (!form.get("acceptTerms")) errors.acceptTerms = "Veuillez accepter les conditions générales de vente";
    setLocalErrors(errors);
    if (Object.keys(errors).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(errors)[0]}"]`)?.focus();
      return;
    }

    const res = await submit({
      customer: {
        firstName: get("firstName"),
        lastName: get("lastName"),
        email: get("email"),
        phone: get("phone"),
        street: get("street"),
        postalCode: get("postalCode"),
        city: get("city"),
        country: get("country"),
        notes: get("notes") || undefined,
      },
      items: items.map((i) => i.config),
      paymentMethod: method,
      acceptTerms: true,
      website: get("website"),
    });
    if (!res.ok) return;
    const { reference, total: confirmedTotal, summary } = res.data;
    localOrders.add({ reference, total: confirmedTotal, summary, paymentMethod: method, createdAt: new Date().toISOString(), status: "pending" });
    track("purchase", { value: confirmedTotal, payment: method });
    cart.clear();
    router.push(`/commande/confirmation?ref=${reference}`);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-7">
        <Honeypot />
        <fieldset>
          <legend className="t-h3 mb-6 flex items-center gap-3 text-ink">
            <span className="t-num flex size-8 items-center justify-center rounded-full bg-ink text-sm text-paper">1</span>
            Vos coordonnées
          </legend>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField label="Prénom" name="firstName" autoComplete="given-name" required error={errorFor("firstName")} />
            <TextField label="Nom" name="lastName" autoComplete="family-name" required error={errorFor("lastName")} />
            <TextField label="E-mail" name="email" type="email" autoComplete="email" required error={errorFor("email")} hint="Pour la confirmation et les instructions de paiement." />
            <TextField label="Téléphone" name="phone" type="tel" autoComplete="tel" required error={errorFor("phone")} hint="Utile si une mesure doit être vérifiée." />
          </div>
        </fieldset>

        <fieldset>
          <legend className="t-h3 mb-6 flex items-center gap-3 text-ink">
            <span className="t-num flex size-8 items-center justify-center rounded-full bg-ink text-sm text-paper">2</span>
            Livraison
          </legend>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-6">
            <TextField label="Rue et numéro" name="street" autoComplete="street-address" required error={errorFor("street")} className="sm:col-span-6" />
            <TextField label="Code postal" name="postalCode" autoComplete="postal-code" required error={errorFor("postalCode")} className="sm:col-span-2" />
            <TextField label="Ville" name="city" autoComplete="address-level2" required error={errorFor("city")} className="sm:col-span-4" />
            <SelectField label="Pays" name="country" defaultValue="Belgique" autoComplete="country-name" className="sm:col-span-6">
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectField>
            <TextArea label="Remarques" name="notes" optional maxLength={1000} placeholder="Accès, étage, précisions sur une mesure…" className="sm:col-span-6" />
          </div>
        </fieldset>

        <fieldset>
          <legend className="t-h3 mb-2 flex items-center gap-3 text-ink">
            <span className="t-num flex size-8 items-center justify-center rounded-full bg-ink text-sm text-paper">3</span>
            Paiement
          </legend>
          <p className="mb-6 text-ink-2">Vous recevez les instructions juste après la commande. La fabrication démarre à réception du paiement.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {payment.methods.map((m) => (
              <label
                key={m}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-[var(--radius-lg)] border bg-surface p-5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky",
                  method === m ? "border-ink" : "border-line hover:border-ink-3",
                )}
              >
                <input type="radio" name="paymentMethod" value={m} checked={method === m} onChange={() => setMethod(m)} className="sr-only" />
                <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border", method === m ? "border-[6px] border-ink" : "border-line-strong")} />
                <span>
                  <span className="block text-ink">{m}</span>
                  <span className="t-small mt-1 block text-ink-3">
                    {m === "Revolut" ? "Lien de paiement Revolut, réception immédiate." : "Depuis n'importe quelle banque, avec votre référence."}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="space-y-4 border-t border-line pt-8">
          <Checkbox
            name="acceptTerms"
            error={errorFor("acceptTerms")}
            label={
              <>
                J&apos;accepte les{" "}
                <Link href="/conditions-generales-de-vente" target="_blank" className="text-ink underline underline-offset-2">
                  conditions générales de vente
                </Link>{" "}
                et je comprends qu&apos;un produit fabriqué sur mesure n&apos;est pas soumis au droit de rétractation standard.
              </>
            }
          />
          <p className="t-small pl-8 text-ink-3">
            Vos données servent uniquement à traiter votre commande.{" "}
            <Link href="/politique-de-confidentialite" className="underline underline-offset-2">
              Politique de confidentialité
            </Link>
            .
          </p>
          {status === "error" && <FormAlert tone="error">{message}</FormAlert>}
          <Button type="submit" size="lg" block arrow disabled={status === "loading"} className="lg:hidden">
            {status === "loading" ? "Envoi en cours…" : `Confirmer la commande · ${formatPrice(total)}`}
          </Button>
        </div>
      </div>

      <aside className="lg:col-span-5" aria-label="Votre commande">
        <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <h2 className="t-h4 text-ink">Votre commande</h2>
          <ul className="mt-5 divide-y divide-line">
            {items.map((i) => {
              const product = getProduct(i.config.productId);
              return (
                <li key={i.id} className="flex gap-4 py-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-[10px] bg-paper-2">
                    {product && <ProductVisual kind={product.visual} width={i.config.width} height={i.config.height} className="h-11 w-11" title={product.name} />}
                  </span>
                  <span className="t-small min-w-0 flex-1 text-ink-2">{describeConfig(i.config)}</span>
                  <span className="t-num shrink-0 text-ink">{formatPrice(safeTotal(i.config))}</span>
                </li>
              );
            })}
          </ul>
          <dl className="space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between gap-6 text-ink-2">
              <dt>Livraison</dt>
              <dd className="text-right">{shipping.label}</dd>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <dt className="text-ink">Total TTC</dt>
              <dd className="t-num text-3xl font-light text-ink">{formatPrice(total)}</dd>
            </div>
          </dl>
          {status === "error" && (
            <div className="mt-4 hidden lg:block">
              <FormAlert tone="error">{message}</FormAlert>
            </div>
          )}
          <Button type="submit" size="lg" block arrow disabled={status === "loading"} className="mt-6 max-lg:hidden">
            {status === "loading" ? "Envoi en cours…" : "Confirmer la commande"}
          </Button>
          <ul className="mt-5 space-y-2 text-sm text-ink-2">
            <li className="flex gap-2">
              <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-sky" />
              Aucune donnée bancaire demandée sur ce site
            </li>
            <li className="flex gap-2">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-sky" />
              {shipping.detail}
            </li>
          </ul>
        </div>
      </aside>
    </form>
  );
}

function safeTotal(config: Parameters<typeof computePrice>[0]) {
  try {
    return computePrice(config).total;
  } catch {
    return 0;
  }
}
