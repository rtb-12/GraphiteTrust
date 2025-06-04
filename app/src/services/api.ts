import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

export interface TrustScore {
  activated: boolean;
  activationBlockNumber: string | null;
  activationTxHash: string | null;
  filterLastUpdateBlockNumber: string | null;
  filterLevel: string;
  kycLastUpdateBlockNumber: string | null;
  kycLevel: string;
  reputation: string;
}

export interface AccountCounters {
  gasUsed: string;
  transactionCount: {
    total: string;
    incoming: string;
    outgoing: string;
  };
  internalTransactionCount: {
    total: string;
    incoming: string;
    outgoing: string;
  };
  tokenTransferCount: {
    total: string;
    incoming: string;
    outgoing: string;
  };
  producedBlockCount: string;
  balanceChangesCount: string;
}

export interface SearchResult {
  name: string;
  type: string;
  description: string;
}

export interface BalanceHistoryEntry {
  blockNumber: string;
  timeStamp: string;
  balance: string;
  balanceChange: string;
}

export interface MinedBlock {
  blockNumber: string;
  timeStamp: string;
  blockReward: string;
}

export interface TopAccount {
  address: string;
  balance: string;
  percentage: string;
  transactionCount: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  result: T;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchEntity = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await api.get<ApiResponse<SearchResult[]>>(
      `/search?query=${encodeURIComponent(query)}`
    );
    console.log("Search Response:", response.data);
    return response.data.result;
  } catch (error) {
    console.error("Error searching entity:", error);
    throw error;
  }
};

export const getTrustScore = async (address: string): Promise<TrustScore> => {
  try {
    const response = await api.get<ApiResponse<TrustScore>>("", {
      params: {
        module: "account",
        action: "kyc",
        address,
        tag: "latest",
        apikey: import.meta.env.VITE_GRAPHITE_API_KEY,
      },
    });
    console.log("Trust Score Response:", response.data);

    // Ensure we're returning the correct data structure
    if (response.data.status === "1" && response.data.result) {
      return {
        ...response.data.result,
        activated: response.data.result.activated === true,
        reputation: response.data.result.reputation || "0",
        kycLevel: response.data.result.kycLevel || "0",
      };
    }

    throw new Error("Invalid response format from API");
  } catch (error) {
    console.error("Error fetching trust score:", error);
    throw error;
  }
};

export const getAccountCounters = async (
  address: string
): Promise<AccountCounters> => {
  try {
    const response = await api.get<ApiResponse<AccountCounters>>("", {
      params: {
        module: "account",
        action: "counters",
        address,
        tag: "latest",
        apikey: import.meta.env.VITE_GRAPHITE_API_KEY,
      },
    });
    console.log("Account Counters Response:", response.data);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching account counters:", error);
    throw error;
  }
};

export const getBalanceHistory = async (
  address: string,
  options?: {
    startTimestamp?: number;
    endTimestamp?: number;
    offset?: number;
    limit?: number;
    sort?: "asc" | "desc";
  }
): Promise<BalanceHistoryEntry[]> => {
  try {
    const response = await api.get<ApiResponse<BalanceHistoryEntry[]>>("", {
      params: {
        module: "account",
        action: "balancehistory",
        address,
        starttimestamp: options?.startTimestamp,
        endtimestamp: options?.endTimestamp,
        offset: options?.offset || 0,
        limit: options?.limit || 10,
        sort: options?.sort || "desc",
        apikey: import.meta.env.VITE_GRAPHITE_API_KEY,
      },
    });
    console.log("Balance History Response:", response.data);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching balance history:", error);
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

export const getMinedBlocks = async (
  address: string,
  options?: {
    offset?: number;
    limit?: number;
  }
): Promise<MinedBlock[]> => {
  try {
    const response = await api.get<ApiResponse<MinedBlock[]>>("", {
      params: {
        module: "account",
        action: "getminedblocks",
        address,
        offset: options?.offset || 0,
        limit: options?.limit || 10,
        apikey: import.meta.env.VITE_GRAPHITE_API_KEY,
      },
    });
    console.log("Mined Blocks Response:", response.data);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching mined blocks:", error);
    throw error;
  }
};

export const getTopAccounts = async (options?: {
  offset?: number;
  limit?: number;
}): Promise<TopAccount[]> => {
  try {
    const response = await api.get<ApiResponse<TopAccount[]>>("", {
      params: {
        module: "account",
        action: "topbalance",
        offset: options?.offset || 0,
        limit: options?.limit || 10,
        apikey: import.meta.env.VITE_GRAPHITE_API_KEY,
      },
    });
    console.log("Top Accounts Response:", response.data);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching top accounts:", error);
    throw error;
  }
};
