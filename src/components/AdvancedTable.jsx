import React, { useMemo } from 'react';
import { useTableData } from '../hooks/useTableData';
import { TableHeader } from './TableHeader';
import { TableFooter } from './TableFooter';

export function AdvancedTable({
  data = [],
  columns = [],
  enableSorting = true,
  enableFiltering = true,
  enableGlobalSearch = true,
  enableFooter = true,
  uiFramework = 'tailwind',
  fontFamily = 'font-inter',
  getRowKey,
  globalSearchPlaceholder = 'Search...',
  footerSummaryConfig = { enabled: true, showColumnSummaries: true },
}) {
  const { processedData, sortConfig, filters, globalSearch, handleSort, handleFilter, setGlobalSearch } = 
    useTableData(data, columns, enableSorting, enableFiltering, enableGlobalSearch);

  const summaries = useMemo(() => {
    const summaries = {};
    columns.forEach(col => {
      if (col.footerSummary) summaries[col.key] = col.footerSummary(processedData);
    });
    return summaries;
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
  };

  const styles = useMemo(
    () => (uiFramework === 'tailwind' ? tailwindStyles : bootstrapStyles),
    [uiFramework, fontFamily],
  );

  const resolveRowKey = (row, idx) => {
    if (typeof getRowKey === 'function') {
      return getRowKey(row, idx);
    }

    if (row?.id != null) {
      return row.id;
    }

    return `${idx}-${columns.map((col) => row?.[col.key]).join('|')}`;
  };

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
            {processedData.map((row, idx) => (
              <tr key={resolveRowKey(row, idx)} className={styles.tableRow}>
                {columns.map(col => <td key={col.key} className={styles.tableCell}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>)}
              </tr>
            ))}
            {processedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className={styles.emptyState} role="status">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
          {enableFooter && footerSummaryConfig.enabled && (
            <TableFooter columns={columns} summaries={summaries} uiFramework={uiFramework} 
                         styles={styles} showColumnSummaries={footerSummaryConfig.showColumnSummaries} />
          )}
        </table>
      </div>
    </div>
  );
}