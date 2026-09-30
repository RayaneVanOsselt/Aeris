"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ViewTracker({ product }: { product: string }) {
  useEffect(() => track("view_product", { product }), [product]);
  return null;
}
