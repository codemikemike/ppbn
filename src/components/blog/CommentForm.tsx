"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Props for the `CommentForm` component.
 */
export type CommentFormProps = {
  /**
   * Blog post slug used to call the comments API.
   */
  slug: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const MIN_COMMENT_LENGTH = 5;

/**
 * Comment form for published blog posts.
 *
 * When logged out, shows "Login to comment".
 *
 * @param props - Component props.
 * @param props.slug - Blog post slug.
 * @returns Comment form UI.
 */
export default function CommentForm({ slug }: CommentFormProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [content, setContent] = useState<string>("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const isSubmitting = submitState === "submitting";

  const submit = async () => {
    if (!isAuthenticated) return;

    const trimmed = content.trim();
    if (trimmed.length < MIN_COMMENT_LENGTH) {
      setSubmitState("error");
      setFeedback(`Comment must be at least ${MIN_COMMENT_LENGTH} characters.`);
      return;
    }

    setSubmitState("submitting");
    setFeedback(null);

    try {
      const response = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimmed }),
      });

      if (!response.ok) {
        setSubmitState("error");
        setFeedback("Unable to submit comment. Please try again.");
        return;
      }

      setContent("");
      setSubmitState("success");
      setFeedback("Comment submitted.");
    } catch {
      setSubmitState("error");
      setFeedback("Unable to submit comment. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">Login to comment</p>
    );
  }

  return (
    <form
      className="mt-4 space-y-3"
      aria-label="Add a comment"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <div>
        <Label htmlFor="comment-content">Comment</Label>
        <textarea
          id="comment-content"
          className={cn(
            "mt-2 min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30",
          )}
          value={content}
          minLength={MIN_COMMENT_LENGTH}
          disabled={isSubmitting}
          placeholder="Write your comment"
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>

      {feedback ? (
        <p
          className={
            submitState === "error"
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
          role={submitState === "error" ? "alert" : "status"}
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
