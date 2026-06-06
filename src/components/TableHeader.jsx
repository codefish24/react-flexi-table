import React from 'react';

function FilterInput({ col, filters, onFilter, styles }) {
  const type = col.filterType || 'text';
  const val = filters[col.key];
  const inputBase = styles.filterInput;

  const handleChange = (value) => onFilter(col.key, value);

  if (type === 'select') {
    return (
      <select
        className={inputBase}
        aria-label={`Filter ${col.title}`}
        value={val || ''}
        onChange={(e) => handleChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="">All</option>
        {(col.filterOptions || []).map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (type === 'boolean') {
    return (
      <select
        className={inputBase}
        aria-label={`Filter ${col.title}`}
        value={val || ''}
        onChange={(e) => handleChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    );
  }

  if (type === 'number') {
    return (
      <input
        type="number"
        className={inputBase}
        placeholder={`Filter ${col.title}`}
        aria-label={`Filter ${col.title}`}
        value={val || ''}
        onChange={(e) => handleChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  if (type === 'date') {
    return (
      <input
        type="date"
        className={inputBase}
        aria-label={`Filter ${col.title}`}
        value={val || ''}
        onChange={(e) => handleChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  if (type === 'daterange') {
    const from = val?.from || '';
    const to = val?.to || '';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }} onClick={(e) => e.stopPropagation()}>
        <input
          type="date"
          className={inputBase}
          aria-label={`${col.title} from`}
          value={from}
          onChange={(e) => handleChange({ from: e.target.value, to })}
        />
        <input
          type="date"
          className={inputBase}
          aria-label={`${col.title} to`}
          value={to}
          onChange={(e) => handleChange({ from, to: e.target.value })}
        />
      </div>
    );
  }

  // default: text
  return (
    <input
      type="text"
      className={inputBase}
      placeholder={`Filter ${col.title}`}
      aria-label={`Filter ${col.title}`}
      value={val || ''}
      onChange={(e) => handleChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

function transformCase(text, caseType) {
  switch (caseType) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'none':
      return text;
    default:
      return text.toUpperCase();
  }
}

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
          const headerText = transformCase(col.title, col.headerCase);
          return (
            <th
              key={col.key}
              className={[thClass, col.headerClassName].filter(Boolean).join(' ')}
              scope="col"
              aria-sort={getAriaSort(col.key, sortable)}
              style={{ textAlign: col.align, width: col.width, minWidth: col.minWidth }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {enableSorting && sortable ? (
                  <button
                    type="button"
                    className={styles.sortButton}
                    onClick={() => onSort(col.key)}
                    aria-label={`Sort by ${col.title}`}
                  >
                    {headerText}
                    {getSortIcon(col.key)}
                  </button>
                ) : (
                  <span>{headerText}</span>
                )}
                {enableFiltering && col.filterable === true && (
                  <FilterInput col={col} filters={filters} onFilter={onFilter} styles={styles} />
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}