"use client";

import { useSyncExternalStore } from "react";
import type { Configuration } from "./pricing";

/**
 * Panier stocké dans le navigateur (localStorage : strictement nécessaire,
 * aucune donnée personnelle). Les prix ne sont PAS stockés : ils sont
 * recalculés à partir du catalogue, et le serveur les recalcule à nouveau.
 */
export type CartItem = { id: string; config: Configuration; addedAt: string };

const KEY = "aeris_cart_v2";
const listeners = new Set<() => void>();
let cache: CartItem[] | null = null;
const EMPTY: CartItem[] = [];

function isConfig(value: unknown): value is Configuration {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.productId === "string" &&
    typeof c.width === "number" &&
    typeof c.height === "number" &&
    typeof c.meshId === "string" &&
    typeof c.colorId === "string" &&
    Array.isArray(c.optionIds) &&
    typeof c.quantity === "number"
  );
}

function read(): CartItem[] {
  if (cache) return cache;
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as unknown;
    cache = Array.isArray(raw)
      ? raw.filter((i): i is CartItem => !!i && typeof i === "object" && typeof (i as CartItem).id === "string" && isConfig((i as CartItem).config))
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: CartItem[]) {
  cache = items;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* navigation privée : le panier reste en mémoire */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  add(config: Configuration) {
    const item: CartItem = { id: crypto.randomUUID(), config, addedAt: new Date().toISOString() };
    write([...read(), item]);
    window.dispatchEvent(new CustomEvent("aeris:cart-added", { detail: item }));
    return item;
  },
  update(id: string, patch: Partial<Configuration>) {
    write(read().map((i) => (i.id === id ? { ...i, config: { ...i.config, ...patch } } : i)));
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
  items: read,
};

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useCartCount(): number {
  return useCart().reduce((n, i) => n + i.config.quantity, 0);
}
