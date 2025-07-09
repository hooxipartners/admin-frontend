// 차량 등록/수정 요청 DTO
export interface MobilityRequestDto {
  mobilityNo: string;
  businessType: string;
  mobilityType: string;
  model: string;
  year: string;
  vin: string;
  corporateRegistrationNumber: string;
  mobilityRegDate: string;
  length: number;
  width: number;
  height: number;
  totalWeight: number;
  passengerCapacity: number;
  fuelType: string;
  mobilityReleasePrice: number;
  files?: any[];
}

// 차량 수정 요청 DTO
export interface MobilityUpdateDto {
  mobilityNo?: string;
  businessType?: string;
  mobilityType?: string;
  model?: string;
  year?: string;
  vin?: string;
  corporateRegistrationNumber?: string;
  mobilityRegDate?: string;
  length?: number;
  width?: number;
  height?: number;
  totalWeight?: number;
  passengerCapacity?: number;
  fuelType?: string;
  mobilityReleasePrice?: number;
  files?: any[];
}

// 차량 검색 DTO
export interface MobilitySearchDto {
  page?: number;
  size?: number;
  mobilityNo?: string;
  model?: string;
  fuelType?: string;
  businessType?: string;
  mobilityType?: string;
}

// 차량 응답 DTO
export interface MobilityResponseDto {
  mobilityId: number;
  mobilityNo: string;
  projectId: number | null;
  projectName: string | null;
  businessType: string;
  vin: string;
  model: string;
  mobilityType: string;
  year: string;
  fuelType: string;
  passengerCapacity: number;
  mobilityRegDate: string;
  hasVehicleReg: boolean;
  hasScrappingCert: boolean;
}

// 차량 상세 응답 DTO
export interface MobilityDetailResponseDto {
  mobilityId: number;
  mobilityNo: string;
  businessType: string;
  vin: string;
  model: string;
  mobilityType: string;
  year: string;
  passengerCapacity: number;
  fuelType: string;
  mobilityRegDate: string;
  mobilityReleasePrice: number;
  length: number;
  width: number;
  height: number;
  totalWeight: number;
  files: any[];
}

// 차량 파일 응답 DTO
export interface MobilityFileResponseDto {
  mobilityFileId: number;
  fileType: string;
  file: any;
} 