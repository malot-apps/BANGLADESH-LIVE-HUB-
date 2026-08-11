'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  CheckSquare,
  Square,
  MinusSquare,
  Inbox,
  Loader2,
} from 'lucide-react';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface BulkAction<T> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'danger' | 'secondary';
  onClick: (selectedItems: T[]) => void;
}

export interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  searchableKeys?: (keyof T | string)[];
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  renderActions?: (item: T) => React.ReactNode;
  bulkActions?: BulkAction<T>[];
  emptyMessage?: string;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  headerTools?: React.ReactNode;
  selectable?: boolean;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function AdminDataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  searchableKeys,
  searchPlaceholder = 'Search records...',
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  renderActions,
  bulkActions,
  emptyMessage = 'No records found.',
  loading = false,
  title,
  subtitle,
  headerTools,
  selectable = false,
  onRowClick,
  className = '',
}: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // 1. Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const query = searchTerm.toLowerCase();
    return data.filter((item) => {
      if (searchableKeys && searchableKeys.length > 0) {
        return searchableKeys.some((k) => {
          const val = item[k as keyof T];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(query);
        });
      }

      // Default fallback: search all top-level primitives
      return Object.values(item).some((val) => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchTerm, searchableKeys]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // 3. Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, safeCurrentPage, pageSize]);

  // Handlers
  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const toggleSelectAllCurrentPage = () => {
    const currentKeys = paginatedData.map(keyExtractor);
    const allSelected = currentKeys.every((k) => selectedKeys.has(k));

    const next = new Set(selectedKeys);
    if (allSelected) {
      currentKeys.forEach((k) => next.delete(k));
    } else {
      currentKeys.forEach((k) => next.add(k));
    }
    setSelectedKeys(next);
  };

  const toggleSelectRow = (key: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = new Set(selectedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelectedKeys(next);
  };

  const selectedItems = useMemo(() => {
    return data.filter((item) => selectedKeys.has(keyExtractor(item)));
  }, [data, selectedKeys, keyExtractor]);

  const currentPageKeys = paginatedData.map(keyExtractor);
  const isAllCurrentPageSelected =
    currentPageKeys.length > 0 && currentPageKeys.every((k) => selectedKeys.has(k));
  const isSomeCurrentPageSelected =
    currentPageKeys.some((k) => selectedKeys.has(k)) && !isAllCurrentPageSelected;

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-100 ${className}`}>
      {/* Top Header & Toolbar */}
      {(title || subtitle || headerTools || searchableKeys !== undefined || searchPlaceholder) && (
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-sm">
          <div>
            {title && <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">{title}</h2>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Custom Header Tools */}
            {headerTools}
          </div>
        </div>
      )}

      {/* Bulk Actions Bar (if any rows selected) */}
      {selectable && selectedKeys.size > 0 && bulkActions && bulkActions.length > 0 && (
        <div className="px-5 py-2.5 bg-red-950/40 border-b border-red-900/40 flex items-center justify-between gap-4 animate-in fade-in duration-200">
          <span className="text-xs font-medium text-red-300">
            {selectedKeys.size} item{selectedKeys.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => {
              const variantClasses =
                action.variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : action.variant === 'primary'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200';

              return (
                <button
                  key={idx}
                  onClick={() => action.onClick(selectedItems)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${variantClasses}`}
                >
                  {action.icon}
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Table Area */}
      <div className="overflow-x-auto relative min-h-[220px]">
        {loading && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] z-20 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
            <span className="text-xs text-slate-300 font-medium">Loading data...</span>
          </div>
        )}

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold tracking-wider uppercase text-[11px] select-none">
              {selectable && (
                <th className="p-3 pl-4 w-10 text-center">
                  <button
                    onClick={toggleSelectAllCurrentPage}
                    className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                    title="Select/Deselect All on Current Page"
                  >
                    {isAllCurrentPageSelected ? (
                      <CheckSquare className="w-4 h-4 text-red-500" />
                    ) : isSomeCurrentPageSelected ? (
                      <MinusSquare className="w-4 h-4 text-red-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass =
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                    ? 'text-right'
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key, col.sortable)}
                    className={`p-3 ${alignClass} ${col.className || ''} ${
                      col.sortable ? 'cursor-pointer hover:text-slate-200 transition-colors' : ''
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'right'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-500">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-red-400" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-red-400" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}

              {renderActions && <th className="p-3 pr-4 text-right">Actions</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (renderActions ? 1 : 0)}
                  className="py-12 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                    <p className="text-xs font-medium text-slate-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => {
                const key = keyExtractor(item);
                const isSelected = selectedKeys.has(key);

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`group transition-colors ${
                      isSelected
                        ? 'bg-red-950/20 hover:bg-red-950/30'
                        : 'hover:bg-slate-800/40'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {selectable && (
                      <td className="p-3 pl-4 text-center">
                        <button
                          onClick={(e) => toggleSelectRow(key, e)}
                          className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-red-500" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    )}

                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left';

                      return (
                        <td key={col.key} className={`p-3 ${alignClass} ${col.className || ''}`}>
                          {col.render
                            ? col.render(item, idx)
                            : String(item[col.key] ?? '')}
                        </td>
                      );
                    })}

                    {renderActions && (
                      <td
                        className="p-3 pr-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center justify-end gap-1">
                          {renderActions(item)}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 px-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Showing{' '}
            <strong className="text-slate-200">
              {sortedData.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-slate-200">
              {Math.min(safeCurrentPage * pageSize, sortedData.length)}
            </strong>{' '}
            of <strong className="text-slate-200">{sortedData.length}</strong> entries
          </span>

          {/* Page size dropdown */}
          <div className="flex items-center gap-1.5 ml-2">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-red-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage <= 1}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-300"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage <= 1}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-300"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-medium text-slate-200">
            Page {safeCurrentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage >= totalPages}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-300"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage >= totalPages}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-300"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDataTable;
