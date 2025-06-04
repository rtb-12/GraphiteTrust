import { useQuery } from "@tanstack/react-query";
import { getBalanceHistory, type BalanceHistoryEntry } from "../services/api";

export function useBalanceHistory(
  address: string,
  options?: {
    startTimestamp?: number;
    endTimestamp?: number;
    offset?: number;
    limit?: number;
    sort?: "asc" | "desc";
  }
) {
  return useQuery<BalanceHistoryEntry[]>({
    queryKey: ["balanceHistory", address, options],
    queryFn: () => getBalanceHistory(address, options),
    enabled: !!address && address.startsWith("0x") && address.length === 42,
  });
}
