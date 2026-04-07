"use client";

import * as React from "react";

/**
 * Props for the `RevealOnScroll` component.
 */
export type RevealOnScrollProps = {
  /**
   * Content to reveal.
   */
  children: React.ReactNode;

  /**
   * Optional additional class names.
   */
  className?: string;
};

/**
 * Reveals content with a CSS-driven fade/slide when it enters the viewport.
 *
 * This uses IntersectionObserver for performance and toggles `data-revealed`.
 * Animation is handled purely by CSS.
 *
 * @param props Component props.
 * @returns Wrapped content that reveals on scroll.
 */
export const RevealOnScroll = ({
  children,
  className,
}: RevealOnScrollProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          element.dataset.revealed = "true";
          observer.disconnect();
          break;
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `ppbn-reveal ${className}` : "ppbn-reveal"}
      data-revealed="false"
    >
      {children}
    </div>
  );
};
