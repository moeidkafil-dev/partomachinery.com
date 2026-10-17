"use client";

import { useEffect, useState } from "react";

/**
 * Reactive prefers-reduced-motion (SSR-safe).
 * `?motion=static` forces the reduced-motion presentation — used for QA of
 * the static path and available to users who need it (AT-07).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const forced =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("motion") === "static";
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(forced || mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
