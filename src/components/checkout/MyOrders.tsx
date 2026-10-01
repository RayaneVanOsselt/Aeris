"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { useLocalOrders } from "@/lib/orders-store";
import { useHydrated } from "@/lib/use-hydrated";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function MyOrders() {
  const { m, href, f } = useI18n();
  const ord = m.orders;
  const orders = useLocalOrders();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="skeleton h-60 rounded-[var(--radius-xl)]" />;
  if (orders.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-line-strong px-6 py-16 text-center">
        <p className="t-h4 text-ink">{ord.emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-ink-2">{ord.emptyText}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={href("contact")} variant="secondary">
            {m.common.contactUs}
          </ButtonLink>
          <ButtonLink href={href("configurator")} arrow>
            {m.common.configureScreen}
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
              {f.date(o.createdAt)} · {f.plural(o.summary.length, m.common.items)}
            </p>
          </div>
          <span className={`t-caption w-fit rounded-full px-3 py-1 ${o.status === "notified" ? "bg-sky-soft text-sky" : "bg-warning-soft text-warning"}`}>
            {o.status === "notified" ? ord.notified : ord.pending}
          </span>
          <p className="t-num w-24 text-ink sm:text-right">{f.price(o.total)}</p>
          <Link href={`${href("confirmation")}?ref=${o.reference}`} className="inline-flex items-center gap-1.5 text-sm text-ink underline-offset-4 hover:underline">
            {o.status === "pending" ? ord.pay : ord.details} <Icon name="arrowRight" size={15} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
