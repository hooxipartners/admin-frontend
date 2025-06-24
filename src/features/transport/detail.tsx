import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Search, Bell } from 'lucide-react'
import { BasicInfoTab } from './tabs/basic-info-tab'
import { VehicleInfoTab } from './tabs/vehicle-info-tab'
import { FacilityInfoTab } from './tabs/facility-info-tab'
import { useQuery } from '@tanstack/react-query'
import { fetchTransportCompanyDetail } from '@/lib/api-hooks'
import { AppSidebar } from '@/components/layout/app-sidebar'

const TransportDetailPage = () => {
  const navigate = useNavigate()
  const params = useParams({ from: '/_authenticated/transport/$id' })
  const [activeTab, setActiveTab] = useState('basic')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['transportCompanyDetail', params.id],
    queryFn: () => fetchTransportCompanyDetail(Number(params.id)),
    enabled: !!params.id,
  })

  if (isLoading) return <div className="p-20 text-center text-gray-500">로딩중...</div>
  if (isError || !data) return <div className="p-20 text-center text-red-500">에러 발생</div>

  const transportData = data

  const handleBack = () => {
    navigate({ to: '/transport' })
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 bg-white">
        {/*이거 삭제후 다시 써야함 공간낭비*/}
        {/*<div className="max-w-5xl mx-auto px-8">*/}
          {/* 상단 네비게이션 - autohtml-project와 동일한 스타일 */}
          <div className="bg-white py-5 border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBack}
                  className="w-8 h-8 border border-[#e4e7ec] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-[18px] h-[18px] text-gray-600" />
                </button>
                <h1 className="text-2xl font-medium text-[#141c25] tracking-[-0.01em] leading-8" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
                  {transportData.companyName} 상세정보
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <Search className="w-[22px] h-[22px] text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell className="w-[22px] h-[22px] text-gray-600" />
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#0166ff] rounded-full"></div>
                  </button>
                </div>
                <div className="w-10 h-10 bg-[#e5f2ff] rounded-full flex items-center justify-center">
                  <span className="text-[#003166] text-lg font-medium leading-7" style={{ fontFamily: '"Inter-Medium", sans-serif' }}>
                    DY
                  </span>
                </div>
              </div>
            </div>

            {/* 탭 네비게이션 - autohtml-project와 동일한 스타일 */}
            <div className="flex items-center mt-5">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'basic'
                    ? 'text-[#141c25] border-[#141c25]'
                    : 'text-[#637083] border-[#e4e7ec] hover:text-[#141c25]'
                }`}
                style={{ fontFamily: '"Inter-Medium", sans-serif' }}
              >
                기본정보
              </button>
              <button
                onClick={() => setActiveTab('vehicle')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'vehicle'
                    ? 'text-[#141c25] border-[#141c25]'
                    : 'text-[#637083] border-[#e4e7ec] hover:text-[#141c25]'
                }`}
                style={{ fontFamily: '"Inter-Medium", sans-serif' }}
              >
                차량정보
              </button>
              <button
                onClick={() => setActiveTab('facility')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'facility'
                    ? 'text-[#141c25] border-[#141c25]'
                    : 'text-[#637083] border-[#e4e7ec] hover:text-[#141c25]'
                }`}
                style={{ fontFamily: '"Inter-Medium", sans-serif' }}
              >
                설비정보
              </button>
            </div>
          {/*</div>*/}

          {/* 탭 콘텐츠 */}
          <div className="px-8 py-4">
            {activeTab === 'basic' && <BasicInfoTab data={transportData} />}
            {activeTab === 'vehicle' && <VehicleInfoTab data={transportData} />}
            {activeTab === 'facility' && <FacilityInfoTab data={transportData} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/transport/$id')({
  component: TransportDetailPage,
})
