"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.scss";

const ITEMS = [
  { href: "/", label: "Board", icon: "🏆" },
  { href: "/bracket", label: "Bracket", icon: "🗂️" },
  { href: "/predict", label: "Predict", icon: "⚽" },
  { href: "/admin", label: "Admin", icon: "🛠️" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.link} ${pathname === item.href ? styles.active : ""}`}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
