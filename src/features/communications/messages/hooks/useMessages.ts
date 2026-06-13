import { useQuery } from "@tanstack/react-query";

import { messagesMock } from "../mocks/messages.mock";

export const useMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
      return messagesMock;
    },
  });
};
