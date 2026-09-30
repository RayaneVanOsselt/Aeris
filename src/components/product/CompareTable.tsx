import Link from "next/link";
import { openings, products } from "@/lib/catalog";
import { formatLeadTime, formatPrice } from "@/lib/format";
import { startingPrice } from "@/lib/pricing";
import { ProductVisual } from "./ProductVisual";

/** Comparatif : aide à comprendre les différences entre modèles d'un coup d'œil. */
export function CompareTable({ ids }: { ids?: string[] }) {
  const list = ids ? products.filter((p) => ids.includes(p.id)) : products;
  return (
    <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)]">
      <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-[0.9375rem]">
        <caption className="sr-only">Comparatif des modèles de moustiquaires</caption>
        <thead>
          <tr className="t-caption text-ink-3">
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">Modèle</th>
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">Pour</th>
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">Idéal pour</th>
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">Pose</th>
            <th scope="col" className="border-b border-line pb-4 pr-6 font-normal">Fabrication</th>
            <th scope="col" className="border-b border-line pb-4 text-right font-normal">Dès</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p.id} className="group align-top">
              <th scope="row" className="border-b border-line py-5 pr-6 font-normal">
                <Link href={`/produits/${p.slug}`} className="flex items-center gap-3 text-ink hover:underline">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-paper-2">
                    <ProductVisual kind={p.visual} width={p.defaultSize.width} height={p.defaultSize.height} className="h-10 w-10" title={p.name} />
                  </span>
                  {p.name}
                </Link>
              </th>
              <td className="border-b border-line py-5 pr-6 text-ink-2">{p.openings.map((o) => openings[o].plural).join(", ")}</td>
              <td className="border-b border-line py-5 pr-6 text-ink-2">{p.idealFor[0]}</td>
              <td className="border-b border-line py-5 pr-6 text-ink-2">{p.installation}</td>
              <td className="t-num border-b border-line py-5 pr-6 text-sm text-ink-2">{formatLeadTime(p.leadTimeDays)}</td>
              <td className="t-num border-b border-line py-5 text-right text-ink">{formatPrice(startingPrice(p))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
