import { createServerFn } from "@tanstack/react-start";
import { fetchDataforseoAccountState } from "@/server/lib/dataforseoAccountState";
import { isHostedServerAuthMode } from "@/server/lib/runtime-env";

export type DataforseoBalanceResult = {
  /**
   * Whether a balance value is available. False when running in hosted mode
   * (billing handled via Autumn, not the user's DataForSEO account) or when
   * the API call fails.
   */
  available: boolean;
  balance: number | null;
  currency: string | null;
  fetchedAt: string;
  errorMessage: string | null;
};

export const getDataforseoBalance = createServerFn({ method: "GET" }).handler(
  async (): Promise<DataforseoBalanceResult> => {
    const fetchedAt = new Date().toISOString();

    // In hosted mode the connected DataForSEO account belongs to the platform,
    // not the end user. Surface a no-balance state so the indicator hides.
    if (await isHostedServerAuthMode()) {
      return {
        available: false,
        balance: null,
        currency: null,
        fetchedAt,
        errorMessage: null,
      };
    }

    try {
      const state = await fetchDataforseoAccountState();
      if (!state || state.moneyBalance === null) {
        return {
          available: false,
          balance: null,
          currency: state?.moneyCurrency ?? null,
          fetchedAt,
          errorMessage: null,
        };
      }
      return {
        available: true,
        balance: state.moneyBalance,
        currency: state.moneyCurrency,
        fetchedAt,
        errorMessage: null,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch balance";
      return {
        available: false,
        balance: null,
        currency: null,
        fetchedAt,
        errorMessage: message,
      };
    }
  },
);
