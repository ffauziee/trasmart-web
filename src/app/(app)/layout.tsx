"use client";

import React, { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import styles from "./pages.module.scss";

const AppSidebar = dynamic(() => import("@/components/layout/AppSidebar"), {
  ssr: false,
  loading: () => <div className={styles.sidebarLoading} />,
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || error)) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, loading, error, router]);

  if (loading) {
    return (
      <div className={styles.pagesLayout}>
        <div className={styles.loadingPage}>
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || error) {
    return (
      <div className={styles.pagesLayout}>
        <div className={styles.loadingPage}>
          <p>Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className={styles.pagesLayout}>
        <Suspense fallback={<div className={styles.sidebarLoading} />}>
          <AppSidebar />
        </Suspense>
        <main className={styles.pagesContent}>{children}</main>
      </div>
    </SidebarProvider>
  );
}

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AuthGuard>{children}</AuthGuard>
    </UserProvider>
  );
}