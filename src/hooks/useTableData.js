import { useState, useMemo, useEffect } from 'react';

function compareValues(aVal, bVal, direction) {
  const directionMultiplier = direction === 'asc' ? 1 : -1;

  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return 1 * directionMultiplier;
  if (bVal == null) return -1 * directionMultiplier;

  if (typeof aVal === 'number' && typeof bVal === 'number') {
    return (aVal - bVal) * directionMultiplier;
  }

  return String(aVal).localeCompare(String(bVal), undefined, {
    numeric: true,
    sensitivity: 'base',
  }) * directionMultiplier;
}

export function useTableData(
  data, columns, enableSorting, enableFiltering, enableGlobalSearch,
  enablePagination, defaultPageSize,
) {
  const [sortConfig, setSortConfig] = useState(null);
  const [filters, setFilters] = useState({});
  const [globalSearch, setGlobalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 10);

  const handleSort = (key) => {
    if (!enableSorting) return;
    setSortConfig(prev => {
      if (prev?.key === key) return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      return { key, direction: 'asc' };
    });
  };

  const handleFilter = (key, value) => {
    if (!enableFiltering) return;
    setFilters(prev => {
      const next = { ...prev };
      const normalizedValue = value.trim();
      if (!normalizedValue) {
        delete next[key];
      } else {
        next[key] = normalizedValue;
      }
      return next;
    });
  };

  // Full filtered + sorted data — used for summaries and pagination count
  const processedData = useMemo(() => {
    let result = [...data];
    if (enableGlobalSearch && globalSearch.trim()) {
      const term = globalSearch.toLowerCase();
      result = result.filter(row => columns.some(col => {
        const val = row[col.key];
        return val != null && String(val).toLowerCase().includes(term);
      }));
    }
    if (enableFiltering) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val) result = result.filter(row => {
          const rowVal = row[key];
          return rowVal != null && String(rowVal).toLowerCase().includes(val.toLowerCase());
        });
      });
    }
    if (sortConfig && enableSorting) {
      result.sort((a, b) => compareValues(a[sortConfig.key], b[sortConfig.key], sortConfig.direction));
    }
    return result;
  }, [data, sortConfig, filters, globalSearch, columns, enableSorting, enableFiltering, enableGlobalSearch]);

  // Reset to page 1 whenever filters, search, or source data change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, globalSearch, data]);

  const totalRows = processedData.length;
  const totalPages = enablePagination && pageSize > 0 ? Math.max(1, Math.ceil(totalRows / pageSize)) : 1;
  const safePage = Math.min(currentPage, totalPages);

  // Paginated slice for table body rendering
  const displayData = useMemo(() => {
    if (!enablePagination) return processedData;
    const start = (safePage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, enablePagination, safePage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    processedData,       // full filtered+sorted data (for footer summaries)
    displayData,         // paginated slice (for table body)
    totalRows,
    totalPages,
    currentPage: safePage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    sortConfig,
    filters,
    globalSearch,
    handleSort,
    handleFilter,
    setGlobalSearch,
  };
}