"use client";

import dynamic from "next/dynamic";

const NotificationBell = dynamic(
  () => import("@/components/layout/NotificationBell"),
  { ssr: false, loading: () => <div style={{ width: 44, height: 44 }} /> },
);

export default function DashboardNotificationBellWrapper({
  buttonClassName,
  badgeClassName,
}: {
  buttonClassName: string;
  badgeClassName: string;
}) {
  return (
    <NotificationBell
      buttonClassName={buttonClassName}
      badgeClassName={badgeClassName}
    />
  );
}
