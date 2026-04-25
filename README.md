# React Flexi Table

A powerful, customizable React table component with sorting, filtering, global search, and dual framework support.

## Installation

```bash
npm install @codefish24/react-flexi-table
```

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