import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { apiClient } from '@/lib/api'
import { BUSINESS_TYPE_MAP } from '@/constants/businessType'
import { FUEL_TYPE_MAP } from '@/constants/fuelType'
import { MOBILITY_TYPE_MAP } from '@/constants/mobilityType'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useState } from 'react'

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

export const VehicleInfoTab = () => {
  const params = useParams({ from: '/_authenticated/transport/$id' })
  const transportCompanyId = params.id

  // 페이징 상태
  const [page, setPage] = useState(0)
  const size = 10

  // 정렬 상태 준비 (추후 확장)
  // const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  // 쿼리 useQuery에 page, size 반영
  const { data, isLoading } = useQuery({
    queryKey: ['mobilityList', transportCompanyId, page, size],
    queryFn: async () => {
      const res = await apiClient.get(`/mobility/list/${transportCompanyId}`, { params: { page, size } })
      return res.data as VehicleListResponse
    },
    enabled: !!transportCompanyId,
  })

  const rows = data?.data.content ?? []
  const total = data?.data.page.totalElements ?? 0
  const lastUpdated = data?.timestamp?.replace('T', ' ').slice(0, 16) ?? ''

  // 정렬 아이콘 SVG
  const SortIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.91634 4.66667L6.99967 1.75L4.08301 4.66667M9.91634 9.33333L6.99967 12.25L4.08301 9.33333" stroke="#414E62" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

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
              // setSort({ key: 'passengerCapacity', direction: sort?.direction === 'asc' ? 'desc' : 'asc' })
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
              // setSort({ key: 'mobilityRegDate', direction: sort?.direction === 'asc' ? 'desc' : 'asc' })
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

  // 상세 버튼 SVG
  const DetailButtonIcon = () => (
    <svg width="66" height="68" viewBox="0 0 66 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="path-1-inside-1_372_12879" fill="white">
        <path d="M0 0H66V68H0V0Z"/>
      </mask>
      <path d="M0 0H66V68H0V0Z" fill="white"/>
      <path d="M66 68V67H0V68V69H66V68Z" fill="#E4E7EC" mask="url(#path-1-inside-1_372_12879)"/>
      <path d="M28.4068 36.5926L33.5922 31.4071M33.5922 31.4071H29.0549M33.5922 31.4071V35.9444M30.9997 43.1666C36.0622 43.1666 40.1663 39.0625 40.1663 33.9999C40.1663 28.9373 36.0622 24.8333 30.9997 24.8333C25.9371 24.8333 21.833 28.9373 21.833 33.9999C21.833 39.0625 25.9371 43.1666 30.9997 43.1666Z" stroke="#637083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  // 검색필터 select 옵션 생성
  const mobilityTypeOptions = Object.entries(MOBILITY_TYPE_MAP)
  const fuelTypeOptions = Object.entries(FUEL_TYPE_MAP)
  const [selectedMobilityType, setSelectedMobilityType] = useState<string>('')
  const [selectedFuelType, setSelectedFuelType] = useState<string>('')

  const pageInfo = data?.data?.page || { size: 10, number: 0, totalElements: 0, totalPages: 1 }

  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col gap-6 max-h-[984px] w-full">
      {/* 헤더 */}
      <div className="flex justify-between items-center h-12 py-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#141c25] text-base font-medium">차량정보</span>
          <span className="text-[#0166ff] text-sm font-semibold">{total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#637083] text-xs">최근 업데이트 일시 {lastUpdated}</span>
          <button className="rounded-[10px] px-5 py-2.5 shadow border border-[#e4e7ec] text-sm font-medium flex items-center gap-2 bg-white">
            {/* <img src="/images/restart0.svg" alt="업데이트" className="w-5 h-5" /> */}
            목록 업데이트
          </button>
          <button className="rounded-[10px] px-5 py-2.5 shadow bg-[#0166ff] text-white text-sm font-medium flex items-center gap-2">
            {/* <img src="/images/plus0.svg" alt="추가" className="w-5 h-5" /> */}
            차량 추가
          </button>
        </div>
      </div>
      {/* 필터/검색/정렬 */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center bg-[#f7f8fa] rounded-lg border border-[#e4e7ec]">
            <span className="inline-block align-middle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.99961 3H19.9997C20.552 3 20.9997 3.44764 20.9997 3.99987L20.9999 5.58569C21 5.85097 20.8946 6.10538 20.707 6.29295L14.2925 12.7071C14.105 12.8946 13.9996 13.149 13.9996 13.4142L13.9996 19.7192C13.9996 20.3698 13.3882 20.8472 12.7571 20.6894L10.7571 20.1894C10.3119 20.0781 9.99961 19.6781 9.99961 19.2192L9.99961 13.4142C9.99961 13.149 9.89425 12.8946 9.70672 12.7071L3.2925 6.29289C3.10496 6.10536 2.99961 5.851 2.99961 5.58579V4C2.99961 3.44772 3.44732 3 3.99961 3Z" stroke="#637083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          <div className="flex items-center gap-1">
            <Select value={selectedMobilityType} onValueChange={setSelectedMobilityType}>
              <SelectTrigger className="rounded-lg border border-[#e4e7ec] px-3 py-2 text-sm bg-white min-w-[120px]">
                <SelectValue placeholder="차량유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                {mobilityTypeOptions.map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
            <SelectTrigger className="rounded-lg border border-[#e4e7ec] px-3 py-2 text-sm bg-white min-w-[120px]">
              <SelectValue placeholder="연료" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체</SelectItem>
              {fuelTypeOptions.map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input className="rounded-lg border border-[#e4e7ec] px-3 py-2 text-sm bg-white w-36" placeholder="차량번호" />
          <button className="rounded-lg px-4 py-2 bg-[#0166ff] text-white text-sm font-medium">검색</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#637083] text-xs">Rows per page</span>
          <select className="rounded-lg border border-[#e4e7ec] px-2 py-1 text-sm bg-white">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>
      {/* 표 */}
      <div className="flex w-full overflow-x-auto">
        {columns.map(col => (
          <div key={col.key} className="flex flex-col flex-1 min-w-[120px]">
            <div className="bg-[#f7f8fa] px-5 py-2.5 text-[#637083] text-sm font-medium border-b border-[#e4e7ec]">
              {col.label}
            </div>
            {isLoading ? (
              <div className="h-[68px] flex items-center justify-center text-gray-400">로딩중...</div>
            ) : rows.length === 0 ? (
              <div className="h-[68px] flex items-center justify-center text-gray-400">데이터 없음</div>
            ) : (
              rows.map(row => (
                <div key={row.mobilityId + String(col.key)} className={
                  [
                    'h-[68px] px-5 py-5 flex items-center border-b border-[#e4e7ec]',
                    (col.key === 'hasVehicleReg' || col.key === 'hasScrappingCert') ? 'justify-center' : ''
                  ].join(' ')
                }>
                  {(() => {
                    switch (col.key) {
                      case 'mobilityNo':
                        return <span className="text-[#141c25] text-sm font-medium">{row.mobilityNo}</span>
                      case 'projectName':
                        return row.projectName ? (
                          <div className="px-2.5 py-1 rounded-md inline-flex justify-center items-center" style={{ background: '#E6F0FF' }}>
                            <div className="text-sm font-medium leading-tight" style={{ color: '#1559C7' }}>{row.projectName}</div>
                          </div>
                        ) : <span className="text-gray-400 text-sm">-</span>
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
                          return <span className="text-gray-400 text-sm">-</span>
                        }
                      case 'vin':
                        return <span className="text-[#141c25] text-sm font-medium">{row.vin}</span>
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
                        return <span className="text-gray-400 text-sm">-</span>
                      case 'hasVehicleReg':
                        return row.hasVehicleReg ? (
                          <span className="inline-block w-5 h-5 flex items-center justify-center">
                            <CertCheckIcon />
                          </span>
                        ) : <span className="text-gray-400 text-sm">-</span>
                      case 'hasScrappingCert':
                        return row.hasScrappingCert ? (
                          <span className="inline-block w-5 h-5 flex items-center justify-center">
                            <CertCheckIcon />
                          </span>
                        ) : <span className="text-gray-400 text-sm">-</span>
                      case 'detail':
                        return (
                          <button className="flex items-center justify-center w-full h-full group" title="상세">
                            <DetailButtonIcon />
                          </button>
                        )
                      default:
                        return null
                    }
                  })()}
                </div>
              ))
            )}
          </div>
        ))}
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
    </div>
  )
}