import { useQuery } from "@tanstack/react-query";

interface Notification {
  message: string;
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      // TODO: Implement actual API call
      return [
        { message: "New trust score update available" },
        { message: "Compliance check completed" },
      ];
    },
  });
}
