"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";

/**
 * Props for the `StaffStarRating` component.
 */
export type StaffStarRatingProps = {
  /**
   * Staff profile id used to call the rating API.
   */
  staffId: string;

  /**
   * The user's existing rating (if any).
   */
  initialRating: number | null;
};

type SaveState = "idle" | "saving" | "success" | "error";

const STAR_COUNT = 5;

/**
 * Interactive star rating control (1-5 stars) for staff profiles.
 *
 * When logged out, shows "Login to rate".
 *
 * @param props - Component props.
 * @param props.staffId - Staff profile id used for rating submissions.
 * @param props.initialRating - Existing user rating, if present.
 * @returns Staff star rating UI.
 */
export default function StaffStarRating({
  staffId,
  initialRating,
}: StaffStarRatingProps) {
  const { status } = useSession();

  const [selectedRating, setSelectedRating] = useState<number | null>(
    initialRating,
  );
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const activeRating = useMemo(
    () => hoverRating ?? selectedRating ?? 0,
    [hoverRating, selectedRating],
  );

  const isSaving = saveState === "saving";
  const isAuthenticated = status === "authenticated";

  const saveRating = async (rating: number) => {
    if (!isAuthenticated) return;

    const previous = selectedRating;
    setSelectedRating(rating);
    setSaveState("saving");
    setMessage(null);

    try {
      const response = await fetch(`/api/staff/${staffId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        setSelectedRating(previous);
        setSaveState("error");
        setMessage("Unable to save rating. Please try again.");
        return;
      }

      const json = (await response.json()) as unknown;
      if (
        typeof json === "object" &&
        json !== null &&
        "userRating" in json &&
        typeof (json as { userRating: unknown }).userRating === "number"
      ) {
        setSelectedRating((json as { userRating: number }).userRating);
      }

      setSaveState("success");
      setMessage("Rating saved.");
    } catch {
      setSelectedRating(previous);
      setSaveState("error");
      setMessage("Unable to save rating. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return <p className="mt-2 text-sm text-muted-foreground">Login to rate</p>;
  }

  return (
    <fieldset className="mt-2">
      <legend className="sr-only">Rate this staff member</legend>
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Rate this staff member"
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => {
          const ratingValue = index + 1;
          const filled = ratingValue <= activeRating;

          return (
            <button
              key={ratingValue}
              type="button"
              className="rounded-sm p-1 disabled:cursor-not-allowed"
              aria-label={`Rate ${ratingValue} out of ${STAR_COUNT}`}
              aria-pressed={ratingValue === (selectedRating ?? 0)}
              disabled={isSaving}
              onMouseEnter={() => setHoverRating(ratingValue)}
              onMouseLeave={() => setHoverRating(null)}
              onFocus={() => setHoverRating(ratingValue)}
              onBlur={() => setHoverRating(null)}
              onClick={() => void saveRating(ratingValue)}
            >
              <Star
                className={
                  filled
                    ? "h-5 w-5 fill-primary text-primary"
                    : "h-5 w-5 text-muted-foreground"
                }
              />
            </button>
          );
        })}
      </div>

      {selectedRating !== null ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Your rating: <span className="font-medium">{selectedRating}/5</span>
        </p>
      ) : null}

      {message ? (
        <p
          className={
            saveState === "error"
              ? "mt-2 text-sm text-destructive"
              : "mt-2 text-sm text-muted-foreground"
          }
          role={saveState === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </fieldset>
  );
}
