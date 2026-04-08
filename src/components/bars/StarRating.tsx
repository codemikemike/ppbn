"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";

/**
 * Props for the `StarRating` component.
 */
export type StarRatingProps = {
  /**
   * Bar slug used to call the rating API.
   */
  barSlug: string;

  /**
   * The user's existing rating (if any).
   */
  initialRating: number | null;
};

type SaveState = "idle" | "saving" | "success" | "error";

const STAR_COUNT = 5;

/**
 * Interactive star rating control (1-5 stars).
 *
 * @param props - Component props.
 * @param props.barSlug - Bar slug used for rating submissions.
 * @param props.initialRating - Existing user rating, if present.
 * @returns Star rating UI with success/error feedback.
 */
export default function StarRating({
  barSlug,
  initialRating,
}: StarRatingProps) {
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

  const saveRating = async (rating: number) => {
    const previous = selectedRating;
    setSelectedRating(rating);
    setSaveState("saving");
    setMessage(null);

    try {
      const response = await fetch(`/api/bars/${barSlug}/rate`, {
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

      setSaveState("success");
      setMessage("Rating saved.");
    } catch {
      setSelectedRating(previous);
      setSaveState("error");
      setMessage("Unable to save rating. Please try again.");
    }
  };

  return (
    <fieldset className="mt-2">
      <legend className="sr-only">Rate this bar</legend>
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Rate this bar"
      >
        {Array.from({ length: STAR_COUNT }, (_, index) => {
          const ratingValue = index + 1;
          const filled = ratingValue <= activeRating;

          return (
            <button
              key={ratingValue}
              type="button"
              className="ppbn-button rounded-sm p-1 disabled:cursor-not-allowed"
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
                    ? "h-5 w-5 text-[#d4af37] fill-[#d4af37] transition-transform"
                    : "h-5 w-5 text-[#444]"
                }
                style={filled ? { color: '#d4af37', fill: '#d4af37' } : { color: '#444' }}
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
