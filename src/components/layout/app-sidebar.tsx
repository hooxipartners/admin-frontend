import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { sidebarData } from './data/sidebar-data'
import LogoutIcon from '../ui/logout-icon'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const handleLogout = () => {
    useAuthStore.getState().auth.reset();
    navigate({ to: '/sign-in' });
  };

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <NavUser user={sidebarData.user} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <button
          className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted rounded-md"
          onClick={handleLogout}
        >
          <LogoutIcon />
          Logout
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
