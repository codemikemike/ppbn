import type { CommentDto } from "@/domain/dtos/CommentDto";

/**
 * Props for the `CommentList` component.
 */
export type CommentListProps = {
  /**
   * Approved comments to render.
   */
  comments: CommentDto[];
};

const formatCommentDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

/**
 * Renders a list of approved blog comments.
 *
 * Each comment uses semantic HTML via an `<article>` and `<time>` element.
 *
 * @param props - Component props.
 * @param props.comments - Approved comments.
 * @returns Comment list UI.
 */
export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">No comments yet.</p>
    );
  }

  return (
    <div className="mt-3 space-y-4" aria-label="Comments">
      {comments.map((comment) => (
        <article key={comment.id} className="rounded-md border p-4">
          <header className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium">
              {comment.authorName ?? "Anonymous"}
            </p>
            <time
              className="text-xs text-muted-foreground"
              dateTime={comment.createdAt.toISOString()}
            >
              {formatCommentDate(comment.createdAt)}
            </time>
          </header>
          <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
            {comment.content}
          </p>
        </article>
      ))}
    </div>
  );
}
