import React from 'react';

export function TableHeader({ columns, sortConfig, filters, enableSorting, enableFiltering, onSort, onFilter, uiFramework, styles }) {
  const getAriaSort = (columnKey, sortable) => {
    if (!enableSorting || !sortable) return 'none';
    if (sortConfig?.key !== columnKey) return 'none';
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };

  const getSortIcon = (key) => {
    if (!enableSorting) return null;
    const isActive = sortConfig?.key === key;
    const isAsc = isActive && sortConfig.direction === 'asc';
    const isDesc = isActive && sortConfig.direction === 'desc';
    return (
      <span className={styles.sortIcon} aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 16" fill="none">
          <path d="M6 1L10 6H2L6 1Z" fill={isAsc ? '#3B82F6' : '#CBD5E1'} />
          <path d="M6 15L2 10H10L6 15Z" fill={isDesc ? '#3B82F6' : '#CBD5E1'} />
        </svg>
      </span>
    );
  };

  const thClass = styles.thCell || styles.tableCell;

  return (
    <thead className={uiFramework === 'tailwind' ? styles.tableHeader : ''}>
      <tr>
        {columns.map(col => {
          const sortable = col.sortable !== false;
          return (
            <th
              key={col.key}
              className={[thClass, col.headerClassName].filter(Boolean).join(' ')}
              scope="col"
              aria-sort={getAriaSort(col.key, sortable)}
              style={{ textAlign: col.align, width: col.width, minWidth: col.minWidth }}
            >
              {enableSorting && sortable ? (
                <button
                  type="button"
                  className={styles.sortButton}
                  onClick={() => onSort(col.key)}
                  aria-label={`Sort by ${col.title}`}
                >
                  {col.title}
                  {getSortIcon(col.key)}
                </button>
              ) : (
                <span>{col.title}</span>
              )}
              {enableFiltering && col.filterable === true && (
                <input type="text" className={styles.filterInput} placeholder={`Filter ${col.title}`}
                       aria-label={`Filter ${col.title}`}
                       value={filters[col.key] || ''} onChange={(e) => onFilter(col.key, e.target.value)}
                       onClick={(e) => e.stopPropagation()} />
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}