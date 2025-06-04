import { useQuery } from "@tanstack/react-query";
import { getTopAccounts, type TopAccount } from "../services/api";

export function useTopAccounts(options?: { offset?: number; limit?: number }) {
  return useQuery<TopAccount[]>({
    queryKey: ["topAccounts", options],
    queryFn: () => getTopAccounts(options),
  });
}
