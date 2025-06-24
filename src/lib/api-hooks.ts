import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, API_ENDPOINTS } from './api'
import axios from 'axios'

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
export const useTransports = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['transports', page, size],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.TRANSPORT.LIST, {
        params: { page, size },
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