"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// TODO: 본인 정보로 교체
const SITE_NAME = "Archive Hanyi Kim";

type NavItem = { href: string; label: string; activePrefixes?: string[] };

const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

const EXTERNAL_LINKS = [
  { href: "https://github.com/your-id", label: "GitHub" },
  { href: "https://instagram.com/your_account", label: "Instagram" },
];

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") return pathname === "/";
  return (item.activePrefixes ?? [item.href]).some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="font-bold tracking-tight">
          {SITE_NAME}
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <nav className="flex gap-5">
            {NAV.map((item) => {
              const active = isActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "font-semibold text-gray-900"
                      : "text-gray-500 transition hover:text-gray-900"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <ul className="hidden items-center gap-4 border-l border-gray-200 pl-6 sm:flex">
            {EXTERNAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition hover:text-gray-900"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}   