"use client";

import { useSyncExternalStore } from "react";
import type { LocalOrder } from "./order";

const KEY = "aeris_orders_v1";
const listeners = new Set<() => void>();
let cache: LocalOrder[] | null = null;
const EMPTY: LocalOrder[] = [];

function read(): LocalOrder[] {
  if (cache) return cache;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown;
    cache = Array.isArray(raw) ? raw.filter((o): o is LocalOrder => !!o && typeof (o as LocalOrder).reference === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(orders: LocalOrder[]) {
  cache = orders;
  try {
    localStorage.setItem(KEY, JSON.stringify(orders.slice(0, 20)));
  } catch {
    /* stockage indisponible */
  }
  listeners.forEach((l) => l());
}

export const localOrders = {
  add: (o: LocalOrder) => write([o, ...read().filter((x) => x.reference !== o.reference)]),
  markNotified: (ref: string) => write(read().map((o) => (o.reference === ref ? { ...o, status: "notified" as const } : o))),
  get: (ref: string) => read().find((o) => o.reference === ref),
  remove: (ref: string) => write(read().filter((o) => o.reference !== ref)),
};

export function useLocalOrders() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => EMPTY,
  );
}
