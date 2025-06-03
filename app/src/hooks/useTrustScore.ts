import { useQuery } from "@tanstack/react-query";

interface TrustScore {
  score: number;
  description: string;
}

export function useTrustScore(query: string) {
  return useQuery<TrustScore>({
    queryKey: ["trustScore", query],
    queryFn: async () => {
      // TODO: Implement actual API call
      return {
        score: 85,
        description:
          "High trust score based on transaction history and compliance",
      };
    },
    enabled: !!query,
  });
}
