import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import SectionHeader from '@/components/ui/section-header';
import FilterBar from '@/components/ui/filter-bar';
import DataTable from '@/components/ui/data-table';
import { PageHeader } from '@/components/layout/page-header.tsx'
import { CheckIcon, DetailIcon, FilterIcon } from '@/components/ui/icons';
// PlusIcon, ReloadIcon이 없으면 FilterIcon 등 유사 아이콘 사용

const LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const FACILITY_COLUMNS = [
  {
    key: 'facilityName',
    label: '차고지',
    className: 'flex-1 px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargers = row.chargers || [];
      const height = chargers.length > 0 ? chargers.length * 68 : 68;
      return (
        <div
          className="flex items-center justify-start h-full"
          style={{ minHeight: height, height: height }}
        >
          <span className="w-full text-left">{row.facilityName}</span>
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
      const chargers = row.chargers || [];
      const height = chargers.length > 0 ? chargers.length * 68 : 68;
      return (
        <div
          className="flex items-center justify-start h-full"
          style={{ minHeight: height, height: height }}
        >
          <span className="w-full text-left">{row.company}</span>
        </div>
      );
    }
  },
  {
    key: 'meterNo',
    label: 'AC전력량계 제조번호',
    className: 'flex-1 px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargers = row.chargers || [];
      const height = chargers.length > 0 ? chargers.length * 68 : 68;
      return (
        <div
          className="flex items-center justify-start h-full"
          style={{ minHeight: height, height: height }}
        >
          <span className="w-full text-left">{row.meterNo}</span>
        </div>
      );
    }
  },
  {
    key: 'meterDate',
    label: 'AC전력량계 제조년월',
    className: 'flex-1 px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargers = row.chargers || [];
      const height = chargers.length > 0 ? chargers.length * 68 : 68;
      return (
        <div
          className="flex items-center justify-start h-full"
          style={{ minHeight: height, height: height }}
        >
          <span className="w-full text-left">{row.meterDate}</span>
        </div>
      );
    }
  },
  {
    key: 'chargerNo',
    label: '충전기 제조번호',
    className: 'flex-1 px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargers = row.chargers || (row.chargerNo ? [{ chargerNo: row.chargerNo }] : []);
      return (
        <div className="flex flex-col">
          {chargers.map((c: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-center justify-start py-2${idx !== chargers.length - 1 ? ' border-b border-[#e4e7ec]' : ''}`}
              style={{ minHeight: 68 }}
            >
              <span className="w-full text-left">{c.chargerNo}</span>
            </div>
          ))}
        </div>
      );
    }
  },
  {
    key: 'chargerDate',
    label: '충전기 제조년월',
    className: 'flex-1 px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargers = row.chargers || (row.chargerNo ? [{ chargerNo: row.chargerNo }] : []);
      return (
        <div className="flex flex-col">
          {chargers.map((c: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-center justify-start py-2${idx !== chargers.length - 1 ? ' border-b border-[#e4e7ec]' : ''}`}
              style={{ minHeight: 68 }}
            >
              <span className="w-full text-left">{c.chargerDate}</span>
            </div>
          ))}
        </div>
      );
    }
  },
  {
    key: 'evidence',
    label: '증빙자료',
    className: 'flex-1 px-5 py-2.5',
    sortable: false,
    render: (_: any, row: any) => {
      const chargers = row.chargers || (row.chargerNo ? [{ chargerNo: row.chargerNo, evidence: true }] : []);
      return (
        <div className="flex flex-col">
          {chargers.map((c: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-center justify-center py-2${idx !== chargers.length - 1 ? ' border-b border-[#e4e7ec]' : ''}`}
              style={{ minHeight: 68 }}
            >
              {c.evidence ? <CheckIcon /> : null}
            </div>
          ))}
        </div>
      );
    }
  },
  {
    key: 'detail',
    label: '상세',
    className: 'flex-none px-5 py-2.5', // flex-none으로 고정, 필요시 추가 스타일
    sortable: false,
    width: 66, // DataTable에서 width 적용 가능하다면 사용
    render: (_: any, row: any) => {
      const chargers = row.chargers || [1];
      return (
        <div style={{ width: 66 }}>
          {chargers.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`flex items-center justify-center py-2${idx !== chargers.length - 1 ? ' border-b border-[#e4e7ec]' : ''}`}
              style={{ minHeight: 68 }}
            >
              <DetailIcon />
            </div>
          ))}
        </div>
      );
    }
  },
];

const FACILITY_DATA = [
  {
    id: 1,
    facilityName: "경기 포천시 내촌면 음고개길 7 내촌전기충전소",
    company: "다모아자동차",
    meterNo: "06212036315",
    meterDate: "2020-04",
    chargers: [
      { chargerNo: "PUMPKIN-24002C2-DB-0004", chargerDate: "2020-04", evidence: true },
      { chargerNo: "PUMPKIN-24002C2-DB-0001", chargerDate: "2020-04", evidence: true },
      { chargerNo: "PUMPKIN-24002C2-DB-0015", chargerDate: "2020-04", evidence: true },
      { chargerNo: "PUMPKIN-24002C2-DB-0005", chargerDate: "2020-04", evidence: true },
      { chargerNo: "PUMPKIN-24002C2-DB-0002", chargerDate: "2020-04", evidence: true },
      { chargerNo: "PUMPKIN-24002C2-DB-0003", chargerDate: "2020-04", evidence: true },
      { chargerNo: "PUMPKIN-24002C2-DB-0006", chargerDate: "2020-04", evidence: true },
      { chargerNo: "PUMPKIN-24002C2-DB-0005", chargerDate: "2020-04", evidence: true },
    ]
  },
  {
    id: 2,
    facilityName: "경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소",
    company: "다모아자동차",
    meterNo: "02212057689",
    meterDate: "2020-04",
    chargers: [
      { chargerNo: "PUMPKIN-24002C2-DB-0006", chargerDate: "2020-04", evidence: true },
      { chargerNo: "PUMPKIN-24002C2-DB-0005", chargerDate: "2020-04", evidence: true },
    ]
  },
  {
    id: 3,
    facilityName: "경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소",
    company: "다모아자동차",
    meterNo: "25212037354",
    meterDate: "2020-04",
    chargers: [
      { chargerNo: "PUMPKIN-24002C2-DB-0005", chargerDate: "2020-04", evidence: true },
    ]
  },
  {
    id: 4,
    facilityName: "경기 남양주시 진건읍 사릉로372번길 1 사능전기충전소",
    company: "다모아자동차",
    meterNo: "25212037354",
    meterDate: "2020-04",
    chargers: [
      { chargerNo: "PUMPKIN-24002C2-DB-0005", chargerDate: "2020-04", evidence: true },
    ]
  },
];

const FacilityPage = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState('10');

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
          count={FACILITY_DATA.length}
          lastUpdated="2025-06-25 15:20"
          secondaryButton={{
            text: '목록 업데이트',
            onClick: () => { console.log('목록 업데이트'); },
            icon: <FilterIcon />,
          }}
          primaryButton={{
            text: '시설 추가',
            onClick: () => { console.log('시설 추가'); },
            icon: <FilterIcon />,
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
        <DataTable
          columns={FACILITY_COLUMNS}
          data={FACILITY_DATA}
          page={page}
          totalPages={1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/facility/')({
  component: FacilityPage,
});

export { FacilityPage };