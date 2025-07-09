import { createFileRoute, useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { BasicInfoTab } from './tabs/basic-info-tab'
import { VehicleInfoTab } from './tabs/vehicle-info-tab'
import AddVehicleTab from './tabs/add'
import { FacilityInfoTab } from './tabs/facility-info-tab'
import { OperationInfoTab } from './tabs/operation-info-tab'
import { useQuery } from '@tanstack/react-query'
import { fetchTransportCompanyDetail } from '@/lib/api-hooks'
import { PageHeader } from '@/components/layout/page-header'

const TransportDetailPage = () => {
  const navigate = useNavigate()
  const params = useParams({ from: '/_authenticated/transport/$id' })
  const search = useSearch({ from: '/_authenticated/transport/$id' }) as Record<string, any>;

  // 쿼리스트링(tab)에서 초기값, 없으면 'vehicle'
  const [activeTab, setActiveTab] = useState<'basic' | 'vehicle' | 'operation' | 'facility' | 'add'>(search['tab'] || 'vehicle')
  const [, setVehicleTabMode] = useState<'list' | 'add'>('list')

  // 쿼리스트링(tab) 변경 시 탭 동기화
  useEffect(() => {
    if (search['tab'] && search['tab'] !== activeTab) {
      setActiveTab(search['tab'] as 'basic' | 'vehicle' | 'operation' | 'facility' | 'add')
    }
  }, [search['tab']])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'basic' | 'vehicle' | 'operation' | 'facility' | 'add')
    navigate({ search: { ...search, tab } as any })
    if (tab !== 'vehicle') setVehicleTabMode('list') // 차량탭이 아닐 때는 항상 list로
  }

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
        {/* 상단 헤더 */}
        <PageHeader 
          title={`${transportData.companyName} 상세정보`}
          onBack={handleBack}
        />

        {/* 탭 네비게이션*/}
        <div className="flex items-center mt-5 px-8">
          <button
            onClick={() => handleTabChange('basic')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'basic'
                ? 'text-[#141c25] border-[#141c25]'
                : 'text-[#637083] border-[#e4e7ec] hover:text-[#141c25]'
            }`}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px'
            }}
          >
            기본정보
          </button>
          <button
            onClick={() => handleTabChange('vehicle')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              (activeTab === 'vehicle' || activeTab === 'add')
                ? 'text-[#141c25] border-[#141c25]'
                : 'text-[#637083] border-[#e4e7ec] hover:text-[#141c25]'
            }`}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px'
            }}
          >
            차량정보
          </button>
          <button
            onClick={() => handleTabChange('operation')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'operation'
                ? 'text-[#141c25] border-[#141c25]'
                : 'text-[#637083] border-[#e4e7ec] hover:text-[#141c25]'
            }`}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px'
            }}
          >
            운행정보
          </button>
          <button
            onClick={() => handleTabChange('facility')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'facility'
                ? 'text-[#141c25] border-[#141c25]'
                : 'text-[#637083] border-[#e4e7ec] hover:text-[#141c25]'
            }`}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px'
            }}
          >
            설비정보
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'basic' && <BasicInfoTab data={transportData} />}
        {activeTab === 'vehicle' && <VehicleInfoTab onAddClick={() => setActiveTab('add')} />}
        {activeTab === 'add' && <AddVehicleTab onClose={() => setActiveTab('vehicle')} onBack={() => setActiveTab('vehicle')} />}
        {activeTab === 'operation' && <OperationInfoTab />}
        {activeTab === 'facility' && <FacilityInfoTab />}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/transport/$id')({
  component: TransportDetailPage,
});

export default TransportDetailPage;