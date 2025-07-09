// 차량 정보 타입
export interface MobilityInfo {
  mobilityId: number;
  mobilityNo: string;
  mobilityType: string;
  model: string;
  year: string;
  fuelType: string;
  passengerCapacity: number;
  registrationDate: string;
  hasRegistration: boolean;
  hasScrappingCert: boolean;
}

// 차량 상세 정보 타입
export interface MobilityDetailInfo {
  mobilityId: number;
  mobilityNo: string;
  mobilityType: string;
  model: string;
  year: string;
  fuelType: string;
  passengerCapacity: number;
  registrationDate: string;
  releasePrice: number;
  length: number;
  width: number;
  height: number;
  totalWeight: number;
  files: MobilityFileInfo[];
}

// 차량 파일 정보 타입
export interface MobilityFileInfo {
  mobilityFileId: number;
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

// 차량 검색 조건 타입
export interface MobilitySearchDto {
  page?: number;
  size?: number;
  mobilityNo?: string;
  model?: string;
  fuelType?: string;
  mobilityType?: string;
} 