import React from 'react';
import Pagination from './pagination';
import SortableHeader, { SortDirection } from './sortable-header';

export interface DataTableColumn {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  sticky?: boolean; // sticky 컬럼 여부
  stickyLeft?: number; // sticky 위치 (px)
  align?: 'left' | 'center' | 'right'; // 셀 정렬
  verticalAlign?: 'top' | 'middle' | 'bottom'; // 셀 수직 정렬
  headerAlign?: 'left' | 'center' | 'right'; // 헤더 정렬
  headerClassName?: string; // 헤더에 적용할 클래스
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
  useCustomTable?: boolean; // 커스텀 테이블 모드
  stickyColumns?: number; // sticky할 컬럼 수
  spacerWidth?: number; // sticky 컬럼과 일반 컬럼 사이 간격 (px)
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
  customHeader, // 커스텀 헤더 prop
  useCustomTable = false,
  stickyColumns = 0,
  spacerWidth = 0
}) => {
  // 커스텀 테이블 모드 (electric.tsx 용)
  if (useCustomTable) {
    const stickyColumnList = columns.slice(0, stickyColumns);
    const regularColumns = columns.slice(stickyColumns);
    
    return (
      <div className={`w-full ${className}`}>
        {/* 커스텀 테이블 - 기존 스타일 적용 */}
        <div className={`w-full overflow-x-auto mb-6 ${tableClassName}`}>
          <div className="min-w-[1200px]">
            <div className="bg-white border border-[#e4e7ec] rounded-lg overflow-hidden" style={{ marginRight: '32px' }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1400px] relative border-collapse">
                  {/* 테이블 헤더 */}
                  <thead>
                    {customHeader}
                  </thead>
                  {/* 테이블 바디 */}
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={row.id || index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]'} hover:bg-gray-50 transition-colors`}>
                        {/* Sticky 컬럼들 */}
                        {stickyColumnList.map((column, colIndex) => {
                          let leftPosition = 0;
                          for (let i = 0; i < colIndex; i++) {
                            const prevCol = stickyColumnList[i];
                            const width = parseInt(prevCol.className?.match(/w-\[(\d+)px\]/)?.[1] || '120');
                            leftPosition += width;
                          }
                          
                          return (
                            <td 
                              key={column.key} 
                              className={`sticky bg-inherit z-20 ${column.className || ''}`}
                              style={{ left: `${leftPosition}px` }}
                            >
                              {column.render ? column.render(row[column.key], row) : (
                                <span className="text-[#141c25] text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  {row[column.key]}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        
                        {/* 간격 컬럼 */}
                        {spacerWidth > 0 && (
                          <td className="bg-inherit" style={{ width: `${spacerWidth}px`, minWidth: `${spacerWidth}px` }}></td>
                        )}
                        
                        {/* 일반 컬럼들 */}
                        {regularColumns.map(column => (
                          <td key={column.key} className={column.className || ''}>
                            {column.render ? column.render(row[column.key], row) : (
                              <span className="text-[#141c25] text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {row[column.key]}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* 기존 페이지네이션 사용 */}
        <div className={paginationClassName}>
          <Pagination
            page={page - 1} // 0부터 시작하도록 변환
            totalPages={totalPages}
            onPageChange={(newPage) => onPageChange(newPage + 1)} // 1부터 시작하도록 변환
          />
        </div>
      </div>
    );
  }

  // 기존 테이블 모드 (기존 기능 유지)
  return (
    <div className={`w-full ${className}`}>
      {/* 테이블 */}
      <div className={`w-full overflow-x-auto mb-6 ${tableClassName}`}>
        <div className="min-w-[1200px]">
          {/* 컬럼 헤더 */}
          {customHeader ? (
            customHeader
          ) : (
            <div className="flex bg-[#F2F4F7]">
              {columns.map((column, idx) => (
                <div 
                  key={column.key} 
                  className={`${column.className || ''} ${column.headerClassName || ''} h-[40px] flex items-center ${idx === columns.length - 1 ? ' border-r-0' : ''}
                    ${column.headerAlign === 'center' ? 'justify-center' : ''}
                    ${column.headerAlign === 'right' ? 'justify-end' : ''}
                    ${column.headerAlign === 'left' || !column.headerAlign ? 'justify-start' : ''}`} 
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
                    <span className={`text-[#344051] font-['Inter'] text-[14px] leading-[20px] font-medium relative whitespace-nowrap
                      ${column.headerAlign === 'center' ? 'text-center' : ''}
                      ${column.headerAlign === 'right' ? 'text-right' : ''}
                      ${column.headerAlign === 'left' || !column.headerAlign ? 'text-left' : ''}`}>
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
              <div
                key={column.key}
                className={`px-[20px] flex
                  ${column.align === 'center' ? 'justify-center text-center' : ''}
                  ${column.align === 'right' ? 'justify-end text-right' : ''}
                  ${column.align === 'left' || !column.align ? 'justify-start text-left' : ''}
                  ${column.verticalAlign === 'middle' ? 'items-center' : ''}
                  ${column.verticalAlign === 'top' ? 'items-start' : ''}
                  ${column.verticalAlign === 'bottom' ? 'items-end' : ''}
                  ${column.className || ''}`}
              >
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