"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { payment } from "@/lib/business";
import { formatPrice } from "@/lib/format";
import { localOrders, useLocalOrders } from "@/lib/orders-store";
import { useHydrated } from "@/lib/use-hydrated";
import { useSubmit } from "@/lib/use-submit";
import { Button, ButtonLink } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { CopyField } from "./CopyField";

export function OrderConfirmation() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const orders = useLocalOrders();
  const hydrated = useHydrated();
  const order = orders.find((o) => o.reference === ref);
  const { submit, status, message } = useSubmit("payment-notice");
  const [method, setMethod] = useState<(typeof payment.methods)[number] | null>(null);
  const chosen = method ?? (order?.paymentMethod as (typeof payment.methods)[number] | undefined) ?? "Revolut";

  if (!hydrated) return <div className="skeleton h-96 rounded-[var(--radius-xl)]" aria-label="Chargement" />;

  if (!order) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-line-strong px-6 py-16 text-center">
        <h1 className="t-h3 text-ink">Commande introuvable sur cet appareil</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-2">
          Les instructions de paiement vous ont aussi été envoyées par e-mail. Pour toute question, contactez-nous avec votre référence.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/mes-commandes" variant="secondary">
            Mes commandes sur cet appareil
          </ButtonLink>
          <ButtonLink href="/contact" arrow>
            Nous contacter
          </ButtonLink>
        </div>
      </div>
    );
  }

  const amount = formatPrice(order.total);
  const notify = async () => {
    const res = await submit({ reference: order.reference, method: chosen });
    if (res.ok) localOrders.markNotified(order.reference);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full bg-success text-white">
            <Icon name="check" size={24} strokeWidth={2.4} />
          </span>
          <p className="t-caption text-success">Commande enregistrée</p>
        </div>
        <h1 className="t-h1 mt-6 text-ink">Merci&nbsp;! Dernière étape&nbsp;: le paiement.</h1>
        <p className="t-lead mt-5 text-ink-2">
          Votre référence est <strong className="t-num font-medium text-ink">{order.reference}</strong>. La fabrication démarre dès réception de votre paiement.
        </p>

        <div className="mt-10 rounded-[var(--radius-xl)] border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-6">
            <p className="text-ink-2">Montant à régler</p>
            <p className="t-num text-4xl font-light text-ink">{amount}</p>
          </div>

          <div role="tablist" aria-label="Moyen de paiement" className="mt-6 inline-flex rounded-full border border-line bg-paper p-1">
            {payment.methods.map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={chosen === m}
                onClick={() => setMethod(m)}
                className={`h-10 rounded-full px-5 text-sm transition-colors ${chosen === m ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
              >
                {m}
              </button>
            ))}
          </div>

          {chosen === "Revolut" ? (
            <div className="mt-6 space-y-3" role="tabpanel">
              <p className="text-ink-2">Ouvrez le lien, indiquez le montant et votre référence en note.</p>
              <CopyField label="Montant" value={amount} copyValue={String(order.total)} />
              <CopyField label="Note / communication" value={order.reference} />
              <ButtonLink href={payment.revolut.url} target="_blank" rel="noopener noreferrer" size="lg" block arrow className="mt-2">
                Payer avec Revolut
              </ButtonLink>
            </div>
          ) : (
            <div className="mt-6 space-y-3" role="tabpanel">
              <p className="text-ink-2">Depuis votre banque, effectuez un virement SEPA avec ces informations.</p>
              <CopyField label="Bénéficiaire" value={payment.bankTransfer.beneficiary} mono={false} />
              <CopyField label="IBAN" value={payment.bankTransfer.iban} copyValue={payment.bankTransfer.iban.replace(/\s/g, "")} />
              <CopyField label="Montant" value={amount} copyValue={String(order.total)} />
              <CopyField label="Communication" value={order.reference} />
            </div>
          )}

          <div className="mt-8 border-t border-line pt-6">
            {order.status === "notified" || status === "success" ? (
              <FormAlert tone="success">Merci, nous vérifions la réception de votre paiement et vous confirmons la mise en fabrication par e-mail.</FormAlert>
            ) : (
              <>
                {status === "error" && (
                  <div className="mb-4">
                    <FormAlert tone="error">{message}</FormAlert>
                  </div>
                )}
                <Button variant="secondary" size="lg" block onClick={notify} disabled={status === "loading"}>
                  {status === "loading" ? "Envoi…" : "J'ai effectué le paiement"}
                </Button>
                <p className="t-small mt-3 text-center text-ink-3">Facultatif : cela nous aide à repérer votre paiement plus vite.</p>
              </>
            )}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-[var(--radius-xl)] bg-night p-6 text-on-night sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <h2 className="t-h4">La suite</h2>
          <ol className="mt-6 space-y-6">
            {[
              ["Paiement", "Revolut ou virement, avec votre référence."],
              ["Confirmation", "Nous vous confirmons la réception et la date de livraison par e-mail."],
              ["Fabrication", "Votre moustiquaire est fabriquée à vos dimensions."],
              ["Livraison", "Elle arrive chez vous avec sa notice de pose."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="t-num flex size-7 shrink-0 items-center justify-center rounded-full border border-line-night text-xs">{i + 1}</span>
                <span>
                  <span className="block">{t}</span>
                  <span className="t-small text-on-night-2">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8 border-t border-line-night pt-6">
            <p className="t-caption text-on-night-2">Récapitulatif</p>
            <ul className="t-small mt-3 space-y-2 text-on-night-2">
              {order.summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <p className="t-small mt-6 text-on-night-2">
            Une question ?{" "}
            <Link href={`/contact?ref=${order.reference}`} className="text-on-night underline underline-offset-2">
              Contactez-nous
            </Link>{" "}
            avec votre référence.
          </p>
        </div>
      </aside>
    </div>
  );
}
