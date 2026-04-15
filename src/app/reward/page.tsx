import { SidebarProvider } from "@/context/SidebarContext";
import AppSidebar from "@/layout/AppSidebar";
import RewardPage from "./index";
import styles from "./page.module.scss";

export default function RewardRoute() {
  return (
    <SidebarProvider>
      <div className={styles.rewardLayout}>
        <AppSidebar />
        <main className={styles.rewardContent}>
          <RewardPage />
        </main>
      </div>
    </SidebarProvider>
  );
}
