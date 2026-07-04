"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MapPinIcon } from "@/components/MapPinIcon";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/resources", label: "Resource Directory" },
  { href: "/how-it-works", label: "How It Works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/40 bg-white/60 px-6 py-3 shadow-md shadow-eucalyptus/5 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="group flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
        >
          <MapPinIcon className="h-7 w-7 shrink-0 drop-shadow-[0_0_6px_var(--glow-dusty-rose)] transition-[filter] duration-500 ease-out group-hover:animate-pin-bounce group-hover:drop-shadow-[0_0_14px_var(--glow-dusty-rose-strong)]" />
          Project Resource Map
        </Link>

        <ul className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.href} link={link} pathname={pathname} />
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-eucalyptus/10 sm:hidden"
        >
          {isOpen ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </button>
      </nav>

      {isOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-white/40 bg-white/60 p-2 shadow-lg shadow-eucalyptus/5 backdrop-blur-2xl sm:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-eucalyptus/10 hover:text-foreground ${
                      isActive
                        ? "bg-eucalyptus/10 text-eucalyptus"
                        : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}

function NavItem({
  link,
  pathname,
}: {
  link: (typeof NAV_LINKS)[number];
  pathname: string;
}) {
  const isActive = pathname === link.href;

  return (
    <li>
      <Link
        href={link.href}
        className="group relative inline-block py-1 text-sm font-medium text-foreground/80 transition-all duration-300 hover:-translate-y-0.5 hover:text-foreground"
      >
        {link.label}
        <span
          className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-dusty-rose transition-transform duration-300 ease-out group-hover:scale-x-100 ${
            isActive ? "scale-x-100" : ""
          }`}
        />
      </Link>
    </li>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  );
}
