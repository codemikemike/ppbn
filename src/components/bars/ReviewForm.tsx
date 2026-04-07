"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export type ReviewFormProps = {
  /**
   * Bar slug used to call the reviews API.
   */
  barSlug: string;
};

type SaveState = "idle" | "saving" | "success" | "error";

const STAR_COUNT = 5;

/**
 * Review submission form for a bar.
 *
 * Only renders the form for logged-in users.
 *
 * @param props - Component props.
 * @param props.barSlug - Bar slug used for review submission.
 * @returns Review form UI or a login prompt.
 */
export default function ReviewForm({ barSlug }: ReviewFormProps) {
  const { status } = useSession();

  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const activeRating = useMemo(
    () => hoverRating ?? rating ?? 0,
    [hoverRating, rating],
  );

  const canSubmit = rating !== null && comment.trim().length >= 10;
  const isSaving = saveState === "saving";

  const submit = async () => {
    if (!canSubmit || rating === null) return;

    setSaveState("saving");
    setMessage(null);

    try {
      const response = await fetch(`/api/bars/${barSlug}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        setSaveState("error");
        setMessage("Unable to submit review. Please try again.");
        return;
      }

      setSaveState("success");
      setMessage("Review submitted.");
      setRating(null);
      setHoverRating(null);
      setComment("");
    } catch {
      setSaveState("error");
      setMessage("Unable to submit review. Please try again.");
    }
  };

  if (status !== "authenticated") {
    return (
      <section aria-label="Leave a review" className="mt-6">
        <h3 className="text-sm font-medium">Leave a review</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Login to leave a review
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Leave a review" className="mt-6">
      <h3 className="text-sm font-medium">Leave a review</h3>

      <form
        className="mt-3 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <fieldset>
          <legend className="sr-only">Rating</legend>
          <Label>Rating</Label>
          <div className="mt-2 flex items-center gap-1" role="radiogroup">
            {Array.from({ length: STAR_COUNT }, (_, index) => {
              const value = index + 1;
              const filled = value <= activeRating;
              return (
                <button
                  key={value}
                  type="button"
                  className="rounded-sm p-1 disabled:cursor-not-allowed"
                  aria-label={`Rate ${value} out of ${STAR_COUNT}`}
                  disabled={isSaving}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(null)}
                  onFocus={() => setHoverRating(value)}
                  onBlur={() => setHoverRating(null)}
                  onClick={() => setRating(value)}
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

          {rating !== null ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected: <span className="font-medium">{rating}/5</span>
            </p>
          ) : null}
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="review-comment">Comment</Label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Write at least 10 characters..."
            disabled={isSaving}
          />
          <p className="text-xs text-muted-foreground">
            {comment.trim().length}/10 minimum
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={!canSubmit || isSaving}>
            Submit review
          </Button>
          {message ? (
            <p
              className={
                saveState === "error"
                  ? "text-sm text-destructive"
                  : "text-sm text-muted-foreground"
              }
              role={saveState === "error" ? "alert" : "status"}
            >
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
