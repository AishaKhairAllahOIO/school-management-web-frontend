import { QueryClient } from "@tanstack/react-query";

import { QUERY_DEFAULT_OPTIONS } from "@/app/providers/query/query.constants";

export const queryClient = new QueryClient({
  defaultOptions: QUERY_DEFAULT_OPTIONS,
});