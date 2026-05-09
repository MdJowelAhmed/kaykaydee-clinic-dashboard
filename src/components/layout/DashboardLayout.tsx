import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAppSelector } from '@/redux/hooks'
import { cn } from '@/utils/cn'
import { DASHBOARD_HEADER_H, DASHBOARD_HEADER_SIDEBAR_GAP } from './dashboardLayoutTokens'

export default function DashboardLayout() {
  const { sidebarCollapsed } = useAppSelector((state) => state.ui)

  const shellTop = `calc(${DASHBOARD_HEADER_H} + ${DASHBOARD_HEADER_SIDEBAR_GAP})`
  const mainMinH = `calc(100vh - ${DASHBOARD_HEADER_H} - ${DASHBOARD_HEADER_SIDEBAR_GAP})`

  return (
    <div className="min-h-screen bg-background ">
      <Header />
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'
        )}
        style={{ paddingTop: shellTop }}
      >
        <main className="px-6 lg:px-8 py-6 " style={{ minHeight: mainMinH }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
