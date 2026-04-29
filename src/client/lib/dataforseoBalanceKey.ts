/**
 * Shared query key for the DataForSEO balance indicator.
 *
 * Mutation flows that spend DataForSEO credits should invalidate queries
 * with this key so the indicator in the top bar refreshes promptly.
 */
export const DATAFORSEO_BALANCE_QUERY_KEY = ["dataforseoBalance"] as const;
