import React, { useMemo, useEffect, useRef } from 'react';
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
  // Show star reminder once on first mount (dev only)
  const _starShown = useRef(false);
  useEffect(() => {
    const isDev = import.meta?.env?.DEV ?? process.env.NODE_ENV === 'development';
    if (!isDev || _starShown.current) return;
    _starShown.current = true;
    setTimeout(() => {
      console.log(
        '%c✨ Enjoying react-flexi-table? Give it a star → https://github.com/codefish24/react-flexi-table',
        'color: #f59e0b; font-size: 14px; font-weight: bold;'
      );
    }, 1000);
  }, []);

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
    card: 'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
    searchContainer: 'px-6 pt-5 pb-4 border-b border-gray-100',
    searchWrapper: 'relative',
    searchInput: 'w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-blue-400 transition-all',
    table: 'min-w-full',
    tableHeader: 'bg-gray-50 border-b border-gray-100',
    tableRow: 'border-b border-gray-50 hover:bg-blue-50/40 transition-colors duration-100',
    tableCell: 'px-6 py-3.5 text-sm text-gray-700',
    thCell: 'px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap',
    filterInput: 'mt-2 w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 normal-case tracking-normal font-normal transition-all',
    sortIcon: 'ml-1.5 inline-flex',
    sortButton: 'inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors font-semibold uppercase tracking-wider text-xs',
    emptyState: 'text-center py-16 text-gray-400 text-sm',
    pagination: 'flex items-center justify-between px-6 py-4 border-t border-gray-100',
    paginationInfo: 'text-xs text-gray-400 font-medium',
    paginationControls: 'flex items-center gap-1',
    paginationButton: 'w-8 h-8 inline-flex items-center justify-center text-sm rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
    paginationButtonActive: 'w-8 h-8 inline-flex items-center justify-center text-sm rounded-lg bg-blue-500 text-white font-semibold shadow-sm',
    paginationSelect: 'text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-gray-600 mr-2 cursor-pointer',
  };

  const bootstrapStyles = {
    container: `${fontFamily} container-fluid p-0`,
    card: 'card shadow-sm border-0',
    searchContainer: 'card-header bg-white border-bottom p-3',
    searchWrapper: 'position-relative',
    searchInput: 'form-control form-control-sm ps-5',
    table: 'table table-hover mb-0',
    tableHeader: 'table-light',
    tableRow: '',
    tableCell: 'align-middle px-3 py-2',
    thCell: 'align-middle px-3 py-2 fw-semibold text-uppercase small text-muted',
    filterInput: 'form-control form-control-sm mt-1',
    sortIcon: 'ms-1',
    sortButton: 'd-inline-flex align-items-center gap-1 cursor-pointer user-select-none text-uppercase small fw-semibold',
    emptyState: 'text-center py-5 text-muted',
    pagination: 'd-flex align-items-center justify-content-between px-3 py-2 border-top',
    paginationInfo: 'text-muted small',
    paginationControls: 'd-flex align-items-center gap-1',
    paginationButton: 'btn btn-sm btn-light',
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
      <div className={styles.card}>
      {enableGlobalSearch && (
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <svg
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5" stroke="#9CA3AF" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input type="text" className={styles.searchInput} placeholder={globalSearchPlaceholder}
                   value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} />
          </div>
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
            {totalRows === 0 ? 'No results' : `Showing ${startRow}–${endRow} of ${totalRows}`}
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
              <IconChevronsLeft />
            </button>
            <button type="button" className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
              <IconChevronLeft />
            </button>
            <PageNumbers currentPage={currentPage} totalPages={totalPages}
              onPageChange={handlePageChange} styles={styles} />
            <button type="button" className={styles.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
              <IconChevronRight />
            </button>
            <button type="button" className={styles.paginationButton}
              onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Last page">
              <IconChevronsRight />
            </button>
          </div>
        </div>
      )}
      </div>
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
          <span key={p} style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#9CA3AF' }} aria-hidden="true">&hellip;</span>
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

function IconChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChevronsLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 12L4 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 12L9 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconChevronsRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}