import Link from "next/link";
import { getI18n } from "@/i18n/server";
import { products } from "@/lib/catalog";
import { startingPrice } from "@/lib/pricing";
import { ProductVisual } from "./ProductVisual";

/** Comparatif : aide à comprendre les différences entre modèles d'un coup d'œil. */
export function CompareTable({ ids }: { ids?: string[] }) {
  const { m, href, f, t } = getI18n();
  const c = m.compare;
  const list = ids ? products.filter((p) => ids.includes(p.id)) : products;
  return (
    <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)]">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-[0.9375rem]">
        <caption className="sr-only">{c.caption}</caption>
        <thead>
          <tr className="t-caption text-ink-3">
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">{c.model}</th>
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">{c.for}</th>
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">{c.idealFor}</th>
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">{c.installation}</th>
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">{c.manufacturing}</th>
            <th scope="col" className="border-b border-line pb-4 text-right font-normal">{c.from}</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => {
            const text = m.catalog.products[p.id];
            return (
              <tr key={p.id} className="group align-top">
                <th scope="row" className="border-b border-line py-5 pr-6 font-normal">
                  <Link href={href("product", p.id)} className="flex items-center gap-3 text-ink hover:underline">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-paper-2">
                      <ProductVisual kind={p.visual} width={p.defaultSize.width} height={p.defaultSize.height} className="h-10 w-10" title={text.name} />
                    </span>
                    {text.name}
                  </Link>
                </th>
                <td className="border-b border-line py-5 pr-6 text-ink-2">{p.openings.map((o) => m.catalog.openings[o].plural).join(m.common.listSeparator)}</td>
                <td className="border-b border-line py-5 pr-6 text-ink-2">{text.idealFor[0]}</td>
                <td className="border-b border-line py-5 pr-6 text-ink-2">{text.installation}</td>
                <td className="t-num border-b border-line py-5 pr-6 text-sm text-ink-2">{t(m.common.leadTime, { min: p.leadTimeDays[0], max: p.leadTimeDays[1] })}</td>
                <td className="t-num border-b border-line py-5 text-right text-ink">{f.price(startingPrice(p))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
