"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/provider";
import { Rich } from "@/i18n/rich";
import { payment, type PaymentMethod } from "@/lib/business";
import { cart, useCart } from "@/lib/cart-store";
import { getProduct } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { describeConfig, describeLine } from "@/lib/order";
import { countries } from "@/lib/form-options";
import { localOrders } from "@/lib/orders-store";
import { computePrice } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { useHydrated } from "@/lib/use-hydrated";
import { useSubmit } from "@/lib/use-submit";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, FormAlert, Honeypot, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";

type OrderResponse = { reference: string; total: number };

export function CheckoutForm() {
  const { m, href, f, t, locale } = useI18n();
  const c = m.checkout;
  const items = useCart();
  const hydrated = useHydrated();
  const router = useRouter();
  const { submit, status, message, fields } = useSubmit<OrderResponse>("order");
  const [method, setMethod] = useState<PaymentMethod>("Revolut");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const total = items.reduce((s, i) => s + safeTotal(i.config), 0);

  useEffect(() => {
    if (items.length) track("begin_checkout", { value: total, items: items.length });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hydrated) return <div className="skeleton h-[640px] rounded-[var(--radius-xl)]" aria-label={m.common.loading} />;

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-line-strong px-6 py-16 text-center">
        <h2 className="t-h3 text-ink">{m.cart.emptyTitle}</h2>
        <p className="mt-2 text-ink-2">{c.emptyText}</p>
        <ButtonLink href={href("configurator")} arrow className="mt-8">
          {m.common.configureScreen}
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
    const err = m.errors;
    if (!get("firstName")) errors.firstName = err.firstName;
    if (!get("lastName")) errors.lastName = err.lastName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email"))) errors.email = err.email;
    if (!/^[+0-9 ().-]{6,30}$/.test(get("phone"))) errors.phone = err.phone;
    if (!get("street")) errors.street = err.street;
    if (!/^[A-Za-z0-9 -]{3,12}$/.test(get("postalCode"))) errors.postalCode = err.postalCode;
    if (!get("city")) errors.city = err.city;
    if (!form.get("acceptTerms")) errors.acceptTerms = err.terms;
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
      locale,
      website: get("website"),
    });
    if (!res.ok) return;
    const { reference, total: confirmedTotal } = res.data;
    // Récapitulatif enregistré dans la langue du client (les prix sont recalculés à partir du catalogue)
    const summary = items.map((i) => describeLine(i.config, m, f));
    localOrders.add({ reference, total: confirmedTotal, summary, paymentMethod: method, createdAt: new Date().toISOString(), status: "pending" });
    track("purchase", { value: confirmedTotal, payment: method });
    cart.clear();
    router.push(`${href("confirmation")}?ref=${reference}`);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-7">
        <Honeypot />
        <fieldset>
          <legend className="t-h3 mb-6 flex items-center gap-3 text-ink">
            <span className="t-num flex size-8 items-center justify-center rounded-full bg-ink text-sm text-paper">1</span>
            {c.contactLegend}
          </legend>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField label={c.firstName} name="firstName" autoComplete="given-name" required error={errorFor("firstName")} />
            <TextField label={c.lastName} name="lastName" autoComplete="family-name" required error={errorFor("lastName")} />
            <TextField label={c.email} name="email" type="email" autoComplete="email" required error={errorFor("email")} hint={c.emailHint} />
            <TextField label={c.phone} name="phone" type="tel" autoComplete="tel" required error={errorFor("phone")} hint={c.phoneHint} />
          </div>
        </fieldset>

        <fieldset>
          <legend className="t-h3 mb-6 flex items-center gap-3 text-ink">
            <span className="t-num flex size-8 items-center justify-center rounded-full bg-ink text-sm text-paper">2</span>
            {c.deliveryLegend}
          </legend>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-6">
            <TextField label={c.street} name="street" autoComplete="street-address" required error={errorFor("street")} className="sm:col-span-6" />
            <TextField label={c.postalCode} name="postalCode" autoComplete="postal-code" required error={errorFor("postalCode")} className="sm:col-span-2" />
            <TextField label={c.city} name="city" autoComplete="address-level2" required error={errorFor("city")} className="sm:col-span-4" />
            <SelectField label={c.country} name="country" defaultValue="Belgique" className="sm:col-span-6">
              {countries.map((country) => (
                <option key={country} value={country}>
                  {c.countries[country]}
                </option>
              ))}
            </SelectField>
            <TextArea label={c.notes} name="notes" optional maxLength={1000} placeholder={c.notesPlaceholder} className="sm:col-span-6" />
          </div>
        </fieldset>

        <fieldset>
          <legend className="t-h3 mb-2 flex items-center gap-3 text-ink">
            <span className="t-num flex size-8 items-center justify-center rounded-full bg-ink text-sm text-paper">3</span>
            {c.paymentLegend}
          </legend>
          <p className="mb-6 text-ink-2">{c.paymentIntro}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {payment.methods.map((pm) => (
              <label
                key={pm}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-[var(--radius-lg)] border bg-surface p-5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky",
                  method === pm ? "border-ink" : "border-line hover:border-ink-3",
                )}
              >
                <input type="radio" name="paymentMethod" value={pm} checked={method === pm} onChange={() => setMethod(pm)} className="sr-only" />
                <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border", method === pm ? "border-[6px] border-ink" : "border-line-strong")} />
                <span>
                  <span className="block text-ink">{m.payment.methods[pm]}</span>
                  <span className="t-small mt-1 block text-ink-3">{c.methodHints[pm]}</span>
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
              <Rich
                text={c.terms}
                link={(label) => (
                  <Link href={href("terms")} target="_blank" className="text-ink underline underline-offset-2">
                    {label}
                  </Link>
                )}
              />
            }
          />
          <p className="t-small pl-8 text-ink-3">
            <Rich
              text={c.privacy}
              link={(label) => (
                <Link href={href("privacy")} className="underline underline-offset-2">
                  {label}
                </Link>
              )}
            />
          </p>
          {status === "error" && <FormAlert tone="error">{message}</FormAlert>}
          <Button type="submit" size="lg" block arrow disabled={status === "loading"} className="lg:hidden">
            {status === "loading" ? m.common.sendingLong : t(c.confirmWithTotal, { total: f.price(total) })}
          </Button>
        </div>
      </div>

      <aside className="lg:col-span-5" aria-label={c.yourOrder}>
        <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <h2 className="t-h4 text-ink">{c.yourOrder}</h2>
          <ul className="mt-5 divide-y divide-line">
            {items.map((i) => {
              const product = getProduct(i.config.productId);
              return (
                <li key={i.id} className="flex gap-4 py-4">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-[10px] bg-paper-2">
                    {product && <ProductVisual kind={product.visual} width={i.config.width} height={i.config.height} className="h-11 w-11" title={m.catalog.products[product.id].name} />}
                  </span>
                  <span className="t-small min-w-0 flex-1 text-ink-2">{describeConfig(i.config, m, f)}</span>
                  <span className="t-num shrink-0 text-ink">{f.price(safeTotal(i.config))}</span>
                </li>
              );
            })}
          </ul>
          <dl className="space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between gap-6 text-ink-2">
              <dt>{m.cart.delivery}</dt>
              <dd className="text-right">{m.shipping.label}</dd>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <dt className="text-ink">{m.common.totalInclTax}</dt>
              <dd className="t-num text-3xl font-light text-ink">{f.price(total)}</dd>
            </div>
          </dl>
          {status === "error" && (
            <div className="mt-4 hidden lg:block">
              <FormAlert tone="error">{message}</FormAlert>
            </div>
          )}
          <Button type="submit" size="lg" block arrow disabled={status === "loading"} className="mt-6 max-lg:hidden">
            {status === "loading" ? m.common.sendingLong : c.confirm}
          </Button>
          <ul className="mt-5 space-y-2 text-sm text-ink-2">
            <li className="flex gap-2">
              <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-sky" />
              {c.noBankData}
            </li>
            <li className="flex gap-2">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-sky" />
              {m.shipping.detail}
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
