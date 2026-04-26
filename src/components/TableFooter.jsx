import React from 'react';

export function TableFooter({ columns, summaries, uiFramework, styles, showColumnSummaries = true }) {
  if (!showColumnSummaries) return null;

  const footerRowClass = uiFramework === 'tailwind'
    ? 'bg-gray-100 font-semibold border-t-2 border-gray-300'
    : 'table-active fw-bold';

  return (
    <tfoot>
      <tr className={footerRowClass}>
        {columns.map(col => (
          <td
            key={col.key}
            className={[styles.tableCell, col.cellClassName].filter(Boolean).join(' ')}
            style={{ textAlign: col.align }}
          >
            {summaries[col.key] ?? ''}
          </td>
        ))}
      </tr>
    </tfoot>
  );
}