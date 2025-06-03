import axios from "axios";

const BASE_URL = "https://api.main.atgraphite.com/api";

export interface TrustScore {
  score: number;
  lastUpdated: string;
  metrics: {
    kycStatus: string;
    regulatoryScore: number;
    transactionHistory: number;
  };
}

export interface SearchResult {
  address: string;
  type: "wallet" | "dao" | "project";
  trustScore: TrustScore;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchEntity = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await api.get(
      `/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching entity:", error);
    throw error;
  }
};

export const getTrustScore = async (address: string): Promise<TrustScore> => {
  try {
    const response = await api.get(`/trust-score/${address}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trust score:", error);
    throw error;
  }
};

export const getRecentActivity = async (address: string) => {
  try {
    const response = await api.get(`/activity/${address}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    throw error;
  }
};
