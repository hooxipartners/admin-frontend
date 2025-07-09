// 운수사 정보 타입
export interface TransportCompany {
  transportCompanyId: number;
  companyName: string;
  areaCode: string;
  corporateRegistrationNumber: string | null;
  address: string | null;
  detailedAddress: string | null;
  managerName: string;
  managerEmail: string;
  managerPhone?: string;
  hydrogenBusCount: number;
  electricBusCount: number;
  busTotalCount: number;
}

// 운수사 계정 정보 타입
export interface TransportAccountListDto {
  transportAccountId: number;
  accountInfoTypeName: string;
  accountInfoTypeDescription: string;
  homepageUrl: string;
  homepageName: string;
  loginId: string;
}

// 운수사 상세 정보 타입
export interface TransportCompanyDetailDto {
  transportCompanyId: number;
  companyName: string;
  businessRegistrationNumber: string | null;
  address: string | null;
  detailedAddress: string | null;
  managerName: string;
  managerPhone: string;
  managerEmail: string | null;
  accountList: TransportAccountListDto[];
}

// 운수사 검색 조건 타입
export interface TransportSearchDto {
  page?: number;
  size?: number;
  areaCode?: string;
  companyName?: string;
  managerName?: string;
} 