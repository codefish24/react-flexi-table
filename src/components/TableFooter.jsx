import React from 'react';

export function TableFooter({ columns, summaries, uiFramework, styles, showColumnSummaries = true }) {
  if (!showColumnSummaries) return null;
  return (
    <tfoot>
      <tr className={uiFramework === 'tailwind' ? 'bg-gray-50 font-semibold' : 'table-active fw-bold'}>
        <td colSpan={columns.length} className={styles.tableCell}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Summary</span>
            <span style={{ fontSize: '0.875rem' }}>Total: {Object.keys(summaries).length} summaries</span>
          </div>
        </td>
      </tr>
      {Object.keys(summaries).length > 0 && (
        <tr className={uiFramework === 'tailwind' ? 'bg-gray-100' : 'table-secondary'}>
          {columns.map(col => <td key={col.key} className={styles.tableCell}>{summaries[col.key] || '-'}</td>)}
        </tr>
      )}
    </tfoot>
  );
}