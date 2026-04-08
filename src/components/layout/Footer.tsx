import Link from "next/link";

/**
 * Shared site footer with consistent PPBN navigation.
 *
 * @returns The global footer.
 */
export const Footer = () => {
  return (
    <footer className="border-t border-border/70 bg-background/95">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          © 2026 Phnom Penh By Night
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.22em]"
        >
          <Link
            href="/bars"
            className="text-muted-foreground transition hover:text-white"
          >
            Bars
          </Link>
          <Link
            href="/blog"
            className="text-muted-foreground transition hover:text-white"
          >
            Blog
          </Link>
          <Link
            href="/staff"
            className="text-muted-foreground transition hover:text-white"
          >
            Staff
          </Link>
          <Link
            href="/events"
            className="text-muted-foreground transition hover:text-white"
          >
            Events
          </Link>
        </nav>
      </div>
    </footer>
  );
};
