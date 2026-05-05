"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { UserProvider } from "@/contexts/UserContext";
import styles from "./pages.module.scss";

const AppSidebar = dynamic(() => import("@/components/layout/AppSidebar"), {
  ssr: false,
  loading: () => <div className={styles.sidebarLoading} />,
});

interface PagesLayoutProps {
  children: React.ReactNode;
}

export default function PagesLayout({ children }: PagesLayoutProps) {
  return (
    <UserProvider>
      <SidebarProvider>
        <div className={styles.pagesLayout}>
          <Suspense fallback={<div className={styles.sidebarLoading} />}>
            <AppSidebar />
          </Suspense>
          <main className={styles.pagesContent}>{children}</main>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}