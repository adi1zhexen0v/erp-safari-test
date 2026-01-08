import { useState, useEffect, useMemo } from "react";

export interface UsePaginationReturn {
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  fromItem: number;
  toItem: number;
}

export function usePagination(
  total: number,
  pageSize: number = 10,
  dependencies: unknown[] = [],
): UsePaginationReturn {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const fromItem = total === 0 ? 0 : startIndex + 1;
  const toItem = Math.min(total, endIndex);

  return useMemo(
    () => ({
      page,
      setPage,
      pageSize,
      totalPages,
      startIndex,
      endIndex,
      fromItem,
      toItem,
    }),
    [page, pageSize, totalPages, startIndex, endIndex, fromItem, toItem],
  );
}

