import React, { useMemo } from 'react';
import { useTableData } from '../hooks/useTableData';
import { TableHeader } from './TableHeader';
import { TableFooter } from './TableFooter';

export function AdvancedTable({
  data = [],
  columns = [],
  enableSorting = true,           // default: sorting ON
  enableFiltering = false,         // default: column filters OFF
  enableGlobalSearch = true,       // default: global search ON
  enableFooter = false,            // default: footer OFF
  enablePagination = true,         // default: pagination ON
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  uiFramework = 'tailwind',
  fontFamily = 'font-inter',
  getRowKey,
  globalSearchPlaceholder = 'Search...',
  footerSummaryConfig = { enabled: false, showColumnSummaries: true }, // default: footer group OFF
}) {
  const {
    processedData,
    displayData,
    totalRows,
    totalPages,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    sortConfig,
    filters,
    globalSearch,
    handleSort,
    handleFilter,
    setGlobalSearch,
  } = useTableData(
    data, columns, enableSorting, enableFiltering, enableGlobalSearch,
    enablePagination, defaultPageSize,
  );

  // Summaries computed over full filtered data, not just the current page
  const summaries = useMemo(() => {
    const result = {};
    columns.forEach(col => {
      if (col.footerSummary) result[col.key] = col.footerSummary(processedData);
    });
    return result;
  }, [columns, processedData]);

  const tailwindStyles = {
    container: `${fontFamily} w-full`,
    searchContainer: 'mb-4 p-4 bg-gray-50 rounded-lg border',
    searchInput: 'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
    table: 'min-w-full bg-white border rounded-lg overflow-hidden',
    tableHeader: 'bg-gray-50',
    tableRow: 'border-b hover:bg-gray-50',
    tableCell: 'px-4 py-3',
    filterInput: 'mt-1 w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500',
    sortIcon: 'ml-1',
    sortButton: 'flex items-center cursor-pointer hover:text-blue-600 font-semibold',
    emptyState: 'text-center py-8 text-gray-500',
    pagination: 'flex items-center justify-between mt-4 px-1',
    paginationInfo: 'text-sm text-gray-600',
    paginationControls: 'flex items-center gap-1',
    paginationButton: 'px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed',
    paginationButtonActive: 'px-3 py-1 text-sm border rounded bg-blue-500 text-white font-semibold',
    paginationSelect: 'px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2',
  };

  const bootstrapStyles = {
    container: `${fontFamily} container-fluid p-0`,
    searchContainer: 'mb-4 p-3 bg-light rounded border',
    searchInput: 'form-control',
    table: 'table table-striped table-bordered table-hover',
    tableHeader: 'table-dark',
    tableRow: '',
    tableCell: 'align-middle',
    filterInput: 'form-control form-control-sm mt-1',
    sortIcon: 'ms-1',
    sortButton: 'd-flex align-items-center cursor-pointer user-select-none',
    emptyState: 'text-center py-5 text-muted',
    pagination: 'd-flex align-items-center justify-content-between mt-3',
    paginationInfo: 'text-muted small',
    paginationControls: 'd-flex align-items-center gap-1',
    paginationButton: 'btn btn-sm btn-outline-secondary',
    paginationButtonActive: 'btn btn-sm btn-primary',
    paginationSelect: 'form-select form-select-sm me-2',
  };

  const styles = useMemo(
    () => (uiFramework === 'tailwind' ? tailwindStyles : bootstrapStyles),
    [uiFramework, fontFamily],
  );

  const resolveRowKey = (row, idx) => {
    if (typeof getRowKey === 'function') return getRowKey(row, idx);
    if (row?.id != null) return row.id;
    return `${idx}-${columns.map((col) => row?.[col.key]).join('|')}`;
  };

  const startRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <div className={styles.container}>
      {enableGlobalSearch && (
        <div className={styles.searchContainer}>
          <input type="text" className={styles.searchInput} placeholder={globalSearchPlaceholder} 
                 value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className={styles.table}>
          <TableHeader columns={columns} sortConfig={sortConfig} filters={filters} 
                       enableSorting={enableSorting} enableFiltering={enableFiltering}
                       onSort={handleSort} onFilter={handleFilter} uiFramework={uiFramework} styles={styles} />
          <tbody>
            {displayData.map((row, idx) => (
              <tr key={resolveRowKey(row, idx)} className={styles.tableRow}>
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={[styles.tableCell, col.cellClassName].filter(Boolean).join(' ')}
                    style={{ textAlign: col.align, width: col.width, minWidth: col.minWidth }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {displayData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className={styles.emptyState} role="status">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
          {enableFooter && footerSummaryConfig.enabled && (
            <TableFooter
              columns={columns}
              summaries={summaries}
              uiFramework={uiFramework}
              styles={styles}
              showColumnSummaries={footerSummaryConfig.showColumnSummaries}
            />
          )}
        </table>
      </div>
      {enablePagination && (
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            {totalRows === 0 ? 'No results' : `Showing ${startRow}\u2013${endRow} of ${totalRows}`}
          </span>
          <div className={styles.paginationControls}>
            <select
              className={styles.paginationSelect}
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              aria-label="Rows per page"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size} / page</option>
              ))}
            </select>
            <button type="button" className={styles.paginationButton}
              onClick={() => handlePageChange(1)} disabled={currentPage === 1} aria-label="First page">
              \u00ab
            </button>
            <button type="button" className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
              \u2039
            </button>
            <PageNumbers currentPage={currentPage} totalPages={totalPages}
              onPageChange={handlePageChange} styles={styles} />
            <button type="button" className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
              \u203a
            </button>
            <button type="button" className={styles.paginationButton}
              onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Last page">
              \u00bb
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PageNumbers({ currentPage, totalPages, onPageChange, styles }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (rangeStart > 2) pages.push('ellipsis-start');
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
  if (rangeEnd < totalPages - 1) pages.push('ellipsis-end');
  if (totalPages > 1) pages.push(totalPages);

  return (
    <>
      {pages.map(p =>
        typeof p === 'string' ? (
          <span key={p} style={{ padding: '0 2px', opacity: 0.5 }} aria-hidden="true">\u2026</span>
        ) : (
          <button
            key={p}
            type="button"
            className={p === currentPage ? styles.paginationButtonActive : styles.paginationButton}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
    </>
  );
}