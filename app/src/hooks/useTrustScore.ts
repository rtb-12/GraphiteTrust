import { useQuery } from "@tanstack/react-query";
import type { TrustScore } from "../services/api";
import { getTrustScore } from "../services/api";

export function useTrustScore(address: string) {
  return useQuery<TrustScore>({
    queryKey: ["trustScore", address],
    queryFn: () => getTrustScore(address),
    enabled: !!address && address.length === 42 && address.startsWith("0x"),
  });
}
