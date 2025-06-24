import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTransports } from '@/lib/api-hooks'
import { Plus, Search, Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// 커스텀 체크박스 컴포넌트
const CustomCheckbox = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0.75H12C16.0041 0.75 19.25 3.99594 19.25 8V12C19.25 16.0041 16.0041 19.25 12 19.25H8C3.99594 19.25 0.75 16.0041 0.75 12V8C0.75 3.99594 3.99594 0.75 8 0.75Z" fill="white"/>
    <path d="M8 0.75H12C16.0041 0.75 19.25 3.99594 19.25 8V12C19.25 16.0041 16.0041 19.25 12 19.25H8C3.99594 19.25 0.75 16.0041 0.75 12V8C0.75 3.99594 3.99594 0.75 8 0.75Z" stroke="#CED2DA" strokeWidth="1.5"/>
  </svg>
)

// 커스텀 상세 아이콘 컴포넌트
const DetailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.40676 13.5927L13.5922 8.40727M13.5922 8.40727H9.05495M13.5922 8.40727V12.9446M10.9997 20.1667C16.0622 20.1667 20.1663 16.0626 20.1663 11C20.1663 5.93743 16.0622 1.83337 10.9997 1.83337C5.93706 1.83337 1.83301 5.93743 1.83301 11C1.83301 16.0626 5.93706 20.1667 10.9997 20.1667Z" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface TransportCompany {
  transportCompanyId: number
  areaCodeName: string
  areaCodeDescription: string
  companyName: string
  transportTypeName: string
  transportTypeDescription: string
  address: string | null
  detailedAddress: string | null
  managerName: string
  bizStartDate: string | null
  reqStartDate: string | null
}

const TransportPage = () => {
  const [page, setPage] = useState(0)
  const size = 10
  const { data, isLoading, isError } = useTransports(page, size)
  const navigate = useNavigate()

  const content: TransportCompany[] = data?.data?.content || []
  const pageInfo = data?.data?.page || { size: 10, number: 0, totalElements: 0, totalPages: 1 }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 바 - 운수사 관리 */}
      <div className="bg-white px-8 py-5 border-b border-[#e4e7ec]">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex-1">
            <h1 className="text-2xl font-medium text-[#141c25] tracking-[-0.01em] leading-8" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
              운수사 관리
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-[22px] h-[22px] text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-[22px] h-[22px] text-gray-600" />
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#0166ff] rounded-full"></div>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="bg-white px-8 py-6">
        {/* 운수사 목록 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-base font-medium text-[#141c25] leading-6" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>운수사 목록</h2>
          </div>
          <Button 
            className="bg-[#0166ff] hover:bg-[#0166ff]/90 text-white px-5 py-2.5 rounded-[10px] font-medium text-sm shadow-sm leading-5"
            style={{ fontFamily: '"Inter-Medium", sans-serif' }}
          >
            <Plus className="w-5 h-5 mr-2" />
            운수사 추가
          </Button>
        </div>

        {/* 전체 카운트 및 검색 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 py-0.5">
            <div className="text-sm text-[#637083] leading-5" style={{ fontFamily: '"Inter-Regular", sans-serif' }}>전체</div>
            <div className="text-sm font-semibold text-[#0166ff] leading-5" style={{ fontFamily: '"Inter-SemiBold", sans-serif' }}>
              {pageInfo.totalElements || 32}
            </div>
          </div>
          <div className="w-80">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-6 h-6 text-[#637083]" />
              </div>
              <Input
                placeholder="Search"
                className="pl-11 pr-20 py-2 border border-[#e4e7ec] rounded-[10px] bg-white shadow-sm text-base text-[#637083] leading-6"
                style={{ fontFamily: '"Inter-Regular", sans-serif' }}
              />
              <Button 
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-50 text-[#0166ff] px-3 py-1 rounded-lg text-sm font-medium shadow-sm leading-5"
                style={{ fontFamily: '"Inter-Medium", sans-serif' }}
              >
                검색
              </Button>
            </div>
          </div>
        </div>

        {/* 표 */}
        <div className="border border-[#e4e7ec] rounded-lg overflow-hidden mb-6">
          {/* 테이블 헤더 */}
          <div className="bg-[#f2f4f7] flex">
            <div className="w-[200px] p-[10px_20px] border-r border-[#e4e7ec] flex items-center gap-2">
              <CustomCheckbox />
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>회사명</span>
            </div>
            <div className="w-[80px] p-[10px_20px] border-r border-[#e4e7ec] flex items-center">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>조합</span>
            </div>
            <div className="w-[150px] p-[10px_20px] border-r border-[#e4e7ec] flex items-center">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>사업자번호</span>
            </div>
            <div className="w-[400px] p-[10px_20px] border-r border-[#e4e7ec] flex items-center">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>주소</span>
            </div>
            <div className="w-[100px] p-[10px_20px] border-r border-[#e4e7ec] flex items-center">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>담당자</span>
            </div>
            <div className="w-[150px] p-[10px_20px] border-r border-[#e4e7ec] flex items-center">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>담당자 연락처</span>
            </div>
            <div className="w-[200px] p-[10px_20px] border-r border-[#e4e7ec] flex items-center">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>담당자 이메일</span>
            </div>
            <div className="flex-1 p-[10px_20px] border-r border-[#e4e7ec] flex items-center">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>메모</span>
            </div>
            <div className="w-[80px] p-[10px_20px] flex items-center">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>상세</span>
            </div>
          </div>

          {/* 테이블 본문 */}
          {isLoading ? (
            <div className="p-20 text-center text-gray-500" style={{ fontFamily: '"Inter-Regular", sans-serif' }}>Loading...</div>
          ) : isError ? (
            <div className="p-20 text-center text-red-500" style={{ fontFamily: '"Inter-Regular", sans-serif' }}>에러가 발생했습니다.</div>
          ) : content.length === 0 ? (
            <div className="p-20 text-center text-gray-500" style={{ fontFamily: '"Inter-Regular", sans-serif' }}>데이터가 없습니다.</div>
          ) : (
            content.map((row, index) => (
              <div 
                key={row.transportCompanyId} 
                className={`flex bg-white hover:bg-gray-50 transition-colors ${
                  index !== content.length - 1 ? 'border-b border-[#e4e7ec]' : ''
                }`}
              >
                <div className="w-[200px] p-5 border-r border-[#e4e7ec] flex items-center gap-2.5 h-[68px]">
                  <CustomCheckbox />
                  <span className="text-sm font-medium text-[#141c25] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>{row.companyName}</span>
                </div>
                <div className="w-[80px] p-5 border-r border-[#e4e7ec] flex items-center h-[68px]">
                  <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>{row.areaCodeDescription}</span>
                </div>
                <div className="w-[150px] p-5 border-r border-[#e4e7ec] flex items-center h-[68px]">
                  <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>110-461-20-21762</span>
                </div>
                <div className="w-[400px] p-5 border-r border-[#e4e7ec] flex items-center h-[68px]">
                  <span className="text-sm font-medium text-[#344051] leading-5 truncate whitespace-nowrap overflow-hidden" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
                    {row.address || '서울특별시 영등포구 의사당대로 83 오투타워 19층 1901호'}
                  </span>
                </div>
                <div className="w-[100px] p-5 border-r border-[#e4e7ec] flex items-center h-[68px]">
                  <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>{row.managerName}</span>
                </div>
                <div className="w-[150px] p-5 border-r border-[#e4e7ec] flex items-center h-[68px]">
                  <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>010-0000-0000</span>
                </div>
                <div className="w-[200px] p-5 border-r border-[#e4e7ec] flex items-center h-[68px]">
                  <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>qwerty@gmail.com</span>
                </div>
                <div className="flex-1 p-5 border-r border-[#e4e7ec] flex items-center h-[68px]">
                  <span className="text-sm font-medium text-[#344051] leading-5 truncate whitespace-nowrap overflow-hidden" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
                    운수사 주소 및 담당자 변경(25.04.21)
                  </span>
                </div>
                <div className="w-[80px] p-5 flex items-center justify-center h-[68px]">
                  <button
                    className="w-[22px] h-[22px] hover:opacity-70 transition-opacity"
                    onClick={() => navigate({ to: `/transport/${row.transportCompanyId}` })}
                  >
                    <DetailIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 이전/다음 페이지네이션 */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setPage((p) => Math.max(0, p - 1))} 
            disabled={page === 0}
            className="bg-[#f2f4f7] hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(pageInfo.totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === page + 1;
              return (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors leading-5 ${
                    isActive 
                      ? 'bg-[#f2f4f7] text-[#141c25]' 
                      : 'text-[#637083] hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: '"Inter-Medium", sans-serif' }}
                >
                  {pageNum}
                </button>
              );
            })}
            {pageInfo.totalPages > 5 && (
              <>
                <span className="text-[#637083] px-2 leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>...</span>
                <button className="w-9 h-9 rounded-lg text-sm font-medium text-[#637083] hover:bg-gray-100 leading-5" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
                  {pageInfo.totalPages}
                </button>
              </>
            )}
          </div>
          
          <button 
            onClick={() => setPage((p) => Math.min(pageInfo.totalPages - 1, p + 1))} 
            disabled={page + 1 >= pageInfo.totalPages}
            className="bg-[#f2f4f7] hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/transport/')({
  component: TransportPage,
})
