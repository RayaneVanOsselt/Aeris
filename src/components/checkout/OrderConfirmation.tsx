"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { Rich } from "@/i18n/rich";
import { payment, type PaymentMethod } from "@/lib/business";
import { localOrders, useLocalOrders } from "@/lib/orders-store";
import { useHydrated } from "@/lib/use-hydrated";
import { useSubmit } from "@/lib/use-submit";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { CopyField } from "./CopyField";

export function OrderConfirmation() {
  const { m, href, f, t, locale } = useI18n();
  const c = m.confirmation;
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const orders = useLocalOrders();
  const hydrated = useHydrated();
  const order = orders.find((o) => o.reference === ref);
  const { submit, status, message } = useSubmit("payment-notice");
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const chosen = method ?? (order?.paymentMethod as PaymentMethod | undefined) ?? "Revolut";
  const methodsLabel = f.list(
    payment.methods.map((x) => m.payment.methods[x]),
    "disjunction",
  );

  if (!hydrated) return <div className="skeleton h-96 rounded-[var(--radius-xl)]" aria-label={m.common.loading} />;

  if (!order) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-line-strong px-6 py-16 text-center">
        <h1 className="t-h3 text-ink">{c.notFoundTitle}</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-2">{c.notFoundText}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={href("orders")} variant="secondary">
            {c.ordersOnDevice}
          </ButtonLink>
          <ButtonLink href={href("contact")} arrow>
            {m.common.contactUs}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const amount = f.price(order.total);
  const notify = async () => {
    const res = await submit({ reference: order.reference, method: chosen, locale });
    if (res.ok) localOrders.markNotified(order.reference);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full bg-success text-white">
            <Icon name="check" size={24} strokeWidth={2.4} />
          </span>
          <p className="t-caption text-success">{c.recorded}</p>
        </div>
        <h1 className="t-h1 mt-6 text-ink">{c.title}</h1>
        <p className="t-lead mt-5 text-ink-2">
          <Rich text={t(c.reference, { reference: order.reference })} strongClassName="t-num font-medium text-ink" />
        </p>

        <div className="mt-10 rounded-[var(--radius-xl)] border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-6">
            <p className="text-ink-2">{c.amountDue}</p>
            <p className="t-num text-4xl font-light text-ink">{amount}</p>
          </div>

          <div role="tablist" aria-label={c.method} className="mt-6 inline-flex rounded-full border border-line bg-paper p-1">
            {payment.methods.map((pm) => (
              <button
                key={pm}
                role="tab"
                aria-selected={chosen === pm}
                onClick={() => setMethod(pm)}
                className={`h-10 rounded-full px-5 text-sm transition-colors ${chosen === pm ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
              >
                {m.payment.methods[pm]}
              </button>
            ))}
          </div>

          {chosen === "Revolut" ? (
            <div className="mt-6 space-y-3" role="tabpanel">
              <p className="text-ink-2">{c.revolutIntro}</p>
              <CopyField label={c.amount} value={amount} copyValue={String(order.total)} />
              <CopyField label={c.note} value={order.reference} />
              <ButtonLink href={payment.revolut.url} target="_blank" rel="noopener noreferrer" size="lg" block arrow className="mt-2">
                {c.payRevolut}
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-6 space-y-3" role="tabpanel">
              <p className="text-ink-2">{c.transferIntro}</p>
              <CopyField label={c.beneficiary} value={payment.bankTransfer.beneficiary} mono={false} />
              <CopyField label={c.iban} value={payment.bankTransfer.iban} copyValue={payment.bankTransfer.iban.replace(/\s/g, "")} />
              <CopyField label={c.amount} value={amount} copyValue={String(order.total)} />
              <CopyField label={c.communication} value={order.reference} />
            </div>
          )}

          <div className="mt-8 border-t border-line pt-6">
            {order.status === "notified" || status === "success" ? (
              <FormAlert tone="success">{c.notified}</FormAlert>
            ) : (
              <>
                {status === "error" && (
                  <div className="mb-4">
                    <FormAlert tone="error">{message}</FormAlert>
                  </div>
                )}
                <Button variant="secondary" size="lg" block onClick={notify} disabled={status === "loading"}>
                  {status === "loading" ? m.common.sending : c.iPaid}
                </Button>
                <p className="t-small mt-3 text-center text-ink-3">{c.iPaidHint}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-[var(--radius-xl)] bg-night p-6 text-on-night sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <h2 className="t-h4">{c.nextTitle}</h2>
          <ol className="mt-6 space-y-6">
            {c.next.map(({ title, text }, i) => (
              <li key={title} className="flex gap-4">
                <span className="t-num flex size-7 shrink-0 items-center justify-center rounded-full border border-line-night text-xs">{i + 1}</span>
                <span>
                  <span className="block">{title}</span>
                  <span className="t-small text-on-night-2">{t(text, { methods: methodsLabel })}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8 border-t border-line-night pt-6">
            <p className="t-caption text-on-night-2">{c.summary}</p>
            <ul className="t-small mt-3 space-y-2 text-on-night-2">
              {order.summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <p className="t-small mt-6 text-on-night-2">
            <Rich
              text={c.question}
              link={(label) => (
                <Link href={`${href("contact")}?ref=${order.reference}`} className="text-on-night underline underline-offset-2">
                  {label}
                </Link>
              )}
            />
          </p>
        </div>
      </aside>
    </div>
  );
}
