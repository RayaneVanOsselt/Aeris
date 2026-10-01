"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { getColor, getMesh, getProduct } from "@/lib/catalog";
import type { CartItem } from "@/lib/cart-store";
import { useCart } from "@/lib/cart-store";
import { computePrice } from "@/lib/pricing";
import { ProductVisual } from "@/components/product/ProductVisual";
import { ButtonLink, IconButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Tiroir de confirmation après ajout : rassure et propose la suite logique (commander ou continuer). */
export function CartDrawer() {
  const { m, href, f, t } = useI18n();
  const [item, setItem] = useState<CartItem | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const items = useCart();
  const subtotal = items.reduce((s, i) => s + safeTotal(i), 0);

  useEffect(() => {
    const onAdd = (e: Event) => setItem((e as CustomEvent<CartItem>).detail);
    window.addEventListener("aeris:cart-added", onAdd);
    return () => window.removeEventListener("aeris:cart-added", onAdd);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  const product = item ? getProduct(item.config.productId) : undefined;
  const color = item ? getColor(item.config.colorId) : undefined;
  const mesh = item ? getMesh(item.config.meshId) : undefined;

  return (
    <dialog
      ref={ref}
      onClose={() => setItem(null)}
      onClick={(e) => e.target === ref.current && setItem(null)}
      aria-label={m.drawer.label}
      className="sheet ml-auto h-dvh w-full max-w-md bg-paper! open:animate-[fade-up_var(--dur-slow)_var(--ease-out)] sm:rounded-l-[var(--radius-xl)]"
    >
      {item && product && color && mesh && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <p className="flex items-center gap-2.5 text-ink">
              <span className="flex size-7 items-center justify-center rounded-full bg-success text-white">
                <Icon name="check" size={15} strokeWidth={2.6} />
              </span>
              {m.drawer.added}
            </p>
            <IconButton icon="close" label={m.common.close} onClick={() => setItem(null)} />
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex gap-4">
              <span className="flex size-24 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-paper-2">
                <ProductVisual kind={product.visual} color={color.hex} width={item.config.width} height={item.config.height} className="h-20 w-20" title={m.catalog.products[product.id].name} />
              </span>
              <div className="min-w-0">
                <p className="text-ink">{m.catalog.products[product.id].name}</p>
                <p className="t-num t-small mt-1 text-ink-3">
                  {f.mm(item.config.width)} × {f.mm(item.config.height)}
                </p>
                <p className="t-small text-ink-3">
                  {m.catalog.meshes[mesh.id].name} · {m.catalog.colors[color.id]} · × {item.config.quantity}
                </p>
                <p className="t-num mt-2 text-ink">{f.price(safeTotal(item))}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-line bg-surface px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="mb-5 flex items-baseline justify-between">
              <span className="text-ink-2">{t(m.drawer.summary, { items: f.plural(items.length, m.common.items) })}</span>
              <span className="t-num text-2xl font-light text-ink">{f.price(subtotal)}</span>
            </div>
            <div className="grid gap-3">
              <ButtonLink href={href("checkout")} size="lg" block arrow onClick={() => setItem(null)}>
                {m.drawer.order}
              </ButtonLink>
              <ButtonLink href={href("cart")} variant="secondary" size="lg" block onClick={() => setItem(null)}>
                {m.common.seeCart}
              </ButtonLink>
            </div>
            <Link href={href("configurator")} onClick={() => setItem(null)} className="mt-4 block text-center text-sm text-ink-2 underline-offset-4 hover:underline">
              {m.drawer.another}
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}

function safeTotal(item: CartItem) {
  try {
    return computePrice(item.config).total;
  } catch {
    return 0;
  }
}
