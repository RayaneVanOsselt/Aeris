"use client";

import Link from "next/link";
import { useId, useState, type Dispatch, type ReactNode } from "react";
import { useI18n } from "@/i18n/provider";
import { Rich } from "@/i18n/rich";
import { claims, payment } from "@/lib/business";
import { frameColors, getColor, getMesh, getOption, meshes, productOptions, products, type OptionId, type Opening, type Product } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { isValidRal, parseNumber, type Action, type ConfiguratorState, type StepIndex } from "@/lib/configurator";
import { computePrice, startingPrice, type Configuration, type PriceBreakdown } from "@/lib/pricing";
import { checkDimensions, describeIssue } from "@/lib/validation";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type StepProps = { state: ConfiguratorState; dispatch: Dispatch<Action> };

function StepTitle({ index, title, intro }: { index: number; title: string; intro?: ReactNode }) {
  const { m, t } = useI18n();
  return (
    <div className="mb-8">
      <p className="t-caption text-sky">{t(m.configurator.stepOf, { step: index + 1 })}</p>
      <h2 data-step-title tabIndex={-1} className="t-h2 mt-3 text-ink outline-none">
        {title}
      </h2>
      {intro && <p className="mt-3 max-w-xl text-ink-2">{intro}</p>}
    </div>
  );
}

/* ── 1. Modèle ─────────────────────────────────────────────── */
export function StepModel({ state, dispatch, onPick }: StepProps & { onPick: () => void }) {
  const { m, href, f, t } = useI18n();
  const groups: Opening[] = ["fenetre", "porte", "baie"];
  return (
    <div>
      <StepTitle
        index={0}
        title={m.configurator.model.title}
        intro={
          <Rich
            text={m.configurator.model.intro}
            link={(label) => (
              <Link href={`${href("catalog")}#aide-au-choix`} className="text-ink underline underline-offset-4">
                {label}
              </Link>
            )}
          />
        }
      />
      <div className="space-y-10">
        {groups.map((g) => (
          <fieldset key={g}>
            <legend className="t-caption mb-4 text-ink-3">{m.catalog.openings[g].plural}</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {products
                .filter((p) => p.openings[0] === g || (g === "baie" && p.id === "sur-mesure-plus"))
                .filter((p) => !(g !== "baie" && p.id === "sur-mesure-plus"))
                .map((p) => {
                  const selected = state.productId === p.id;
                  const text = m.catalog.products[p.id];
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        dispatch({ type: "selectProduct", productId: p.id });
                        onPick();
                      }}
                      className={cn(
                        "group flex items-center gap-4 rounded-[var(--radius-lg)] border bg-surface p-3 text-left transition-[border-color,box-shadow] duration-[var(--dur-base)]",
                        selected ? "border-ink shadow-[var(--shadow-md)]" : "border-line hover:border-ink-3",
                      )}
                    >
                      <span className="flex size-20 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-paper-2">
                        <ProductVisual kind={p.visual} width={p.defaultSize.width} height={p.defaultSize.height} color="#383C42" className="h-16 w-16" title={text.name} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-ink">
                          {text.name}
                          {text.badge && <span className="t-caption rounded-full bg-sand-soft px-2 py-0.5 text-[10px] text-sand-deep">{text.badge}</span>}
                        </span>
                        <span className="t-small mt-0.5 block text-ink-3">{text.tagline}</span>
                        <span className="t-num mt-1.5 block text-sm text-ink-2">{t(m.common.fromPrice, { price: f.price(startingPrice(p)) })}</span>
                      </span>
                      <span
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                          selected ? "border-ink bg-ink text-paper" : "border-line-strong",
                        )}
                      >
                        {selected && <Icon name="check" size={14} strokeWidth={2.4} />}
                      </span>
                    </button>
                  );
                })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

/* ── 2. Dimensions ─────────────────────────────────────────── */
export function StepDimensions({ state, dispatch, product }: StepProps & { product: Product }) {
  const { m, href, f } = useI18n();
  const d = m.configurator.dims;
  const id = useId();
  const width = parseNumber(state.width);
  const height = parseNumber(state.height);
  const [touched, setTouched] = useState({ width: state.width !== "", height: state.height !== "" });
  const issues = checkDimensions(product, width, height);
  const fields = [
    { key: "width" as const, label: m.common.width, value: state.width, range: product.limits.width },
    { key: "height" as const, label: m.common.height, value: state.height, range: product.limits.height },
  ];

  return (
    <div>
      <StepTitle index={1} title={d.title} intro={d.intro} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const issue = touched[field.key] ? issues.find((i) => i.field === field.key) : undefined;
          return (
            <div key={field.key}>
              <label htmlFor={`${id}-${field.key}`} className="flex items-baseline justify-between text-sm text-ink-2">
                {field.label}
                <span className="t-num text-xs text-ink-3">
                  {f.mm(field.range[0])} – {f.mm(field.range[1])}
                </span>
              </label>
              <div
                className={cn(
                  "mt-2 flex items-baseline gap-2 rounded-[var(--radius-lg)] border-2 bg-surface px-5 transition-colors focus-within:border-sky",
                  issue?.level === "error" ? "border-danger" : issue?.level === "warning" ? "border-warning/60" : "border-line",
                )}
              >
                <input
                  id={`${id}-${field.key}`}
                  inputMode="numeric"
                  autoComplete="off"
                  value={field.value}
                  placeholder="0"
                  onChange={(e) => dispatch({ type: "set", patch: { [field.key]: e.target.value.replace(/[^\d.,]/g, "").slice(0, 6) } })}
                  onBlur={() => setTouched((prev) => ({ ...prev, [field.key]: true }))}
                  aria-invalid={issue?.level === "error"}
                  aria-describedby={issue ? `${id}-${field.key}-msg` : undefined}
                  className="t-num h-20 w-full min-w-0 bg-transparent text-4xl font-light text-ink outline-none placeholder:text-ink-3/40"
                />
                <span className="text-ink-3">{m.common.mm}</span>
              </div>
              {issue && (
                <p id={`${id}-${field.key}-msg`} role={issue.level === "error" ? "alert" : undefined} className={cn("mt-2.5 flex gap-2 text-sm", issue.level === "error" ? "text-danger" : "text-warning")}>
                  <Icon name={issue.level === "error" ? "alert" : "info"} size={16} className="mt-0.5 shrink-0" />
                  <span>
                    {describeIssue(issue, m, f).message}
                    {issue.fix && (
                      <button type="button" onClick={() => dispatch({ type: "set", patch: { [field.key]: String(issue.fix!.value) } })} className="ml-1.5 font-medium underline underline-offset-2">
                        {describeIssue(issue, m, f).fixLabel}
                      </button>
                    )}
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>
      {issues
        .filter((i) => i.code === "ratio")
        .map((i) => (
          <p key={i.code} className="mt-4 flex gap-2 text-sm text-warning">
            <Icon name="info" size={16} className="mt-0.5 shrink-0" />
            {describeIssue(i, m, f).message}
          </p>
        ))}

      <div className="mt-10 grid grid-cols-1 gap-6 rounded-[var(--radius-lg)] border border-line bg-paper-2/60 p-6 sm:grid-cols-[140px_1fr] sm:items-center">
        <ProductVisual kind={product.visual} width={product.defaultSize.width} height={product.defaultSize.height} dimensions color="#383C42" className="mx-auto h-40 w-full max-w-[140px]" title={d.whereToMeasure} />
        <div>
          <p className="t-h4 text-ink">{d.howTitle}</p>
          <ol className="mt-3 space-y-2 text-sm text-ink-2">
            {d.how.map((line, i) => (
              <li key={line} className="flex gap-2.5">
                <span className="t-num text-sky">{i + 1}</span>
                {line}
              </li>
            ))}
          </ol>
          <Link href={href("guide")} target="_blank" className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink underline underline-offset-4">
            {d.guide} <Icon name="arrowUpRight" size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── 3. Toile & coloris ────────────────────────────────────── */
export function StepFinish({ state, dispatch }: StepProps) {
  const { m, f, t } = useI18n();
  const fi = m.configurator.finish;
  const id = useId();
  const color = getColor(state.colorId)!;
  const ralInvalid = state.colorId === "ral" && !isValidRal(state.ralCode);
  return (
    <div>
      <StepTitle index={2} title={fi.title} intro={fi.intro} />
      <fieldset>
        <legend className="t-caption mb-4 text-ink-3">{m.common.mesh}</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {meshes.map((x) => {
            const selected = state.meshId === x.id;
            return (
              <label
                key={x.id}
                className={cn(
                  "relative flex cursor-pointer gap-4 rounded-[var(--radius-lg)] border bg-surface p-4 transition-[border-color,box-shadow] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky",
                  selected ? "border-ink shadow-[var(--shadow-sm)]" : "border-line hover:border-ink-3",
                )}
              >
                <input type="radio" name="toile" value={x.id} checked={selected} onChange={() => dispatch({ type: "set", patch: { meshId: x.id } })} className="sr-only" />
                <span
                  aria-hidden
                  className="size-14 shrink-0 rounded-full border border-line-strong"
                  style={{
                    backgroundColor: x.id === "solaire" ? "#c9d2de" : "#e3ebf5",
                    backgroundImage: `linear-gradient(to right, rgb(22 30 44/.7) ${x.strand}px, transparent ${x.strand}px), linear-gradient(to bottom, rgb(22 30 44/.7) ${x.strand}px, transparent ${x.strand}px)`,
                    backgroundSize: `${Math.max(3, 40 / x.density)}px ${Math.max(3, 40 / x.density)}px`,
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-ink">{m.catalog.meshes[x.id].name}</span>
                    <span className="t-num shrink-0 text-xs text-ink-3">{x.multiplier === 1 ? fi.included : t(fi.surcharge, { percent: Math.round((x.multiplier - 1) * 100) })}</span>
                  </span>
                  <span className="t-small mt-1 block text-ink-3">{m.catalog.meshes[x.id].description}</span>
                </span>
              </label>
            );
          })}
        </div>
        <p className="t-small mt-3 text-ink-3">{fi.surchargeHint}</p>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="t-caption mb-4 text-ink-3">{t(fi.colorLegend, { color: m.catalog.colors[color.id] })}</legend>
        <div className="flex flex-wrap gap-3">
          {frameColors.map((c) => {
            const selected = state.colorId === c.id;
            return (
              <label key={c.id} className="group flex cursor-pointer flex-col items-center gap-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky">
                <input type="radio" name="coloris" value={c.id} checked={selected} onChange={() => dispatch({ type: "set", patch: { colorId: c.id } })} className="sr-only" />
                <span
                  className={cn("size-14 rounded-full border border-line-strong ring-offset-4 ring-offset-paper transition-shadow", selected ? "ring-2 ring-ink" : "group-hover:ring-1 group-hover:ring-line-strong")}
                  style={{ background: c.id === "ral" ? "conic-gradient(#c8a57a,#3563e9,#1f7a55,#b42318,#c8a57a)" : c.hex }}
                />
                <span className={cn("text-xs", selected ? "text-ink" : "text-ink-3")}>
                  {m.catalog.colors[c.id]}
                  {c.surcharge > 0 && <span className="block text-center">+{f.price(c.surcharge)}</span>}
                </span>
              </label>
            );
          })}
        </div>
        {state.colorId === "ral" && (
          <div className="mt-6 max-w-xs animate-fade-up">
            <label htmlFor={`${id}-ral`} className="text-sm text-ink-2">
              {fi.ral} <span className="text-ink-3">{fi.ralHint}</span>
            </label>
            <div className={cn("mt-2 flex items-center rounded-[var(--radius-md)] border bg-surface px-4 focus-within:border-sky", ralInvalid ? "border-danger" : "border-line")}>
              <span className="t-num text-ink-3">RAL</span>
              <input
                id={`${id}-ral`}
                inputMode="numeric"
                maxLength={4}
                value={state.ralCode}
                onChange={(e) => dispatch({ type: "set", patch: { ralCode: e.target.value.replace(/\D/g, "").slice(0, 4) } })}
                placeholder="7016"
                aria-invalid={ralInvalid}
                className="t-num h-12 w-full bg-transparent pl-2 text-ink outline-none"
              />
            </div>
            <p className="t-small mt-2 text-ink-3">{fi.ralHelp}</p>
          </div>
        )}
      </fieldset>
    </div>
  );
}

/* ── 4. Options ────────────────────────────────────────────── */
export function StepOptions({ state, dispatch }: StepProps) {
  const { m, f } = useI18n();
  const opt = m.configurator.options;
  const id = useId();
  return (
    <div>
      <StepTitle index={3} title={opt.title} intro={opt.intro} />
      <fieldset>
        <legend className="t-caption mb-4 text-ink-3">{opt.legend}</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {productOptions.map((o) => {
            const selected = state.optionIds.includes(o.id);
            return (
              <label
                key={o.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3.5 rounded-[var(--radius-lg)] border bg-surface p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky",
                  selected ? "border-ink" : "border-line hover:border-ink-3",
                )}
              >
                <input type="checkbox" checked={selected} onChange={() => dispatch({ type: "toggleOption", id: o.id })} className="sr-only" />
                <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors", selected ? "border-ink bg-ink text-paper" : "border-line-strong")}>
                  {selected && <Icon name="check" size={13} strokeWidth={2.6} />}
                </span>
                <span className="flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-ink">{m.catalog.options[o.id].name}</span>
                    <span className="t-num text-sm text-ink-2">+{f.price(o.price)}</span>
                  </span>
                  <span className="t-small mt-1 block text-ink-3">{m.catalog.options[o.id].description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p id={`${id}-qty`} className="t-caption mb-3 text-ink-3">
            {opt.quantity}
          </p>
          <div role="group" aria-labelledby={`${id}-qty`} className="inline-flex items-center rounded-[var(--radius-md)] border border-line bg-surface">
            <button type="button" aria-label={opt.decrease} disabled={state.quantity <= 1} onClick={() => dispatch({ type: "set", patch: { quantity: state.quantity - 1 } })} className="flex size-12 items-center justify-center text-ink disabled:opacity-30">
              <Icon name="minus" size={18} />
            </button>
            <output className="t-num w-12 text-center text-lg text-ink" aria-live="polite">
              {state.quantity}
            </output>
            <button type="button" aria-label={opt.increase} disabled={state.quantity >= 20} onClick={() => dispatch({ type: "set", patch: { quantity: state.quantity + 1 } })} className="flex size-12 items-center justify-center text-ink disabled:opacity-30">
              <Icon name="plus" size={18} />
            </button>
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-label`} className="t-caption mb-3 block text-ink-3">
            {opt.label}
          </label>
          <input
            id={`${id}-label`}
            value={state.label}
            maxLength={40}
            onChange={(e) => dispatch({ type: "set", patch: { label: e.target.value } })}
            placeholder={opt.labelPlaceholder}
            className="h-12 w-full rounded-[var(--radius-md)] border border-line bg-surface px-4 text-ink outline-none focus:border-sky"
          />
          <p className="t-small mt-2 text-ink-3">{opt.labelHint}</p>
        </div>
      </div>
    </div>
  );
}

/* ── 5. Récapitulatif ──────────────────────────────────────── */
export function StepSummary({
  product,
  config,
  price,
  onEdit,
  onAdd,
  onQuote,
  onReset,
  added,
}: {
  product: Product;
  config: Configuration;
  price: PriceBreakdown;
  onEdit: (s: StepIndex) => void;
  onAdd: () => void;
  onQuote: () => void;
  onReset: () => void;
  added: boolean;
}) {
  const { m, href, f, t } = useI18n();
  const su = m.configurator.summary;
  const [copied, setCopied] = useState(false);
  const mesh = getMesh(config.meshId)!;
  const color = getColor(config.colorId)!;
  const unitNoOptions = computePrice({ ...config, optionIds: [], quantity: 1 }).unit;

  const rows: Array<{ label: string; value: ReactNode; step: StepIndex }> = [
    { label: m.common.model, value: m.catalog.products[product.id].name, step: 0 },
    {
      label: su.dimensions,
      value: (
        <span className="t-num">
          {f.mm(config.width)} × {f.mm(config.height)} <span className="text-ink-3">({f.area(price.areaM2)})</span>
        </span>
      ),
      step: 1,
    },
    { label: m.common.mesh, value: m.catalog.meshes[mesh.id].name, step: 2 },
    { label: m.common.color, value: `${m.catalog.colors[color.id]}${config.ralCode ? ` ${config.ralCode}` : ""}`, step: 2 },
    {
      label: su.options,
      value: config.optionIds.length
        ? config.optionIds
            .filter((o) => getOption(o))
            .map((o) => m.catalog.options[o as OptionId].name)
            .join(m.common.listSeparator)
        : m.common.none,
      step: 3,
    },
    { label: su.quantity, value: `${config.quantity}${config.label ? ` · ${t(m.common.quoted, { text: config.label })}` : ""}`, step: 3 },
  ];

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible : l'URL reste visible dans la barre d'adresse */
    }
  };

  return (
    <div>
      <StepTitle index={4} title={su.title} intro={su.intro} />
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4 py-4">
            <dt className="w-28 shrink-0 text-sm text-ink-3">{r.label}</dt>
            <dd className="flex-1 text-ink">{r.value}</dd>
            <button type="button" onClick={() => onEdit(r.step)} className="inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink" aria-label={t(su.editRow, { label: r.label })}>
              <Icon name="edit" size={15} /> <span className="hidden sm:inline">{m.common.edit}</span>
            </button>
          </div>
        ))}
      </dl>

      <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-surface p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-ink-2">
            <dt>{su.unitPrice}</dt>
            <dd className="t-num">{f.price(unitNoOptions)}</dd>
          </div>
          {price.options > 0 && (
            <div className="flex justify-between text-ink-2">
              <dt>{su.options}</dt>
              <dd className="t-num">+{f.price(price.options)}</dd>
            </div>
          )}
          {config.quantity > 1 && (
            <div className="flex justify-between text-ink-2">
              <dt>{su.quantity}</dt>
              <dd className="t-num">× {config.quantity}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <dt className="text-ink">{m.common.totalInclTax}</dt>
            <dd className="t-num text-3xl font-light text-ink">{f.price(price.total)}</dd>
          </div>
          <div className="flex justify-between text-xs text-ink-3">
            <dt>{m.common.ofWhichVat}</dt>
            <dd className="t-num">{f.price(price.vat)}</dd>
          </div>
        </dl>
        <p className="t-small mt-4 flex gap-2 text-ink-2">
          <Icon name="clock" size={16} className="mt-0.5 shrink-0 text-sky" />
          {t(su.leadTime, { lead: t(m.common.leadTime, { min: product.leadTimeDays[0], max: product.leadTimeDays[1] }) })}
        </p>
        {product.id === "sur-mesure-plus" && (
          <p className="t-small mt-3 flex gap-2 text-warning">
            <Icon name="info" size={16} className="mt-0.5 shrink-0" />
            {su.special}
          </p>
        )}
      </div>

      {added ? (
        <div role="status" className="mt-6 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-success/30 bg-success-soft p-5 sm:flex-row sm:items-center">
          <span className="flex items-center gap-3 text-success">
            <span className="flex size-9 items-center justify-center rounded-full bg-success text-white">
              <Icon name="check" size={18} strokeWidth={2.4} />
            </span>
            {su.added}
          </span>
          <div className="flex gap-2 sm:ml-auto">
            <ButtonLink href={href("cart")} size="sm" arrow>
              {m.common.seeCart}
            </ButtonLink>
            <Button size="sm" variant="secondary" onClick={onReset}>
              {su.another}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button onClick={onAdd} size="lg" arrow icon="bag" className={product.id === "sur-mesure-plus" ? "order-2" : ""} variant={product.id === "sur-mesure-plus" ? "secondary" : "primary"}>
            {su.addToCart}
          </Button>
          <Button onClick={onQuote} size="lg" variant={product.id === "sur-mesure-plus" ? "primary" : "secondary"}>
            {m.common.requestQuote}
          </Button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-ink-2">
          <li className="flex items-center gap-1.5">
            <Icon name="lock" size={15} className="text-sky" />{" "}
            {f.list(
              payment.methods.map((x) => m.payment.methods[x]),
              "disjunction",
            )}
          </li>
          {!claims.checkedBeforeProduction.toConfirm && (
            <li className="flex items-center gap-1.5">
              <Icon name="eye" size={15} className="text-sky" /> {m.claims.checkedBeforeProduction.label}
            </li>
          )}
        </ul>
        <button type="button" onClick={share} className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink" aria-live="polite">
          <Icon name={copied ? "check" : "share"} size={15} /> {copied ? su.linkCopied : su.copyLink}
        </button>
      </div>
    </div>
  );
}
