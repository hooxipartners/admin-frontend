import React, { useState, useRef } from 'react'

// 인라인 SVG 컴포넌트 정의
const RestartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v4m0 0l2-2m-2 2l-2-2m8 6a8 8 0 11-2.343-5.657" stroke="#637083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12m6-6H4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const FilterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 5h18M6 10h12M9 15h6M12 20h0" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const NavArrowDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const BaseIcon = () => (
  <svg width="28" height="34" viewBox="0 0 28 34" fill="none"><rect width="28" height="34" rx="2" fill="#fff" stroke="#E4E7EC"/></svg>
);
const ErmarkIcon = () => (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none"><ellipse cx="6" cy="5.5" rx="6" ry="5.5" fill="#E4E7EC"/></svg>
);

const BUSINESS_TYPE_MAP = { NEW: '신규도입', REPLACEMENT: '대체도입' } as const;
const FUEL_TYPE_MAP = { ELECTRIC: '전기', GASOLINE: '가솔린', DIESEL: '디젤' } as const;
const MOBILITY_TYPE_MAP = { BUS: '버스', CAR: '승용차', VAN: '밴' } as const;

type BusinessType = keyof typeof BUSINESS_TYPE_MAP;
type FuelType = keyof typeof FUEL_TYPE_MAP;
type MobilityType = keyof typeof MOBILITY_TYPE_MAP;

// 목업 데이터 (이미지 예시 기반, 10개 row)
const mockRows = [
  {
    mobilityId: 1,
    mobilityNo: '12가 3451',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress', // 진행중
    fileStatus: 'check', // 체크
    remark: 'trash',
  },
  {
    mobilityId: 2,
    mobilityNo: '12가 3452',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress',
    fileStatus: 'check',
    remark: 'trash',
  },
  {
    mobilityId: 3,
    mobilityNo: '12가 3453',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress',
    fileStatus: 'check',
    remark: 'trash',
  },
  {
    mobilityId: 4,
    mobilityNo: '12가 3454',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress',
    fileStatus: 'check',
    remark: 'trash',
  },
  {
    mobilityId: 5,
    mobilityNo: '12가 3455',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress',
    fileStatus: 'check',
    remark: 'trash',
  },
  {
    mobilityId: 6,
    mobilityNo: '12가 3456',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress',
    fileStatus: 'check',
    remark: 'trash',
  },
  {
    mobilityId: 7,
    mobilityNo: '12가 3457',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress',
    fileStatus: 'check',
    remark: 'trash',
  },
  {
    mobilityId: 8,
    mobilityNo: '12가 3458',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress',
    fileStatus: 'x', // X
    remark: 'trash',
  },
  {
    mobilityId: 9,
    mobilityNo: '12가 3459',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress',
    fileStatus: 'spinner', // spinner
    remark: 'trash',
  },
  {
    mobilityId: 10,
    mobilityNo: '12가 3460',
    projectName: '다모아자동차(주)_충전량데이터.xlsx',
    businessType: 'NEW',
    vin: '2019-01 ~ 2024-12',
    model: '',
    mobilityType: '',
    year: '',
    fuelType: '',
    passengerCapacity: '',
    mobilityRegDate: '2020-04-20',
    status: '',
    hasVehicleReg: true,
    hasScrappingCert: true,
    types: [
      { label: '충전량', color: '#FFFBEB', textColor: '#78350F' },
      { label: '주행거리', color: '#ECFDF5', textColor: '#064E3B' },
      { label: '주유량', color: '#F0F9FF', textColor: '#0B4A6F' },
    ],
    uploadStatus: 'progress',
    fileStatus: 'spinner2', // spinner2
    remark: 'trash',
  },
];

// vehicle-info-tab.tsx 컬럼 정의 복사
const columns = [
  { key: 'mobilityNo', label: '자동차등록번호' },
  { key: 'projectName', label: '프로젝트' },
  { key: 'businessType', label: '사업구분' },
  { key: 'vin', label: '차대번호' },
  { key: 'model', label: '모델명' },
  { key: 'mobilityType', label: '차량유형' },
  { key: 'year', label: '연식' },
  { key: 'fuelType', label: '연료' },
  { key: 'passengerCapacity', label: '인승' },
  { key: 'mobilityRegDate', label: '차량등록일' },
  { key: 'status', label: '차량상태' },
  { key: 'hasVehicleReg', label: '자동차등록증' },
  { key: 'hasScrappingCert', label: '말소증명서' },
];

const CertCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M1.375 11.4584L5.11109 15.1945C5.32588 15.4093 5.67412 15.4093 5.88891 15.1945L8.25 12.8334M14.6667 6.41675L11 10.0834M6.41667 11.0001L10.6111 15.1945C10.8259 15.4093 11.1741 15.4093 11.3889 15.1945L20.1667 6.41675" stroke="#10B978" strokeWidth="1.5" strokeLinecap="round"/></svg>
)

const statusIcon = (status: string) => {
  if (status === 'success') {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 11.5L8.5 18L20 6.5" stroke="#10B978" strokeWidth="2" strokeLinecap="round"/></svg>
    );
  }
  if (status === 'error') {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="6" stroke="#FF4C4C" strokeWidth="2"/></svg>
    );
  }
  // pending or etc
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="6" stroke="#CED2DA" strokeWidth="2"/></svg>
  );
};

const labelColor = (type: string) => {
  switch (type) {
    case '충전량': return 'bg-[#FFF7E0] text-[#B76E00]';
    case '주행거리': return 'bg-[#E6FAF0] text-[#0D6832]';
    case '주유량': return 'bg-[#E6F0FF] text-[#1559C7]';
    default: return 'bg-gray-100 text-gray-500';
  }
};

export const OperationInfoTab = () => {
  // 필터 상태 (목업)
  const [selectedMobilityType, setSelectedMobilityType] = useState('')
  const [selectedFuelType, setSelectedFuelType] = useState('')
  const [inputMobilityNo, setInputMobilityNo] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [page, setPage] = useState(0);
  const size = 5;
  const total = mockRows.length;
  const pageInfo = {
    size,
    number: page,
    totalElements: total,
    totalPages: Math.ceil(total / size),
  };
  const pagedRows = mockRows.slice(page * size, (page + 1) * size);

  // 옵션
  const mobilityTypeOptions = Object.entries(MOBILITY_TYPE_MAP)
  const fuelTypeOptions = Object.entries(FUEL_TYPE_MAP)

  return (
    <div className="bg-white px-8 py-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center h-12 py-3 flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[#141c25] text-base font-medium">운행정보</span>
          <span className="text-[#0166ff] text-sm font-semibold">{mockRows.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#637083] text-xs">최근 업데이트 일시 2025-06-25 15:20</span>
          <button className="rounded-[10px] px-5 py-2.5 shadow border border-[#e4e7ec] text-sm font-medium flex items-center gap-2 bg-white">
            <RestartIcon />
            목록 업데이트
          </button>
          <button className="rounded-[10px] px-5 py-2.5 shadow bg-[#0166ff] text-white text-sm font-medium flex items-center gap-2">
            <PlusIcon />
            운행 추가
          </button>
        </div>
      </div>
      {/* 필터/검색/정렬 */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center bg-[#f7f8fa] rounded-lg border border-[#e4e7ec]">
            <span className="inline-block align-middle">
              <FilterIcon />
            </span>
          </button>
          <div className="flex items-center gap-1">
            <select className="rounded-lg border border-[#e4e7ec] px-3 py-2 text-sm bg-white min-w-[120px]" value={selectedMobilityType} onChange={e => setSelectedMobilityType(e.target.value)}>
              <option value="">차량유형</option>
              {mobilityTypeOptions.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <select className="rounded-lg border border-[#e4e7ec] px-3 py-2 text-sm bg-white min-w-[120px]" value={selectedFuelType} onChange={e => setSelectedFuelType(e.target.value)}>
            <option value="">연료</option>
            {fuelTypeOptions.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <input
            ref={inputRef}
            className="rounded-lg border border-[#e4e7ec] px-3 py-2 text-sm bg-white w-36"
            placeholder="차량번호"
            value={inputMobilityNo}
            onChange={e => setInputMobilityNo(e.target.value)}
          />
          <button className="rounded-lg px-4 py-2 bg-[#0166ff] text-white text-sm font-medium">검색</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#637083] text-xs">Rows per page</span>
          <select className="rounded-lg border border-[#e4e7ec] px-2 py-1 text-sm bg-white">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>
      {/* 테이블+페이징 영역 */}
      <div className="mb-6 overflow-x-visible rounded-lg border border-[#e4e7ec]">
        {/* 테이블 헤더 */}
        <div className="flex bg-[#f2f4f7]">
          {columns.map((col) => (
            <div
              key={col.key}
              className="flex-1 min-w-0 py-2.5 px-5 border-r border-[#e4e7ec] flex items-center whitespace-normal break-all overflow-hidden"
            >
              {col.label}
            </div>
          ))}
        </div>
        {/* 테이블 바디 */}
        {pagedRows.length === 0 ? (
          <div className="p-20 text-center text-gray-500">데이터가 없습니다.</div>
        ) : (
          pagedRows.map((row) => (
            <div
              key={row.mobilityId}
              className="flex border-b border-[#e4e7ec] bg-white transition-colors hover:bg-gray-50"
            >
              {columns.map((col) => {
                switch (col.key) {
                  case 'mobilityNo':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center text-[#141c25] text-sm font-medium">{row.mobilityNo}</div>;
                  case 'projectName':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center">{row.projectName ? (<div className="px-2.5 py-1 rounded-md inline-flex justify-center items-center" style={{ background: '#E6F0FF' }}><div className="text-sm font-medium leading-tight" style={{ color: '#1559C7' }}>{row.projectName}</div></div>) : <span className="text-gray-400 text-sm"></span>}</div>;
                  case 'businessType':
                    if (row.businessType === 'NEW') {
                      return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center"><div className="px-2.5 py-1 rounded-md inline-flex justify-center items-center" style={{ background: '#FFF7E0' }}><div className="text-sm font-medium leading-tight" style={{ color: '#B76E00' }}>신규도입</div></div></div>;
                    } else if (row.businessType === 'REPLACEMENT') {
                      return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center"><div className="px-2.5 py-1 rounded-md flex justify-center items-center" style={{ background: '#E6FAF0' }}><div className="text-sm font-medium leading-tight" style={{ color: '#0D6832' }}>대체도입</div></div></div>;
                    } else {
                      return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center"><span className="text-gray-400 text-sm"></span></div>;
                    }
                  case 'vin':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center"><span className="text-[#141c25] text-sm font-medium min-w-[200px] max-w-[320px] whitespace-nowrap overflow-x-auto block">{row.vin}</span></div>;
                  case 'model':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center text-[#141c25] text-sm font-medium">{row.model}</div>;
                  case 'mobilityType':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center text-[#141c25] text-sm font-medium">{MOBILITY_TYPE_MAP[row.mobilityType as MobilityType]}</div>;
                  case 'year':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center text-[#141c25] text-sm font-medium">{row.year}</div>;
                  case 'fuelType':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center text-[#141c25] text-sm font-medium">{FUEL_TYPE_MAP[row.fuelType as FuelType]}</div>;
                  case 'passengerCapacity':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center text-[#141c25] text-sm font-medium">{row.passengerCapacity}인승</div>;
                  case 'mobilityRegDate':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center text-[#141c25] text-sm font-medium">{row.mobilityRegDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</div>;
                  case 'status':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center text-gray-400 text-sm"></div>;
                  case 'hasVehicleReg':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center justify-center">{row.hasVehicleReg ? <CertCheckIcon /> : <span className="text-gray-400 text-sm"></span>}</div>;
                  case 'hasScrappingCert':
                    return <div key={col.key} className="flex-1 min-w-0 py-5 px-5 border-r border-[#e4e7ec] flex items-center justify-center">{row.hasScrappingCert ? <CertCheckIcon /> : <span className="text-gray-400 text-sm"></span>}</div>;
                  default:
                    return null;
                }
              })}
            </div>
          ))
        )}
      </div>
      {/* 페이징 */}
      <div className="flex items-center justify-between mt-6">
        <button
          className="rounded-lg bg-[#f2f4f7] p-2"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M12.5 5L7.5 10L12.5 15" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(pageInfo.totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === page + 1;
            return (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-9 w-9 rounded-lg text-sm leading-5 font-medium transition-colors ${isActive ? 'bg-[#f2f4f7] text-[#141c25]' : 'text-[#637083] hover:bg-gray-100'}`}
                style={{ fontFamily: 'Inter-Medium, sans-serif' }}
              >
                {pageNum}
              </button>
            );
          })}
          {pageInfo.totalPages > 5 && (
            <>
              <span className="px-2 leading-5 text-[#637083]" style={{ fontFamily: 'Inter-Medium, sans-serif' }}>
                ...
              </span>
              <button
                className="h-9 w-9 rounded-lg text-sm leading-5 font-medium text-[#637083] hover:bg-gray-100"
                style={{ fontFamily: 'Inter-Medium, sans-serif' }}
              >
                {pageInfo.totalPages}
              </button>
            </>
          )}
        </div>
        <button
          className="rounded-lg bg-[#f2f4f7] p-2"
          disabled={page + 1 >= pageInfo.totalPages}
          onClick={() => setPage((p) => Math.min(pageInfo.totalPages - 1, p + 1))}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7.5 5L12.5 10L7.5 15" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}


