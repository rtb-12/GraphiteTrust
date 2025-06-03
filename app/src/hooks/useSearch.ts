import { useQuery } from "@tanstack/react-query";
import {
  searchEntity,
  getTrustScore,
  getRecentActivity,
} from "../services/api";

export const useSearch = (query: string) => {
  const searchQuery = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchEntity(query),
    enabled: query.length > 0,
  });

  const selectedAddress = searchQuery.data?.[0]?.address;

  const trustScoreQuery = useQuery({
    queryKey: ["trustScore", selectedAddress],
    queryFn: () => getTrustScore(selectedAddress!),
    enabled: !!selectedAddress,
  });

  const activityQuery = useQuery({
    queryKey: ["activity", selectedAddress],
    queryFn: () => getRecentActivity(selectedAddress!),
    enabled: !!selectedAddress,
  });

  return {
    searchResults: searchQuery.data,
    trustScore: trustScoreQuery.data,
    recentActivity: activityQuery.data,
    isLoading:
      searchQuery.isLoading ||
      trustScoreQuery.isLoading ||
      activityQuery.isLoading,
    error: searchQuery.error || trustScoreQuery.error || activityQuery.error,
  };
};
