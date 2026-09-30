"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useReducer, useRef, useState } from "react";
import { getColor, getMesh, getProduct } from "@/lib/catalog";
import { cart } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import { STEPS, initialState, isStepValid, parseNumber, parseParams, reducer, toConfiguration, toParams, type StepIndex } from "@/lib/configurator";
import { formatPrice } from "@/lib/format";
import { useAnimatedNumber } from "@/lib/hooks";
import { computePrice, startingPrice } from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { StepDimensions, StepFinish, StepModel, StepOptions, StepSummary } from "./Steps";

export function Configurator() {
  const params = useSearchParams();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, params, parseParams);
  const [added, setAdded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const product = state.productId ? getProduct(state.productId) : undefined;
  const config = toConfiguration(state);
  const price = config ? computePrice(config) : null;
  const shownPrice = useAnimatedNumber(price?.total ?? (product ? startingPrice(product) : 0));
  const canContinue = isStepValid(state, state.step);
  const isLast = state.step === 4;

  useEffect(() => track("configurator_started", { product: state.productId ?? "aucun" }), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Barre d'action mobile fixe : on décale le bouton de l'assistant pour qu'il ne la recouvre pas
  useEffect(() => {
    document.documentElement.style.setProperty("--sticky-bar", "76px");
    return () => document.documentElement.style.setProperty("--sticky-bar", "0px");
  }, []);

  // État reflété dans l'URL : lien partageable, rechargement sans perte
  useEffect(() => {
    const qs = toParams(state);
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [state]);

  // À chaque changement d'étape : focus sur le titre (lecteurs d'écran) et retour en haut du panneau
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const heading = panelRef.current?.querySelector<HTMLElement>("[data-step-title]");
    heading?.focus({ preventScroll: true });
    const top = (panelRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 140;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  }, [state.step]);

  const goto = (step: StepIndex) => dispatch({ type: "goto", step });
  const next = () => {
    if (!canContinue) return;
    track("configurator_step_completed", { step: state.step, product: state.productId ?? "" });
    goto(Math.min(4, state.step + 1) as StepIndex);
  };

  const addToCart = () => {
    if (!config || !price) return;
    cart.add(config);
    track("add_to_cart", { product: config.productId, value: price.total });
    setAdded(true);
  };

  const requestQuote = () => {
    track("quote_requested", { source: "configurateur", product: state.productId ?? "" });
    router.push(`/devis?${toParams(state)}`);
  };

  const color = getColor(state.colorId)!;
  const mesh = getMesh(state.meshId)!;
  const w = parseNumber(state.width);
  const h = parseNumber(state.height);

  return (
    <div className="grid gap-8 pb-28 lg:grid-cols-12 lg:gap-12 lg:pb-0">
      {/* Progression */}
      <nav aria-label="Étapes de configuration" className="lg:col-span-12">
        <ol className="scroll-row -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:px-0">
          {STEPS.map((label, i) => {
            const reachable = i <= state.maxStep || (i === state.step + 1 && canContinue);
            const done = i < state.step || (i <= state.maxStep && i !== state.step);
            return (
              <li key={label} className="min-w-[8.5rem] flex-1 shrink-0 snap-start">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => goto(i as StepIndex)}
                  aria-current={state.step === i ? "step" : undefined}
                  className="group w-full text-left disabled:cursor-not-allowed"
                >
                  <span className="block h-1 overflow-hidden rounded-full bg-line">
                    <span
                      className={cn("block h-full rounded-full transition-[width,background-color] duration-[var(--dur-slow)] ease-[var(--ease-out)]", state.step === i ? "bg-ink" : "bg-sky")}
                      style={{ width: state.step === i || done ? "100%" : "0%" }}
                    />
                  </span>
                  <span className={cn("mt-3 flex items-center gap-2 text-sm", state.step === i ? "text-ink" : reachable ? "text-ink-2 group-hover:text-ink" : "text-ink-3")}>
                    <span className="t-num text-xs">{done ? <Icon name="check" size={14} className="text-sky" /> : `0${i + 1}`}</span>
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Aperçu (mobile : compact en haut) */}
      <div className="lg:order-2 lg:col-span-5">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <div className="relative h-56 overflow-hidden rounded-[var(--radius-xl)] border border-line bg-gradient-to-b from-surface to-paper-2 sm:h-72 lg:h-auto lg:aspect-[4/4.2]">
            <div aria-hidden className="blueprint-grid absolute inset-0" />
            {product ? (
              <ProductVisual
                kind={product.visual}
                color={color.hex}
                width={w && w > 0 ? Math.min(Math.max(w, 150), 4000) : product.defaultSize.width}
                height={h && h > 0 ? Math.min(Math.max(h, 150), 4000) : product.defaultSize.height}
                meshDensity={mesh.density}
                meshStrand={mesh.strand}
                reinforced={state.optionIds.includes("renfort")}
                dimensions={isStepValid({ ...state, step: 1 }, 1)}
                title={`Aperçu : ${product.name}`}
                className="absolute inset-0 h-full w-full p-4 transition-opacity sm:p-8"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center text-ink-3">
                <Icon name="layers" size={28} />
                <p className="max-w-[16rem] text-sm">Choisissez un modèle : l&apos;aperçu se construit à chaque choix.</p>
              </div>
            )}
            {product && (
              <p className="t-caption absolute left-4 top-4 rounded-full border border-line bg-surface/90 px-3 py-1 text-ink-2 backdrop-blur">Aperçu en direct</p>
            )}
          </div>

          {/* Récapitulatif prix (desktop) */}
          <div className="mt-4 hidden rounded-[var(--radius-xl)] bg-night p-6 text-on-night lg:block">
            <PriceBlock product={product} total={shownPrice} hasConfig={!!price} quantity={state.quantity} />
            {product && (
              <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line-night pt-5 text-sm">
                <div>
                  <dt className="text-xs text-on-night-2">Toile</dt>
                  <dd className="mt-0.5 truncate">{mesh.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-on-night-2">Coloris</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 truncate">
                    <span className="size-2.5 shrink-0 rounded-full border border-white/30" style={{ background: color.hex }} />
                    {color.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-on-night-2">Fabrication</dt>
                  <dd className="t-num mt-0.5">
                    {product.leadTimeDays[0]}–{product.leadTimeDays[1]} j
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </div>
      </div>

      {/* Étape en cours */}
      <div ref={panelRef} className="lg:order-1 lg:col-span-7">
        <div key={state.step} className="animate-fade-up">
          {state.step === 0 && (
            <StepModel
              state={state}
              dispatch={dispatch}
              onPick={() => {
                track("configurator_step_completed", { step: 0 });
                // Le réducteur applique la sélection avant de changer d'étape : pas d'état périmé
                dispatch({ type: "goto", step: 1 });
              }}
            />
          )}
          {state.step === 1 && product && <StepDimensions state={state} dispatch={dispatch} product={product} />}
          {state.step === 2 && <StepFinish state={state} dispatch={dispatch} />}
          {state.step === 3 && <StepOptions state={state} dispatch={dispatch} />}
          {state.step === 4 && product && config && price && (
            <StepSummary
              product={product}
              config={config}
              price={price}
              onEdit={goto}
              onAdd={addToCart}
              onQuote={requestQuote}
              added={added}
              onReset={() => {
                dispatch({ type: "set", patch: initialState });
                setAdded(false);
              }}
            />
          )}
        </div>

        {!isLast && (
          <div className="mt-10 hidden items-center justify-between border-t border-line pt-6 lg:flex">
            <Button variant="ghost" icon="arrowLeft" onClick={() => goto(Math.max(0, state.step - 1) as StepIndex)} disabled={state.step === 0}>
              Retour
            </Button>
            <Button onClick={next} disabled={!canContinue} arrow size="lg">
              {state.step === 3 ? "Voir le récapitulatif" : "Continuer"}
            </Button>
          </div>
        )}
      </div>

      {/* Barre mobile : prix + action, toujours accessibles au pouce */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="container-site flex h-[76px] items-center gap-3">
          {state.step > 0 && (
            <button
              type="button"
              aria-label="Étape précédente"
              onClick={() => goto((state.step - 1) as StepIndex)}
              className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-line text-ink"
            >
              <Icon name="arrowLeft" size={20} />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <p className="t-caption truncate text-ink-3">{price ? "Prix TTC" : product ? "À partir de" : "Étape 1 sur 5"}</p>
            <p className="t-num text-xl text-ink" aria-live="polite">
              {product ? formatPrice(shownPrice) : "—"}
            </p>
          </div>
          {isLast ? (
            <Button onClick={addToCart} disabled={!config} arrow>
              Ajouter
            </Button>
          ) : (
            <Button onClick={next} disabled={!canContinue} arrow>
              Continuer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function PriceBlock({ product, total, hasConfig, quantity }: { product?: ReturnType<typeof getProduct>; total: number; hasConfig: boolean; quantity: number }) {
  if (!product) {
    return (
      <>
        <p className="t-caption text-on-night-2">Prix estimé TTC</p>
        <p className="mt-2 text-on-night-2">Le prix s&apos;affiche dès que vous choisissez un modèle.</p>
      </>
    );
  }
  return (
    <>
      <p className="t-caption text-on-night-2">{hasConfig ? `Prix TTC${quantity > 1 ? ` · ${quantity} pièces` : ""}` : "À partir de"}</p>
      <p className="t-num mt-2 text-5xl font-light tracking-[-0.04em]" aria-live="polite">
        {formatPrice(total)}
      </p>
      <p className="mt-1 text-sm text-on-night-2">TVA 21 % incluse · {product.name}</p>
    </>
  );
}
