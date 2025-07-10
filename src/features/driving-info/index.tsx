import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
// 탭별 컴포넌트 import (아직 생성 전, 추후 생성)
import ElectricTab from './tabs/electric';
import HydrogenTab from './tabs/hydrogen';
import FossilTab from './tabs/fossil';

const TABS = [
  { label: '전기', value: 'electric' },
  { label: '수소', value: 'hydrogen' },
  { label: '화석연료', value: 'fossil' },
];

export default function DrivingInfoPage() {
  const [activeTab, setActiveTab] = useState('electric');

  return (
    <div className='min-h-screen   bg-white'>
      <PageHeader
        title="운행 관리"
        showBackButton={false}
        showActions={true}
        showNotification={true}
        userInitials="DY"
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="px-8 pt-6">
        {activeTab === 'electric' && <ElectricTab />}
        {activeTab === 'hydrogen' && <HydrogenTab />}
        {activeTab === 'fossil' && <FossilTab />}
      </div>
    </div>
  );
}
export { DrivingInfoPage };