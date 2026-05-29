import { useQuery } from "@tanstack/react-query";

import { classesMock } from "../mocks/classes.mock";

export const useClasses = () => {
  return useQuery({
    queryKey: ["classes"],

    queryFn: async () => {
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      return classesMock;
    },
  });
};