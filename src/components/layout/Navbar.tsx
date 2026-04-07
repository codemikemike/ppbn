"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";

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

  if (status === "loading") return null;

  const username = session?.user?.name ?? session?.user?.email;

  const handleLogout = async (): Promise<void> => {
    await signOut({ callbackUrl: "/" });
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="border-b">
      <nav
        className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3"
        aria-label="Main"
      >
        <Link href="/" className="text-sm font-semibold">
          Phnom Penh By Night
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {status === "authenticated" ? (
            <>
              <span className="text-sm text-muted-foreground">{username}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {isMobileMenuOpen ? (
        <div className="border-t md:hidden">
          <div className="mx-auto w-full max-w-5xl px-4 py-3">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  asChild
                  className="justify-start"
                  onClick={closeMobileMenu}
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}

              <div className="mt-2 border-t pt-3">
                {status === "authenticated" ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      {username}
                    </span>
                    <Button
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
                    variant="outline"
                    asChild
                    onClick={closeMobileMenu}
                    className="justify-start"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};
