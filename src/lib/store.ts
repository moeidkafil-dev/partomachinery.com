"use client";

import { create } from "zustand";

/**
 * UI state shared across the site shell:
 * - support panel open/close
 * - product context attached when opening support from a product CTA
 * - monotonic epoch, incremented on every open so the panel can remount
 *   with a fresh form state per session (no reset-in-effect patterns).
 */
interface SiteUiState {
  supportOpen: boolean;
  supportEpoch: number;
  supportProductContext?: string;
  openSupport: (productContext?: string) => void;
  closeSupport: () => void;
}

export const useSiteUi = create<SiteUiState>((set) => ({
  supportOpen: false,
  supportEpoch: 0,
  supportProductContext: undefined,
  openSupport: (productContext) =>
    set((s) => ({
      supportOpen: true,
      supportEpoch: s.supportEpoch + 1,
      supportProductContext: productContext,
    })),
  closeSupport: () => set({ supportOpen: false }),
}));
