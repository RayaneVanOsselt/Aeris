"use client";

import Link from "next/link";
import { useId, useState, type Dispatch, type ReactNode } from "react";
import { frameColors, getColor, getMesh, getOption, meshes, openings, productOptions, products, type Opening, type Product } from "@/lib/catalog";
import { claims, payment } from "@/lib/business";
import { cn } from "@/lib/cn";
import { isValidRal, parseNumber, type Action, type ConfiguratorState, type StepIndex } from "@/lib/configurator";
import { formatLeadTime, formatMm, formatPrice, formatArea } from "@/lib/format";
import { computePrice, startingPrice, type Configuration, type PriceBreakdown } from "@/lib/pricing";
import { checkDimensions } from "@/lib/validation";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type StepProps = { state: ConfiguratorState; dispatch: Dispatch<Action> };

function StepTitle({ index, title, intro }: { index: number; title: string; intro?: ReactNode }) {
  return (
    <div className="mb-8">
      <p className="t-caption text-sky">Étape {index + 1} sur 5</p>
      <h2 data-step-title tabIndex={-1} className="t-h2 mt-3 text-ink outline-none">
        {title}
      </h2>
      {intro && <p className="mt-3 max-w-xl text-ink-2">{intro}</p>}
    </div>
  );
}

/* ── 1. Modèle ─────────────────────────────────────────────── */
export function StepModel({ state, dispatch, onPick }: StepProps & { onPick: () => void }) {
  const groups: Opening[] = ["fenetre", "porte", "baie"];
  return (
    <div>
      <StepTitle
        index={0}
        title="Pour quelle ouverture ?"
        intro={
          <>
            Choisissez votre modèle. Un doute ?{" "}
            <Link href="/moustiquaires#aide-au-choix" className="text-ink underline underline-offset-4">
              L&apos;aide au choix
            </Link>{" "}
            vous oriente en trois questions.
          </>
        }
      />
      <div className="space-y-10">
        {groups.map((g) => (
          <fieldset key={g}>
            <legend className="t-caption mb-4 text-ink-3">{openings[g].plural}</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {products
                .filter((p) => p.openings[0] === g || (g === "baie" && p.id === "sur-mesure-plus"))
                .filter((p) => !(g !== "baie" && p.id === "sur-mesure-plus"))
                .map((p) => {
                  const selected = state.productId === p.id;
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
                        <ProductVisual kind={p.visual} width={p.defaultSize.width} height={p.defaultSize.height} color="#383C42" className="h-16 w-16" title={p.name} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-ink">
                          {p.name}
                          {p.badge && <span className="t-caption rounded-full bg-sand-soft px-2 py-0.5 text-[10px] text-sand-deep">{p.badge}</span>}
                        </span>
                        <span className="t-small mt-0.5 block text-ink-3">{p.tagline}</span>
                        <span className="t-num mt-1.5 block text-sm text-ink-2">dès {formatPrice(startingPrice(p))}</span>
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
  const id = useId();
  const width = parseNumber(state.width);
  const height = parseNumber(state.height);
  const [touched, setTouched] = useState({ width: state.width !== "", height: state.height !== "" });
  const issues = checkDimensions(product, width, height);
  const fields = [
    { key: "width" as const, label: "Largeur", value: state.width, range: product.limits.width },
    { key: "height" as const, label: "Hauteur", value: state.height, range: product.limits.height },
  ];

  return (
    <div>
      <StepTitle index={1} title="Vos dimensions" intro="En millimètres, au plus juste. Nous vérifions chaque configuration avant de lancer la fabrication." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const issue = touched[f.key] ? issues.find((i) => i.field === f.key) : undefined;
          return (
            <div key={f.key}>
              <label htmlFor={`${id}-${f.key}`} className="flex items-baseline justify-between text-sm text-ink-2">
                {f.label}
                <span className="t-num text-xs text-ink-3">
                  {formatMm(f.range[0])} – {formatMm(f.range[1])}
                </span>
              </label>
              <div
                className={cn(
                  "mt-2 flex items-baseline gap-2 rounded-[var(--radius-lg)] border-2 bg-surface px-5 transition-colors focus-within:border-sky",
                  issue?.level === "error" ? "border-danger" : issue?.level === "warning" ? "border-warning/60" : "border-line",
                )}
              >
                <input
                  id={`${id}-${f.key}`}
                  inputMode="numeric"
                  autoComplete="off"
                  value={f.value}
                  placeholder="0"
                  onChange={(e) => dispatch({ type: "set", patch: { [f.key]: e.target.value.replace(/[^\d.,]/g, "").slice(0, 6) } })}
                  onBlur={() => setTouched((t) => ({ ...t, [f.key]: true }))}
                  aria-invalid={issue?.level === "error"}
                  aria-describedby={issue ? `${id}-${f.key}-msg` : undefined}
                  className="t-num h-20 w-full min-w-0 bg-transparent text-4xl font-light text-ink outline-none placeholder:text-ink-3/40"
                />
                <span className="text-ink-3">mm</span>
              </div>
              {issue && (
                <p id={`${id}-${f.key}-msg`} role={issue.level === "error" ? "alert" : undefined} className={cn("mt-2.5 flex gap-2 text-sm", issue.level === "error" ? "text-danger" : "text-warning")}>
                  <Icon name={issue.level === "error" ? "alert" : "info"} size={16} className="mt-0.5 shrink-0" />
                  <span>
                    {issue.message}
                    {issue.fix && (
                      <button type="button" onClick={() => dispatch({ type: "set", patch: { [f.key]: String(issue.fix!.value) } })} className="ml-1.5 font-medium underline underline-offset-2">
                        {issue.fix.label}
                      </button>
                    )}
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>
      {issues.filter((i) => !fields.some((f) => f.key === i.field) || i.message.includes("inversé")).map((i) => (
        <p key={i.message} className="mt-4 flex gap-2 text-sm text-warning">
          <Icon name="info" size={16} className="mt-0.5 shrink-0" />
          {i.message}
        </p>
      ))}

      <div className="mt-10 grid grid-cols-1 gap-6 rounded-[var(--radius-lg)] border border-line bg-paper-2/60 p-6 sm:grid-cols-[140px_1fr] sm:items-center">
        <ProductVisual kind={product.visual} width={product.defaultSize.width} height={product.defaultSize.height} dimensions color="#383C42" className="mx-auto h-40 w-full max-w-[140px]" title="Où mesurer" />
        <div>
          <p className="t-h4 text-ink">Bien mesurer en 30 secondes</p>
          <ol className="mt-3 space-y-2 text-sm text-ink-2">
            <li className="flex gap-2.5"><span className="t-num text-sky">1</span>Mesurez la largeur en haut, au milieu et en bas.</li>
            <li className="flex gap-2.5"><span className="t-num text-sky">2</span>Mesurez la hauteur à gauche, au centre et à droite.</li>
            <li className="flex gap-2.5"><span className="t-num text-sky">3</span>Notez la plus petite valeur, en millimètres.</li>
          </ol>
          <Link href="/guide-des-mesures" target="_blank" className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink underline underline-offset-4">
            Guide détaillé <Icon name="arrowUpRight" size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── 3. Toile & coloris ────────────────────────────────────── */
export function StepFinish({ state, dispatch }: StepProps) {
  const id = useId();
  const color = getColor(state.colorId)!;
  const ralInvalid = state.colorId === "ral" && !isValidRal(state.ralCode);
  return (
    <div>
      <StepTitle index={2} title="Toile et coloris" intro="La toile détermine l'usage, le coloris l'harmonie avec vos menuiseries." />
      <fieldset>
        <legend className="t-caption mb-4 text-ink-3">Toile</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {meshes.map((m) => {
            const selected = state.meshId === m.id;
            return (
              <label
                key={m.id}
                className={cn(
                  "relative flex cursor-pointer gap-4 rounded-[var(--radius-lg)] border bg-surface p-4 transition-[border-color,box-shadow] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky",
                  selected ? "border-ink shadow-[var(--shadow-sm)]" : "border-line hover:border-ink-3",
                )}
              >
                <input type="radio" name="toile" value={m.id} checked={selected} onChange={() => dispatch({ type: "set", patch: { meshId: m.id } })} className="sr-only" />
                <span
                  aria-hidden
                  className="size-14 shrink-0 rounded-full border border-line-strong"
                  style={{
                    backgroundColor: m.id === "solaire" ? "#c9d2de" : "#e3ebf5",
                    backgroundImage: `linear-gradient(to right, rgb(22 30 44/.7) ${m.strand}px, transparent ${m.strand}px), linear-gradient(to bottom, rgb(22 30 44/.7) ${m.strand}px, transparent ${m.strand}px)`,
                    backgroundSize: `${Math.max(3, 40 / m.density)}px ${Math.max(3, 40 / m.density)}px`,
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-ink">{m.name}</span>
                    <span className="t-num shrink-0 text-xs text-ink-3">{m.multiplier === 1 ? "Inclus" : `+${Math.round((m.multiplier - 1) * 100)} %`}</span>
                  </span>
                  <span className="t-small mt-1 block text-ink-3">{m.description}</span>
                </span>
              </label>
            );
          })}
        </div>
        <p className="t-small mt-3 text-ink-3">Le pourcentage s&apos;applique à la part « surface » du prix.</p>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="t-caption mb-4 text-ink-3">Coloris du profilé · {color.name}</legend>
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
                  {c.name}
                  {c.surcharge > 0 && <span className="block text-center">+{formatPrice(c.surcharge)}</span>}
                </span>
              </label>
            );
          })}
        </div>
        {state.colorId === "ral" && (
          <div className="mt-6 max-w-xs animate-fade-up">
            <label htmlFor={`${id}-ral`} className="text-sm text-ink-2">
              Code RAL <span className="text-ink-3">(facultatif, 4 chiffres)</span>
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
            <p className="t-small mt-2 text-ink-3">Pas sûr ? Laissez vide : nous confirmerons le coloris avec vous.</p>
          </div>
        )}
      </fieldset>
    </div>
  );
}

/* ── 4. Options ────────────────────────────────────────────── */
export function StepOptions({ state, dispatch }: StepProps) {
  const id = useId();
  return (
    <div>
      <StepTitle index={3} title="Options et quantité" intro="Tout est facultatif. Chaque option s'ajoute au prix affiché." />
      <fieldset>
        <legend className="t-caption mb-4 text-ink-3">Options</legend>
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
                    <span className="text-ink">{o.name}</span>
                    <span className="t-num text-sm text-ink-2">+{formatPrice(o.price)}</span>
                  </span>
                  <span className="t-small mt-1 block text-ink-3">{o.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p id={`${id}-qty`} className="t-caption mb-3 text-ink-3">
            Quantité (mêmes dimensions)
          </p>
          <div role="group" aria-labelledby={`${id}-qty`} className="inline-flex items-center rounded-[var(--radius-md)] border border-line bg-surface">
            <button type="button" aria-label="Diminuer" disabled={state.quantity <= 1} onClick={() => dispatch({ type: "set", patch: { quantity: state.quantity - 1 } })} className="flex size-12 items-center justify-center text-ink disabled:opacity-30">
              <Icon name="minus" size={18} />
            </button>
            <output className="t-num w-12 text-center text-lg text-ink" aria-live="polite">
              {state.quantity}
            </output>
            <button type="button" aria-label="Augmenter" disabled={state.quantity >= 20} onClick={() => dispatch({ type: "set", patch: { quantity: state.quantity + 1 } })} className="flex size-12 items-center justify-center text-ink disabled:opacity-30">
              <Icon name="plus" size={18} />
            </button>
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-label`} className="t-caption mb-3 block text-ink-3">
            Repère (facultatif)
          </label>
          <input
            id={`${id}-label`}
            value={state.label}
            maxLength={40}
            onChange={(e) => dispatch({ type: "set", patch: { label: e.target.value } })}
            placeholder="Ex. chambre parentale"
            className="h-12 w-full rounded-[var(--radius-md)] border border-line bg-surface px-4 text-ink outline-none focus:border-sky"
          />
          <p className="t-small mt-2 text-ink-3">Pratique si vous commandez pour plusieurs pièces.</p>
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
  const [copied, setCopied] = useState(false);
  const mesh = getMesh(config.meshId)!;
  const color = getColor(config.colorId)!;
  const unitNoOptions = computePrice({ ...config, optionIds: [], quantity: 1 }).unit;

  const rows: Array<{ label: string; value: ReactNode; step: StepIndex }> = [
    { label: "Modèle", value: product.name, step: 0 },
    { label: "Dimensions", value: <span className="t-num">{formatMm(config.width)} × {formatMm(config.height)} <span className="text-ink-3">({formatArea(price.areaM2)})</span></span>, step: 1 },
    { label: "Toile", value: mesh.name, step: 2 },
    { label: "Coloris", value: `${color.name}${config.ralCode ? ` ${config.ralCode}` : ""}`, step: 2 },
    { label: "Options", value: config.optionIds.length ? config.optionIds.map((o) => getOption(o)?.name).join(", ") : "Aucune", step: 3 },
    { label: "Quantité", value: `${config.quantity}${config.label ? ` · « ${config.label} »` : ""}`, step: 3 },
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
      <StepTitle index={4} title="Votre moustiquaire" intro="Vérifiez chaque ligne : vous pouvez encore tout modifier." />
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4 py-4">
            <dt className="w-28 shrink-0 text-sm text-ink-3">{r.label}</dt>
            <dd className="flex-1 text-ink">{r.value}</dd>
            <button type="button" onClick={() => onEdit(r.step)} className="inline-flex items-center gap-1 text-sm text-ink-2 hover:text-ink" aria-label={`Modifier : ${r.label}`}>
              <Icon name="edit" size={15} /> <span className="hidden sm:inline">Modifier</span>
            </button>
          </div>
        ))}
      </dl>

      <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-surface p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-ink-2">
            <dt>Moustiquaire (prix unitaire)</dt>
            <dd className="t-num">{formatPrice(unitNoOptions)}</dd>
          </div>
          {price.options > 0 && (
            <div className="flex justify-between text-ink-2">
              <dt>Options</dt>
              <dd className="t-num">+{formatPrice(price.options)}</dd>
            </div>
          )}
          {config.quantity > 1 && (
            <div className="flex justify-between text-ink-2">
              <dt>Quantité</dt>
              <dd className="t-num">× {config.quantity}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <dt className="text-ink">Total TTC</dt>
            <dd className="t-num text-3xl font-light text-ink">{formatPrice(price.total)}</dd>
          </div>
          <div className="flex justify-between text-xs text-ink-3">
            <dt>dont TVA 21 %</dt>
            <dd className="t-num">{formatPrice(price.vat)}</dd>
          </div>
        </dl>
        <p className="t-small mt-4 flex gap-2 text-ink-2">
          <Icon name="clock" size={16} className="mt-0.5 shrink-0 text-sky" />
          Fabrication estimée : {formatLeadTime(product.leadTimeDays)} après réception du paiement.
        </p>
        {product.id === "sur-mesure-plus" && (
          <p className="t-small mt-3 flex gap-2 text-warning">
            <Icon name="info" size={16} className="mt-0.5 shrink-0" />
            Projet spécial : une étude personnalisée confirmera la faisabilité et le prix. Nous vous conseillons la demande de devis.
          </p>
        )}
      </div>

      {added ? (
        <div role="status" className="mt-6 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-success/30 bg-success-soft p-5 sm:flex-row sm:items-center">
          <span className="flex items-center gap-3 text-success">
            <span className="flex size-9 items-center justify-center rounded-full bg-success text-white">
              <Icon name="check" size={18} strokeWidth={2.4} />
            </span>
            Ajoutée au panier.
          </span>
          <div className="flex gap-2 sm:ml-auto">
            <ButtonLink href="/panier" size="sm" arrow>
              Voir le panier
            </ButtonLink>
            <Button size="sm" variant="secondary" onClick={onReset}>
              En configurer une autre
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button onClick={onAdd} size="lg" arrow icon="bag" className={product.id === "sur-mesure-plus" ? "order-2" : ""} variant={product.id === "sur-mesure-plus" ? "secondary" : "primary"}>
            Ajouter au panier
          </Button>
          <Button onClick={onQuote} size="lg" variant={product.id === "sur-mesure-plus" ? "primary" : "secondary"}>
            Demander un devis
          </Button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-ink-2">
          <li className="flex items-center gap-1.5">
            <Icon name="lock" size={15} className="text-sky" /> {payment.methods.join(" ou ")}
          </li>
          {!claims.checkedBeforeProduction.toConfirm && (
            <li className="flex items-center gap-1.5">
              <Icon name="eye" size={15} className="text-sky" /> {claims.checkedBeforeProduction.label}
            </li>
          )}
        </ul>
        <button type="button" onClick={share} className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink" aria-live="polite">
          <Icon name={copied ? "check" : "share"} size={15} /> {copied ? "Lien copié" : "Copier le lien de cette configuration"}
        </button>
      </div>
    </div>
  );
}
