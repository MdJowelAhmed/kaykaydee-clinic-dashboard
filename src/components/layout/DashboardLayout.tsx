import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { DASHBOARD_HEADER_H, DASHBOARD_HEADER_SIDEBAR_GAP } from './dashboardLayoutTokens'

export default function DashboardLayout() {
  const shellTop = `calc(${DASHBOARD_HEADER_H} + ${DASHBOARD_HEADER_SIDEBAR_GAP})`
  const mainMinH = `calc(100vh - ${DASHBOARD_HEADER_H} - ${DASHBOARD_HEADER_SIDEBAR_GAP})`

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div style={{ paddingTop: shellTop }}>
        <main className="px-6 lg:px-9 py-6" style={{ minHeight: mainMinH }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
