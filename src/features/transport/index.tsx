import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Bell, Plus, Search } from 'lucide-react'
import { useTransports } from '@/lib/api-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { areaCodeMap } from '@/constants/areaCodeMap'
import { PrevIcon, NextIcon } from '@/components/ui/icons'
import Select from '@/components/ui/select'

// 커스텀 상세 아이콘 컴포넌트
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

interface TransportCompany {
  transportCompanyId: number
  companyName: string
  areaCode: string
  corporateRegistrationNumber: string | null
  address: string | null
  detailedAddress: string | null
  managerName: string
  managerEmail: string
  hydrogenBusCount: number
  electricBusCount: number
  busTotalCount: number
}

// 지역 옵션 배열 생성
const AREA_OPTIONS = [
  { value: 'ALL', label: '지역' },
  ...Object.entries(areaCodeMap)
    .filter(([code]) => code !== 'ALL')
    .map(([code, name]) => ({ value: code, label: name }))
]

const TransportPage = () => {
  const [page, setPage] = useState(0)
  const size = 10
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

  return (
    <div className='min-h-screen bg-white'>
      {/* 상단 네비게이션 바 - 운수사 관리 */}
      <div className='border-b border-[#e4e7ec] bg-white px-8 py-5'>
        <div className='flex max-w-full items-center justify-between'>
          <div className='flex-1'>
            <h1
              className='text-2xl leading-8 font-medium tracking-[-0.01em] text-[#141c25]'
              style={{ fontFamily: '"Inter-Medium", sans-serif' }}
            >
              운수사 관리
            </h1>
          </div>
          <div className='flex items-center gap-3'>
            <button className='rounded-lg p-1 transition-colors hover:bg-gray-100'>
              <Search className='h-[22px] w-[22px] text-gray-600' />
            </button>
            <button className='relative rounded-lg p-1 transition-colors hover:bg-gray-100'>
              <Bell className='h-[22px] w-[22px] text-gray-600' />
              <div className='absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#0166ff]'></div>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 - 새롭게 정의 */}
      <div className='bg-white px-8 py-6'>
        {/* 운수사정보 헤더 및 CTA */}
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center'>
            <h2 className='text-base leading-6 font-medium text-[#141c25]'>
              운수사정보
            </h2>
          </div>
          <Button className='rounded-[10px] bg-[#0166ff] px-5 py-2.5 text-sm leading-5 font-medium text-white shadow-sm hover:bg-[#0166ff]/90'>
            <Plus className='mr-2 h-5 w-5' />
            운수사 추가
          </Button>
        </div>

        {/* 필터/검색/Rows per page */}
        <div className='mb-6 flex flex-wrap items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            {/* 지역 MultiSelect */}
            <Select
              options={AREA_OPTIONS.map(({ value, label }) => ({ value, label }))}
              placeholder="지역"
              className="min-w-[120px] h-10 rounded-[10px] border border-[#e4e7ec] bg-white shadow-sm px-5 text-sm font-medium text-[#344051]"
            />
            {/* 검색 인풋 */}
            <Input
              placeholder='회사명, 담당자명'
              className='w-60 rounded-[10px] border px-4 py-2 text-sm'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const [companyName, managerName] = searchInput.split(' ')
                  setSearch({ companyName: companyName || '', managerName: managerName || '' })
                  setPage(0)
                }
              }}
            />
            <Button
              className='rounded-[10px] bg-[#141c25] px-5 py-2 text-sm font-medium text-white'
              onClick={() => {
                // 회사명, 담당자명 분리 (예: "공항버스 신수용")
                const [companyName, managerName] = searchInput.split(' ')
                setSearch({ companyName: companyName || '', managerName: managerName || '' })
                setPage(0)
              }}
            >
              검색
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-[#637083]'>Rows per page</span>
            <select className='rounded-[10px] border px-4 py-2 text-sm'>
              <option>10</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>

        {/* 테이블 */}
        <div className='mb-6 overflow-hidden rounded-lg border border-[#e4e7ec]'>
          <div className='flex bg-[#f2f4f7]'>
            <div className='flex-1 p-3 border-r border-[#e4e7ec] flex items-center'>회사명</div>
            <div className='flex-1 p-3 border-r border-[#e4e7ec] flex items-center'>지역</div>
            <div className='flex-1 p-3 border-r border-[#e4e7ec] flex items-center'>사업자번호</div>
            <div className='flex-[2] p-3 border-r border-[#e4e7ec] flex items-center'>주소</div>
            <div className='flex-1 p-3 border-r border-[#e4e7ec] flex items-center'>담당자</div>
            <div className='flex-[2] p-3 border-r border-[#e4e7ec] flex items-center'>담당자 이메일</div>
            <div className='flex-1 p-3 border-r border-[#e4e7ec] flex items-center'>수소차량</div>
            <div className='flex-1 p-3 border-r border-[#e4e7ec] flex items-center'>전기차량</div>
            <div className='flex-1 p-3 border-r border-[#e4e7ec] flex items-center'>전체차량</div>
            <div className='w-[60px] p-3 flex items-center justify-center sticky right-0 bg-[#f2f4f7] z-10'>상세</div>
          </div>
          {content.length === 0 ? (
            <div className='p-20 text-center text-gray-500'>데이터가 없습니다.</div>
          ) : (
            content.map((row) => (
              <div
                key={row.transportCompanyId}
                className='flex border-b border-[#e4e7ec] bg-white transition-colors hover:bg-gray-50'
              >
                <div className='flex-1 p-5 border-r border-[#e4e7ec] flex items-center'>{row.companyName}</div>
                <div className='flex-1 p-5 border-r border-[#e4e7ec] flex items-center'>{areaCodeMap[row.areaCode] || row.areaCode}</div>
                <div className='flex-1 p-5 border-r border-[#e4e7ec] flex items-center'>{row.corporateRegistrationNumber || '-'}</div>
                <div className='flex-[2] p-5 border-r border-[#e4e7ec] flex items-center'>{row.address ? `${row.address} ${row.detailedAddress || ''}` : '-'}</div>
                <div className='flex-1 p-5 border-r border-[#e4e7ec] flex items-center'>{row.managerName}</div>
                <div className='flex-[2] p-5 border-r border-[#e4e7ec] flex items-center'>{row.managerEmail}</div>
                <div className='flex-1 p-5 border-r border-[#e4e7ec] flex items-center'>{row.hydrogenBusCount}</div>
                <div className='flex-1 p-5 border-r border-[#e4e7ec] flex items-center'>{row.electricBusCount}</div>
                <div className='flex-1 p-5 border-r border-[#e4e7ec] flex items-center'>{row.busTotalCount}</div>
                <div className='w-[60px] p-5 flex items-center justify-center sticky right-0 bg-white z-10'>
                  <button
                    className='h-[22px] w-[22px] transition-opacity hover:opacity-70'
                    onClick={() => navigate({ to: `/transport/${row.transportCompanyId}` })}
                  >
                    <DetailIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 페이징 */}
        <div className='flex items-center justify-between'>
          <button
            className='rounded-lg bg-[#f2f4f7] p-2'
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <PrevIcon />
          </button>
          <div className='flex items-center gap-2'>
            {/* 페이지 번호 버튼 */}
            {Array.from(
              { length: Math.min(pageInfo.totalPages, 5) },
              (_, i) => {
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
                    style={{ fontFamily: '"Inter-Medium", sans-serif' }}
                  >
                    {pageNum}
                  </button>
                )
              }
            )}
            {pageInfo.totalPages > 5 && (
              <>
                <span
                  className='px-2 leading-5 text-[#637083]'
                  style={{ fontFamily: '"Inter-Medium", sans-serif' }}
                >
                  ...
                </span>
                <button
                  className='h-9 w-9 rounded-lg text-sm leading-5 font-medium text-[#637083] hover:bg-gray-100'
                  style={{ fontFamily: '"Inter-Medium", sans-serif' }}
                >
                  {pageInfo.totalPages}
                </button>
              </>
            )}
          </div>
          <button
            className='rounded-lg bg-[#f2f4f7] p-2'
            disabled={page + 1 >= pageInfo.totalPages}
            onClick={() =>
              setPage((p) => Math.min(pageInfo.totalPages - 1, p + 1))
            }
          >
            <NextIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/transport/')({
  component: TransportPage,
})
