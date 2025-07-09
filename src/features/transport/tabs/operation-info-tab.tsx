import { useState } from 'react';
import Select from '@/components/ui/select'
import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import FilterBar from '@/components/ui/filter-bar';
import SectionHeader from '@/components/ui/section-header';
import PdfIcon from '@/components/ui/icons/pdf-icon';
import TrashIcon from '@/components/ui/icons/trash-icon';
import FileCheckIcon from '@/components/ui/icons/file-check-icon';
import FileErrorIcon from '@/components/ui/icons/file-error-icon';
import FileWaitIcon from '@/components/ui/icons/file-wait-icon';
import { SortDirection } from '@/components/ui/sortable-header';


const LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];
// 목업 데이터 (간단화)
const getOperationMockData = () => Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  fileName: '다모아자동차(주)_총전량데이터.xlsx',
  range: '2019-01 ~ 2024-12',
  types: ['총전량', '주행거리', '주유량'],
  upload: i === 3 ? 80 : 100,
  date: '2020-04-20',
  status: i === 3 ? 'x' : (i === 4 ? 'loading' : 'check'),
}));

// 1. 테이블 컬럼 정의 및 목업 row 데이터 교체
const tableColumns = [
  { 
    key: 'fileName', 
    label: '운행정보 데이터', 
    className: 'flex-[2] min-w-[240px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
    sortable: false,
    render: (value: string, row: any) => (
      <div className="flex items-center gap-2">
        <PdfIcon />
        <span className="truncate text-[#141c25] text-sm font-medium">{value}</span>
      </div>
    )
  },
  { 
    key: 'range', 
    label: '데이터 범위', 
    className: 'flex-1 min-w-[140px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-[#141c25] text-sm font-medium',
    sortable: false
  },
  { 
    key: 'types', 
    label: '데이터 유형', 
    className: 'flex-1 min-w-[180px] px-4 py-2.5 flex items-center gap-2 border-r border-[#e4e7ec]',
    sortable: false,
    render: (value: string[], row: any) => (
      <>
        {value.map((type, i) => {
          let badgeType: 'charge' | 'mileage' | 'fuel' = 'charge';
          if (type === '충전량') badgeType = 'charge';
          else if (type === '주행거리') badgeType = 'mileage';
          else if (type === '주유량') badgeType = 'fuel';
          return (
            <Badge key={i} type={badgeType}>{type}</Badge>
          );
        })}
      </>
    )
  },
  { 
    key: 'upload', 
    label: '업로드상태', 
    className: 'flex-1 min-w-[160px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec]',
    sortable: false,
    render: (value: number, row: any) => (
      <div className="w-full h-2 rounded-full bg-[#f2f4f7] flex items-center">
        <div className={`h-2 rounded-full ${value === 100 ? 'bg-[#0166ff] w-full' : 'bg-[#0166ff]'}`} style={{ width: value + '%' }} />
      </div>
    )
  },
  { 
    key: 'date', 
    label: '파일등록일', 
    className: 'flex-1 min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-[#141c25] text-sm font-medium',
    sortable: true
  },
  { 
    key: 'status', 
    label: '파일상태', 
    className: 'flex-1 min-w-[80px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec]',
    sortable: false,
    render: (value: string, row: any) => (
      <>
        {value === 'check' && <FileCheckIcon />}
        {value === 'x' && <FileErrorIcon />}
        {value === 'loading' && <FileWaitIcon />}
      </>
    )
  },
  { 
    key: 'action', 
    label: '비고', 
    className: 'flex-1 min-w-[80px] px-4 py-2.5 flex items-center justify-center text-xs font-medium',
    sortable: false,
    render: (value: any, row: any) => <TrashIcon />
  },
];


// 데이터유형 Enum 프론트 상수화
const ACCOUNT_INFO_TYPE_OPTIONS = [
  { value: 'MILEAGE', label: '주행거리' },
  { value: 'FUEL', label: '주유량' },
  { value: 'CHARGE', label: '충전량' },
  { value: 'ORS', label: 'ORS' },
];

export const OperationInfoTab = () => {
  const [limit, setLimit] = useState<string>('10');
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(null);
  const size = 10;
  const rows = getOperationMockData().slice(page * size, (page + 1) * size)
  const totalElements = getOperationMockData().length
  const totalPages = Math.ceil(totalElements / size)
  const lastUpdated = '2025-06-25 15:rows20'

  const handleSort = (key: string, direction: SortDirection) => {
    setSort(direction ? { key, direction } : null);
    // 여기에 실제 정렬 로직 추가 가능
    console.log('Sort:', key, direction);
  };

  return (
    <div className="w-full min-h-screen pt-4">
      {/* 헤더 */}
      <SectionHeader
        title="운행정보"
        count={totalElements}
        lastUpdated={lastUpdated}
        secondaryButton={{
          text: "목록 업데이트",
          onClick: () => console.log("목록 업데이트"),
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_770_5826)">
                <path d="M5.56476 17.1395C2.10975 15.0177 0.631928 10.6321 2.26422 6.78667C4.06251 2.55016 8.95468 0.573595 13.1912 2.37189C17.4277 4.17018 19.4043 9.06234 17.606 13.2988C16.9033 14.9542 15.7282 16.2646 14.3045 17.1395M18.3335 17.5001H14.6669C14.3907 17.5001 14.1669 17.2762 14.1669 17.0001V13.3334M10.0002 18.3418L10.0085 18.3325" stroke="#344051" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_770_5826">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          )
        }}
        primaryButton={{
          text: "운행 추가",
          onClick: () => console.log("운행 추가"),
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        }}
      />
      {/* 필터 바 */}
      <FilterBar
        selects={[
          {
            options: ACCOUNT_INFO_TYPE_OPTIONS.map(({ value, label }) => ({ value, label })),
            placeholder: "데이터유형",
            className: "min-w-[120px]"
          }
        ]}
        searchInput={{
          placeholder: "차량번호",
          value: "",
          onChange: () => {},
          onKeyDown: () => {}
        }}
        searchButton={{
          text: "검색",
          onClick: () => console.log("검색")
        }}
        rightSection={
          <>
            <span className="text-xs text-[#637083]">Rows per page</span>
            <Select 
              options={LIMIT_OPTIONS.map(opt => ({ label: opt.label, value: String(opt.value) }))} 
              value={limit} 
              onValueChange={setLimit} 
              simple 
              className="w-20" 
            />
          </>
        }
      />
      {/* 테이블 */}
      <DataTable
        columns={tableColumns}
        data={rows}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        sort={sort}
        onSort={handleSort}
      />
    </div>
  )
}
