"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CalendarPopover } from "@/components/layout/CalendarPopover";
import { LiveClock } from "@/components/layout/LiveClock";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { primaryNav, secondaryNav } from "@/lib/site";
import { cn } from "@/lib/utils";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

function MobileMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, []);

  return (
    <dialog ref={ref} aria-label="Site menu" onClose={onClose} className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-bg text-ink backdrop:bg-transparent">
      <div className="container-page flex h-full flex-col overflow-y-auto py-4">
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl">Menu</span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid size-11 place-items-center rounded-full border border-line">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-4 flex-1">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link href={item.href} onClick={onClose} aria-current={isActive(pathname, item.href) ? "page" : undefined} className={cn("block py-3 font-serif text-2xl", isActive(pathname, item.href) && "text-primary")}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-4 grid grid-cols-2 gap-x-4">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={onClose} className="block py-2 text-ink-2">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-between border-t border-line py-4">
          <span className="text-sm text-muted">Calendar</span>
          <CalendarPopover up />
        </div>
        <div className="flex items-center justify-between py-5">
          <span className="text-sm text-muted">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </dialog>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="DeveloperBro, home">
          <LogoMark className="size-8 transition-transform duration-200 group-hover:-rotate-3" />
          <Wordmark className="font-serif text-xl tracking-tight" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex xl:gap-6">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 min-[400px]:flex">
            <LiveClock className="flex" />
            <span className="hidden sm:block">
              <CalendarPopover />
            </span>
          </div>
          <GlobalSearch />
          <div className="hidden lg:block"><ThemeToggle /></div>
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="grid size-10 place-items-center rounded-full border border-line lg:hidden">
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      {menuOpen && <MobileMenu pathname={pathname} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
