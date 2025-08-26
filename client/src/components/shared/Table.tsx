import React, { useState, useMemo } from "react";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";
import TablePagination from "@/components/shared/TablePagination";

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  highlightRow?: (item: T) => boolean;
  onRowClick?: (item: T) => void;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (newPage: number) => void;
  isLoading?: boolean;
}

function Table<T>({
  data,
  columns,
  highlightRow,
  onRowClick,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isLoading,
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  return (
    <>
      <UITable>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`${column.className} ${
                  column.sortable ? "cursor-pointer" : ""
                }`}
                onClick={() => column.sortable && handleSort(column.accessor)}
              >
                {column.header}
                {column.sortable &&
                  sortColumn === column.accessor &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline ml-1" />
                  ) : (
                    <ChevronDown className="inline ml-1" />
                  ))}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex space-x-2 justify-center items-center bg-white">
                  <span className="sr-only">Loading...</span>
                  <div className="h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-4 w-4 bg-black rounded-full animate-bounce"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={`${
                  highlightRow && highlightRow(item) ? "bg-accent" : ""
                } ${onRowClick ? "cursor-pointer hover:bg-muted" : ""}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column, cellIndex) => (
                  <TableCell key={cellIndex} className={column.className}>
                    {column.cell
                      ? column.cell(item)
                      : String(item[column.accessor])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </UITable>
      {onPageChange && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}

export default Table;
