import React from 'react';
import Pagination from './pagination';
import SortableHeader, { SortDirection } from './sortable-header';

export interface DataTableColumn {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sort?: { key: string; direction: SortDirection } | null;
  onSort?: (key: string, direction: SortDirection) => void;
  className?: string;
  tableClassName?: string;
  paginationClassName?: string;
  customHeader?: React.ReactNode; // 커스텀 헤더 추가
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  page,
  totalPages,
  onPageChange,
  sort,
  onSort,
  className = '',
  tableClassName = '',
  paginationClassName = '',
  customHeader // 커스텀 헤더 prop
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* 테이블 */}
      <div className={`w-full overflow-x-auto mb-6 ${tableClassName}`}>
        <div className="min-w-[1200px]">
          {/* 컬럼 헤더 */}
          {customHeader ? (
            customHeader
          ) : (
            <div className="flex bg-[#f2f4f7]">
              {columns.map((column, idx) => (
                <div 
                  key={column.key} 
                  className={`${column.className || ''} ${idx === columns.length - 1 ? ' border-r-0' : ''}`} 
                  style={{ 
                    ...(idx === 0 ? { borderTopLeftRadius: 8 } : {}), 
                    ...(idx === columns.length - 1 ? { borderTopRightRadius: 8 } : {}) 
                  }}
                >
                  {column.sortable && onSort ? (
                    <SortableHeader
                      label={column.label}
                      sortKey={column.key}
                      currentSort={sort || null}
                      onSort={onSort}
                    />
                  ) : (
                    <span className="text-xs font-medium text-[#344051] leading-5 whitespace-nowrap font-inter text-[14px] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {column.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 테이블 본문 */}
        {data.map((row, index) => (
          <div 
            key={row.id || index} 
            className={`flex bg-white hover:bg-gray-50 transition-colors min-w-[1200px] ${index !== data.length - 1 ? 'border-b border-[#e4e7ec]' : ''}`} 
            style={{ minHeight: '68px' }}
          >
            {columns.map((column) => (
              <div key={column.key} className={column.className || ''}>
                {column.render ? column.render(row[column.key], row) : (
                  <span className="text-[#141c25] text-sm font-medium">
                    {row[column.key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* 페이징 */}
      <div className={paginationClassName}>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default DataTable; 