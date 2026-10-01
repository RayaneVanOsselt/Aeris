import Link from "next/link";
import { getI18n } from "@/i18n/server";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";

export type Crumb = { name: string; href: string };

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  const { m, href } = getI18n();
  const all = [{ name: m.common.home, href: href("home") }, ...items];
  return (
    <>
      <nav aria-label={m.common.breadcrumb} className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-ink-3">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <Icon name="chevronRight" size={14} className="opacity-60" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-ink-2">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="link-underline hover:text-ink">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
