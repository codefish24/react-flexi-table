import React from 'react';

export function TableFooter({ columns, summaries, uiFramework, styles, showColumnSummaries = true, fontSize }) {
  if (!showColumnSummaries) return null;

  const footerRowClass = uiFramework === 'tailwind'
    ? 'bg-blue-50/60 font-semibold border-t border-blue-100 text-blue-900'
    : 'table-primary fw-bold';

  return (
    <tfoot>
      <tr className={footerRowClass}>
        {columns.map(col => (
          <td
            key={col.key}
            className={[styles.tableCell, col.cellClassName].filter(Boolean).join(' ')}
            style={{ textAlign: col.align, fontSize: fontSize?.body }}
          >
            {summaries[col.key] ?? ''}
          </td>
        ))}
      </tr>
    </tfoot>
  );
}