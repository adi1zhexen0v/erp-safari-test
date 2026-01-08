import { createContext, useContext } from "react";

interface TableContextValue {
  rounded: boolean;
}

export const TableContext = createContext<TableContextValue>({ rounded: true });

export function useTableContext() {
  return useContext(TableContext);
}

