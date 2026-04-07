"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Props for the FavoriteButton component.
 */
export type FavoriteButtonProps = {
  /**
   * Bar slug used to call the favorite toggle API.
   */
  barSlug: string;

  /**
   * Initial favorite state when the component mounts.
   */
  initialIsFavorited: boolean;
};

/**
 * Heart icon button that toggles whether a bar is favorited.
 *
 * Uses optimistic UI updates and requires authentication.
 * When logged out, the button is disabled and shows a tooltip.
 *
 * @param props - Component props.
 * @param props.barSlug - Bar slug used for toggling.
 * @param props.initialIsFavorited - Initial favorited state.
 * @returns Favorite toggle button.
 */
export default function FavoriteButton({
  barSlug,
  initialIsFavorited,
}: FavoriteButtonProps) {
  const { status } = useSession();

  const [isFavorited, setIsFavorited] = useState<boolean>(initialIsFavorited);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const isAuthenticated = status === "authenticated";

  const toggle = async () => {
    if (!isAuthenticated || isSaving) return;

    const previous = isFavorited;
    const next = !previous;

    setIsFavorited(next);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/bars/${barSlug}/favorite`, {
        method: "POST",
      });

      if (!response.ok) {
        setIsFavorited(previous);
        return;
      }

      const json = (await response.json()) as unknown;
      if (
        typeof json === "object" &&
        json !== null &&
        "isFavorited" in json &&
        typeof (json as { isFavorited: unknown }).isFavorited === "boolean"
      ) {
        setIsFavorited((json as { isFavorited: boolean }).isFavorited);
      }
    } catch {
      setIsFavorited(previous);
    } finally {
      setIsSaving(false);
    }
  };

  const title = isAuthenticated
    ? "Save to favorites"
    : "Login to save favorites";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => {
        void toggle();
      }}
      disabled={!isAuthenticated || isSaving}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      title={title}
    >
      <Heart
        className={
          isFavorited
            ? "h-5 w-5 fill-primary text-primary"
            : "h-5 w-5 text-muted-foreground"
        }
      />
    </Button>
  );
}
