"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useLocalOrders } from "@/lib/orders-store";
import { useHydrated } from "@/lib/use-hydrated";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function MyOrders() {
  const orders = useLocalOrders();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="skeleton h-60 rounded-[var(--radius-xl)]" />;
  if (orders.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-line-strong px-6 py-16 text-center">
        <p className="t-h4 text-ink">Aucune commande sur cet appareil</p>
        <p className="mx-auto mt-2 max-w-md text-ink-2">
          Vous avez commandé depuis un autre appareil ? Retrouvez vos instructions dans l&apos;e-mail de confirmation, ou contactez-nous avec votre référence.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/contact" variant="secondary">
            Nous contacter
          </ButtonLink>
          <ButtonLink href="/configurateur" arrow>
            Configurer une moustiquaire
          </ButtonLink>
        </div>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-line border-y border-line">
      {orders.map((o) => (
        <li key={o.reference} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="t-num text-ink">{o.reference}</p>
            <p className="t-small text-ink-3">
              {new Date(o.createdAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })} · {o.summary.length} article{o.summary.length > 1 ? "s" : ""}
            </p>
          </div>
          <span className={`t-caption w-fit rounded-full px-3 py-1 ${o.status === "notified" ? "bg-sky-soft text-sky" : "bg-warning-soft text-warning"}`}>
            {o.status === "notified" ? "Paiement signalé" : "En attente de paiement"}
          </span>
          <p className="t-num w-24 text-ink sm:text-right">{formatPrice(o.total)}</p>
          <Link href={`/commande/confirmation?ref=${o.reference}`} className="inline-flex items-center gap-1.5 text-sm text-ink underline-offset-4 hover:underline">
            {o.status === "pending" ? "Payer" : "Détails"} <Icon name="arrowRight" size={15} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
