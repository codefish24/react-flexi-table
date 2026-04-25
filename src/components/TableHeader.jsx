import React from 'react';

export function TableHeader({ columns, sortConfig, filters, enableSorting, enableFiltering, onSort, onFilter, uiFramework, styles }) {
  const getAriaSort = (columnKey, sortable) => {
    if (!enableSorting || !sortable) return 'none';
    if (sortConfig?.key !== columnKey) return 'none';
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };

  const getSortIcon = (key) => {
    if (!enableSorting) return null;
    if (sortConfig?.key !== key) return uiFramework === 'tailwind' ? '↕️' : '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <thead className={uiFramework === 'tailwind' ? styles.tableHeader : ''}>
      <tr>
        {columns.map(col => {
          const sortable = col.sortable !== false;

          return (
          <th key={col.key} className={styles.tableCell} scope="col" aria-sort={getAriaSort(col.key, sortable)}>
            {enableSorting && sortable ? (
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => onSort(col.key)}
                aria-label={`Sort by ${col.title}`}
              >
                {col.title}
                <span className={styles.sortIcon} aria-hidden="true">{getSortIcon(col.key)}</span>
              </button>
            ) : (
              <span>{col.title}</span>
            )}
            {enableFiltering && col.filterable !== false && (
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