import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { apiClient } from '@/lib/api'
import { BUSINESS_TYPE_MAP } from '@/constants/businessType'
import { FUEL_TYPE_MAP } from '@/constants/fuelType'
import { MOBILITY_TYPE_MAP } from '@/constants/mobilityType'
import { useState, useEffect, useRef } from 'react'
import VechicleInfoDetailModal from './vechicleInfoDetailModal'
import Select  from '@/components/ui/select'
import FilterBar from '@/components/ui/filter-bar'
import DataTable from '@/components/ui/data-table'
import SectionHeader from '@/components/ui/section-header'
import { SortDirection } from '@/components/ui/sortable-header'

// 타입 정의
export interface VehicleData {
  mobilityId: number
  mobilityNo: string
  projectId: number | null
  projectName: string | null
  businessType: keyof typeof BUSINESS_TYPE_MAP
  vin: string
  model: string
  mobilityType: keyof typeof MOBILITY_TYPE_MAP
  year: string
  fuelType: keyof typeof FUEL_TYPE_MAP
  passengerCapacity: number
  mobilityRegDate: string
  hasVehicleReg: boolean
  hasScrappingCert: boolean
}

interface VehicleListResponse {
  success: boolean
  data: {
    content: VehicleData[]
    page: {
      size: number
      number: number
      totalElements: number
      totalPages: number
    }
  }
  timestamp: string
}

export interface VehicleInfoTabProps {
  onAddClick?: () => void;
}

const LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

export const VehicleInfoTab = ({ onAddClick }: VehicleInfoTabProps) => {
  const params = useParams({ from: '/_authenticated/transport/$id' })
  const transportCompanyId = params.id

  // 페이징 상태
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [limit, setLimit] = useState<string>('10');
  // 정렬 상태 수정
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | null>(null)

  // 체크 SVG (자동차등록증/말소증명서 true)
  const CertCheckIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.375 11.4584L5.11109 15.1945C5.32588 15.4093 5.67412 15.4093 5.88891 15.1945L8.25 12.8334M14.6667 6.41675L11 10.0834M6.41667 11.0001L10.6111 15.1945C10.8259 15.4093 11.1741 15.4093 11.3889 15.1945L20.1667 6.41675" stroke="#10B978" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  // 상세 버튼 SVG (동그란 원+화살표, 22x22)
  const DetailButtonIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="11" cy="11" r="10" stroke="#637083" strokeWidth="1.5" fill="white" />
      <path d="M8.5 13.5L13.5 8.5" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10.5 8.5H13.5V11.5" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  // 차량유형, 연료유형 등 옵션 배열 정의 예시
  const MOBILITY_TYPE_OPTIONS = [
    { value: 'ALL', label: '차량유형' },
    // ... 나머지 옵션 ...
  ]
  const FUEL_TYPE_OPTIONS = [
    { value: 'ALL', label: '연료' },
    // ... 나머지 옵션 ...
  ]

  // 필터 상태
  const [selectedMobilityType, ] = useState<string[]>(['ALL'])
  const [selectedFuelType, ] = useState<string[]>(['ALL'])

  // 검색 상태
  const [searchMobilityNo, setSearchMobilityNo] = useState('')
  const [inputMobilityNo, setInputMobilityNo] = useState('')

  // DataTable 컬럼 정의 (operation-info-tab.tsx 방식 따라하기)
  const tableColumns = [
    { 
      key: 'mobilityNo', 
      label: '자동차등록번호', 
      className: 'flex-[1.2] min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'projectName', 
      label: '프로젝트', 
      className: 'flex-[1.2] min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string | null) => value ? (
        <div className="px-2.5 py-1 rounded-md inline-flex justify-center items-center" style={{ background: '#E5F2FF' }}>
          <div className="text-sm font-medium leading-tight" style={{ color: '#00254D' }}>{value}</div>
        </div>
      ) : <span className="text-gray-400 text-sm"></span>
    },
    { 
      key: 'businessType', 
      label: '사업구분', 
      className: 'flex-[1] min-w-[90px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: keyof typeof BUSINESS_TYPE_MAP) => {
        if (value === 'NEW') {
          return (
            <div className="px-2.5 py-1 rounded-md inline-flex justify-center items-center" style={{ background: '#FFFBEB' }}>
              <div className="text-sm font-medium leading-tight" style={{ color: '#78350F' }}>신규도입</div>
            </div>
          )
        }
        if (value === 'REPLACEMENT') {
          return (
            <div className="px-2.5 py-1 rounded-md inline-flex justify-center items-center" style={{ background: '#ECFDF5' }}>
              <div className="text-sm font-medium leading-tight" style={{ color: '#064E3B' }}>대체도입</div>
            </div>
          )
        }
        return <span className="text-gray-400 text-sm"></span>
      }
    },
    { 
      key: 'vin', 
      label: '차대번호', 
      className: 'flex-[2] min-w-[200px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'model', 
      label: '모델명', 
      className: 'flex-[1] min-w-[90px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'mobilityType', 
      label: '차량유형', 
      className: 'flex-[1] min-w-[90px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: keyof typeof MOBILITY_TYPE_MAP) => (
        <span className="text-[#141c25] text-sm font-medium">{MOBILITY_TYPE_MAP[value]}</span>
      )
    },
    { 
      key: 'year', 
      label: '연식', 
      className: 'flex-[0.8] min-w-[70px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'fuelType', 
      label: '연료', 
      className: 'flex-[0.8] min-w-[70px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: keyof typeof FUEL_TYPE_MAP) => (
        <span className="text-[#141c25] text-sm font-medium">{FUEL_TYPE_MAP[value]}</span>
      )
    },
    { 
      key: 'passengerCapacity', 
      label: '인승', 
      className: 'flex-[0.8] min-w-[70px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: true,
      render: (value: number) => (
        <span className="text-[#141c25] text-sm font-medium">{value}인승</span>
      )
    },
    { 
      key: 'mobilityRegDate', 
      label: '차량등록일', 
      className: 'flex-[1.2] min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: true,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</span>
      )
    },
    { 
      key: 'status', 
      label: '차량상태', 
      className: 'flex-[0.8] min-w-[70px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: () => <span className="text-gray-400 text-sm"></span>
    },
    { 
      key: 'hasVehicleReg', 
      label: '자동차등록증', 
      className: 'flex-[1] min-w-[90px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: boolean) => value ? <CertCheckIcon /> : <span className="text-gray-400 text-sm"></span>
    },
    { 
      key: 'hasScrappingCert', 
      label: '말소증명서', 
      className: 'flex-[1] min-w-[90px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: boolean) => value ? <CertCheckIcon /> : <span className="text-gray-400 text-sm"></span>
    },
    { 
      key: 'detail', 
      label: '상세', 
      className: 'w-[60px] min-w-[60px] max-w-[60px] px-0 py-0 flex items-center justify-center sticky right-0 bg-white z-10 border-l border-[#e4e7ec]',
      sortable: false,
      render: (value: any, row: VehicleData) => (
        <button
          className="h-[22px] w-[22px] transition-opacity hover:opacity-70 flex items-center justify-center"
          onClick={() => setDetailModalId(row.mobilityId)}
          type="button"
        >
          <DetailButtonIcon />
        </button>
      )
    },
  ]

  // 정렬 핸들러 수정
  const handleSort = (key: string, direction: SortDirection) => {
    setSort(direction ? { key, direction } : null);
  }

  // 차량유호/연료 select 변경 시 자동 필터링
  useEffect(() => {
    refetch()
  }, [selectedMobilityType, selectedFuelType])

  // 차량번호 input 엔터 핸들러
  const inputRef = useRef<HTMLInputElement>(null)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchMobilityNo(inputMobilityNo)
    }
  }
  const handleSearchClick = () => {
    setSearchMobilityNo(inputMobilityNo)
    inputRef.current?.blur()
  }

  // 쿼리 useQuery에 page, size, 필터, 정렬 반영
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'mobilityList',
      transportCompanyId,
      page,
      size,
      selectedMobilityType,
      selectedFuelType,
      searchMobilityNo,
      sort
    ],
    queryFn: async () => {
      const params: any = { page, size }
      if (selectedMobilityType[0] && selectedMobilityType[0] !== 'ALL') {
        params.mobilityTypes = selectedMobilityType;
      }
      if (selectedFuelType[0] && selectedFuelType[0] !== 'ALL') {
        params.fuelTypes = selectedFuelType
      }
      if (searchMobilityNo) params.mobilityNo = searchMobilityNo
      if (sort) params.sort = `${sort.key},${sort.direction}`
      const res = await apiClient.get(`/mobility/list/${transportCompanyId}`, { params })
      return res.data as VehicleListResponse
    },
    enabled: !!transportCompanyId,
  })

  const rows = data?.data.content ?? []
  const total = data?.data.page.totalElements ?? 0
  const lastUpdated = data?.timestamp?.replace('T', ' ').slice(0, 16) ?? ''

  const pageInfo = data?.data?.page || { size: 10, number: 0, totalElements: 0, totalPages: 1 }

  const [detailModalId, setDetailModalId] = useState<number | null>(null)

  return (
    <div className="w-full min-h-screen pl-8 pt-4">
      {/* 섹션 헤더 */}
      <SectionHeader
        title="차량정보"
        count={total}
        lastUpdated={lastUpdated}
        secondaryButton={{
          text: "목록 업데이트",
          onClick: () => refetch(),
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_687_8438)">
                <path d="M5.56476 17.1395C2.10975 15.0177 0.631928 10.6321 2.26422 6.78667C4.06251 2.55016 8.95468 0.573595 13.1912 2.37189C17.4277 4.17018 19.4043 9.06234 17.606 13.2988C16.9033 14.9542 15.7282 16.2646 14.3045 17.1395M18.3335 17.5001H14.6669C14.3907 17.5001 14.1669 17.2762 14.1669 17.0001V13.3334M10.0002 18.3418L10.0085 18.3325" stroke="#344051" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_687_8438">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          )
        }}
        primaryButton={onAddClick ? {
          text: "차량 추가",
          onClick: onAddClick,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        } : undefined}
      />

      {/* 필터 바 */}
      <FilterBar
        selects={[
          {
            options: MOBILITY_TYPE_OPTIONS.map(({ label, value }) => ({ label, value })),
            placeholder: "차량유형",
            className: 'flex-[2] min-w-[100px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
          },
          {
            options: FUEL_TYPE_OPTIONS.map(({ label, value }) => ({ label, value })),
            placeholder: "연료",
            className: "min-w-[80px]"
          }
        ]}
        searchInput={{
          placeholder: "차량번호",
          value: inputMobilityNo,
          onChange: (value) => setInputMobilityNo(value),
          onKeyDown: handleInputKeyDown
        }}
        searchButton={{
          text: "검색",
          onClick: handleSearchClick
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
        totalPages={pageInfo.totalPages}
        onPageChange={setPage}
        sort={sort}
        onSort={handleSort}
      />

      {/* 상세 모달 */}
      {detailModalId && (
        <VechicleInfoDetailModal
          mobilityId={detailModalId}
          onClose={() => setDetailModalId(null)}
        />
      )}
    </div>
  )
}