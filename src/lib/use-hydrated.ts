"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Vrai une fois côté client : évite d'afficher un panier vide avant la lecture du stockage local. */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
