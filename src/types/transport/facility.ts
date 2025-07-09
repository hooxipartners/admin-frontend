// 설비 정보 타입
export interface FacilityData {
  id: number;
  garage: string;
  acMeterNo: string;
  acMeterYear: string;
  proof1: boolean;
  chargerNo: string;
  chargerYear: string;
  proof2: boolean;
}

// 설비 검색 조건 타입
export interface FacilitySearchDto {
  page?: number;
  size?: number;
  garage?: string;
  acMeterNo?: string;
  chargerNo?: string;
}

// 설비 상세 정보 타입
export interface FacilityDetailInfo {
  id: number;
  garage: string;
  acMeterNo: string;
  acMeterYear: string;
  proof1: boolean;
  chargerNo: string;
  chargerYear: string;
  proof2: boolean;
  files: FacilityFileInfo[];
}

// 설비 파일 정보 타입
export interface FacilityFileInfo {
  facilityFileId: number;
  fileType: string;
  file: {
    fileId: number;
    uploadDirPath: string;
    originalFileName: string;
    storedFileName: string;
    fileSizeByte: number;
    uploadDate: string;
  };
} 