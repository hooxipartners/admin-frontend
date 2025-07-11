import { Command } from 'lucide-react'
import { type SidebarData } from '../types'
import {
  DashboardIcon,
  ProjectManagementIcon,
  TransportCompanyIcon,
  VehicleManagementIcon,
  DrivingInfoIcon,
  FacilityManagementIcon,
} from '../../ui/icons'

export const sidebarData: SidebarData = {
  user: {
    name: '김도영 책임',
    email: '외부사업 관리자',
    avatar: '/avatars/dy.png', // 임시 아바타 경로
  },
  teams: [
    {
      name: '프로젝트 선택',
      logo: Command,
      plan: '활성 프로젝트',
    },
  ],
  navGroups: [
    {
      title: '',
      items: [
        {
          title: '대시보드',
          url: '/',
          icon: DashboardIcon,
        },
        {
          title: '프로젝트 관리',
          url: '/project',
          icon: ProjectManagementIcon,
        },
        {
          title: '운수사 관리',
          url: '/transport',
          icon: TransportCompanyIcon,
        },
        {
          title: '차량 관리',
          url: '/mobility',
          icon: VehicleManagementIcon,
        },
        {
          title: '운행 관리',
          url: '/driving-info',
          icon: DrivingInfoIcon,
        },
        {
          title: '설비 관리',
          url: '/facility',
          icon: FacilityManagementIcon,
        },
      ],
    },
  ],
}
