"use client";

import Link from "next/link";
import { getColor, getMesh, getOption, getProduct } from "@/lib/catalog";
import { cart, useCart, type CartItem } from "@/lib/cart-store";
import { payment, shipping } from "@/lib/business";
import { formatLeadTime, formatMm, formatPrice } from "@/lib/format";
import { computePrice } from "@/lib/pricing";
import { ProductVisual } from "@/components/product/ProductVisual";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useHydrated } from "@/lib/use-hydrated";

export function lineTotal(item: CartItem) {
  try {
    return computePrice(item.config).total;
  } catch {
    return null;
  }
}

export function CartView() {
  const items = useCart();
  const hydrated = useHydrated();
  const valid = items.filter((i) => lineTotal(i) !== null);
  const total = valid.reduce((s, i) => s + (lineTotal(i) ?? 0), 0);
  const vat = Math.round(total - total / (1 + payment.vatRate));

  if (!hydrated) return <div className="skeleton h-80 rounded-[var(--radius-xl)]" aria-label="Chargement du panier" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[var(--radius-xl)] border border-dashed border-line-strong px-6 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-paper-2 text-ink-2">
          <Icon name="bag" size={26} />
        </span>
        <h2 className="t-h3 mt-6 text-ink">Votre panier est vide</h2>
        <p className="mt-2 max-w-sm text-ink-2">Configurez votre première moustiquaire : le prix s&apos;affiche en temps réel.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/configurateur" arrow>
            Configurer une moustiquaire
          </ButtonLink>
          <ButtonLink href="/moustiquaires" variant="secondary">
            Voir les modèles
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <ul className="divide-y divide-line border-y border-line lg:col-span-8" aria-label="Articles du panier">
        {items.map((item) => {
          const product = getProduct(item.config.productId);
          const color = getColor(item.config.colorId);
          const mesh = getMesh(item.config.meshId);
          const total = lineTotal(item);
          if (!product || !color || !mesh || total === null) {
            return (
              <li key={item.id} className="flex items-center justify-between gap-4 py-6 text-sm text-danger">
                Cet article n&apos;est plus disponible dans cette configuration.
                <button type="button" onClick={() => cart.remove(item.id)} className="underline">
                  Retirer
                </button>
              </li>
            );
          }
          const editHref = `/configurateur?modele=${product.id}&largeur=${item.config.width}&hauteur=${item.config.height}&toile=${mesh.id}&coloris=${color.id}${item.config.ralCode ? `&ral=${item.config.ralCode}` : ""}${item.config.optionIds.length ? `&options=${item.config.optionIds.join(",")}` : ""}&qte=${item.config.quantity}`;
          return (
            <li key={item.id} className="grid grid-cols-[88px_1fr] gap-5 py-6 sm:grid-cols-[120px_1fr_auto]">
              <Link href={`/produits/${product.slug}`} className="flex aspect-square items-center justify-center rounded-[var(--radius-md)] bg-paper-2">
                <ProductVisual kind={product.visual} color={color.hex} width={item.config.width} height={item.config.height} className="h-[80%] w-[80%]" title={product.name} />
              </Link>
              <div className="min-w-0">
                <p className="text-ink">
                  {product.name}
                  {item.config.label && <span className="text-ink-3"> · {item.config.label}</span>}
                </p>
                <p className="t-num t-small mt-1 text-ink-2">
                  {formatMm(item.config.width)} × {formatMm(item.config.height)}
                </p>
                <p className="t-small text-ink-3">
                  {mesh.name} · {color.name}
                  {item.config.ralCode ? ` ${item.config.ralCode}` : ""}
                  {item.config.optionIds.length > 0 && ` · ${item.config.optionIds.map((o) => getOption(o)?.name).join(", ")}`}
                </p>
                <p className="t-small mt-1 text-ink-3">Fabrication : {formatLeadTime(product.leadTimeDays)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center rounded-[var(--radius-md)] border border-line bg-surface" role="group" aria-label={`Quantité : ${item.config.quantity}`}>
                    <button
                      type="button"
                      aria-label="Diminuer la quantité"
                      disabled={item.config.quantity <= 1}
                      onClick={() => cart.update(item.id, { quantity: item.config.quantity - 1 })}
                      className="flex size-10 items-center justify-center disabled:opacity-30"
                    >
                      <Icon name="minus" size={16} />
                    </button>
                    <span className="t-num w-8 text-center">{item.config.quantity}</span>
                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      disabled={item.config.quantity >= 20}
                      onClick={() => cart.update(item.id, { quantity: item.config.quantity + 1 })}
                      className="flex size-10 items-center justify-center disabled:opacity-30"
                    >
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                  <Link href={editHref} className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
                    <Icon name="edit" size={15} /> Modifier
                  </Link>
                  <button type="button" onClick={() => cart.remove(item.id)} className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-danger">
                    <Icon name="trash" size={15} /> Retirer
                  </button>
                </div>
              </div>
              <p className="t-num col-span-2 text-right text-lg text-ink sm:col-span-1">{formatPrice(total)}</p>
            </li>
          );
        })}
      </ul>

      <aside className="lg:col-span-4" aria-label="Récapitulatif">
        <div className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <h2 className="t-h4 text-ink">Récapitulatif</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-ink-2">
              <dt>Sous-total TTC</dt>
              <dd className="t-num">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between gap-6 text-ink-2">
              <dt>Livraison</dt>
              <dd className="text-right">{shipping.label}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-4">
              <dt className="text-ink">Total TTC</dt>
              <dd className="t-num text-3xl font-light text-ink">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between text-xs text-ink-3">
              <dt>dont TVA 21 %</dt>
              <dd className="t-num">{formatPrice(vat)}</dd>
            </div>
          </dl>
          <ButtonLink href="/commande" size="lg" block arrow className="mt-6">
            Passer commande
          </ButtonLink>
          <ButtonLink href="/configurateur" variant="ghost" block className="mt-2">
            Ajouter une moustiquaire
          </ButtonLink>
          <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm text-ink-2">
            <li className="flex gap-2.5">
              <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-sky" />
              Paiement {payment.methods.join(" ou ")}, après confirmation
            </li>
            <li className="flex gap-2.5">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-sky" />
              {shipping.detail}
            </li>
            <li className="flex gap-2.5">
              <Icon name="check" size={16} className="mt-0.5 shrink-0 text-sky" />
              Aucun compte à créer
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
