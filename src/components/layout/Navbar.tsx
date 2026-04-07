"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/bars", label: "Bars" },
  { href: "/blog", label: "Blog" },
  { href: "/staff", label: "Staff" },
  { href: "/events", label: "Events" },
] as const;

/**
 * Global site navigation bar.
 *
 * - Shows primary navigation links.
 * - Shows Login when logged out.
 * - Shows username + Logout when logged in.
 */
export const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (status === "loading") return null;

  const username = session?.user?.name ?? session?.user?.email;

  const handleLogout = async (): Promise<void> => {
    await signOut({ callbackUrl: "/" });
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 ppbn-glass">
      <nav
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3"
        aria-label="Main"
      >
        <Link href="/" className="ppbn-logo" aria-label="Phnom Penh By Night">
          PHNOM PENH BY NIGHT
        </Link>

        <div className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive ? "ppbn-navlink ppbn-navlink-active" : "ppbn-navlink"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex" aria-label="Account">
          {status === "authenticated" ? (
            <>
              <span className="text-sm text-muted-foreground">{username}</span>
              <Button
                className="ppbn-button"
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button className="ppbn-button" variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <button
            type="button"
            className="ppbn-hamburger"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            data-open={isMobileMenuOpen ? "true" : "false"}
          >
            <span className="ppbn-hamburger-line" />
            <span className="ppbn-hamburger-line" />
            <span className="ppbn-hamburger-line" />
          </button>
        </div>
      </nav>

      <div
        className={
          isMobileMenuOpen
            ? "ppbn-mobilemenu ppbn-mobilemenu-open md:hidden"
            : "ppbn-mobilemenu md:hidden"
        }
      >
        <div className="mx-auto w-full max-w-6xl px-4 pb-4">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? "ppbn-navlink ppbn-navlink-active"
                      : "ppbn-navlink"
                  }
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-2 border-t border-border/60 pt-3">
              {status === "authenticated" ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {username}
                  </span>
                  <Button
                    className="ppbn-button"
                    variant="outline"
                    onClick={async () => {
                      closeMobileMenu();
                      await handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  className="ppbn-button"
                  variant="outline"
                  asChild
                  onClick={closeMobileMenu}
                >
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
