import { SidebarProvider } from "@/context/SidebarContext";
import AppSidebar from "@/layout/AppSidebar";
import DashboardPage from "./index";
import styles from "./page.module.scss";

export default function DashboardRoute() {
  return (
    <SidebarProvider>
      <div className={styles.dashboardLayout}>
        <AppSidebar />
        <main className={styles.dashboardContent}>
          <DashboardPage />
        </main>
      </div>
    </SidebarProvider>
  );
}
