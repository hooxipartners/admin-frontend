import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  apiClient, 
  API_ENDPOINTS, 
  uploadSingleFile, 
  saveSingleFile, 
  updateMobility,
  createMobility,
  createMobilitiesBatch,
  getMobilityList,
  getMobilityDetail,
  getFacilityList,
  getFacilityDetail,
  createFacility,
  updateFacility,
  deleteFacility
} from './api'
import axios from 'axios'
import type { 
  MobilityRequestDto, 
  MobilityUpdateDto, 
  MobilitySearchDto, 
  MobilityResponseDto, 
  MobilityDetailResponseDto,
  Page,
  HooxiResponse 
} from '@/types/api'

// 사용자 관련 훅
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS.LIST)
      return response.data
    },
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, userData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// 태스크 관련 훅
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.TASKS.LIST)
      return response.data
    },
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (taskData: any) => {
      const response = await apiClient.post(API_ENDPOINTS.TASKS.CREATE, taskData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(API_ENDPOINTS.TASKS.UPDATE(id), data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(id))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// 인증 관련 훅
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (credentials: { loginId: string; password: string }) => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      return response.data
    },
    onSuccess: () => {
      // 토큰 저장
      // useAuthStore.getState().auth.setAccessToken(data.token)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
      return response.data
    },
    onSuccess: () => {
      // 토큰 제거
      // useAuthStore.getState().auth.reset()
      queryClient.clear()
    },
  })
}

// 운수사관리 리스트 조회
export const useTransports = (
  page: number = 0,
  size: number = 10,
  areaCode?: string,
  companyName?: string,
  managerName?: string
) => {
  return useQuery({
    queryKey: ['transports', page, size, areaCode, companyName, managerName],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.TRANSPORT.LIST, {
        params: { page, size, areaCode, companyName, managerName },
      })
      return response.data
    },
    enabled: true,
  })
}

export interface TransportAccountListDto {
  transportAccountId: number;
  accountInfoTypeName: string;
  accountInfoTypeDescription: string;
  homepageUrl: string;
  homepageName: string;
  loginId: string;
}

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

export async function fetchTransportCompanyDetail(id: number): Promise<TransportCompanyDetailDto> {
  const res = await axios.get<{ success: boolean; data: TransportCompanyDetailDto }>(
    `/api/transport/${id}/detail/basic`
  );
  return res.data.data;
}

// 차량 관련 훅들
export const useMobilities = (
  transportCompanyId: number,
  searchParams: MobilitySearchDto = {}
) => {
  return useQuery({
    queryKey: ['mobilities', transportCompanyId, searchParams],
    queryFn: async () => {
      const response = await getMobilityList(transportCompanyId, searchParams);
      return response as HooxiResponse<Page<MobilityResponseDto>>;
    },
    enabled: !!transportCompanyId,
  })
}

export const useMobilityDetail = (mobilityId: number) => {
  return useQuery({
    queryKey: ['mobility', mobilityId],
    queryFn: async () => {
      const response = await getMobilityDetail(mobilityId);
      return response as HooxiResponse<MobilityDetailResponseDto>;
    },
    enabled: !!mobilityId,
  })
}

export const useCreateMobility = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ transportCompanyId, data }: { transportCompanyId: number; data: MobilityRequestDto }) => {
      const response = await createMobility(transportCompanyId, data);
      return response as HooxiResponse<MobilityResponseDto>;
    },
    onSuccess: (_, { transportCompanyId }) => {
      queryClient.invalidateQueries({ queryKey: ['mobilities', transportCompanyId] })
    },
  })
}

export const useCreateMobilitiesBatch = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ transportCompanyId, data }: { transportCompanyId: number; data: MobilityRequestDto[] }) => {
      const response = await createMobilitiesBatch(transportCompanyId, data);
      return response as HooxiResponse<MobilityResponseDto[]>;
    },
    onSuccess: (_, { transportCompanyId }) => {
      queryClient.invalidateQueries({ queryKey: ['mobilities', transportCompanyId] })
    },
  })
}

// 파일 업로드 mutation
export const useUploadSingleFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      return await uploadSingleFile(file);
    },
  });
};

// 파일 저장 mutation
export const useSaveSingleFile = () => {
  return useMutation({
    mutationFn: async (dto: {
      uploadDirPath: string;
      originalFileName: string;
      storedFileName: string;
      uploadTempPath: string;
      fileSizeByte: number;
    }) => {
      return await saveSingleFile(dto);
    },
  });
};

export const useUpdateTransport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiClient.put(API_ENDPOINTS.TRANSPORT.UPDATE(String(id)), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
    },
  });
};

export const useUpdateMobility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: MobilityUpdateDto }) => {
      const response = await updateMobility(id, data);
      return response as HooxiResponse<MobilityDetailResponseDto>;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['mobility', id] });
      queryClient.invalidateQueries({ queryKey: ['mobilities'] });
    },
  });
}; 

// Facility 관련 훅들
export const useFacilities = (transportCompanyId: number, searchParams?: any) => {
  return useQuery({
    queryKey: ['facilities', transportCompanyId, searchParams],
    queryFn: async () => {
      const response = await getFacilityList(transportCompanyId, searchParams)
      return response.data.content // API 응답의 content 배열 반환
    },
    enabled: !!transportCompanyId,
  })
}

export const useFacilityDetail = (id: number) => {
  return useQuery({
    queryKey: ['facility', id],
    queryFn: async () => {
      const response = await getFacilityDetail(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateFacility = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ transportCompanyId, data }: { transportCompanyId: number; data: any }) => {
      const response = await createFacility(transportCompanyId, data)
      return response
    },
    onSuccess: (_, { transportCompanyId }) => {
      queryClient.invalidateQueries({ queryKey: ['facilities', transportCompanyId] })
    },
  })
}

export const useUpdateFacility = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await updateFacility(id, data)
      return response
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] })
      queryClient.invalidateQueries({ queryKey: ['facility', id] })
    },
  })
}

export const useDeleteFacility = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteFacility(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] })
    },
  })
}