import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { apiClient } from '@/lib/api'
import { BUSINESS_TYPE_MAP } from '@/constants/businessType'
import { FUEL_TYPE_MAP } from '@/constants/fuelType'
import { MOBILITY_TYPE_MAP } from '@/constants/mobilityType'
import { useState } from 'react'
import Select  from '@/components/ui/select'
import FilterBar from '@/components/ui/filter-bar'
import DataTable from '@/components/ui/data-table'
import SectionHeader from '@/components/ui/section-header'
import { SortDirection } from '@/components/ui/sortable-header'
import type { 
  MobilityResponseDto, 
} from '@/types/api/mobility'
import type { 
  Page, 
  HooxiResponse 
} from '@/types/api/common'
import { areaCodeMap } from '@/constants/areaCodeMap';

export interface MobilityInfoTabProps {
  onAddClick?: () => void;
}

const LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

// 지역 옵션 (ALL 제외)
const AREA_OPTIONS = Object.entries(areaCodeMap)
  .filter(([key]) => key !== 'ALL')
  .map(([key, value]) => ({ value: key, label: value }));

// 차량유형, 연료유형 옵션 (ALL/placeholder 제외)
const MOBILITY_TYPE_OPTIONS = Object.entries(MOBILITY_TYPE_MAP)
  .map(([key, value]) => ({ value: key, label: value }));

const FUEL_TYPE_OPTIONS = Object.entries(FUEL_TYPE_MAP)
  .map(([key, value]) => ({ value: key, label: value }));

export const MobilityInfoTab = ({ onAddClick }: MobilityInfoTabProps) => {
  const params = useParams({ from: '/_authenticated/transport/$id' })
  const transportCompanyId = params.id

  // 페이징 상태
  const [page, setPage] = useState(0)
  const [size, ] = useState(10)
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

  // 필터 상태
  const [selectedMobilityType, setSelectedMobilityType] = useState<string[]>(['ALL'])
  const [selectedFuelType, setSelectedFuelType] = useState<string[]>(['ALL'])
  const [selectedArea, setSelectedArea] = useState<string[]>(['ALL'])

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
      label: '등록일', 
      className: 'flex-[1] min-w-[90px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: string) => (
        <span className="text-[#141c25] text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'hasVehicleReg', 
      label: '자동차등록증', 
      className: 'flex-[0.8] min-w-[70px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: boolean) => value ? <CertCheckIcon /> : null
    },
    { 
      key: 'hasScrappingCert', 
      label: '말소증명서', 
      className: 'flex-[0.8] min-w-[70px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec] text-xs font-medium',
      sortable: false,
      render: (value: boolean) => value ? <CertCheckIcon /> : null
    },
    { 
      key: 'detail', 
      label: '상세', 
      className: 'w-[60px] min-w-[60px] max-w-[60px] px-0 py-0 flex items-center justify-center sticky right-0 bg-white z-10 border-l border-[#e4e7ec]',
      sortable: false,
      render: (_: any, row: MobilityResponseDto) => (
        <button
          className="h-[22px] w-[22px] transition-opacity hover:opacity-70 flex items-center justify-center"
          onClick={() => console.log('Detail clicked for:', row.mobilityId)}
          type="button"
        >
          <DetailButtonIcon />
        </button>
      )
    }
  ]

  // 정렬 핸들러
  const handleSort = (key: string, direction: SortDirection) => {
    setSort(direction ? { key, direction } : null)
  }

  // 검색 핸들러
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick()
    }
  }

  const handleSearchClick = () => {
    setSearchMobilityNo(inputMobilityNo)
    setPage(0)
  }

  // API 호출
  const { data, isLoading, error } = useQuery<HooxiResponse<Page<MobilityResponseDto>>>({
    queryKey: ['mobilityList', transportCompanyId, page, size, searchMobilityNo, selectedMobilityType, selectedFuelType, sort],
    queryFn: async () => {
      const response = await apiClient.get(`/mobility/list/${transportCompanyId}`, {
        params: {
          page,
          size,
          mobilityNo: searchMobilityNo || undefined,
          mobilityType: selectedMobilityType.includes('ALL') ? undefined : selectedMobilityType.join(','),
          fuelType: selectedFuelType.includes('ALL') ? undefined : selectedFuelType.join(','),
          sort: sort ? `${sort.key},${sort.direction}` : undefined
        }
      })
      return response.data
    },
    enabled: !!transportCompanyId
  })

  const content: MobilityResponseDto[] = data?.data?.content || []
  const pageInfo = data?.data || {
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1,
  }

  if (isLoading) return <div className="p-20 text-center text-gray-500">로딩중...</div>
  if (error) return <div className="p-20 text-center text-red-500">에러 발생</div>

  return (
    <div className="w-full min-h-screen pl-8 pr-8 pt-4">
      {/* 섹션 헤더 */}
      <SectionHeader
        title="차량정보"
        count={pageInfo.totalElements}
        primaryButton={{
          text: "차량 추가",
          onClick: onAddClick || (() => console.log("차량 추가")),
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
            options: AREA_OPTIONS,
            placeholder: "지역",
            selectedValues: selectedArea,
            onSelectionChange: setSelectedArea,
            className: "w-40"
          },
          {
            options: MOBILITY_TYPE_OPTIONS,
            placeholder: "차량유형",
            selectedValues: selectedMobilityType,
            onSelectionChange: setSelectedMobilityType,
            className: "w-40"
          },
          {
            options: FUEL_TYPE_OPTIONS,
            placeholder: "연료",
            selectedValues: selectedFuelType,
            onSelectionChange: setSelectedFuelType,
            className: "w-32"
          }
        ]}
        searchInput={{
          placeholder: "자동차등록번호",
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
        data={content}
        page={page}
        totalPages={pageInfo.totalPages}
        onPageChange={setPage}
        sort={sort}
        onSort={handleSort}
      />
    </div>
  )
} 