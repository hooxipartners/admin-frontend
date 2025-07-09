import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Bell, Plus, Search } from 'lucide-react'
import { useTransports } from '@/lib/api-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { areaCodeMap } from '@/constants/areaCodeMap'
import Select from '@/components/ui/select'
import Pagination from '@/components/ui/pagination'
import FilterBar from '@/components/ui/filter-bar'
import DataTable from '@/components/ui/data-table'
import PdfIcon from '@/components/ui/icons/pdf-icon';
import TrashIcon from '@/components/ui/icons/trash-icon';

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
  const [size, ] = useState(10)
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
        {/* 필터 바 */}
        <FilterBar
          selects={[
            {
              options: AREA_OPTIONS.map(({ value, label }) => ({ value, label })),
              placeholder: "지역",
              className: "h-10 px-2 text-sm font-medium text-[#344051]"
            }
          ]}
          searchInput={{
            placeholder: "회사명, 담당자명",
            value: searchInput,
            onChange: (value) => setSearchInput(value),
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                const [companyName, managerName] = searchInput.split(' ')
                setSearch({ companyName: companyName || '', managerName: managerName || '' })
                setPage(0)
              }
            }
          }}
          searchButton={{
            text: "검색",
            onClick: () => {
              const [companyName, managerName] = searchInput.split(' ')
              setSearch({ companyName: companyName || '', managerName: managerName || '' })
              setPage(0)
            }
          }}
        />
        {/* 테이블 */}
        <DataTable
          columns={[
            { key: 'companyName', label: '회사명', sortable: false },
            { key: 'areaCode', label: '지역', sortable: false },
            { key: 'corporateRegistrationNumber', label: '사업자번호', sortable: false },
            { key: 'address', label: '주소', sortable: false },
            { key: 'managerName', label: '담당자', sortable: false },
            { key: 'managerEmail', label: '담당자 이메일', sortable: false },
            { key: 'hydrogenBusCount', label: '수소차량', sortable: false },
            { key: 'electricBusCount', label: '전기차량', sortable: false },
            { key: 'busTotalCount', label: '전체차량', sortable: false },
            { key: 'detail', label: '상세', sortable: false }
          ]}
          data={content.map((row) => ({
            ...row,
            areaCode: areaCodeMap[row.areaCode] || row.areaCode,
            address: row.address ? `${row.address} ${row.detailedAddress || ''}` : '-',
            corporateRegistrationNumber: row.corporateRegistrationNumber || '-',
            detail: (
              <button
                className='h-[22px] w-[22px] transition-opacity hover:opacity-70'
                onClick={() => navigate({ to: `/transport/${row.transportCompanyId}` })}
              >
                <DetailIcon />
              </button>
            )
          }))}
          page={page}
          totalPages={pageInfo.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/transport/')({
  component: TransportPage,
})

export {TransportPage}