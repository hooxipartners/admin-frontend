import { useState, useRef } from 'react'

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

//const BUSINESS_TYPE_MAP = { NEW: '신규도입', REPLACEMENT: '대체도입' } as const;
const FUEL_TYPE_MAP = { ELECTRIC: '전기', GASOLINE: '가솔린', DIESEL: '디젤' } as const;
const MOBILITY_TYPE_MAP = { BUS: '버스', CAR: '승용차', VAN: '밴' } as const;

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

// 1. 테이블 컬럼 정의 및 목업 row 데이터 교체
const tableColumns = [
  { key: 'file', label: '운행정보 데이터' },
  { key: 'range', label: '데이터 범위' },
  { key: 'type', label: '데이터 유형' },
  { key: 'upload', label: '업로드상태' },
  { key: 'date', label: '파일등록일' },
  { key: 'status', label: '파일상태' },
  { key: 'action', label: '비고' },
];

const tableRows = [
  {
    file: { icon: 'pdf', name: '다모아자동차(주)_총전량데이터.xlsx' },
    range: '2019-01 ~ 2024-12',
    type: [
      { label: '총전량', bg: '#FDF6EC', color: '#B76E00' },
      { label: '주행거리', bg: '#ECFDF5', color: '#0D6832' },
      { label: '주유량', bg: '#F0F9FF', color: '#0B4A6F' },
    ],
    upload: 100,
    date: '2020-04-20',
    status: 'check',
    action: 'trash',
  },
  {
    file: { icon: 'pdf', name: '다모아자동차(주)_총전량데이터.xlsx' },
    range: '2019-01 ~ 2024-12',
    type: [
      { label: '총전량', bg: '#FDF6EC', color: '#B76E00' },
      { label: '주행거리', bg: '#ECFDF5', color: '#0D6832' },
      { label: '주유량', bg: '#F0F9FF', color: '#0B4A6F' },
    ],
    upload: 100,
    date: '2020-04-20',
    status: 'check',
    action: 'trash',
  },
  {
    file: { icon: 'pdf', name: '다모아자동차(주)_총전량데이터.xlsx' },
    range: '2019-01 ~ 2024-12',
    type: [
      { label: '총전량', bg: '#FDF6EC', color: '#B76E00' },
      { label: '주행거리', bg: '#ECFDF5', color: '#0D6832' },
      { label: '주유량', bg: '#F0F9FF', color: '#0B4A6F' },
    ],
    upload: 100,
    date: '2020-04-20',
    status: 'check',
    action: 'trash',
  },
  {
    file: { icon: 'pdf', name: '다모아자동차(주)_총전량데이터.xlsx' },
    range: '2019-01 ~ 2024-12',
    type: [
      { label: '총전량', bg: '#FDF6EC', color: '#B76E00' },
      { label: '주행거리', bg: '#ECFDF5', color: '#0D6832' },
      { label: '주유량', bg: '#F0F9FF', color: '#0B4A6F' },
    ],
    upload: 80,
    date: '2020-04-20',
    status: 'x',
    action: 'trash',
  },
  {
    file: { icon: 'pdf', name: '다모아자동차(주)_총전량데이터.xlsx' },
    range: '2019-01 ~ 2024-12',
    type: [
      { label: '총전량', bg: '#FDF6EC', color: '#B76E00' },
      { label: '주행거리', bg: '#ECFDF5', color: '#0D6832' },
      { label: '주유량', bg: '#F0F9FF', color: '#0B4A6F' },
    ],
    upload: 60,
    date: '2020-04-20',
    status: 'loading',
    action: 'trash',
  },
];

// PDF 아이콘, 체크, 엑스, 로딩, 휴지통 아이콘 등 SVG 컴포넌트 추가
const PdfIcon = () => (
  <svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.84668 0.5H18.2568L29.0391 11.1377V30.5996C29.0391 32.2034 27.7453 33.5 26.1543 33.5H5.84668C4.25569 33.5 2.96191 32.2034 2.96191 30.5996V3.40039C2.96191 1.79662 4.25569 0.5 5.84668 0.5Z" fill="white" stroke="#E4E7EC"/>
    <path d="M10.1247 26.2144V21.1234H12.0338C12.4249 21.1234 12.753 21.1964 13.0182 21.3422C13.285 21.488 13.4863 21.6886 13.6222 21.9438C13.7598 22.1973 13.8285 22.4857 13.8285 22.8088C13.8285 23.1353 13.7598 23.4253 13.6222 23.6788C13.4847 23.9324 13.2816 24.1321 13.0132 24.2779C12.7447 24.4221 12.4141 24.4942 12.0214 24.4942H10.7561V23.736H11.8971C12.1258 23.736 12.313 23.6962 12.4589 23.6167C12.6047 23.5372 12.7124 23.4278 12.782 23.2886C12.8533 23.1494 12.8889 22.9895 12.8889 22.8088C12.8889 22.6282 12.8533 22.4691 12.782 22.3315C12.7124 22.194 12.6039 22.0871 12.4564 22.0109C12.3105 21.933 12.1224 21.894 11.8921 21.894H11.0469V26.2144H10.1247ZM16.3547 26.2144H14.6296V21.1234H16.3895C16.895 21.1234 17.3291 21.2254 17.6921 21.4292C18.0567 21.6314 18.3367 21.9222 18.5323 22.3017C18.7278 22.6812 18.8256 23.1353 18.8256 23.6639C18.8256 24.1942 18.727 24.65 18.5298 25.0311C18.3342 25.4123 18.0517 25.7048 17.6821 25.9086C17.3142 26.1124 16.8718 26.2144 16.3547 26.2144ZM15.5518 25.4164H16.31C16.6646 25.4164 16.9604 25.3518 17.1974 25.2225C17.4344 25.0916 17.6125 24.8969 17.7318 24.6384C17.8512 24.3782 17.9108 24.0534 17.9108 23.6639C17.9108 23.2745 17.8512 22.9513 17.7318 22.6945C17.6125 22.4359 17.436 22.2429 17.2024 22.1153C16.9704 21.986 16.682 21.9214 16.3373 21.9214H15.5518V25.4164ZM19.7018 26.2144V21.1234H22.9632V21.8965H20.6241V23.2786H22.7395V24.0517H20.6241V26.2144H19.7018Z" fill="#344051"/>
    <path d="M18.4619 6.72528V0L29.5388 10.9286H22.7223C20.3693 10.9286 18.4619 9.04669 18.4619 6.72528Z" fill="url(#paint0_radial_677_11428)"/>
    <defs>
      <radialGradient id="paint0_radial_677_11428" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24.0004 2.73214) rotate(90) scale(8.19643 8.30769)"><stop stopColor="#E4E7EC"/><stop offset="1" stopColor="#CED2DA"/></radialGradient>
    </defs>
  </svg>
);

const TrashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.3333 8.25016L16.5046 18.6509C16.3505 19.5275 15.589 20.1668 14.699 20.1668H7.30101C6.41097 20.1668 5.64951 19.5275 5.49538 18.6509L3.66667 8.25016M19.25 5.50016H14.0938M14.0938 5.50016V3.66683C14.0938 2.65431 13.273 1.8335 12.2604 1.8335H9.73958C8.72706 1.8335 7.90625 2.65431 7.90625 3.66683V5.50016M14.0938 5.50016H7.90625M2.75 5.50016H7.90625" stroke="#637083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// 파일상태 SVG 아이콘들 (22x22로 통일)
const FileCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 11.5L10 15L16 7" stroke="#10B978" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const FileErrorIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.19434 15.8058L11.0001 11.0001M11.0001 11.0001L15.8058 6.19434M11.0001 11.0001L6.19434 6.19434M11.0001 11.0001L15.8058 15.8058" stroke="#FF4D4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const FileWaitIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.0003 4.354V5.729M15.6997 6.30052L14.7274 7.2728M17.6462 10.9998H16.2712M15.6997 15.6992L14.7274 14.7269M11.0003 16.2707V17.6457M7.2733 14.7269L6.30103 15.6992M5.72949 10.9998H4.35449M7.2733 7.2728L6.30103 6.30052" stroke="#CED2DA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
          {tableColumns.map((col, idx) => (
            <div
              key={col.key}
              className="py-2.5 px-5 border-r border-[#e4e7ec] flex items-center font-semibold text-[#141c25] text-sm"
              style={{ flex: idx === 0 ? '2' : 1 }}
            >
              {col.label}
            </div>
          ))}
        </div>
        {/* 테이블 바디 */}
        {tableRows.length === 0 ? (
          <div className="p-20 text-center text-gray-500">데이터가 없습니다.</div>
        ) : (
          tableRows.map((row, i) => (
            <div key={i} className="flex border-b border-[#e4e7ec] bg-white transition-colors hover:bg-gray-50">
              {/* 운행정보 데이터 */}
              <div className="py-5 px-5 border-r border-[#e4e7ec] flex items-center gap-3" style={{ flex: 2 }}>
                <PdfIcon />
                <span className="text-[#141c25] text-sm font-medium">{row.file.name}</span>
              </div>
              {/* 데이터 범위 */}
              <div className="py-5 px-5 border-r border-[#e4e7ec] flex items-center text-[#141c25] text-sm font-medium" style={{ flex: 1 }}>
                {row.range}
              </div>
              {/* 데이터 유형 */}
              <div className="py-5 px-5 border-r border-[#e4e7ec] flex items-center gap-2" style={{ flex: 1 }}>
                {row.type.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: t.bg, color: t.color }}>{t.label}</span>
                ))}
              </div>
              {/* 업로드상태 */}
              <div className="py-5 px-5 border-r border-[#e4e7ec] flex items-center w-full min-w-[120px]" style={{ flex: 1 }}>
                <div className="w-full h-2 bg-[#E4E7EC] rounded-full overflow-hidden mr-2">
                  <div className="h-2 rounded-full bg-[#0166ff] transition-all" style={{ width: `${row.upload}%` }}></div>
                </div>
              </div>
              {/* 파일등록일 */}
              <div className="py-5 px-5 border-r border-[#e4e7ec] flex items-center text-[#141c25] text-sm font-medium" style={{ flex: 1 }}>
                {row.date}
              </div>
              {/* 파일상태 */}
              <div className="py-5 px-5 border-r border-[#e4e7ec] flex items-center justify-center" style={{ flex: 1 }}>
                {row.status === 'check' && row.upload === 100 && <FileCheckIcon />}
                {row.status === 'x' && <FileErrorIcon />}
                {(row.status === 'loading' || (row.status === 'check' && row.upload < 100)) && <FileWaitIcon />}
              </div>
              {/* 비고 */}
              <div className="py-5 px-5 flex items-center justify-center" style={{ flex: 1 }}>
                <button><TrashIcon /></button>
              </div>
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


