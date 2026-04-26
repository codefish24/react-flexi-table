import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AdvancedTable } from '../src/components/AdvancedTable';

// ── Sample data: 120 employees ──────────────────────────────────────────────
const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
const STATUSES    = ['Active', 'On Leave', 'Remote'];

const DATA = Array.from({ length: 120 }, (_, i) => ({
  id:         i + 1,
  name:       ['Alice Chen', 'Bob Smith', 'Carol Jones', 'David Kim', 'Eva Müller',
               'Frank Lee', 'Grace Wu', 'Hank Patel', 'Iris Tanaka', 'Jack Nguyen'][i % 10] + ` #${i + 1}`,
  age:        22 + (i % 40),
  department: DEPARTMENTS[i % DEPARTMENTS.length],
  salary:     40000 + (i % 20) * 2500,
  status:     STATUSES[i % STATUSES.length],
  email:      `user${i + 1}@acme.com`,
  joined:     `${2018 + (i % 6)}-${String((i % 12) + 1).padStart(2, '0')}-01`,
}));

const STATUS_COLORS = {
  Active:   'bg-green-100 text-green-700',
  'On Leave': 'bg-yellow-100 text-yellow-700',
  Remote:   'bg-blue-100 text-blue-700',
};

// ── Column definitions ───────────────────────────────────────────────────────
const COLUMNS = [
  { key: 'id',         title: '#',          width: 56,  align: 'center', sortable: true },
  { key: 'name',       title: 'Name',       sortable: true, filterable: true },
  { key: 'age',        title: 'Age',        width: 72,  align: 'center', sortable: true },
  { key: 'department', title: 'Department', sortable: true, filterable: true },
  {
    key: 'salary',
    title: 'Salary',
    align: 'right',
    sortable: true,
    render: (val) => (
      <span className="font-mono font-medium text-gray-800">
        ${val.toLocaleString()}
      </span>
    ),
    footerSummary: (rows) =>
      <span className="font-mono font-semibold text-blue-700">
        Avg ${Math.round(rows.reduce((s, r) => s + r.salary, 0) / (rows.length || 1)).toLocaleString()}
      </span>,
  },
  {
    key: 'status',
    title: 'Status',
    sortable: true,
    render: (val) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[val]}`}>
        {val}
      </span>
    ),
  },
  { key: 'email',  title: 'Email',  sortable: true },
  { key: 'joined', title: 'Joined', sortable: true, width: 110 },
];

// ── Demo App ─────────────────────────────────────────────────────────────────
function App() {
  const [framework, setFramework] = useState('tailwind');
  const [showFilters, setShowFilters] = useState(false);
  const [showFooter, setShowFooter]   = useState(true);

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          react-flexi-table <span className="text-blue-500">Demo</span>
        </h1>
        <p className="text-sm text-gray-500">120 rows · live dev preview</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-600 font-medium cursor-pointer select-none">
          <input type="checkbox" className="w-4 h-4 rounded accent-blue-500"
            checked={showFilters} onChange={e => setShowFilters(e.target.checked)} />
          Column filters
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 font-medium cursor-pointer select-none">
          <input type="checkbox" className="w-4 h-4 rounded accent-blue-500"
            checked={showFooter} onChange={e => setShowFooter(e.target.checked)} />
          Footer summary
        </label>
        <div className="ml-auto flex gap-2">
          {['tailwind', 'bootstrap'].map(fw => (
            <button
              key={fw}
              onClick={() => setFramework(fw)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors
                ${framework === fw
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {fw}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <AdvancedTable
        key={`${framework}-${showFilters}-${showFooter}`}
        data={DATA}
        columns={COLUMNS}
        uiFramework={framework}
        enableSorting={true}
        enableGlobalSearch={true}
        enableFiltering={showFilters}
        enablePagination={true}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
        enableFooter={showFooter}
        footerSummaryConfig={{ enabled: showFooter, showColumnSummaries: true }}
        globalSearchPlaceholder="Search employees..."
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
