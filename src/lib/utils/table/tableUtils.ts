import { Dispatch, SetStateAction } from "react";
import { SortDirection } from "@/lib/hooks/useTableData"; // sesuaikan path

export function handleSort<T extends string>(
  field: T,
  sortField: T,
  setSortField: Dispatch<SetStateAction<T>>,
  sortDirection: SortDirection,
  setSortDirection: Dispatch<SetStateAction<SortDirection>>
) {
  if (sortField === field) {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortDirection("asc");
  }
}
