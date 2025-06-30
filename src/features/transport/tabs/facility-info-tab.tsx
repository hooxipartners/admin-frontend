import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const NavArrowLeftSvg = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 5L7.5 10L12.5 15" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const NavArrowRightSvg = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 5L12.5 10L7.5 15" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const DetailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.40676 13.5927L13.5922 8.40727M13.5922 8.40727H9.05495M13.5922 8.40727V12.9446M10.9997 20.1667C16.0622 20.1667 20.1663 16.0626 20.1663 11C20.1663 5.93743 16.0622 1.83337 10.9997 1.83337C5.93706 1.83337 1.83301 5.93743 1.83301 11C1.83301 16.0626 5.93706 20.1667 10.9997 20.1667Z" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const CustomCheckbox = ({ checked }: { checked: boolean }) => (
  <span className={`w-5 h-5 inline-block rounded-lg border-[1.5px] ${checked ? 'border-[#0166ff] bg-[#0166ff]' : 'border-[#CED2DA] bg-white'}`}/>
)

// 설비정보 목업 데이터 (차량정보와 동일하게 배열 형태, 각 컬럼별 데이터)
const getFacilityMockData = () => Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  garage: '경기 포천시 내촌면 음고개길 7 내촌전기충전소',
  company: '다모아자동차',
  acMeterNo: '06212036315',
  acMeterYear: '2020-04',
  chargerNo: 'PUMPKIN-24002C2-DB-0004',
  chargerYear: '2020-04',
  serial: (i+1).toString().padStart(2, '0'),
  plateFile: '다모아자동차(주)_충전동판이미지.pdf',
}))

export const FacilityInfoTab = () => {
  const [checkedRows, setCheckedRows] = useState<number[]>([])
  const [page, setPage] = useState(0)
  const size = 10
  const rows = getFacilityMockData().slice(page * size, (page + 1) * size)
  const totalElements = getFacilityMockData().length
  const totalPages = Math.ceil(totalElements / size)
  const isAllChecked = rows.length > 0 && checkedRows.length === rows.length

  const handleCheckRow = (id: number) => {
    setCheckedRows(checkedRows.includes(id) ? checkedRows.filter(i => i !== id) : [...checkedRows, id])
  }
  const handleCheckAll = () => {
    if (isAllChecked) {
      setCheckedRows([])
    } else {
      setCheckedRows(rows.map(row => row.id))
    }
  }

  // 컬럼 정의 (차량정보와 동일하게)
  const columns = [
    {
      key: 'garage',
      label: (
        <span className="flex items-center gap-2">
          <button onClick={handleCheckAll}><CustomCheckbox checked={isAllChecked} /></button>
          차고지
        </span>
      ),
      className: 'flex-[3] min-w-[480px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (row: any) => (
        <span className="flex items-center gap-2">
          <button onClick={() => handleCheckRow(row.id)}><CustomCheckbox checked={checkedRows.includes(row.id)} /></button>
          <span className="text-sm font-medium text-[#141c25] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.garage}</span>
        </span>
      ),
    },
    {
      key: 'company',
      label: '운수사',
      className: 'flex-1 min-w-[180px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (row: any) => (
        <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.company}</span>
      ),
    },
    {
      key: 'acMeterNo',
      label: 'AC전력계 제조번호',
      className: 'flex-1 min-w-[140px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (row: any) => (
        <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.acMeterNo}</span>
      ),
    },
    {
      key: 'acMeterYear',
      label: 'AC전력계 제조년월',
      className: 'flex-1 min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (row: any) => (
        <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.acMeterYear}</span>
      ),
    },
    {
      key: 'chargerNo',
      label: '충전기 제조번호',
      className: 'flex-1 min-w-[180px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (row: any) => (
        <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.chargerNo}</span>
      ),
    },
    {
      key: 'chargerYear',
      label: '충전기 제조년월',
      className: 'flex-1 min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (row: any) => (
        <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.chargerYear}</span>
      ),
    },
    {
      key: 'serial',
      label: '연번',
      className: 'flex-1 min-w-[70px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (row: any) => (
        <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.serial}</span>
      ),
    },
    {
      key: 'plateFile',
      label: '충전설비 붙임 이미지',
      className: 'flex-1 min-w-[220px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium',
      render: (row: any) => (
        <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-[#f2f4f7] rounded px-1.5 py-0.5 text-xs font-medium text-[#344051] whitespace-nowrap">PDF</div>
          <span className="text-xs text-[#141c25] whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>{row.plateFile}</span>
        </a>
      ),
    },
    {
      key: 'detail',
      label: '상세',
      className: 'w-[26px] min-w-[26px] max-w-[26px] px-0 py-0 flex items-center justify-center sticky right-0 bg-white z-20 shadow-[rgba(16,30,54,0.06)_-4px_0px_8px_0px] border-l border-[#e4e7ec] h-[48px]',
      render: () => (
        <div className="w-[26px] min-w-[26px] max-w-[26px] px-0 py-0 flex items-center justify-center sticky right-0 bg-white z-20 shadow-[rgba(16,30,54,0.06)_-4px_0px_8px_0px] border-l border-[#e4e7ec] h-[68px]">
          <button className="w-[22px] h-[22px] flex items-center justify-center mx-auto hover:opacity-70 transition-opacity h-full">
            <DetailIcon />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full min-h-screen">
      {/* 섹션 헤더 */}
      <div className="bg-white mb-6 flex items-center justify-between">
        <h2 className="text-base font-medium text-[#141c25] leading-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          설비정보
        </h2>
        <Button className="px-5 py-2.5 bg-[#0166ff] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] flex items-center gap-2 text-white text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
          설비 추가
        </Button>
      </div>
      {/* 전체 카운트 및 검색 */}
      <div className="bg-white mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 py-0.5">
          <div className="text-sm text-[#637083] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>전체</div>
          <div className="text-sm font-semibold text-[#0166ff] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{totalElements}</div>
        </div>
        <div className="w-80">
          <div className="relative">
            <Input placeholder="Search" className="w-full pl-4 pr-20 py-2 border border-[#e4e7ec] rounded-[10px] bg-white shadow-sm text-base text-[#637083] leading-6" style={{ fontFamily: 'Inter, sans-serif' }} />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-50 text-[#0166ff] px-3 py-1 rounded-lg text-sm font-medium shadow-sm leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>
              검색
            </Button>
          </div>
        </div>
      </div>
      {/* 테이블 */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-[#e4e7ec]">
        <div className="flex bg-[#f2f4f7] min-w-[1200px]">
          {/* 컬럼 헤더 */}
          {columns.map((column, idx) => (
            <div
              key={column.key}
              className={
                column.key === 'detail'
                  ? 'w-[60px] min-w-[60px] max-w-[60px] p-3 flex items-center justify-center sticky right-0 bg-[#f2f4f7] z-10 border-l border-[#e4e7ec]'
                  : 'flex-1 min-w-[120px] p-3 border-r border-[#e4e7ec] flex items-center'
              }
              style={{ ...(idx === 0 ? { borderTopLeftRadius: 12 } : {}), ...(idx === columns.length - 1 ? { borderTopRightRadius: 12 } : {}) }}
            >
              <span className="text-xs font-medium text-[#344051] leading-5 whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                {column.label}
              </span>
            </div>
          ))}
        </div>
        {/* 테이블 본문 */}
        {rows.map((row, index) => (
          <div key={row.id} className={`flex bg-white hover:bg-gray-50 transition-colors min-w-[1200px] ${index !== rows.length - 1 ? 'border-b border-[#e4e7ec]' : ''}`} style={{ minHeight: '68px' }}>
            {columns.map((column, idx) => (
              column.key === 'detail' ? (
                <div key={column.key} className="w-[60px] min-w-[60px] max-w-[60px] p-3 flex items-center justify-center sticky right-0 bg-white z-10 border-l border-[#e4e7ec]">
                  {column.render ? column.render(row) : null}
                </div>
              ) : (
                <div key={column.key} className="flex-1 min-w-[120px] p-3 border-r border-[#e4e7ec] flex items-center">
                  {column.render ? column.render(row) : row[column.key]}
                </div>
              )
            ))}
          </div>
        ))}
      </div>
      {/* 페이지네이션 */}
      <div className="flex items-center justify-between py-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="bg-[#f2f4f7] hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
        >
          <NavArrowLeftSvg />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1
            const isActive = pageNum === page + 1
            return (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors leading-5 ${
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
              <span className="text-[#637083] px-2 leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                ...
              </span>
              <button
                className="w-9 h-9 rounded-lg text-sm font-medium text-[#637083] hover:bg-gray-100 leading-5"
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
          className="bg-[#f2f4f7] hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
        >
          <NavArrowRightSvg />
        </button>
      </div>
    </div>
  )
}
