// 운행 정보 타입
export interface OperationData {
  id: number;
  vehicleNo: string;
  driverName: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  distance: number;
  fuelConsumption: number;
  status: string;
}

// 운행 검색 조건 타입
export interface OperationSearchDto {
  page?: number;
  size?: number;
  vehicleNo?: string;
  driverName?: string;
  routeName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

// 운행 상세 정보 타입
export interface OperationDetailInfo {
  id: number;
  vehicleNo: string;
  driverName: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  distance: number;
  fuelConsumption: number;
  status: string;
  routeDetails: RouteDetail[];
  fuelRecords: FuelRecord[];
}

// 경로 상세 정보 타입
export interface RouteDetail {
  stopId: number;
  stopName: string;
  arrivalTime: string;
  departureTime: string;
  passengers: number;
}

// 연료 기록 타입
export interface FuelRecord {
  recordId: number;
  fuelType: string;
  amount: number;
  timestamp: string;
  location: string;
} 