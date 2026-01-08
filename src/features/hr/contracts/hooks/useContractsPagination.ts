import { usePagination, type UsePaginationReturn } from "@/shared/hooks";

export function useContractsPagination(
  total: number,
  pageSize: number = 10,
  dependencies: unknown[] = [],
): UsePaginationReturn {
  return usePagination(total, pageSize, dependencies);
}

