import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import SectionHeader from '@/components/ui/section-header';
import FilterBar from '@/components/ui/filter-bar';
import DataTable from '@/components/ui/data-table';
import { PageHeader } from '@/components/layout/page-header.tsx'
import { CheckIcon, DetailIcon, PlusIcon } from '@/components/ui/icons'
import { RefreshIcon } from '@/components/ui/icons/refresh-icon.tsx'
import { useFacilities } from '@/lib/api-hooks';
import FacilityDetailModal from './FacilityDetailModal';
import FacilityAddModal from './FacilityAddModal';

const LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const FACILITY_COLUMNS = [
  {
    key: 'fullAddress',
    label: '차고지',
    className: 'flex-1 w-[538px] min-w-[538px] max-w-[538px]  px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargingDevices = row.chargingDevices || [];
      const totalChargers = chargingDevices.reduce((sum: number, device: any) => sum + (device.chargers?.length || 0), 0);
      const height = totalChargers > 0 ? totalChargers * 68 : 68;
      return (
        <div
          className="flex items-center justify-start h-full"
          style={{ minHeight: height, height: height }}
        >
          <span className="w-full text-left">{row.fullAddress}</span>
        </div>
      );
    }
  },
  {
    key: 'company',
    label: '운수사',
    className: 'flex-1 px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargingDevices = row.chargingDevices || [];
      const totalChargers = chargingDevices.reduce((sum: number, device: any) => sum + (device.chargers?.length || 0), 0);
      const height = totalChargers > 0 ? totalChargers * 68 : 68;
      return (
        <div
          className="flex items-center justify-start h-full"
          style={{ minHeight: height, height: height }}
        >
          <span className="w-full text-left">다모아자동차</span>
        </div>
      );
    }
  },
  {
    key: 'powerMeterId',
    label: 'AC전력량계 제조번호',
    className: 'flex-1 px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargingDevices = row.chargingDevices || [];
      const totalChargers = chargingDevices.reduce((sum: number, device: any) => sum + (device.chargers?.length || 0), 0);
      const height = totalChargers > 0 ? totalChargers * 68 : 68;
      return (
        <div
          className="flex items-center justify-start h-full"
          style={{ minHeight: height, height: height }}
        >
          <span className="w-full text-left">{chargingDevices[0]?.serialNumber || '-'}</span>
        </div>
      );
    }
  },
  {
    key: 'manufactureDate',
    label: 'AC전력량계 제조년월',
    className: 'flex-1 px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargingDevices = row.chargingDevices || [];
      const totalChargers = chargingDevices.reduce((sum: number, device: any) => sum + (device.chargers?.length || 0), 0);
      const height = totalChargers > 0 ? totalChargers * 68 : 68;
      return (
        <div
          className="flex items-center justify-start h-full"
          style={{ minHeight: height, height: height }}
        >
          <span className="w-full text-left">{chargingDevices[0]?.manufactureDate || '-'}</span>
        </div>
      );
    }
  },
  {
    key: 'chargerNo',
    label: '충전기 제조번호',
    className: 'flex-1  px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargingDevices = row.chargingDevices || [];
      const allChargers = chargingDevices.flatMap((device: any) => device.chargers || []);
      return (
        <div className="flex flex-col">
          {allChargers.map((c: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-center justify-start py-2${idx !== allChargers.length - 1 ? ' border-b border-[#e4e7ec]' : ''}`}
              style={{ minHeight: 68 }}
            >
              <span className="w-full text-left">{c.serialNumber}</span>
            </div>
          ))}
        </div>
      );
    }
  },
  {
    key: 'chargerDate',
    label: '충전기 제조년월',
    className: 'flex-1 w-[134px] min-w-[134px] max-w-[134px] px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargingDevices = row.chargingDevices || [];
      const allChargers = chargingDevices.flatMap((device: any) => device.chargers || []);
      return (
        <div className="flex flex-col">
          {allChargers.map((c: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-center justify-start py-2${idx !== allChargers.length - 1 ? ' border-b border-[#e4e7ec]' : ''}`}
              style={{ minHeight: 68 }}
            >
              <span className="w-full text-left">{c.manufactureDate}</span>
            </div>
          ))}
        </div>
      );
    }
  },
  {
    key: 'evidence',
    label: '증빙자료',
    className: 'flex-1 w-[92px] min-w-[92px] max-w-[92px] px-5 py-2.5',
    sortable: false,
    headerAlign: 'center' as const,
    align: 'center' as const,
    render: (_: any, row: any) => {
      const chargingDevices = row.chargingDevices || [];
      
      // 하나의 충전소에 대해 하나의 증빙자료 아이콘만 표시
      // AC전력량계 또는 충전기 중 하나라도 파일이 있으면 표시
      const hasAnyFile = chargingDevices.some((device: any) => {
        // AC전력량계 파일 확인
        if (device.hasPowerMeterFile) return true;
        
        // 충전기 파일 확인
        if (device.chargers && device.chargers.length > 0) {
          return device.chargers.some((charger: any) => charger.hasChargerFile);
        }
        
        return false;
      });
      
      return (
        <div className="flex items-center justify-center py-2" style={{ minHeight: 68 }}>
          {hasAnyFile ? <CheckIcon /> : null}
        </div>
      );
    }
  },
  {
    key: 'detail',
    label: '상세',
    className: 'flex-none w-[66px] min-w-[66px] max-w-[66px] px-5 py-2.5',
    sortable: false,
    headerAlign: 'center' as const,
    align: 'center' as const,
    width: 66,
    render: (_: any, row: any) => {
      const chargingDevices = row.chargingDevices || [];
      
      // 하나의 충전소에 대해 하나의 상세 버튼만 표시
      return (
        <div style={{ width: 66 }}>
          <div className="flex items-center justify-center py-2" style={{ minHeight: 68 }}>
            <DetailIcon />
          </div>
        </div>
      );
    }
  },
];

// 목업 데이터 제거 - API에서 데이터를 가져옴

// facility 데이터 타입 정의 (간단히 any로 처리하거나, 정확히 정의해도 됨)
type FacilityType = {
  id: number;
  facilityName: string;
  company: string;
  meterNo: string;
  meterDate: string;
  meterImage?: string;
  chargers: Array<{
    chargerNo: string;
    chargerDate: string;
    chargerImage?: string;
    evidence?: boolean;
  }>;
};

const FacilityPage = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState('10');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  
  // TODO: 실제 transportCompanyId를 가져오는 로직 필요 (현재는 임시로 1 사용)
  const transportCompanyId = 1;
  
  // API에서 시설 데이터 가져오기
  const { data: facilitiesData, isLoading, error, refetch } = useFacilities(transportCompanyId);

  // 상세 열기 핸들러
  const handleOpenDetail = (facilityId: number) => {
    setSelectedFacilityId(facilityId);
    setModalOpen(true);
  };

  // 상세 닫기 핸들러
  const handleCloseDetail = () => {
    setModalOpen(false);
    setSelectedFacilityId(null);
  };

  // 시설 추가 모달 열기 핸들러
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  // 시설 추가 모달 닫기 핸들러
  const handleCloseAddModal = (shouldRefresh = false) => {
    setAddModalOpen(false);
    // 설비 추가 성공 시 리스트 새로고침
    if (shouldRefresh) {
      refetch();
    }
  };

  // 컬럼 중 상세 아이콘 클릭 이벤트 연결
  const columns = FACILITY_COLUMNS.map(col => {
    if (col.key === 'detail') {
      return {
        ...col,
        render: (_: any, row: any) => {
          const chargingDevices = row.chargingDevices || [];
          const allChargers = chargingDevices.flatMap((device: any) => device.chargers || []);
          const totalRows = allChargers.length > 0 ? allChargers.length : 1;
          const totalHeight = totalRows * 68; // Calculate the total height for vertical centering
          return (
            <div
              className="flex items-center justify-center" // Center content vertically and horizontally
              style={{ width: 66, height: totalHeight }} // Set the total height for the merged cell
            >
              <button
                className="flex items-center justify-center w-full h-full hover:bg-gray-100 rounded"
                onClick={() => handleOpenDetail(row.chargingStationId)}
                aria-label="상세"
                type="button"
              >
                <DetailIcon />
              </button>
            </div>
          );
        }
      };
    }
    return col;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 헤더 */}
      <PageHeader
        title="시설 관리"
      />
      {/* 메인 콘텐츠 영역 */}
      <div className="bg-white pl-8 pr-8 mt-6">
        {/* 섹션 헤더 */}
        <SectionHeader
          title="설비 정보"
          count={facilitiesData?.length || 0}
          lastUpdated="2025-06-25 15:20"
          secondaryButton={{
            text: '목록 업데이트',
            onClick: () => { refetch(); },
            icon: <RefreshIcon className="w-5 h-5" />,
          }}
          primaryButton={{
            text: '시설 추가',
            onClick: handleOpenAddModal,
            icon: <PlusIcon />
          }}
        />
        {/* 필터 바 */}
        <FilterBar
          selects={[
            {
              options: [
                { value: 'ALL', label: '운수사' },
                { value: 'seoul', label: '서울버스조합' },
                { value: 'seongnam', label: '성남버스조합' },
              ],
              placeholder: '운수사',
              className: 'min-w-[120px]'
            },
            {
              options: [
                { value: 'ALL', label: '지역' },
                { value: 'gyeonggi', label: '경기' },
                { value: 'sejong', label: '세종' },
              ],
              placeholder: '지역',
              className: 'min-w-[120px]'
            },
          ]}
          searchInput={{
            placeholder: '차고지명',
            value: '',
            onChange: () => {},
          }}
          searchButton={{
            text: '검색',
            onClick: () => {},
          }}
          rightSection={
            <>
              <span className="text-xs text-[#637083]">Rows per page</span>
              <select
                className="w-20 border border-[#e4e7ec] rounded-[10px] px-2 py-1 ml-2"
                value={limit}
                onChange={e => setLimit(e.target.value)}
              >
                {LIMIT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </>
          }
        />
        {/* 테이블 */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={facilitiesData || []}
            page={page}
            totalPages={1}
            onPageChange={setPage}
          />
        )}
      </div>
      {/* 상세 모달 */}
      <FacilityDetailModal
        open={modalOpen}
        onClose={handleCloseDetail}
        facilityId={selectedFacilityId}
      />
      
      {/* 시설 추가 모달 */}
      <FacilityAddModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
      />
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/facility/')({
  component: FacilityPage,
});

export { FacilityPage };