# react-flexi-table

A modern, lightweight React data table with sorting, global search, typed column filters, pagination, footer summaries, and support for both **Tailwind CSS** and **Bootstrap**.

[![npm](https://img.shields.io/npm/v/@codefish24/react-flexi-table)](https://www.npmjs.com/package/@codefish24/react-flexi-table)
[![license](https://img.shields.io/npm/l/@codefish24/react-flexi-table)](LICENSE)

---

## Features

- **Sorting** — click any column header to sort asc / desc / clear
- **Global search** — instant full-table search across all columns
- **Typed column filters** — text, select, number, date, date range, boolean — opt-in per column
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
| `fontSize` | `string \| object` | `'md'` | Font size preset (`'sm'`, `'md'`, `'lg'`) or custom object `{ wrapper, header, body }` |
| `getRowKey` | `function` | — | `(row, index) => key` — custom row key resolver |
| `globalSearchPlaceholder` | `string` | `'Search...'` | Placeholder for the search input |

### Column definition

| Property | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | **required** | Maps to a field in your data object |
| `title` | `string` | **required** | Column header label |
| `sortable` | `boolean` | `true` | Allow sorting on this column |
| `filterable` | `boolean` | `false` | Show a filter input (requires `enableFiltering={true}`) |
| `filterType` | `string` | `'text'` | Filter input type — see table below |
| `filterOptions` | `string[]` | — | Options for `'select'` filter type |
| `render` | `function` | — | `(value, row) => ReactNode` — custom cell renderer |
| `footerSummary` | `function` | — | `(allFilteredRows) => ReactNode\|string` — footer cell content |
| `align` | `string` | — | `'left'` \| `'center'` \| `'right'` |
| `width` | `number\|string` | — | Fixed column width e.g. `120` or `'10%'` |
| `minWidth` | `number\|string` | — | Minimum column width |
| `headerClassName` | `string` | — | Extra CSS class on the `<th>` |
| `cellClassName` | `string` | — | Extra CSS class on every `<td>` in this column |
| `headerCase` | `string` | `'uppercase'` | Header text transform: `'uppercase'`, `'lowercase'`, `'title'`, `'sentence'`, or `'none'` |

### Filter types (`filterType`)

| Value | UI rendered | Match behaviour |
|---|---|---|
| `'text'` (default) | Text input | Case-insensitive substring match |
| `'select'` | Dropdown | Exact string match — provide `filterOptions: []` |
| `'number'` | Number input | Exact numeric equality |
| `'boolean'` | Yes / No / All dropdown | Boolean / truthy equality |
| `'date'` | Date picker | Matches rows whose value starts with the selected date string |
| `'daterange'` | Two date pickers (From / To) | Inclusive date range |

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
  { key: 'name',  title: 'Name',  filterable: true },           // text (default)
  { key: 'email', title: 'Email', filterable: true },           // text (default)
  { key: 'age',   title: 'Age' },                               // no filter
];

<AdvancedTable
  data={data}
  columns={columns}
  enableGlobalSearch={true}
  enableFiltering={true}
/>
```

### Typed column filters

```jsx
const columns = [
  // Free-text search
  { key: 'name', title: 'Name', filterable: true, filterType: 'text' },

  // Dropdown — pick from a fixed list
  {
    key: 'department',
    title: 'Department',
    filterable: true,
    filterType: 'select',
    filterOptions: ['Engineering', 'Design', 'Marketing', 'Sales'],
  },

  // Numeric equality
  { key: 'age', title: 'Age', filterable: true, filterType: 'number' },

  // Yes / No toggle
  { key: 'active', title: 'Active', filterable: true, filterType: 'boolean' },

  // Single date picker
  { key: 'created', title: 'Created', filterable: true, filterType: 'date' },

  // From / To date range
  { key: 'joined', title: 'Joined', filterable: true, filterType: 'daterange' },
];

<AdvancedTable
  data={data}
  columns={columns}
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

### Header text case

Control the column header text transformation per column:

```jsx
const columns = [
  { key: 'name', title: 'Name', headerCase: 'title' },        // "Name"
  { key: 'email', title: 'Email Address', headerCase: 'sentence' }, // "Email address"
  { key: 'status', title: 'Status', headerCase: 'none' },     // "Status" (as-is)
  { key: 'age', title: 'Age' },                               // "AGE" (default: uppercase)
];
```

### Font size

Use a preset or customize font sizes for wrapper, header, and body cells:

```jsx
// Preset sizes
<AdvancedTable data={data} columns={columns} fontSize="sm" />  // Small
<AdvancedTable data={data} columns={columns} fontSize="md" />  // Medium (default)
<AdvancedTable data={data} columns={columns} fontSize="lg" />  // Large

// Custom sizes
<AdvancedTable
  data={data}
  columns={columns}
  fontSize={{
    wrapper: '14px',   // Table wrapper base size
    header: '12px',    // Header cells
    body: '13px'       // Body cells
  }}
/>
```

**Preset values:**

| Preset | Wrapper | Header | Body |
|--------|---------|--------|------|
| `sm` | 13px | 11px | 12px |
| `md` | 14px | 12px | 13px |
| `lg` | 16px | 14px | 15px |

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