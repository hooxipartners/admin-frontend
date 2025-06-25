import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import React, { useRef, useState } from 'react';

interface Props {
  mobilityId: number;
  onClose: () => void;
}

// DTO 타입 (간략화)
interface MobilityFileResponseDto {
  attachFileId: number;
  fileTypeName: string;
  fileTypeDescription: string;
  originalFileName: string;
  storedFileName: string;
  relativeFilePath: string;
  fileSizeByte: number;
}
interface MobilityDetailResponseDto {
  mobilityId: number;
  mobilityNo: string;
  type: string;
  model: string;
  year: string;
  vin: string;
  mobilityRegDate: string;
  fuelTypeName: string;
  fuelTypeDescription: string;
  length: number;
  width: number;
  height: number;
  totalWeight: number;
  passengerCapacity: number;
  mobilityReleasePrice: number;
  files: MobilityFileResponseDto[];
}

// 업로드 응답 타입
interface UploadSingleFileResponseDto {
  originalFileName: string;
  storedFileName: string;
  uploadTempPath: string;
  fileSizeByte: number;
}

// FileRequestDto 타입
interface FileRequestDto {
  uploadDirPath?: string;
  fileType: string;
  originalFileName: string;
  storedFileName: string;
  uploadTempPath: string;
  fileSizeByte: number;
}
// MobilityRequestDto 타입
interface MobilityRequestDto {
  mobilityNo: string;
  type: string;
  model: string;
  year: string;
  vin: string;
  companyName?: string;
  corporateRegistrationNumber?: string;
  mobilityRegDate: string;
  length?: number;
  width?: number;
  height?: number;
  totalWeight?: number;
  passengerCapacity?: number;
  fuelType?: string;
  mobilityReleasePrice?: number;
  files: FileRequestDto[];
}

// PDF 아이콘 SVG
const PDFIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.38379 0.5H13.6504L21.6533 7.93164V21.5996C21.6533 22.6228 20.7677 23.4998 19.6152 23.5H4.38379C3.23137 23.4998 2.3457 22.6228 2.3457 21.5996V2.40039C2.3457 1.37721 3.23137 0.500191 4.38379 0.5Z" fill="white" stroke="#E4E7EC"/>
    <path d="M5.50848 15.8572V10.7663H7.41757C7.80867 10.7663 8.13679 10.8392 8.40194 10.985C8.66875 11.1309 8.8701 11.3314 9.00599 11.5866C9.14354 11.8401 9.21231 12.1285 9.21231 12.4516C9.21231 12.7781 9.14354 13.0681 9.00599 13.3217C8.86845 13.5752 8.66544 13.7749 8.39697 13.9207C8.12851 14.0649 7.7979 14.137 7.40514 14.137H6.13987V13.3788H7.28085C7.50954 13.3788 7.69681 13.3391 7.84264 13.2595C7.98847 13.18 8.09619 13.0706 8.16579 12.9314C8.23705 12.7922 8.27268 12.6323 8.27268 12.4516C8.27268 12.271 8.23705 12.1119 8.16579 11.9744C8.09619 11.8368 7.98765 11.7299 7.84015 11.6537C7.69432 11.5758 7.50623 11.5369 7.27588 11.5369H6.43071V15.8572H5.50848ZM11.7385 15.8572H10.0134V10.7663H11.7733C12.2787 10.7663 12.7129 10.8682 13.0759 11.072C13.4404 11.2742 13.7205 11.565 13.9161 11.9445C14.1116 12.324 14.2094 12.7781 14.2094 13.3068C14.2094 13.8371 14.1108 14.2928 13.9136 14.6739C13.718 15.0551 13.4355 15.3476 13.0659 15.5514C12.698 15.7553 12.2555 15.8572 11.7385 15.8572ZM10.9356 15.0592H11.6938C12.0484 15.0592 12.3442 14.9946 12.5812 14.8653C12.8182 14.7344 12.9963 14.5397 13.1156 14.2812C13.235 14.021 13.2946 13.6962 13.2946 13.3068C13.2946 12.9173 13.235 12.5942 13.1156 12.3373C12.9963 12.0788 12.8198 11.8857 12.5862 11.7581C12.3542 11.6288 12.0658 11.5642 11.7211 11.5642H10.9356V15.0592ZM15.0856 15.8572V10.7663H18.347V11.5394H16.0079V12.9215H18.1233V13.6945H16.0079V15.8572H15.0856Z" fill="#344051"/>
    <path d="M13.8457 4.74725V0L22.1534 7.71429H17.041C15.2763 7.71429 13.8457 6.3859 13.8457 4.74725Z" fill="url(#paint0_radial_457_8270)"/>
    <defs>
      <radialGradient id="paint0_radial_457_8270" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.9995 1.92857) rotate(90) scale(5.78571 6.23077)"><stop stopColor="#E4E7EC"/><stop offset="1" stopColor="#CED2DA"/></radialGradient>
    </defs>
  </svg>
);
// 삭제 아이콘 SVG
const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.3337 10.0001C18.3337 14.6025 14.6027 18.3334 10.0003 18.3334C5.39795 18.3334 1.66699 14.6025 1.66699 10.0001C1.66699 5.39771 5.39795 1.66675 10.0003 1.66675C14.6027 1.66675 18.3337 5.39771 18.3337 10.0001ZM7.36961 6.48549C7.12554 6.24141 6.72981 6.24141 6.48573 6.48549C6.24165 6.72956 6.24165 7.12529 6.48573 7.36937L9.23415 10.1178L6.48573 12.8662C6.24165 13.1103 6.24165 13.506 6.48573 13.7501C6.72981 13.9942 7.12554 13.9942 7.36961 13.7501L10.118 11.0017L12.8664 13.7501C13.1105 13.9942 13.5062 13.9942 13.7503 13.7501C13.9944 13.506 13.9944 13.1103 13.7503 12.8662L11.0019 10.1178L13.7503 7.36937C13.9944 7.12529 13.9944 6.72956 13.7503 6.48549C13.5062 6.24141 13.1105 6.24141 12.8664 6.48549L10.118 9.2339L7.36961 6.48549Z" fill="#CED2DA"/>
  </svg>
);

// 드래그앤드랍+클릭 업로드 input file 컴포넌트
const InputFile: React.FC<{ onChange: (file: File) => void }> = ({ onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };
  return (
    <div
      className={`px-8 py-6 bg-white rounded-2xl outline outline-1 outline-[#e4e7ec] flex flex-col items-center gap-2 border-dashed ${dragOver ? 'border-2 border-[#0166ff]' : ''}`}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{ cursor: 'pointer' }}
    >
      <div className="w-8 h-8 bg-gradient-to-b from-[#f2f4f7] to-[#e4e7ec] rounded-full flex items-center justify-center mb-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3V15M3 9H15" stroke="#344051" strokeWidth="1.3" strokeLinecap="round"/></svg>
      </div>
      <div className="text-center text-[#637083] text-base font-medium">Drag & drop or choose files to upload</div>
      <div className="text-center text-[#b0b7c3] text-xs">Max file size 1MB</div>
      <input ref={inputRef} type="file" className="hidden" onChange={e => { if (e.target.files && e.target.files[0]) onChange(e.target.files[0]); }} />
    </div>
  );
};

const VechicleInfoDetailModal: React.FC<Props> = ({ mobilityId, onClose }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['mobilityDetail', mobilityId],
    queryFn: async () => {
      const res = await apiClient.get(`/mobility/detail/${mobilityId}`);
      return res.data.data as MobilityDetailResponseDto;
    },
    enabled: !!mobilityId,
  });

  // 디자인용 더미 데이터 (API 실패 시)
  const dummy = {
    mobilityId: 1,
    mobilityNo: '서울74사2457',
    type: '대형 승합',
    model: 'HYPERS11L',
    year: '2020',
    vin: 'LKLA6H1V3LA759872',
    mobilityRegDate: '2020-12-23',
    fuelTypeName: 'ELECTRIC',
    fuelTypeDescription: '전기',
    length: 11210,
    width: 2480,
    height: 3270,
    totalWeight: 14675,
    passengerCapacity: 45,
    mobilityReleasePrice: 2390000,
    files: [
      {
        attachFileId: 1,
        fileTypeName: 'VEHICLE_REG',
        fileTypeDescription: '자동차 등록증',
        originalFileName: '운수사관리-상세-차량정보.png',
        storedFileName: '7ac4cbdfa15e458b86fff996a7e5bd6b.png',
        relativeFilePath: '/mobility/7ac4cbdfa15e458b86fff996a7e5bd6b.png',
        fileSizeByte: 160528,
      },
    ],
  };
  const detail = data || dummy;

  // 파일 상태 관리 (프론트 상태만)
  const [carRegFile, setCarRegFile] = useState<MobilityFileResponseDto | UploadSingleFileResponseDto | File | null>(
    detail.files?.find(f => f.fileTypeName === 'VEHICLE_REG') || null
  );
  const [exportFile, setExportFile] = useState<MobilityFileResponseDto | UploadSingleFileResponseDto | File | null>(
    detail.files?.find(f => f.fileTypeName === 'EXPORT_DELETE_CERT') || null
  );
  const [carRegLoading, setCarRegLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // 파일 삭제 핸들러
  const handleDeleteCarRegFile = () => setCarRegFile(null);
  const handleDeleteExportFile = () => setExportFile(null);

  // 파일 업로드 API
  async function uploadSingleFile(file: File): Promise<UploadSingleFileResponseDto> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/file/upload/single-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  }

  // 파일 업로드 핸들러
  const handleUploadCarRegFile = async (file: File) => {
    setCarRegLoading(true);
    try {
      const uploaded = await uploadSingleFile(file);
      setCarRegFile(uploaded);
    } finally {
      setCarRegLoading(false);
    }
  };
  const handleUploadExportFile = async (file: File) => {
    setExportLoading(true);
    try {
      const uploaded = await uploadSingleFile(file);
      setExportFile(uploaded);
    } finally {
      setExportLoading(false);
    }
  };

  // 기존 파일과 비교해 새로 업로드한 파일만 files에 추가
  function isNewFile(file: any, detailFiles: any[], type: string) {
    if (!file) return false;
    // 기존 파일 중 fileType이 type인 것
    const old = detailFiles.find(f => f.fileTypeName === type);
    // 새로 업로드한 파일(UploadSingleFileResponseDto 등)은 attachFileId 없음
    if (!old && file) return true; // 기존에 없고 새로 있으면 새 파일
    if ('attachFileId' in file) return false; // 기존 파일 그대로
    // 업로드 응답 객체는 storedFileName, uploadTempPath 등 있음
    return true;
  }

  // FileRequestDto 변환 함수 (UploadSingleFileResponseDto만 변환)
  function toFileRequestDtoFromUpload(file: any, fileType: string): FileRequestDto | null {
    if (!file) return null;
    // 업로드 응답 객체만 변환
    if ('storedFileName' in file && 'uploadTempPath' in file) {
      return {
        fileType,
        originalFileName: file.originalFileName,
        storedFileName: file.storedFileName,
        uploadTempPath: file.uploadTempPath,
        fileSizeByte: file.fileSizeByte,
        uploadDirPath: '',
      };
    }
    return null;
  }

  // 수정 버튼 클릭 핸들러
  const handleUpdate = async () => {
    const files: FileRequestDto[] = [];
    if (isNewFile(carRegFile, detail.files, 'VEHICLE_REG')) {
      const dto = toFileRequestDtoFromUpload(carRegFile, 'VEHICLE_REG');
      if (dto) files.push(dto);
    }
    if (isNewFile(exportFile, detail.files, 'EXPORT_DELETE_CERT')) {
      const dto = toFileRequestDtoFromUpload(exportFile, 'EXPORT_DELETE_CERT');
      if (dto) files.push(dto);
    }

    const req: MobilityRequestDto = {
      mobilityNo: detail.mobilityNo,
      type: detail.type,
      model: detail.model,
      year: detail.year,
      vin: detail.vin,
      companyName: undefined,
      corporateRegistrationNumber: undefined,
      mobilityRegDate: detail.mobilityRegDate,
      length: detail.length,
      width: detail.width,
      height: detail.height,
      totalWeight: detail.totalWeight,
      passengerCapacity: detail.passengerCapacity,
      fuelType: detail.fuelTypeName,
      mobilityReleasePrice: detail.mobilityReleasePrice,
      files,
    };
    try {
      await apiClient.put(`/mobility/${mobilityId}`, req);
      alert('수정이 완료되었습니다.');
      onClose();
    } catch (e) {
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 회색 반투명 배경 */}
      <div className="fixed inset-0 bg-[#334f6f]/50 backdrop-blur-[1px]" onClick={onClose} />
      {/* 오른쪽 패널 */}
      <div className="ml-auto w-[520px] h-full bg-white rounded-l-2xl shadow-xl flex flex-col p-8 relative animate-slide-in-right">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-10">
          <div className="text-xl font-medium text-[#141c25]">차량 상세정보</div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <span className="sr-only">닫기</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="#344051" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        {/* 본문 */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
        ) : (
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
            {/* 차량번호/프로젝트 */}
            <div className="flex gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">차량번호</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm text-[#637083]">{detail.mobilityNo}</div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">프로젝트</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm text-[#b0b7c3]">부천001</div>
              </div>
            </div>
            {/* 차대번호/모델명 */}
            <div className="flex gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">차대번호</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm">{detail.vin}</div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">모델명</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm">{detail.model}</div>
              </div>
            </div>
            {/* 차량유형/연식/연료 */}
            <div className="flex gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">차량유형</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm">{detail.type}</div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">연식</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm">{detail.year}</div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">연료</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm">{detail.fuelTypeDescription}</div>
              </div>
            </div>
            {/* 승차정원/차량출고가 */}
            <div className="flex gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">승차정원</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm">{detail.passengerCapacity}인승</div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">차량출고가</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm flex items-center gap-1">
                  {detail.mobilityReleasePrice?.toLocaleString()}<span className="text-xs text-[#b0b7c3]">원</span>
                </div>
              </div>
            </div>
            {/* 차량등록일 */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-[#141c25]">차량등록일</div>
              <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm">{detail.mobilityRegDate}</div>
            </div>
            {/* 길이/너비/높이/중량 */}
            <div className="flex gap-5">
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">길이</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm flex items-center gap-1">{detail.length?.toLocaleString()}<span className="text-xs text-[#b0b7c3]">mm</span></div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">너비</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm flex items-center gap-1">{detail.width?.toLocaleString()}<span className="text-xs text-[#b0b7c3]">mm</span></div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">높이</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm flex items-center gap-1">{detail.height?.toLocaleString()}<span className="text-xs text-[#b0b7c3]">mm</span></div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="text-sm font-medium text-[#141c25]">중량</div>
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] text-sm flex items-center gap-1">{detail.totalWeight?.toLocaleString()}<span className="text-xs text-[#b0b7c3]">kg</span></div>
              </div>
            </div>
            {/* 자동차등록증 */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-[#141c25]">자동차등록증</div>
              {carRegFile ? (
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] flex items-center gap-2">
                  <PDFIcon />
                  <span className="text-sm text-[#637083]">
                    {'originalFileName' in carRegFile ? carRegFile.originalFileName : carRegFile.name}
                  </span>
                  <button onClick={handleDeleteCarRegFile} className="ml-auto"><DeleteIcon /></button>
                </div>
              ) : (
                carRegLoading ? (
                  <div className="pl-3 pr-2.5 py-2 text-[#637083]">업로드 중...</div>
                ) : (
                  <InputFile onChange={handleUploadCarRegFile} />
                )
              )}
            </div>
            {/* 수출/자진말소증명서 */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-[#141c25]">수출/자진말소증명서</div>
              {exportFile ? (
                <div className="pl-3 pr-2.5 py-2 bg-white rounded-[10px] outline outline-1 outline-[#e4e7ec] flex items-center gap-2">
                  <PDFIcon />
                  <span className="text-sm text-[#637083]">
                    {'originalFileName' in exportFile ? exportFile.originalFileName : exportFile.name}
                  </span>
                  <button onClick={handleDeleteExportFile} className="ml-auto"><DeleteIcon /></button>
                </div>
              ) : (
                exportLoading ? (
                  <div className="pl-3 pr-2.5 py-2 text-[#637083]">업로드 중...</div>
                ) : (
                  <InputFile onChange={handleUploadExportFile} />
                )
              )}
            </div>
          </div>
        )}
        {/* 하단 수정 버튼 */}
        <div className="mt-8 flex justify-end">
          <button className="px-5 py-2.5 bg-[#344051] rounded-[10px] text-white text-sm font-medium" onClick={handleUpdate}>수정</button>
        </div>
      </div>
    </div>
  );
};

export default VechicleInfoDetailModal; 