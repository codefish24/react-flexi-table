# react-flexi-table

A modern, lightweight React data table with sorting, global search, column filters, pagination, footer summaries, and support for both **Tailwind CSS** and **Bootstrap**.

[![npm](https://img.shields.io/npm/v/@codefish24/react-flexi-table)](https://www.npmjs.com/package/@codefish24/react-flexi-table)
[![license](https://img.shields.io/npm/l/@codefish24/react-flexi-table)](LICENSE)

---

## Features

- **Sorting** — click any column header to sort asc / desc / clear
- **Global search** — instant full-table search across all columns
- **Column filters** — opt-in per-column filter inputs
- **Pagination** — built-in page navigation with page-size selector
- **Footer summaries** — computed over all filtered rows (not just current page)
- **Custom cell rendering** — full control via `col.render`
- **Per-column styles** — `align`, `width`, `minWidth`, `cellClassName`, `headerClassName`
- **Dual framework** — Tailwind CSS or Bootstrap out of the box

---

## Installation

```bash
npm install @codefish24/react-flexi-table
```

Import the stylesheet once in your app entry:

```js
import '@codefish24/react-flexi-table/dist/index.css';
```

---

## Quick Start

```jsx
import { AdvancedTable } from '@codefish24/react-flexi-table';
import '@codefish24/react-flexi-table/dist/index.css';

const columns = [
  { key: 'name',  title: 'Name',  sortable: true },
  { key: 'age',   title: 'Age',   sortable: true },
  { key: 'email', title: 'Email', sortable: true },
];

const data = [
  { id: 1, name: 'Alice',  age: 28, email: 'alice@example.com' },
  { id: 2, name: 'Bob',    age: 34, email: 'bob@example.com'   },
  { id: 3, name: 'Carol',  age: 22, email: 'carol@example.com' },
];

export default function App() {
  return <AdvancedTable data={data} columns={columns} />;
}
```

---

## Props

### `<AdvancedTable />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `array` | `[]` | Row data |
| `columns` | `array` | `[]` | Column definitions (see below) |
| `enableSorting` | `boolean` | `true` | Sort on column header click |
| `enableFiltering` | `boolean` | `false` | Show per-column filter inputs (opt-in per column via `col.filterable`) |
| `enableGlobalSearch` | `boolean` | `true` | Show global search bar |
| `enablePagination` | `boolean` | `true` | Show pagination bar |
| `defaultPageSize` | `number` | `10` | Rows shown per page |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Page size dropdown options |
| `enableFooter` | `boolean` | `false` | Show footer row |
| `footerSummaryConfig` | `object` | `{ enabled: false, showColumnSummaries: true }` | Footer options |
| `uiFramework` | `string` | `'tailwind'` | `'tailwind'` or `'bootstrap'` |
| `fontFamily` | `string` | `'font-inter'` | CSS class applied to the container |
| `getRowKey` | `function` | — | `(row, index) => key` — custom row key resolver |
| `globalSearchPlaceholder` | `string` | `'Search...'` | Placeholder for the search input |

### Column definition

| Property | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | **required** | Maps to a field in your data object |
| `title` | `string` | **required** | Column header label |
| `sortable` | `boolean` | `true` | Allow sorting on this column |
| `filterable` | `boolean` | `false` | Show a filter input (requires `enableFiltering={true}`) |
| `render` | `function` | — | `(value, row) => ReactNode` — custom cell renderer |
| `footerSummary` | `function` | — | `(allFilteredRows) => ReactNode\|string` — footer cell content |
| `align` | `string` | — | `'left'` \| `'center'` \| `'right'` |
| `width` | `number\|string` | — | Fixed column width e.g. `120` or `'10%'` |
| `minWidth` | `number\|string` | — | Minimum column width |
| `headerClassName` | `string` | — | Extra CSS class on the `<th>` |
| `cellClassName` | `string` | — | Extra CSS class on every `<td>` in this column |

---

## Examples

### Pagination

```jsx
<AdvancedTable
  data={data}
  columns={columns}
  enablePagination={true}
  defaultPageSize={25}
  pageSizeOptions={[25, 50, 100]}
/>
```

### Global search + column filters

```jsx
const columns = [
  { key: 'name',  title: 'Name',  filterable: true },
  { key: 'email', title: 'Email', filterable: true },
  { key: 'age',   title: 'Age' },  // no filter on this column
];

<AdvancedTable
  data={data}
  columns={columns}
  enableGlobalSearch={true}
  enableFiltering={true}
/>
```

### Custom cell rendering

```jsx
const columns = [
  {
    key: 'status',
    title: 'Status',
    render: (value) => (
      <span className={value === 'Active' ? 'badge-green' : 'badge-red'}>
        {value}
      </span>
    ),
  },
  {
    key: 'salary',
    title: 'Salary',
    align: 'right',
    render: (value) => `$${value.toLocaleString()}`,
  },
];
```

### Footer summaries

Footer values are computed over **all filtered rows**, so totals/averages stay correct while paginating.

```jsx
const columns = [
  {
    key: 'salary',
    title: 'Salary',
    footerSummary: (rows) =>
      `Total: $${rows.reduce((s, r) => s + r.salary, 0).toLocaleString()}`,
  },
  {
    key: 'age',
    title: 'Age',
    footerSummary: (rows) =>
      `Avg: ${Math.round(rows.reduce((s, r) => s + r.age, 0) / rows.length)}`,
  },
];

<AdvancedTable
  data={data}
  columns={columns}
  enableFooter={true}
  footerSummaryConfig={{ enabled: true, showColumnSummaries: true }}
/>
```

### Bootstrap

```jsx
<AdvancedTable data={data} columns={columns} uiFramework="bootstrap" />
```

### Custom row key

```jsx
<AdvancedTable data={data} columns={columns} getRowKey={(row) => row.uuid} />
```

---

## Local Development

```bash
# Clone and install
git clone https://github.com/codefish24/react-flexi-table.git
cd react-flexi-table
npm install

# Start the demo in the browser (hot-reload)
npm run dev

# Build the library
npm run build
```

---

## License

MIT © [codefish24](https://github.com/codefish24)


## Quick Start

```jsx
import React from 'react';
import { AdvancedTable } from '@codefish24/react-flexi-table';
import '@codefish24/react-flexi-table/dist/index.css';

const App = () => {
  const columns = [
    { key: 'name', title: 'Name', sortable: true, filterable: true },
    { key: 'age', title: 'Age', sortable: true },
    { key: 'email', title: 'Email', sortable: true, filterable: true }
  ];

  const data = [
    { name: 'John Doe', age: 28, email: 'john@example.com' },
    { name: 'Jane Smith', age: 34, email: 'jane@example.com' }
  ];

  return (
    <AdvancedTable
      data={data}
      columns={columns}
      enableSorting={true}
      enableFiltering={true}
      enableGlobalSearch={true}
      uiFramework="tailwind"
    />
  );
};

export default App;
```

## API Documentation

### Table Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| data | array | [] | Table data array |
| columns | array | [] | Column configuration (see below) |
| enableSorting | boolean | true | Enable/disable sorting globally |
| enableFiltering | boolean | true | Enable/disable filtering globally |
| enableGlobalSearch | boolean | true | Enable/disable global search |
| enableFooter | boolean | true | Show/hide footer |
| uiFramework | string | 'tailwind' | UI framework: 'tailwind' or 'bootstrap' |
| fontFamily | string | 'font-inter' | CSS font class for table text |
| globalSearchPlaceholder | string | 'Search...' | Placeholder text for global search input |
| footerSummaryConfig | object | { enabled: true, showColumnSummaries: true } | Footer configuration options |

### Column Configuration

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| key | string | Yes | Unique identifier matching data object key |
| title | string | Yes | Display text in column header |
| sortable | boolean | No | Enable sorting for this column (default: true) |
| filterable | boolean | No | Enable filtering for this column (default: true) |
| footerSummary | function | No | Custom summary calculation function |
| render | function | No | Custom cell rendering function |

### footerSummaryConfig

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | boolean | true | Enable/disable footer |
| position | string | 'bottom' | Footer position: 'top' or 'bottom' |
| showColumnSummaries | boolean | true | Show/hide column summary calculations |

## Examples

### Basic Table

```jsx
import { AdvancedTable } from '@codefish24/react-flexi-table';

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' }
];

const data = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];

<AdvancedTable data={data} columns={columns} />
```

### Table with Sorting and Filtering

```jsx
const columns = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    filterable: true
  },
  {
    key: 'age',
    title: 'Age',
    sortable: true,
    filterable: false
  },
  {
    key: 'email',
    title: 'Email',
    sortable: false,
    filterable: true
  }
];

<AdvancedTable
  data={data}
  columns={columns}
  enableSorting={true}
  enableFiltering={true}
/>
```

### Table with Footer Summaries

```jsx
const columns = [
  {
    key: 'salary',
    title: 'Salary',
    sortable: true,
    footerSummary: (data) => {
      const total = data.reduce((sum, row) => sum + row.salary, 0);
      const avg = total / data.length;
      return `Avg: $${avg} | Total: $${total}`;
    }
  },
  {
    key: 'age',
    title: 'Age',
    sortable: true,
    footerSummary: (data) => {
      const avg = data.reduce((sum, row) => sum + row.age, 0) / data.length;
      const max = Math.max(...data.map(row => row.age));
      return `Avg: ${avg} | Max: ${max}`;
    }
  }
];

<AdvancedTable
  data={data}
  columns={columns}
  enableFooter={true}
/>
```

### Custom Cell Rendering

```jsx
const columns = [
  {
    key: 'status',
    title: 'Status',
    render: (value) => (
      <span className={`badge ${value === 'Active' ? 'bg-success' : 'bg-danger'}`}>
        {value === 'Active' ? 'Active' : 'Inactive'}
      </span>
    )
  },
  {
    key: 'actions',
    title: 'Actions',
    render: (value, row) => (
      <button onClick={() => handleEdit(row)}>Edit</button>
    )
  }
];

<AdvancedTable data={data} columns={columns} />
```