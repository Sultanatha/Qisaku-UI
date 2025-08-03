import { useMemo } from "react";

export type SortDirection = "asc" | "desc";

export function useTableData<T>(
  data: T[],
  options: {
    searchTerm: string;
    searchFields?: (keyof T)[];
    sortField?: keyof T;
    sortDirection?: SortDirection;
    currentPage: number;
    pageSize: number;
  }
) {
  const {
    searchTerm,
    searchFields = [],
    sortField,
    sortDirection = "asc",
    currentPage,
    pageSize,
  } = options;

  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(lowerSearch)
        );
      });
    });
  }, [data, searchTerm, searchFields]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Try parse date if it's a date string
      if (
        typeof aValue === "string" &&
        typeof bValue === "string" &&
        Date.parse(aValue) &&
        Date.parse(bValue)
      ) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  return {
    filteredData,
    sortedData,
    paginatedData,
    totalPages,
  };
}
