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

// 목업 데이터 (간단화)
const getOperationMockData = () => Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  fileName: '다모아자동차(주)_총전량데이터.xlsx',
  range: '2019-01 ~ 2024-12',
  types: ['총전량', '주행거리', '주유량'],
  upload: i === 3 ? 80 : 100,
  date: '2020-04-20',
  status: i === 3 ? 'x' : (i === 4 ? 'loading' : 'check'),
}));

// 1. 테이블 컬럼 정의 및 목업 row 데이터 교체
const tableColumns = [
  { key: 'fileName', label: '운행정보 데이터', className: 'flex-[2] min-w-[240px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium' },
  { key: 'range', label: '데이터 범위', className: 'flex-1 min-w-[140px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium' },
  { key: 'types', label: '데이터 유형', className: 'flex-1 min-w-[180px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium' },
  { key: 'upload', label: '업로드상태', className: 'flex-1 min-w-[160px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium' },
  { key: 'date', label: '파일등록일', className: 'flex-1 min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium' },
  { key: 'status', label: '파일상태', className: 'flex-1 min-w-[80px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec] text-xs font-medium justify-center' },
  { key: 'action', label: '비고', className: 'flex-1 min-w-[80px] px-4 py-2.5 flex items-center justify-center text-xs font-medium' },
];

const tableRows = getOperationMockData();

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
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M6.5 11.5L10 15L16 7" stroke="#10B978" strokeWidth="1.5" strokeLinecap="round"/></svg>
);
const FileErrorIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M6.19434 15.8058L11.0001 11.0001M11.0001 11.0001L15.8058 6.19434M11.0001 11.0001L6.19434 6.19434M11.0001 11.0001L15.8058 15.8058" stroke="#FF4D4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const FileWaitIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11.0003 4.354V5.729M15.6997 6.30052L14.7274 7.2728M17.6462 10.9998H16.2712M15.6997 15.6992L14.7274 14.7269M11.0003 16.2707V17.6457M7.2733 14.7269L6.30103 15.6992M5.72949 10.9998H4.35449M7.2733 7.2728L6.30103 6.30052" stroke="#CED2DA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

export const OperationInfoTab = () => {
  const [page, setPage] = useState(0)
  const size = 5
  const rows = getOperationMockData().slice(page * size, (page + 1) * size)
  const totalElements = getOperationMockData().length
  const totalPages = Math.ceil(totalElements / size)

  return (
    <div className="w-full min-h-screen pt-4 px-8 pb-8">
      {/* 섹션 헤더 */}
      <div className="bg-white mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium text-[#141c25] leading-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            운행정보
          </h2>
          <span className="ml-2 text-sm font-semibold text-[#0166ff]" style={{ marginLeft: 8, fontFamily: 'Inter, sans-serif' }}>{totalElements}</span>
        </div>
        <button className="px-5 py-2.5 bg-[#0166ff] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(20,28,37,0.04)] flex items-center gap-2 text-white text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
          운행 추가
        </button>
      </div>
      {/* 전체 카운트 및 검색 */}
      <div className="bg-white mb-6 flex items-center justify-between">
        <div className="w-80">
          <div className="relative">
            <input placeholder="차량번호" className="w-full pl-4 pr-20 py-2 border border-[#e4e7ec] rounded-[10px] bg-white shadow-sm text-base text-[#637083] leading-6" style={{ fontFamily: 'Inter, sans-serif' }} />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-gray-50 text-[#0166ff] px-3 py-1 rounded-lg text-sm font-medium shadow-sm leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>
              검색
            </button>
          </div>
        </div>
      </div>
      {/* 테이블 */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-[#e4e7ec]">
        <div className="flex bg-[#f2f4f7] min-w-[1200px]">
          {/* 컬럼 헤더 */}
          {tableColumns.map((column, idx) => (
            <div
              key={column.key}
              className={column.className + (idx === tableColumns.length - 1 ? ' border-r-0' : '')}
              style={{ ...(idx === 0 ? { borderTopLeftRadius: 12 } : {}), ...(idx === tableColumns.length - 1 ? { borderTopRightRadius: 12 } : {}) }}
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
            {/* 운행정보 데이터 */}
            <div className="flex-[2] min-w-[240px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec]">
              <span className="text-sm font-medium text-[#141c25] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.fileName}</span>
            </div>
            {/* 데이터 범위 */}
            <div className="flex-1 min-w-[140px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec]">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.range}</span>
            </div>
            {/* 데이터 유형 */}
            <div className="flex-1 min-w-[180px] px-4 py-2.5 flex items-center gap-2 border-r border-[#e4e7ec]">
              {row.types.map((type, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#f2f4f7] text-[#344051]" style={{ fontFamily: 'Inter, sans-serif' }}>{type}</span>
              ))}
            </div>
            {/* 업로드상태 */}
            <div className="flex-1 min-w-[160px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec]">
              <div className="w-full h-2 bg-[#E4E7EC] rounded-full overflow-hidden mr-2">
                <div className="h-2 rounded-full bg-[#0166ff] transition-all" style={{ width: `${row.upload}%` }}></div>
              </div>
            </div>
            {/* 파일등록일 */}
            <div className="flex-1 min-w-[120px] px-4 py-2.5 flex items-center border-r border-[#e4e7ec]">
              <span className="text-sm font-medium text-[#344051] leading-5" style={{ fontFamily: 'Inter, sans-serif' }}>{row.date}</span>
            </div>
            {/* 파일상태 */}
            <div className="flex-1 min-w-[80px] px-4 py-2.5 flex items-center justify-center border-r border-[#e4e7ec]">
              {row.status === 'check' && row.upload === 100 && <FileCheckIcon />}
              {row.status === 'x' && <FileErrorIcon />}
              {(row.status === 'loading' || (row.status === 'check' && row.upload < 100)) && <FileWaitIcon />}
            </div>
            {/* 비고 */}
            <div className="flex-1 min-w-[80px] px-4 py-2.5 flex items-center justify-center">
              <button><TrashIcon /></button>
            </div>
          </div>
        ))}
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
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-9 w-9 rounded-lg text-sm leading-5 font-medium transition-colors ${page === i ? 'bg-[#f2f4f7] text-[#141c25]' : 'text-[#637083] hover:bg-gray-100'}`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          className="rounded-lg bg-[#f2f4f7] p-2"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7.5 5L12.5 10L7.5 15" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}


