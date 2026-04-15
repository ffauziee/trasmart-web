import { SidebarProvider } from "@/context/SidebarContext";
import AppSidebar from "@/layout/AppSidebar";
import AccountPage from "./index";
import styles from "./page.module.scss";

export default function AccountRoute() {
  return (
    <SidebarProvider>
      <div className={styles.accountLayout}>
        <AppSidebar />
        <main className={styles.accountContent}>
          <AccountPage />
        </main>
      </div>
    </SidebarProvider>
  );
}
