import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { ENV, logEnvInfo } from './env'

// 환경 정보 로그 (개발 환경에서만)
logEnvInfo()

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: ENV.getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 개발 환경에서 요청 로그
    if (ENV.IS_DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    // 개발 환경에서 응답 로그
    if (ENV.IS_DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    // 개발 환경에서 에러 로그
    if (ENV.IS_DEV) {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data)
    }
    
    // 401 에러 시 자동 로그아웃
    if (error.response?.status === 401) {
      useAuthStore.getState().auth.reset()
    }
    return Promise.reject(error)
  }
)

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  // Tasks
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },
  // Transport
  TRANSPORT: {
    LIST: '/transport',
    CREATE: '/transport',
    UPDATE: (id: string) => `/transport/${id}`,
    DELETE: (id: string) => `/transport/${id}`,
  },
  // Mobility
  MOBILITY: {
    LIST: '/mobility/list/25',
  },
} as const 

// 파일 업로드 (FormData)
export async function uploadSingleFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post('/file/upload/single-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// 다중 파일 업로드 (FormData)
export async function uploadMultiFiles(files: File[]) {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  const res = await apiClient.post('/file/upload/multi-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// 파일 저장
export async function saveSingleFile(dto: {
  uploadDirPath: string;
  originalFileName: string;
  storedFileName: string;
  uploadTempPath: string;
  fileSizeByte: number;
}) {
  const res = await apiClient.post('/file/save/single-file', dto);
  return res.data;
}

// 다중 파일 정보 저장
export async function saveMultiFiles(fileRequestDtos: any[]) {
  const res = await apiClient.post('/file/save/multi-file', fileRequestDtos);
  return res.data;
}

// 차량 정보 수정 API
export async function updateMobility(id: number, data: any) {
  const res = await apiClient.put(`/mobility/${id}`, data);
  return res.data;
}

// --- Naver OCR API 타입 정의 ---
export interface HooxiOcrRequestDto {
  originalFileName: string;
  storedFileName: string;
  uploadTempPath: string;
}

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

export interface NaverOcrResponseDto {
  successCount: number;
  failureCount: number;
  successList: MobilityRegistrationDto[];
  failureList: MobilityRegistrationDto[];
}

// --- Naver OCR API 함수 ---
export async function getNaverOcrResult(requestDtos: HooxiOcrRequestDto[]): Promise<any> {
  const res = await apiClient.post('/naver-ocr', requestDtos, { timeout: 60000 });
  return res.data;
}

// 임시 경로 파일 읽기 (바이너리 반환)
export async function readTempFile(uploadTempPath: string): Promise<Blob> {
  const res = await apiClient.get('/file/read-temp-file', {
    params: { uploadTempPath },
    responseType: 'blob',
  });
  return res.data;
} 