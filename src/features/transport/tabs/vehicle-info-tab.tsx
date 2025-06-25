import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { apiClient } from '@/lib/api'
import VechicleInfoDetailModal from './vechicleInfoDetailModal'

// 타입 정의 (자바 DTO와 1:1 매핑)
interface MobilityFileResponseDto {
  attachFileId: number
  fileTypeName: string
  fileTypeDescription: string
  originalFileName: string
  storedFileName: string
  relativeFilePath: string
  fileSizeByte: number
}

interface MobilityResponseDto {
  mobilityId: number
  mobilityNo: string
  type: string
  model: string
  year: string
  vin: string
  mobilityRegDate: string
  fuelTypeName: string
  fuelTypeDescription: string
  files: MobilityFileResponseDto[]
}

interface MobilityListResponse {
  content: MobilityResponseDto[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// 더미 데이터 생성 (API 응답이 비어있을 때 사용)
const getDummyData = (): MobilityResponseDto[] => [
  {
    mobilityId: 1,
    mobilityNo: '서울71사2208',
    type: '승합일반형대형',
    model: 'HYPERS11L',
    year: '2022',
    vin: 'KMJTA18XPLCC32528',
    mobilityRegDate: '2022-03-01',
    fuelTypeName: '디젤',
    fuelTypeDescription: '경유',
    files: [
      {
        attachFileId: 101,
        fileTypeName: '자동차등록증',
        fileTypeDescription: '자동차등록증 설명',
        originalFileName: '서울71사2208_자동차등록증.pdf',
        storedFileName: 'car_reg_101.pdf',
        relativeFilePath: '/files/car_reg_101.pdf',
        fileSizeByte: 123456,
      },
      {
        attachFileId: 102,
        fileTypeName: '수출/자진말소증명서',
        fileTypeDescription: '수출/자진말소증명서 설명',
        originalFileName: '서울71사2208_수출말소증명서.pdf',
        storedFileName: 'export_cert_102.pdf',
        relativeFilePath: '/files/export_cert_102.pdf',
        fileSizeByte: 654321,
      },
    ],
  },
  {
    mobilityId: 2,
    mobilityNo: '부산12가3456',
    type: '화물',
    model: '포터',
    year: '2021',
    vin: 'KMH98765432101234',
    mobilityRegDate: '2021-07-15',
    fuelTypeName: 'LPG',
    fuelTypeDescription: '액화석유가스',
    files: [
      {
        attachFileId: 103,
        fileTypeName: '자동차등록증',
        fileTypeDescription: '자동차등록증 설명',
        originalFileName: '부산12가3456_자동차등록증.pdf',
        storedFileName: 'car_reg_103.pdf',
        relativeFilePath: '/files/car_reg_103.pdf',
        fileSizeByte: 234567,
      },
    ],
  },
]

// 커스텀 체크박스 컴포넌트 (HTML 디자인 가이드 참고)
const CustomCheckbox = ({ checked }: { checked: boolean }) => (
  <span
    className={`inline-block h-5 w-5 rounded-lg border-[1.5px] ${checked ? 'border-[#0166ff] bg-[#0166ff]' : 'border-[#CED2DA] bg-white'}`}
  />
)

// 상세 아이콘 SVG 컴포넌트
const DetailIcon = () => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 22 22'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M8.40676 13.5927L13.5922 8.40727M13.5922 8.40727H9.05495M13.5922 8.40727V12.9446M10.9997 20.1667C16.0622 20.1667 20.1663 16.0626 20.1663 11C20.1663 5.93743 16.0622 1.83337 10.9997 1.83337C5.93706 1.83337 1.83301 5.93743 1.83301 11C1.83301 16.0626 5.93706 20.1667 10.9997 20.1667Z'
      stroke='#141C25'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

// 네비게이션 화살표 SVG
const NavArrowLeftSvg = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M12.5 5L7.5 10L12.5 15'
      stroke='#141C25'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
const NavArrowRightSvg = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M7.5 5L12.5 10L7.5 15'
      stroke='#141C25'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export const VehicleInfoTab = () => {
  const params = useParams({ from: '/_authenticated/transport/$id' })
  const transportCompanyId = params.id
  const [page, setPage] = useState(0)
  const size = 10
  const errorRef = useRef(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedMobilityId, setSelectedMobilityId] = useState<number | null>(
    null
  )

  // useQuery: 에러 swallow, errorRef로 에러 상태 관리
  const { data, isLoading } = useQuery({
    queryKey: ['mobilityList', transportCompanyId, page, size],
    queryFn: async () => {
      try {
        const res = await apiClient.get(
          `/mobility/list/${transportCompanyId}`,
          {
            params: { page, size },
          }
        )
        errorRef.current = false
        return res.data.data as MobilityListResponse
      } catch (e) {
        errorRef.current = true
        return null
      }
    },
    enabled: !!transportCompanyId,
  })

  // 체크박스 상태 관리
  const [checkedRows, setCheckedRows] = useState<number[]>([])

  // 에러이거나 데이터가 없으면 더미데이터 사용
  const shouldShowDummy =
    errorRef.current || !data || !data.content || data.content.length === 0
  const rows = shouldShowDummy ? getDummyData() : data.content
  const totalElements = data?.totalElements ?? rows.length
  const totalPages = data?.totalPages ?? 1
  const isAllChecked = rows.length > 0 && checkedRows.length === rows.length

  const handleCheckRow = (id: number) => {
    setCheckedRows(
      checkedRows.includes(id)
        ? checkedRows.filter((i) => i !== id)
        : [...checkedRows, id]
    )
  }
  const handleCheckAll = () => {
    if (isAllChecked) {
      setCheckedRows([])
    } else {
      setCheckedRows(rows.map((row) => row.mobilityId))
    }
  }

  // 상세 컬럼 전용 클래스 (헤더/본문 분리)
  const detailHeaderClass =
    'w-[26px] min-w-[26px] max-w-[26px] px-0 py-0 flex items-center justify-center sticky right-0 bg-white z-20 shadow-[rgba(16,30,54,0.06)_-4px_0px_8px_0px] border-l border-[#e4e7ec] h-[48px]'

  const handleOpenDetail = (mobilityId: number) => {
    setSelectedMobilityId(mobilityId)
    setDetailModalOpen(true)
  }
  const handleCloseDetail = () => {
    setDetailModalOpen(false)
    setSelectedMobilityId(null)
  }

  // 컬럼 정의 배열 (상세 컬럼은 className에 detailHeaderClass/detailCellClass 사용)
  const columns = [
    {
      key: 'mobilityNo',
      label: (
        <span className='flex items-center gap-2'>
          <button onClick={handleCheckAll}>
            <CustomCheckbox checked={isAllChecked} />
          </button>
          차량번호
        </span>
      ),
      className:
        'w-[120px] min-w-[80px] md:w-[160px] md:min-w-[120px] lg:w-[220px] lg:min-w-[220px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
      render: (row: any) => (
        <span className='flex items-center gap-2'>
          <button onClick={() => handleCheckRow(row.mobilityId)}>
            <CustomCheckbox checked={checkedRows.includes(row.mobilityId)} />
          </button>
          <span
            className='text-xs leading-5 font-medium whitespace-nowrap text-[#141c25] md:text-sm'
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {row.mobilityNo}
          </span>
        </span>
      ),
    },
    {
      key: 'project',
      label: '프로젝트배정',
      className:
        'w-[80px] min-w-[60px] md:w-[100px] md:min-w-[80px] lg:w-[110px] lg:min-w-[110px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'bizType',
      label: '사업구분',
      className:
        'w-[80px] min-w-[60px] md:w-[100px] md:min-w-[80px] lg:w-[110px] lg:min-w-[110px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'vin',
      label: '차대번호',
      className:
        'w-[120px] min-w-[80px] md:w-[160px] md:min-w-[120px] lg:w-[200px] lg:min-w-[200px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'model',
      label: '모델명',
      className:
        'w-[80px] min-w-[60px] md:w-[100px] md:min-w-[80px] lg:w-[120px] lg:min-w-[120px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'type',
      label: '차량유형',
      className:
        'w-[100px] min-w-[70px] md:w-[120px] md:min-w-[100px] lg:w-[140px] lg:min-w-[140px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'year',
      label: '연식',
      className:
        'w-[50px] min-w-[40px] md:w-[60px] md:min-w-[50px] lg:w-[70px] lg:min-w-[70px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'fuelTypeDescription',
      label: '연료',
      className:
        'w-[50px] min-w-[40px] md:w-[60px] md:min-w-[50px] lg:w-[70px] lg:min-w-[70px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'capacity',
      label: '인승',
      className:
        'w-[60px] min-w-[40px] md:w-[60px] md:min-w-[50px] lg:w-[70px] lg:min-w-[70px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'mobilityRegDate',
      label: '차량등록일',
      className:
        'w-[90px] min-w-[70px] md:w-[100px] md:min-w-[90px] lg:w-[110px] lg:min-w-[110px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'carRegFile',
      label: '자동차등록증',
      className:
        'w-[180px] min-w-[120px] md:w-[240px] md:min-w-[180px] lg:w-[320px] lg:min-w-[320px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'exportFile',
      label: '수출/자진말소증명서',
      className:
        'w-[180px] min-w-[120px] md:w-[240px] md:min-w-[180px] lg:w-[320px] lg:min-w-[320px] px-2 md:px-4 lg:px-5 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs md:text-sm',
    },
    {
      key: 'detail',
      label: '상세',
      className:
        'w-[26px] min-w-[26px] max-w-[26px] px-0 py-0 flex items-center justify-center sticky right-0 bg-white z-20 shadow-[rgba(16,30,54,0.06)_-4px_0px_8px_0px] border-l border-[#e4e7ec] h-[48px]',
      render: (row: any) => (
        <div className='sticky right-0 z-20 flex h-[68px] w-[26px] max-w-[26px] min-w-[26px] items-center justify-center border-l border-[#e4e7ec] bg-white px-0 py-0 shadow-[rgba(16,30,54,0.06)_-4px_0px_8px_0px]'>
          <button
            className='mx-auto flex h-[22px] h-full w-[22px] items-center justify-center transition-opacity hover:opacity-70'
            onClick={() => handleOpenDetail(row.mobilityId)}
          >
            <DetailIcon />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className='min-h-screen w-full'>
      {/* 섹션 헤더 */}
      <div className='mb-6 flex items-center justify-between bg-white'>
        <h2
          className='text-base leading-6 font-medium text-[#141c25]'
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          차량정보
        </h2>
        <button
          className='flex items-center gap-2 rounded-[10px] bg-[#0166ff] px-5 py-2.5 text-sm font-medium text-white shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)]'
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          차량 추가
        </button>
      </div>
      {/* 전체 카운트 및 검색 */}
      <div className='mb-6 flex items-center justify-between bg-white'>
        <div className='flex items-center gap-2 py-0.5'>
          <div
            className='text-sm leading-5 text-[#637083]'
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            전체
          </div>
          <div
            className='text-sm leading-5 font-semibold text-[#0166ff]'
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {totalElements}
          </div>
        </div>
        <div className='w-80'>
          <div className='relative'>
            <input
              placeholder='Search'
              className='w-full rounded-[10px] border border-[#e4e7ec] bg-white py-2 pr-20 pl-4 text-base leading-6 text-[#637083] shadow-sm'
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <button
              className='absolute top-1/2 right-2 -translate-y-1/2 transform rounded-lg bg-transparent px-3 py-1 text-sm leading-5 font-medium text-[#0166ff] shadow-sm hover:bg-gray-50'
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              검색
            </button>
          </div>
        </div>
      </div>
      {/* 테이블 */}
      <div
        className='w-full overflow-x-auto'
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          style={{ minWidth: '1200px' }}
          className='overflow-hidden rounded-2xl border border-[#e4e7ec]'
        >
          {/* 테이블 헤더 */}
          <div className='flex border-b border-[#e4e7ec] bg-[#f5f6f8]'>
            {columns.map((column, idx) => (
              <div
                key={column.key}
                className={
                  column.key === 'detail'
                    ? detailHeaderClass
                    : column.className +
                      (idx === columns.length - 1
                        ? ''
                        : ' border-r border-[#e4e7ec]') +
                      (idx === 0 ? ' rounded-tl-2xl' : '') +
                      (idx === columns.length - 1 ? ' rounded-tr-2xl' : '')
                }
              >
                <span
                  className='text-xs leading-5 font-medium whitespace-nowrap text-[#344051] lg:text-sm'
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {column.label}
                </span>
              </div>
            ))}
          </div>
          {/* 테이블 본문 */}
          {isLoading ? (
            <div
              className='p-20 text-center text-gray-500'
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Loading...
            </div>
          ) : (
            rows.map((row: any, index: number) => (
              <div
                key={row.mobilityId}
                className={`flex bg-white transition-colors hover:bg-gray-50 ${index !== rows.length - 1 ? 'border-b border-[#e4e7ec]' : ''}`}
                style={{ minHeight: '68px' }}
              >
                {columns.map((column, idx) =>
                  column.key === 'detail' ? (
                    column?.render(row)
                  ) : (
                    <div
                      key={column.key}
                      className={
                        column.className +
                        (idx === columns.length - 1
                          ? ''
                          : ' border-r border-[#e4e7ec]')
                      }
                    >
                      {column.render
                        ? column.render(row)
                        : (() => {
                            switch (column.key) {
                              case 'project':
                                return (
                                  <span
                                    className='inline-block rounded-[6px] bg-[#e5f2ff] px-2 py-0.5 text-xs font-medium text-[#0166ff]'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    부천001
                                  </span>
                                )
                              case 'bizType':
                                return (
                                  <span
                                    className='inline-block rounded-[6px] bg-[#e5f2ff] px-2 py-0.5 text-xs font-medium text-[#0166ff]'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    신규도입
                                  </span>
                                )
                              case 'vin':
                                return (
                                  <span
                                    className='text-sm leading-5 font-medium whitespace-nowrap text-[#344051]'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    {row.vin}
                                  </span>
                                )
                              case 'model':
                                return (
                                  <span
                                    className='text-sm leading-5 font-medium whitespace-nowrap text-[#344051]'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    {row.model}
                                  </span>
                                )
                              case 'type':
                                return (
                                  <span
                                    className='text-sm leading-5 font-medium whitespace-nowrap text-[#344051]'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    {row.type}
                                  </span>
                                )
                              case 'year':
                                return (
                                  <span
                                    className='text-sm leading-5 font-medium whitespace-nowrap text-[#344051]'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    {row.year}
                                  </span>
                                )
                              case 'fuelTypeDescription':
                                return (
                                  <span
                                    className='text-sm leading-5 font-medium whitespace-nowrap text-[#344051]'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    {row.fuelTypeDescription}
                                  </span>
                                )
                              case 'capacity':
                                return (
                                  <span
                                    className='text-sm leading-5 font-medium whitespace-nowrap text-[#344051]'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    11인승
                                  </span>
                                )
                              case 'mobilityRegDate':
                                return (
                                  <span
                                    className='text-sm leading-5 font-medium whitespace-nowrap text-[#344051]'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    {row.mobilityRegDate}
                                  </span>
                                )
                              case 'carRegFile':
                                return row.files &&
                                  row.files.filter(
                                    (f: any) => f.fileTypeName === 'VEHICLE_REG'
                                  ).length > 0 ? (
                                  row.files
                                    .filter(
                                      (f: any) =>
                                        f.fileTypeName === 'VEHICLE_REG'
                                    )
                                    .map((file: any) => (
                                      <a
                                        key={file.attachFileId}
                                        href={file.relativeFilePath}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-2 transition-opacity hover:opacity-80'
                                      >
                                        <div className='rounded bg-[#f2f4f7] px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-[#344051]'>
                                          PDF
                                        </div>
                                        <span
                                          className='text-xs whitespace-nowrap text-[#141c25]'
                                          style={{
                                            fontFamily: 'Inter, sans-serif',
                                          }}
                                        >
                                          {file.originalFileName}
                                        </span>
                                      </a>
                                    ))
                                ) : (
                                  <span
                                    className='text-xs text-gray-400'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    -
                                  </span>
                                )
                              case 'exportFile':
                                return row.files &&
                                  row.files.filter(
                                    (f: any) =>
                                      f.fileTypeName === 'EXPORT_DELETE_CERT'
                                  ).length > 0 ? (
                                  row.files
                                    .filter(
                                      (f: any) =>
                                        f.fileTypeName === 'EXPORT_DELETE_CERT'
                                    )
                                    .map((file: any) => (
                                      <a
                                        key={file.attachFileId}
                                        href={file.relativeFilePath}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex items-center gap-2 transition-opacity hover:opacity-80'
                                      >
                                        <div className='rounded bg-[#f2f4f7] px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-[#344051]'>
                                          PDF
                                        </div>
                                        <span
                                          className='text-xs whitespace-nowrap text-[#141c25]'
                                          style={{
                                            fontFamily: 'Inter, sans-serif',
                                          }}
                                        >
                                          {file.originalFileName}
                                        </span>
                                      </a>
                                    ))
                                ) : (
                                  <span
                                    className='text-xs text-gray-400'
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    -
                                  </span>
                                )
                              default:
                                return null
                            }
                          })()}
                    </div>
                  )
                )}
              </div>
            ))
          )}
        </div>
        {/* 페이지네이션 */}
        <div className='flex items-center justify-between py-4'>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className='rounded-lg bg-[#f2f4f7] p-2 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <NavArrowLeftSvg />
          </button>
          <div className='flex items-center gap-2'>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {pageNum}
                </button>
              )
            })}
            {totalPages > 5 && (
              <>
                <span
                  className='px-2 leading-5 text-[#637083]'
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  ...
                </span>
                <button
                  className='h-9 w-9 rounded-lg text-sm leading-5 font-medium text-[#637083] hover:bg-gray-100'
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page + 1 >= totalPages}
            className='rounded-lg bg-[#f2f4f7] p-2 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <NavArrowRightSvg />
          </button>
        </div>
      </div>
      {detailModalOpen && selectedMobilityId && (
        <VechicleInfoDetailModal
          mobilityId={selectedMobilityId}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}
