/**
 * DTO representing a published blog comment.
 */
export type CommentDto = {
  /**
   * Comment id.
   */
  id: string;

  /**
   * Comment content.
   */
  content: string;

  /**
   * Comment author display name.
   */
  authorName: string | null;

  /**
   * When the comment was created.
   */
  createdAt: Date;
};
