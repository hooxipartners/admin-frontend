import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/(auth)')({
  beforeLoad: async () => {
    const { accessToken } = useAuthStore.getState().auth
    if (accessToken) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Outlet,
}) 