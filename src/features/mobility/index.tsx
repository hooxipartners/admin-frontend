import  { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMobilities } from '@/lib/api-hooks'
import { BUSINESS_TYPE_MAP } from '@/constants/businessType'
import { FUEL_TYPE_MAP } from '@/constants/fuelType'
import { MOBILITY_TYPE_MAP } from '@/constants/mobilityType'
import Select from '@/components/ui/select'
import SectionHeader from '@/components/ui/section-header'
import FilterBar from '@/components/ui/filter-bar'
import DataTable from '@/components/ui/data-table'
import { SortDirection } from '@/components/ui/sortable-header'
import { PageHeader } from '@/components/layout/page-header'
import { DetailIcon, CheckIcon, PlusIcon } from '@/components/ui/icons'

import type { MobilityResponseDto } from '@/types/api/mobility'
import { RefreshIcon } from '@/components/ui/icons/refresh-icon.tsx'

// 연료구분 옵션 배열 생성
const FUEL_TYPE_OPTIONS = [
  { value: 'ALL', label: '연료구분' },
  ...Object.entries(FUEL_TYPE_MAP)
    .filter(([code]) => code !== 'ALL')
    .map(([code, name]) => ({ value: code, label: name }))
]

// 차량구분 옵션 배열 생성
const MOBILITY_TYPE_OPTIONS = [
  { value: 'ALL', label: '차량구분' },
  ...Object.entries(MOBILITY_TYPE_MAP)
    .filter(([code]) => code !== 'ALL')
    .map(([code, name]) => ({ value: code, label: name }))
]

const LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
]

const MobilityPage = () => {
  const [page, setPage] = useState(0)
  const [size, ] = useState(10)
  const [limit, setLimit] = useState<string>('10')
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(null)
  const [selectedBusinessType, ] = useState<string[]>(['ALL'])
  const [selectedFuelType, ] = useState<string[]>(['ALL'])
  const [selectedMobilityType, ] = useState<string[]>(['ALL'])
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState({ mobilityNo: '', model: '' })

  // 임시로 transportCompanyId를 1로 설정 (실제로는 URL 파라미터나 상태에서 가져와야 함)
  const transportCompanyId = 1

  const businessTypeParam = selectedBusinessType.includes('ALL') ? '' : selectedBusinessType.join(',')
  const fuelTypeParam = selectedFuelType.includes('ALL') ? '' : selectedFuelType.join(',')
  const mobilityTypeParam = selectedMobilityType.includes('ALL') ? '' : selectedMobilityType.join(',')
  const mobilityNoParam = search.mobilityNo?.trim() ? search.mobilityNo : undefined
  const modelParam = search.model?.trim() ? search.model : undefined

  useMobilities(
    transportCompanyId,
    {
      page,
      size,
      businessType: businessTypeParam,
      fuelType: fuelTypeParam,
      mobilityType: mobilityTypeParam,
      mobilityNo: mobilityNoParam,
      model: modelParam
    }
  )
  const navigate = useNavigate()

  // 목업 데이터
  const mockData: MobilityResponseDto[] = [
    {
      mobilityId: 1,
      mobilityNo: '서울71사2208',
      projectId: 1,
      projectName: '부천001',
      businessType: 'NEW',
      vin: 'KMJTA18XPLCC32528',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'ELECTRIC',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: true
    },
    {
      mobilityId: 2,
      mobilityNo: '서울71사2209',
      projectId: 1,
      projectName: '부천001',
      businessType: 'REPLACEMENT',
      vin: 'KMJTA18XPLCC32529',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'ELECTRIC',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: true
    },
    {
      mobilityId: 3,
      mobilityNo: '서울71사2210',
      projectId: null,
      projectName: null,
      businessType: 'NEW',
      vin: 'KMJTA18XPLCC32530',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'DIESEL',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: false
    },
    {
      mobilityId: 4,
      mobilityNo: '서울71사2211',
      projectId: null,
      projectName: null,
      businessType: 'NEW',
      vin: 'KMJTA18XPLCC32531',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'DIESEL',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: false
    },
    {
      mobilityId: 5,
      mobilityNo: '서울71사2212',
      projectId: null,
      projectName: null,
      businessType: 'NEW',
      vin: 'KMJTA18XPLCC32532',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'DIESEL',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: false
    },
    {
      mobilityId: 6,
      mobilityNo: '서울71사2213',
      projectId: null,
      projectName: null,
      businessType: 'NEW',
      vin: 'KMJTA18XPLCC32533',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'DIESEL',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: false
    },
    {
      mobilityId: 7,
      mobilityNo: '서울71사2214',
      projectId: null,
      projectName: null,
      businessType: 'NEW',
      vin: 'KMJTA18XPLCC32534',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'DIESEL',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: false
    },
    {
      mobilityId: 8,
      mobilityNo: '서울71사2215',
      projectId: null,
      projectName: null,
      businessType: 'NEW',
      vin: 'KMJTA18XPLCC32535',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'CNG',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: false
    },
    {
      mobilityId: 9,
      mobilityNo: '서울71사2216',
      projectId: null,
      projectName: null,
      businessType: 'NEW',
      vin: 'KMJTA18XPLCC32536',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'CNG',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: false
    },
    {
      mobilityId: 10,
      mobilityNo: '서울71사2217',
      projectId: null,
      projectName: null,
      businessType: 'NEW',
      vin: 'KMJTA18XPLCC32537',
      model: 'HYPERS11L',
      mobilityType: 'LARGE_BUS',
      year: '2002',
      fuelType: 'CNG',
      passengerCapacity: 11,
      mobilityRegDate: '2020-04-20',
      hasVehicleReg: true,
      hasScrappingCert: false
    }
  ]

  // 목업 데이터에 운수사명과 지역 정보 추가
  const content: MobilityResponseDto[] = mockData.map(item => ({
    ...item,
    transportCompanyName: item.mobilityId <= 7 ? '서울버스조합' : '성남버스조합',
    areaCode: '세종'
  }))
  
  const pageInfo = {
    size: 10,
    number: 0,
    totalElements: 32,
    totalPages: 4,
  }



  // DataTable 컬럼 정의
  const tableColumns = [
    { 
      key: 'mobilityNo', 
      label: '자동차차등록번호', 
      className: 'flex-[1.2] min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'transportCompanyName', 
      label: '운수사명', 
      className: 'flex-[1] min-w-[100px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'areaCode', 
      label: '지역', 
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'projectName', 
      label: '프로젝트', 
      className: 'w-[100px] min-w-[100px] max-w-[100px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string | null) => (
        value ? (
          <div className="px-2.5 py-1 bg-blue-50 rounded-md flex justify-center items-center whitespace-nowrap">
            <span className="text-blue-900 text-sm font-medium">{value}</span>
          </div>
        ) : null
      )
    },
    { 
      key: 'businessType', 
      label: '사업구분', 
      className: 'w-[100px] min-w-[100px] max-w-[100px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => {
        const isNew = value === 'NEW'
        return (
          <div className={`px-2.5 py-1 rounded-md flex justify-center items-center whitespace-nowrap ${isNew ? 'bg-yellow-50' : 'bg-green-50'}`}>
            <span className={`text-sm font-medium ${isNew ? 'text-yellow-900' : 'text-green-900'}`}>
              {BUSINESS_TYPE_MAP[value] || value}
            </span>
          </div>
        )
      }
    },
    { 
      key: 'vin', 
      label: '차대번호', 
      className: 'flex-[1.2] min-w-[150px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'model', 
      label: '모델명', 
      className: 'flex-[1] min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'mobilityType', 
      label: '차량유형', 
      className: 'w-[100px] min-w-[100px] max-w-[100px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{MOBILITY_TYPE_MAP[value] || value}</span>
      )
    },
    { 
      key: 'year', 
      label: '연식', 
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'fuelType', 
      label: '연료', 
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium">{FUEL_TYPE_MAP[value] || value}</span>
      )
    },
    { 
      key: 'passengerCapacity', 
      label: '인승', 
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: true,
      render: (value: number) => (
        <span className="text-[#344051] text-sm font-medium">{value}인승</span>
      )
    },
    { 
      key: 'mobilityRegDate', 
      label: '차량등록일', 
      className: 'w-[110px] min-w-[110px] max-w-[110px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: true,
      render: (value: string) => (
        <span className="text-[#344051] text-sm font-medium whitespace-nowrap">{value}</span>
      )
    },
    { 
      key: 'hasVehicleReg', 
      label: '자동차등록증', 
      className: 'w-[100px] min-w-[100px] max-w-[100px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: boolean) => (
        <div className="flex items-center justify-center">
          {value ? <CheckIcon /> : null}
        </div>
      )
    },
    { 
      key: 'hasScrappingCert', 
      label: '말소증명서', 
      className: 'w-[100px] min-w-[100px] max-w-[100px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: boolean) => (
        <div className="flex items-center justify-center">
          {value ? <CheckIcon /> : null}
        </div>
      )
    },
    { 
      key: 'detail', 
      label: '상세', 
      className: 'w-[80px] min-w-[80px] max-w-[80px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (_: any, row: MobilityResponseDto) => (
        <button
          className="h-[22px] w-[22px] transition-opacity hover:opacity-70 flex items-center justify-center"
          onClick={() => navigate({ to: `/mobility/${row.mobilityId}` })}
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
    const [mobilityNo, model] = searchInput.split(' ')
    setSearch({ mobilityNo: mobilityNo || '', model: model || '' })
    setPage(0)
  }

  return (
    <div className='min-h-screen   bg-white'>
      {/* 상단 헤더 */}
      <PageHeader 
        title="차량 관리"
        // onBack prop 없음 - 뒤로가기 버튼 자동 숨김
      />

      {/* 메인 콘텐츠 영역 */}
      <div className='bg-white pt-4 pl-8 pr-8 pb-8'>
        {/* 섹션 헤더 */}
        <SectionHeader
          title="차량정보"
          count={pageInfo.totalElements}
          lastUpdated="2025-06-25 15:20"
          secondaryButton={{
            text: "목록 업데이트",
            onClick: () => {
              // 목록 업데이트 로직
              console.log('목록 업데이트')
            },
            icon: <RefreshIcon className="w-5 h-5" />,
          }}
          primaryButton={{
            text: "차량 추가",
            onClick: () => {
              // 차량 추가 로직
              console.log('차량 추가')
            },
            icon: <PlusIcon />
          }}
        />

        {/* 필터 바 */}
        <FilterBar
          selects={[
            {
              options: [
                { value: 'ALL', label: '운수사' },
                { value: 'seoul', label: '서울버스조합' },
                { value: 'seongnam', label: '성남버스조합' }
              ],
              placeholder: "운수사",
              className: "min-w-[120px]"
            },
            {
              options: [
                { value: 'ALL', label: '지역' },
                { value: 'sejong', label: '세종' }
              ],
              placeholder: "지역",
              className: "min-w-[120px]"
            },
            {
              options: [
                { value: 'ALL', label: '프로젝트' },
                { value: 'bucheon001', label: '부천001' }
              ],
              placeholder: "프로젝트",
              className: "min-w-[120px]"
            },
            {
              options: MOBILITY_TYPE_OPTIONS.map(({ value, label }) => ({ value, label })),
              placeholder: "차량유형",
              className: "min-w-[120px]"
            },
            {
              options: FUEL_TYPE_OPTIONS.map(({ value, label }) => ({ value, label })),
              placeholder: "연료",
              className: "min-w-[120px]"
            }
          ]}
          searchInput={{
            placeholder: "차량번호",
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

export const Route = createFileRoute('/_authenticated/mobility/')({
  component: MobilityPage,
})

export {MobilityPage}