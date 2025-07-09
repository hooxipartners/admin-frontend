// Naver OCR 요청 DTO
export interface HooxiOcrRequestDto {
  originalFileName: string;
  storedFileName: string;
  uploadTempPath: string;
}

// 차량 등록 정보 DTO (OCR 결과)
export interface MobilityRegistrationDto {
  originalFileName: string;
  storedFileName: string;
  uploadTempPath: string;
  mobilityNo: string;
  type: string;
  model: string;
  year: string;
  vin: string;
  companyName: string;
  corporateRegistrationNumber: string;
  mobilityRegDate: string;
  length: string;
  width: string;
  height: string;
  totalWeight: string;
  passengerCapacity: string;
  fuelType: string;
  mobilityReleasePrice: string;
}

// Naver OCR 응답 DTO
export interface NaverOcrResponseDto {
  successCount: number;
  failureCount: number;
  successList: MobilityRegistrationDto[];
  failureList: MobilityRegistrationDto[];
} 