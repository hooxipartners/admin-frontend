import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { apiClient } from '@/lib/api'
import { BUSINESS_TYPE_MAP } from '@/constants/businessType'
import { FUEL_TYPE_MAP } from '@/constants/fuelType'
import { MOBILITY_TYPE_MAP } from '@/constants/mobilityType'
import { useState, useEffect, useRef } from 'react'
import VechicleInfoDetailModal from './vechicleInfoDetailModal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Select  from '@/components/ui/select'

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

// 정렬 아이콘 SVG
const SortIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.91634 4.66667L6.99967 1.75L4.08301 4.66667M9.91634 9.33333L6.99967 12.25L4.08301 9.33333" stroke="#414E62" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export interface VehicleInfoTabProps {
  onAddClick?: () => void;
}

export const VehicleInfoTab = ({ onAddClick }: VehicleInfoTabProps) => {
  const params = useParams({ from: '/_authenticated/transport/$id' })
  const transportCompanyId = params.id

  // 페이징 상태
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  // 정렬 상태 준비 (추후 확장)
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  // 컬럼 순서 및 라벨 정의 (정렬 아이콘 추가)
  const columns = [
    { key: 'mobilityNo', label: '자동차등록번호' },
    { key: 'projectName', label: '프로젝트' },
    { key: 'businessType', label: '사업구분' },
    { key: 'vin', label: '차대번호' },
    { key: 'model', label: '모델명' },
    { key: 'mobilityType', label: '차량유형' },
    { key: 'year', label: '연식' },
    { key: 'fuelType', label: '연료' },
    {
      key: 'passengerCapacity',
      label: (
        <span className="flex items-center gap-1">
          인승
          <button
            type="button"
            className="ml-1 p-0.5 hover:bg-gray-100 rounded"
            onClick={() => {
              handleSort('passengerCapacity')
            }}
          >
            <SortIcon />
          </button>
        </span>
      ),
    },
    {
      key: 'mobilityRegDate',
      label: (
        <span className="flex items-center gap-1">
          차량등록일
          <button
            type="button"
            className="ml-1 p-0.5 hover:bg-gray-100 rounded"
            onClick={() => {
              handleSort('mobilityRegDate')
            }}
          >
            <SortIcon />
          </button>
        </span>
      ),
    },
    { key: 'status', label: '차량상태' },
    { key: 'hasVehicleReg', label: '자동차등록증' },
    { key: 'hasScrappingCert', label: '말소증명서' },
    { key: 'detail', label: '상세' },
  ]

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

  // ...
  const [selectedMobilityType, ] = useState<string[]>(['ALL'])
  const [selectedFuelType, ] = useState<string[]>(['ALL'])

  // ...
  const [searchMobilityNo, setSearchMobilityNo] = useState('')
  const [inputMobilityNo, setInputMobilityNo] = useState('')

  // 인승/차량등록일 정렬 핸들러
  const handleSort = (key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
    })
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
    <div className="w-full min-h-screen pt-4">
      {/* 섹션 헤더 */}
      <div className="flex w-full h-12 py-3 bg-Background-Colors-bg-0 items-center mb-6">
        {/* 좌측: 차량정보 + 카운트 */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          <span className="text-base font-medium text-[#141c25] truncate">차량정보</span>
          <span className="text-sm font-semibold text-[#0166ff]">{total}</span>
        </div>
        {/* auto 공간 */}
        <div className="flex-1" />
        {/* 우측: 최근업데이트, 목록업데이트, 차량추가 */}
        <div className="flex items-center gap-2 flex-wrap justify-end flex-shrink-0">
          <span className="text-xs text-[#637083]itespace-nowrap">
            최근 업데이트 일시 {lastUpdated}
          </span>
          <button
            className="px-5 py-2.5 bg-white rounded-[10px] shadow border border-[#e4e7ec] text-sm font-medium flex items-center gap-2"
            onClick={/* 기존 목록업데이트 핸들러 있으면 연결 */ undefined}
          >
            {/* 목록업데이트 아이콘 */}
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
            목록 업데이트
          </button>
          <button
            className="px-5 py-2.5 bg-[#0166ff] text-white rounded-[10px] shadow text-sm font-medium flex items-center gap-2"
            onClick={onAddClick}
          >
            {/* 차량추가 아이콘 */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            차량 추가
          </button>
        </div>
      </div>
      {/* 필터 바 */}
      <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-6">
        {/* 좌측: 필터들 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 아이콘 박스 */}
          <div data-external-addon="False" data-show-helper-text="false" data-show-label="false" data-show-left-side="true" data-show-right-side="false" data-state="Filled" data-trailing-addon="False" data-type="Classic" className="h-10 inline-flex flex-col justify-center items-center">
            <div className="h-10 px-3 py-2 bg-Background-Colors-bg-0 rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-Border-Colors-border-200 inline-flex justify-center items-center gap-4 overflow-hidden">
              <div className="flex justify-center items-center gap-2 h-10">
                <div data-type="Icon" className="flex justify-start items-start">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.99961 3H19.9997C20.552 3 20.9997 3.44764 20.9997 3.99987L20.9999 5.58569C21 5.85097 20.8946 6.10538 20.707 6.29295L14.2925 12.7071C14.105 12.8946 13.9996 13.149 13.9996 13.4142L13.9996 19.7192C13.9996 20.3698 13.3882 20.8472 12.7571 20.6894L10.7571 20.1894C10.3119 20.0781 9.99961 19.6781 9.99961 19.2192L9.99961 13.4142C9.99961 13.149 9.89425 12.8946 9.70672 12.7071L3.2925 6.29289C3.10496 6.10536 2.99961 5.851 2.99961 5.58579V4C2.99961 3.44772 3.44732 3 3.99961 3Z" stroke="#637083" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* 차량유형 Select */}
          <Select
            options={MOBILITY_TYPE_OPTIONS.map(({ label, value }) => ({ label, value }))}
            placeholder="차량유형"
            className="min-w-[100px]"
          />

          {/* 연료 Select */}
          <Select
            options={FUEL_TYPE_OPTIONS.map(({ label, value }) => ({ label, value }))}
            placeholder="연료"
            className="min-w-[80px]"
          />
          {/* 차량번호 입력 */}
          <div data-external-addon="False" data-show-helper-text="false" data-show-label="false" data-show-left-side="false" data-show-right-side="false" data-state="Default" data-trailing-addon="False" data-type="Classic" className="w-60 inline-flex flex-col justify-center items-center">
            <div className="self-stretch pl-3 pr-2.5 py-2 bg-Background-Colors-bg-0 rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] outline outline-1 outline-offset-[-1px] outline-Border-Colors-border-200 inline-flex justify-between items-center h-10">
              <Input
                className="flex-1 border-none outline-none shadow-none bg-transparent px-0 py-0 text-base text-Text-text-tertiary font-normal font-['Inter'] leading-normal h-10"
                placeholder="차량번호"
                value={inputMobilityNo}
                onChange={e => setInputMobilityNo(e.target.value)}
                onKeyDown={handleInputKeyDown}
              />
            </div>
          </div>
          {/* 검색 버튼 */}
          <Button
            className="px-5 py-2.5 bg-Foreground-Colors-foreground-01 rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] inline-flex justify-center items-center gap-4 flex-shrink-0 h-10 min-w-[80px]"
            onClick={handleSearchClick}
            type="button"
          >
            <span className="text-center justify-start text-Text-text-quaternary text-sm font-medium font-['Inter'] leading-tight">검색</span>
          </Button>
        </div>
        {/* 우측: Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#637083]">Rows per page</span>
          <select
            className="pl-5 pr-3 py-2.5 bg-white rounded-[10px] shadow outline outline-1 outline-offset-[-1px] outline-[#e4e7ec] text-sm font-medium text-[#637083]"
            value={size}
            onChange={e => setSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      {/* 테이블과 필터 사이 24px 간격 유지 (mb-6) */}
      <div className="mb-6 overflow-x-visible rounded-lg border border-[#e4e7ec]">
        {/* 테이블 헤더 */}
        <div className="flex bg-[#f2f4f7]">
          {columns.map((col) =>
            col.key === 'detail' ? (
              <div
                key={col.key}
                className="w-26 min-w-[104px] max-w-[104px] py-2.5 px-0 flex items-center justify-center sticky right-0 bg-[#f2f4f7] z-10 border-l border-[#e4e7ec] rounded-tr-lg rounded-br-lg"
              >
                {col.label}
              </div>
            ) : (
              <div
                key={col.key}
                className="flex-1 min-w-0 py-2.5 px-5 border-r border-[#e4e7ec] flex items-center whitespace-normal break-all overflow-hidden"
                onClick={() => {
                  if (col.key === 'passengerCapacity' || col.key === 'mobilityRegDate') handleSort(col.key)
                }}
                style={{ cursor: col.key === 'passengerCapacity' || col.key === 'mobilityRegDate' ? 'pointer' : undefined }}
              >
                {col.label}
                {(col.key === 'passengerCapacity' || col.key === 'mobilityRegDate') && sort?.key === col.key && (
                  <span className="ml-1">
                    {sort.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            )
          )}
        </div>
        {/* 테이블 바디 */}
        {isLoading ? (
          <div className="p-20 text-center text-gray-500">로딩중...</div>
        ) : rows.length === 0 ? (
          <div className="p-20 text-center text-gray-500">데이터가 없습니다.</div>
        ) : (
          rows.map((row) => (
            <div
              key={row.mobilityId}
              className="flex border-b border-[#e4e7ec] bg-white transition-colors hover:bg-gray-50"
            >
              {columns.map((col) => {
                if (col.key === 'detail') {
                  return (
                    <div
                      key={col.key}
                      className="w-26 min-w-[104px] max-w-[104px] py-5 px-0 flex items-center justify-center sticky right-0 bg-white z-10 border-l border-[#e4e7ec] rounded-br-lg"
                    >
                      <button
                        className="h-[22px] w-[22px] transition-opacity hover:opacity-70 flex items-center justify-center"
                        onClick={() => setDetailModalId(row.mobilityId)}
                        type="button"
                      >
                        <DetailButtonIcon />
                      </button>
                    </div>
                  )
                }
                return (
                  <div
                    key={col.key}
                    className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center whitespace-normal break-all overflow-hidden"
                  >
                    {(() => {
                      switch (col.key) {
                        case 'mobilityNo':
                          return <span className="text-[#141c25] text-sm font-medium">{row.mobilityNo}</span>
                        case 'projectName':
                          return row.projectName ? (
                            <div className="px-2.5 py-1 rounded-md inline-flex justify-center items-center" style={{ background: '#E6F0FF' }}>
                              <div className="text-sm font-medium leading-tight" style={{ color: '#1559C7' }}>{row.projectName}</div>
                            </div>
                          ) : <span className="text-gray-400 text-sm"></span>
                        case 'businessType':
                          if (row.businessType === 'NEW') {
                            return (
                              <div className="px-2.5 py-1 rounded-md inline-flex justify-center items-center" style={{ background: '#FFF7E0' }}>
                                <div className="text-sm font-medium leading-tight" style={{ color: '#B76E00' }}>신규도입</div>
                              </div>
                            )
                          } else if (row.businessType === 'REPLACEMENT') {
                            return (
                              <div className="px-2.5 py-1 rounded-md flex justify-center items-center" style={{ background: '#E6FAF0' }}>
                                <div className="text-sm font-medium leading-tight" style={{ color: '#0D6832' }}>대체도입</div>
                              </div>
                            )
                          } else {
                            return <span className="text-gray-400 text-sm"></span>
                          }
                        case 'vin':
                          return <span className="text-[#141c25] text-sm font-medium min-w-[200px] max-w-[320px] whitespace-nowrap overflow-x-auto block">{row.vin}</span>
                        case 'model':
                          return <span className="text-[#141c25] text-sm font-medium">{row.model}</span>
                        case 'mobilityType':
                          return <span className="text-[#141c25] text-sm font-medium">{MOBILITY_TYPE_MAP[row.mobilityType]}</span>
                        case 'year':
                          return <span className="text-[#141c25] text-sm font-medium">{row.year}</span>
                        case 'fuelType':
                          return <span className="text-[#141c25] text-sm font-medium">{FUEL_TYPE_MAP[row.fuelType]}</span>
                        case 'passengerCapacity':
                          return <span className="text-[#141c25] text-sm font-medium">{row.passengerCapacity}인승</span>
                        case 'mobilityRegDate':
                          return <span className="text-[#141c25] text-sm font-medium">{row.mobilityRegDate?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</span>
                        case 'status':
                          return <span className="text-gray-400 text-sm"></span>
                        case 'hasVehicleReg':
                          return (
                            <div
                              key={col.key}
                              className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center justify-center whitespace-normal break-all overflow-hidden"
                            >
                              {row.hasVehicleReg ? <CertCheckIcon /> : <span className="text-gray-400 text-sm"></span>}
                            </div>
                          )
                        case 'hasScrappingCert':
                          return (
                            <div
                              key={col.key}
                              className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center justify-center whitespace-normal break-all overflow-hidden"
                            >
                              {row.hasScrappingCert ? <CertCheckIcon /> : <span className="text-gray-400 text-sm"></span>}
                            </div>
                          )
                        default:
                          return null
                      }
                    })()}
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>
      {/* 페이징 */}
      <div className="flex items-center justify-between mt-6">
        <button
          className="rounded-lg bg-[#f2f4f7] p-2"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          {/* PrevIcon 대체 */}
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M12.5 5L7.5 10L12.5 15" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(pageInfo.totalPages, 5) }, (_, i) => {
            const pageNum = i + 1
            const isActive = pageNum === page + 1
            return (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-9 w-9 rounded-lg text-sm leading-5 font-medium transition-colors ${
                  isActive
                    ? 'bg-[#f2f4f7] text-[#141c25]'
                    : 'text-[#637083] hover:bg-gray-100'
                }`}
                style={{ fontFamily: 'Inter-Medium, sans-serif' }}
              >
                {pageNum}
              </button>
            )
          })}
          {pageInfo.totalPages > 5 && (
            <>
              <span className="px-2 leading-5 text-[#637083]" style={{ fontFamily: 'Inter-Medium, sans-serif' }}>
                ...
              </span>
              <button
                className="h-9 w-9 rounded-lg text-sm leading-5 font-medium text-[#637083] hover:bg-gray-100"
                style={{ fontFamily: 'Inter-Medium, sans-serif' }}
              >
                {pageInfo.totalPages}
              </button>
            </>
          )}
        </div>
        <button
          className="rounded-lg bg-[#f2f4f7] p-2"
          disabled={page + 1 >= pageInfo.totalPages}
          onClick={() => setPage((p) => Math.min(pageInfo.totalPages - 1, p + 1))}
        >
          {/* NextIcon 대체 */}
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7.5 5L12.5 10L7.5 15" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
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