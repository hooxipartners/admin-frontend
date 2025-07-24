interface FacilityDetailModalProps {
  open: boolean;
  onClose: () => void;
  facility: {
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
  } | null;
}

export default function FacilityDetailModal({ open, onClose, facility }: FacilityDetailModalProps) {
  if (!open || !facility) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-stretch">
      {/* BG */}
      <div
        className="fixed inset-0 bg-[#334f6f]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-[800px] h-full bg-white rounded-l-2xl shadow-xl flex flex-col p-8 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="text-[20px] font-medium text-[#141C25] leading-7 font-inter">설비 상세정보</div>
          <button
            className="p-2 bg-[#F2F4F7] rounded-lg flex items-center justify-center"
            onClick={onClose}
            aria-label="닫기"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M12 4L4 12" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {/* List */}
        <div className="flex flex-col gap-6">
          {/* 차고지/운수사 */}
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter">차고지</label>
              <div className="bg-white border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[14px] text-[#344051] font-medium shadow-sm">{facility.facilityName}</div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter">운수사</label>
              <div className="bg-white border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[14px] text-[#344051] font-medium shadow-sm flex items-center justify-between">
                {facility.company}
                <svg width="20" height="20" fill="none"><path d="M7 8l3 3 3-3" stroke="#637083" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
          {/* AC전력량계 */}
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter">AC전력량계 제조번호</label>
              <div className="bg-white border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[14px] text-[#344051] font-medium shadow-sm">{facility.meterNo}</div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter">제조년월</label>
              <div className="bg-white border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[14px] text-[#344051] font-medium shadow-sm flex items-center justify-between">
                {facility.meterDate}
                <svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="8" stroke="#637083" strokeWidth="1.5"/><path d="M10 5v5l3 3" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter">AC전력량계 이미지</label>
              <div className="bg-white border border-[#E4E7EC] rounded-[10px] px-3 py-2 flex items-center gap-2 shadow-sm">
                <svg width="24" height="24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" stroke="#E4E7EC"/><text x="7" y="16" fontSize="7" fontWeight="600" fill="#344051">PDF</text></svg>
                <span className="text-[14px] text-[#344051] font-medium">{facility.meterImage || '서울71사2208_자동차등록증.pdf'}</span>
                <button className="ml-auto"><svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="8" fill="#CED2DA"/></svg></button>
              </div>
            </div>
          </div>
          {/* 충전설비 */}
          {facility.chargers.map((charger, idx) => (
            <div className="flex gap-6" key={idx}>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter">충전설비 제조번호</label>
                <div className="bg-white border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[14px] text-[#344051] font-medium shadow-sm">{charger.chargerNo}</div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter">충전설비 제조년월</label>
                <div className="bg-white border border-[#E4E7EC] rounded-[10px] px-3 py-2 text-[14px] text-[#344051] font-medium shadow-sm flex items-center justify-between">
                  {charger.chargerDate}
                  <svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="8" stroke="#637083" strokeWidth="1.5"/><path d="M10 5v5l3 3" stroke="#637083" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#141C25] leading-5 font-inter">충전설비동판 이미지</label>
                <div className="bg-white border border-[#E4E7EC] rounded-[10px] px-3 py-2 flex items-center gap-2 shadow-sm">
                  <svg width="24" height="24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" stroke="#E4E7EC"/><text x="7" y="16" fontSize="7" fontWeight="600" fill="#344051">PDF</text></svg>
                  <span className="text-[14px] text-[#344051] font-medium">{charger.chargerImage || '서울71사2208_자동차등록증.pdf'}</span>
                  <button className="ml-auto"><svg width="20" height="20" fill="none"><circle cx="10" cy="10" r="8" fill="#CED2DA"/></svg></button>
                </div>
              </div>
            </div>
          ))}
          {/* 추가 버튼 */}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 bg-[#F2F4F7] rounded-[10px] text-[14px] font-medium text-[#141C25]">
            <svg width="20" height="20" fill="none"><path d="M10 5v10M5 10h10" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round"/></svg>
            충전설비 추가
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 bg-[#F2F4F7] rounded-[10px] text-[14px] font-medium text-[#141C25]">
            <svg width="20" height="20" fill="none"><path d="M10 5v10M5 10h10" stroke="#141C25" strokeWidth="1.5" strokeLinecap="round"/></svg>
            AC전력량계 추가
          </button>
        </div>
        {/* 하단 CTA */}
        <div className="flex justify-end mt-10">
          <button className="px-5 py-2.5 bg-[#141C25] text-white rounded-[10px] font-medium text-[14px] shadow">수정</button>
        </div>
      </div>
    </div>
  );
} 