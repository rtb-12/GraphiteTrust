import { useQuery } from "@tanstack/react-query";
import { getMinedBlocks, type MinedBlock } from "../services/api";

export function useMinedBlocks(
  address: string,
  options?: {
    offset?: number;
    limit?: number;
  }
) {
  return useQuery<MinedBlock[]>({
    queryKey: ["minedBlocks", address, options],
    queryFn: () => getMinedBlocks(address, options),
    enabled: !!address && address.startsWith("0x") && address.length === 42,
  });
}
