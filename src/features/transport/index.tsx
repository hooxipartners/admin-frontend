import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTransports } from '@/lib/api-hooks'
import { areaCodeMap } from '@/constants/areaCodeMap'
import Select from '@/components/ui/select'
import SectionHeader from '@/components/ui/section-header'
import FilterBar from '@/components/ui/filter-bar'
import DataTable from '@/components/ui/data-table'
import { SortDirection } from '@/components/ui/sortable-header'
import { PageHeader } from '@/components/layout/page-header'
import { PlusIcon } from '@/components/ui/icons'

import type { TransportCompany } from '@/types/transport'
import type { DataTableColumn } from '@/components/ui/data-table';

// 지역 옵션 배열 생성

// 지역 옵션 배열 생성
const AREA_OPTIONS = [
  { value: 'ALL', label: '지역' },
  ...Object.entries(areaCodeMap)
    .filter(([code]) => code !== 'ALL')
    .map(([code, name]) => ({ value: code, label: name }))
]

const LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
]

const TransportPage = () => {
  const [page, setPage] = useState(0)
  const [size, ] = useState(10)
  const [limit, setLimit] = useState<string>('10')
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(null)
  const [selectedArea, ] = useState<string[]>(['ALL'])
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState({ companyName: '', managerName: '' })

  const areaCodeParam = selectedArea.includes('ALL') ? '' : selectedArea.join(',')
  const companyNameParam = search.companyName?.trim() ? search.companyName : undefined
  const managerNameParam = search.managerName?.trim() ? search.managerName : undefined

  const { data } = useTransports(
    page,
    size,
    areaCodeParam,
    companyNameParam,
    managerNameParam
  )
  const navigate = useNavigate()

  const content: TransportCompany[] = data?.data?.content || []
  const pageInfo = data?.data?.page || {
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  }

  // 상세 버튼 아이콘 컴포넌트
  const DetailIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10" stroke="#637083" strokeWidth="1.5" fill="white" />
      <path d="M8.5 13.5L13.5 8.5" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10.5 8.5H13.5V11.5" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  // DataTable 컬럼 정의
  const tableColumns: DataTableColumn[] = [
    {
      key: 'companyName',
      label: '회사명',
      align: 'left',
      verticalAlign: 'middle',
      className: 'sticky left-0 z-10 w-[141px] min-w-[141px] max-w-[141px] px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      ),
      headerClassName: 'bg-[#F2F4F7]' // 헤더에만 배경색
    },
    {
      key: 'areaCode',
      label: '지역',
      align: 'center',
      verticalAlign: 'middle',
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{areaCodeMap[value] || value}</span>
      )
    },
    {
      key: 'corporateRegistrationNumber',
      label: '사업자번호',
      align: 'center',
      verticalAlign: 'middle',
      className: 'flex-[1] min-w-[164px] max-w-[164px] px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: string | null) => (
        <span className="text-[#344051] text-sm font-medium">{value || '-'}</span>
      )
    },
    {
      key: 'address',
      label: '주소',
      align: 'center',
      verticalAlign: 'middle',
      className: 'w-[300px] min-w-[300px]  px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: string | null, row: TransportCompany) => {
        const fullAddress = value ? `${value} ${row.detailedAddress || ''}`.trim() : '-'
        return (
          <span className="text-[#344051] text-sm font-medium truncate" title={fullAddress}>
            {fullAddress}
          </span>
        )
      }
    },
    {
      key: 'managerName',
      label: '담당자',
      align: 'center',
      verticalAlign: 'middle',
      className: 'w-[100px] min-w-[100px] max-w-[100px] px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{value}</span>
      )
    },
    {
      key: 'managerPhone',
      label: '담당자 연락처',
      align: 'center',
      verticalAlign: 'middle',
      className: 'flex-[1] min-w-[170px]  px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{value || '010-0000-0000'}</span>
      )
    },
    {
      key: 'managerEmail',
      label: '담당자 이메일',
      align: 'left',
      verticalAlign: 'middle',
      className: 'flex-[1.2] min-w-[160px]  px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{value}</span>
      )
    },
    {
      key: 'hydrogenBusCount',
      label: '수소차량',
      align: 'center',
      verticalAlign: 'middle',
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: number) => (
        <span className="text-[#344051] text-sm font-medium">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'electricBusCount',
      label: '전기차량',
      align: 'center',
      verticalAlign: 'middle',
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: number) => (
        <span className="text-[#344051] text-sm font-medium">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'busTotalCount',
      label: '전체차량',
      align: 'center',
      verticalAlign: 'middle',
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-[20px] py-2.5 flex items-center text-xs font-medium',
      sortable: false,
      render: (value: number) => (
        <span className="text-[#344051] text-sm font-medium">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'detail',
      label: '상세',
      align: 'center',
      verticalAlign: 'middle',
      className: 'sticky right-0 bg-white z-10 w-[80px] min-w-[80px] max-w-[80px] px-[20px] py-2.5 flex items-center justify-center text-xs font-medium',
      sortable: false,
      render: (_: any, row: TransportCompany) => (
        <button
          className="h-[22px] w-[22px] transition-opacity hover:opacity-70 flex items-center justify-center"
          onClick={() => navigate({ to: `/transport/${row.transportCompanyId}`, search: { tab: 'basic' } })}
          type="button"
        >
          <DetailIcon />
        </button>
      ),
      headerClassName: 'bg-[#F2F4F7]'
    }
  ]

  // 정렬 핸들러
  const handleSort = (key: string, direction: SortDirection) => {
    setSort(direction ? { key, direction } : null)
  }

  // 검색 핸들러
  const handleSearch = () => {
    const [companyName, managerName] = searchInput.split(' ')
    setSearch({ companyName: companyName || '', managerName: managerName || '' })
    setPage(0)
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* 상단 헤더 */}
      <PageHeader
        title="운수사 관리"
        // onBack prop 없음 - 뒤로가기 버튼 자동 숨김
      />

      {/* 메인 콘텐츠 영역 */}
      <div className='bg-white pt-4 pl-8 pr-8 pb-8 overflow-visible'>
        {/* 섹션 헤더 */}
        <SectionHeader
          title="운수사정보"
          count={pageInfo.totalElements}
          primaryButton={{
            text: "운수사 추가",
            onClick: () => console.log("운수사 추가"),
            icon: <PlusIcon />
          }}
        />

        {/* 필터 바 */}
        <FilterBar
          selects={[
            {
              options: AREA_OPTIONS.map(({ value, label }) => ({ value, label })),
              placeholder: "지역",
              className: "min-w-[100px]"
            }
          ]}
          searchInput={{
            placeholder: "회사명, 담당자명",
            value: searchInput,
            onChange: (value) => setSearchInput(value),
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
          data={content}
          page={page}
          totalPages={pageInfo.totalPages}
          onPageChange={setPage}
          sort={sort}
          onSort={handleSort}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/transport/')({
  component: TransportPage,
})

export {TransportPage}