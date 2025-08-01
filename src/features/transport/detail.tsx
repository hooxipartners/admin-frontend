import { createFileRoute, useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { BasicInfoTab } from './tabs/basic-info-tab'
import { MobilityInfoTab } from './tabs/mobility-info-tab'
import AddMobilityTab from './tabs/add'
import { FacilityInfoTab } from './tabs/facility-info-tab'
import { OperationInfoTab } from './tabs/operation-info-tab'
import { useQuery } from '@tanstack/react-query'
import { fetchTransportCompanyDetail } from '@/lib/api-hooks'
import { PageHeader } from '@/components/layout/page-header'

const TransportDetailPage = () => {
  const navigate = useNavigate()
  const params = useParams({ from: '/_authenticated/transport/$id' })
  const search = useSearch({ from: '/_authenticated/transport/$id' }) as Record<string, any>;

  // 쿼리스트링(tab)에서 초기값, 없으면 'mobility'
  const [activeTab, setActiveTab] = useState<'basic' | 'mobility' | 'operation' | 'facility' | 'add'>(search['tab'] || 'mobility')
  const [, setMobilityTabMode] = useState<'list' | 'add'>('list')

  // 쿼리스트링(tab) 변경 시 탭 동기화
  useEffect(() => {
    if (search['tab'] && search['tab'] !== activeTab) {
      setActiveTab(search['tab'] as 'basic' | 'mobility' | 'operation' | 'facility' | 'add')
    }
  }, [search['tab']])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'basic' | 'mobility' | 'operation' | 'facility' | 'add')
    navigate({ search: { ...search, tab } as any })
    if (tab !== 'mobility') setMobilityTabMode('list') // 차량탭이 아닐 때는 항상 list로
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
    <div className="min-h-screen bg-white flex ">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 bg-white ">
        {/* 상단 헤더 + 탭 네비게이션 */}
        <PageHeader 
          title={`${transportData.companyName} 상세정보`}
          onBack={handleBack}
          tabs={[
            { label: '기본정보', value: 'basic' },
            { label: '차량정보', value: 'mobility' },
            { label: '운행정보', value: 'operation' },
            { label: '설비정보', value: 'facility' },
          ]}
          activeTab={activeTab === 'add' ? 'mobility' : activeTab}
          onTabChange={handleTabChange}
        />

        {/* 탭 콘텐츠 */}
        {activeTab === 'basic' && <BasicInfoTab data={transportData} />}
        {activeTab === 'mobility' && <MobilityInfoTab onAddClick={() => setActiveTab('add')} />}
        {activeTab === 'add' && <AddMobilityTab onClose={() => setActiveTab('mobility')} onBack={() => setActiveTab('mobility')} />}
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