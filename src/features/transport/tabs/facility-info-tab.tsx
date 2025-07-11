import { useState } from 'react'
import SectionHeader from '@/components/ui/section-header'
import FilterBar from '@/components/ui/filter-bar'
import DataTable from '@/components/ui/data-table'
import Select from '@/components/ui/select'
import { SortDirection } from '@/components/ui/sortable-header'
import { CheckIcon, DetailIcon } from '@/components/ui/icons'

import type { FacilityData } from '@/types/transport'

// 설비정보 목업 데이터

// 설비정보 목업 데이터
const getFacilityMockData = (): FacilityData[] => [
  // 첫 번째 차고지 그룹 (1개 설비)
  {
    id: 1,
    garage: '경기 포천시 내촌면 음고개길 7 내촌전기충전소',
    acMeterNo: '06212036315',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0004',
    chargerYear: '2020-04',
    proof2: true
  },
  // 두 번째 차고지 그룹 (2개 설비)
  {
    id: 2,
    garage: '경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소',
    acMeterNo: '02212057689',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0001',
    chargerYear: '2020-04',
    proof2: true
  },
  {
    id: 3,
    garage: '경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소',
    acMeterNo: '02212057689',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0015',
    chargerYear: '2020-04',
    proof2: true
  },
  // 세 번째 차고지 그룹 (7개 설비)
  {
    id: 4,
    garage: '경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소',
    acMeterNo: '25212037354',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0005',
    chargerYear: '2020-04',
    proof2: true
  },
  {
    id: 5,
    garage: '경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소',
    acMeterNo: '25212037354',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0002',
    chargerYear: '2020-04',
    proof2: true
  },
  {
    id: 6,
    garage: '경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소',
    acMeterNo: '25212037354',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0003',
    chargerYear: '2020-04',
    proof2: true
  },
  {
    id: 7,
    garage: '경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소',
    acMeterNo: '25212037354',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0006',
    chargerYear: '2020-04',
    proof2: true
  },
  {
    id: 8,
    garage: '경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소',
    acMeterNo: '25212037354',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0005',
    chargerYear: '2020-04',
    proof2: true
  },
  {
    id: 9,
    garage: '경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소',
    acMeterNo: '25212037354',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0005',
    chargerYear: '2020-04',
    proof2: true
  },
  {
    id: 10,
    garage: '경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소',
    acMeterNo: '25212037354',
    acMeterYear: '2020-04',
    proof1: true,
    chargerNo: 'PUMPKIN-24002C2-DB-0005',
    chargerYear: '2020-04',
    proof2: true
  }
]

const LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
]

export const FacilityInfoTab = () => {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState<string>('10')
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const size = 10
  const rows = getFacilityMockData().slice(page * size, (page + 1) * size)
  const totalElements = getFacilityMockData().length
  const totalPages = Math.ceil(totalElements / size)



  // DataTable 컬럼 정의
  const tableColumns = [
    { 
      key: 'garage', 
      label: '차고지', 
      className: 'flex-[2] min-w-[300px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium leading-5">{value}</span>
      )
    },
    { 
      key: 'acMeterNo', 
      label: 'AC전력량계 제조번호', 
      className: 'flex-[1.5] min-w-[180px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'acMeterYear', 
      label: 'AC전력량계 제조년월', 
      className: 'flex-[1.2] min-w-[160px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'proof1', 
      label: '증빙자료', 
      className: 'flex-[0.8] min-w-[100px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: boolean) => value ? <CheckIcon /> : null
    },
    { 
      key: 'chargerNo', 
      label: '충전기 제조번호', 
      className: 'flex-[1.8] min-w-[200px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'chargerYear', 
      label: '충전기 제조년월', 
      className: 'flex-[1.2] min-w-[140px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'proof2', 
      label: '증빙자료', 
      className: 'flex-[0.8] min-w-[100px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: boolean) => value ? <CheckIcon /> : null
    },
    { 
      key: 'detail', 
      label: '상세', 
      className: 'w-[60px] min-w-[60px] max-w-[60px] px-0 py-0 flex items-center justify-center sticky right-0 bg-white z-10 border-l border-[#e4e7ec]',
      sortable: false,
      render: (_: any, row: FacilityData) => (
        <button
          className="h-[22px] w-[22px] transition-opacity hover:opacity-70 flex items-center justify-center"
          onClick={() => console.log('Detail clicked for:', row.id)}
          type="button"
        >
          <DetailIcon />
        </button>
      )
    }
  ]

  // 정렬 핸들러
  const handleSort = (key: string, direction: SortDirection) => {
    setSort(direction ? { key, direction } : null)
  }

  // 검색 핸들러
  const handleSearch = () => {
    console.log('Search:', searchQuery)
  }

  return (
    <div className="w-full min-h-screen pl-8 pr-8 pt-4">
      {/* 섹션 헤더 */}
      <SectionHeader
        title="설비정보"
        count={totalElements}
        primaryButton={{
          text: "설비 추가",
          onClick: () => console.log("설비 추가"),
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        }}
      />

      {/* 필터 바 */}
      <FilterBar
        searchInput={{
          placeholder: "차고지명",
          value: searchQuery,
          onChange: (value) => setSearchQuery(value),
          onKeyDown: (e) => e.key === 'Enter' && handleSearch()
        }}
        searchButton={{
          text: "검색",
          onClick: handleSearch
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