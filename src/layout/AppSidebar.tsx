"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import styles from "./AppSidebar.module.scss";

type NavItem = {
  name: string;
  path: string;
  shortLabel: string;
};

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    shortLabel: "DB",
  },
  {
    name: "My Points",
    path: "/my-points",
    shortLabel: "MP",
  },
  {
    name: "Rewards",
    path: "/rewards",
    shortLabel: "RW",
  },
  {
    name: "User Profile",
    path: "/profile",
    shortLabel: "UP",
  },
];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleSidebar,
    toggleMobileSidebar,
  } = useSidebar();
  const pathname = usePathname();
  const isOpen = isExpanded || isHovered || isMobileOpen;

  const renderMenuItems = (items: NavItem[]) => (
    <ul className={styles.menuList}>
      {items.map((nav) => (
        <li key={nav.name}>
          <Link
            href={nav.path}
            className={`${styles.menuItem} ${
              isActive(nav.path) ? styles.menuItemActive : ""
            }`}
            onClick={() => {
              if (isMobileOpen) {
                toggleMobileSidebar();
              }
            }}
          >
            <span className={styles.shortLabel}>{nav.shortLabel}</span>
            {isOpen && (
              <span className={styles.menuText}>{nav.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  return (
    <>
      <button
        className={styles.mobileToggle}
        type="button"
        onClick={toggleMobileSidebar}
      >
        Menu
      </button>

      <aside
      className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarCollapsed} ${
        isMobileOpen ? styles.sidebarMobileOpen : ""
      }`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.topRow}>
        {isOpen ? <h2>Trasmart</h2> : <h2>TM</h2>}
        <button className={styles.collapseBtn} type="button" onClick={toggleSidebar}>
          {isExpanded ? "<" : ">"}
        </button>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatar}>A</div>
        {isOpen && (
          <div>
            <p className={styles.profileName}>Aryok</p>
            <p className={styles.profileEmail}>example@mail.com</p>
          </div>
        )}
      </div>

      <nav className={styles.navSection}>
        {isOpen && <p className={styles.sectionLabel}>Menu</p>}
        {renderMenuItems(navItems)}
      </nav>

      <div className={styles.footerHint}>
        {isOpen ? "Sort your waste, save the planet." : "Eco"}
      </div>
      </aside>
    </>
  );
};

export default AppSidebar;
