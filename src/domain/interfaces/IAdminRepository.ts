import type { CreateBlogPostData } from "../dtos/CreateBlogPostData";
import type { BlogPostDto } from "../dtos/BlogPostDto";
import type { CreateBarData } from "../dtos/CreateBarData";
import type { BarDto } from "../dtos/BarDto";
import type { AdminBarListItemDto } from "../dtos/AdminBarListItemDto";
import type { AdminBlogPostListItemDto } from "../dtos/AdminBlogPostListItemDto";
import type { AdminOverviewStatsDto } from "../dtos/AdminOverviewStatsDto";
import type { AdminReviewListItemDto } from "../dtos/AdminReviewListItemDto";
import type { AdminStaffProfileListItemDto } from "../dtos/AdminStaffProfileListItemDto";
import type { AdminUserListItemDto } from "../dtos/AdminUserListItemDto";
import type { UserRole } from "../dtos/UserRole";
import type { CreateEventData } from "../dtos/CreateEventData";
import type { EventDto } from "../dtos/EventDto";
import type { CreateStaffProfileData } from "../dtos/CreateStaffProfileData";
import type { StaffProfileDto } from "../dtos/StaffProfileDto";

/**
 * Admin repository contract.
 */
export interface IAdminRepository {
  /**
   * Creates a new blog post as admin.
   * @param adminId - Admin performing the action.
   * @param data - Blog post creation data.
   */
  createBlogPost(adminId: string, data: CreateBlogPostData): Promise<BlogPostDto>;
  /**
   * Creates a new bar as admin.
   * @param adminId - Admin performing the action.
   * @param data - Bar creation data.
   */
  createBar(adminId: string, data: CreateBarData): Promise<BarDto>;
  /**
   * Creates a new event as admin.
   */
  createEvent(adminId: string, data: CreateEventData): Promise<EventDto>;
  /**
   * Creates a new staff profile as admin.
   */
  createStaffProfile(adminId: string, data: CreateStaffProfileData): Promise<StaffProfileDto>;
  /**
   * Gets admin dashboard overview stats.
   */
  getOverviewStats(): Promise<AdminOverviewStatsDto>;

  /**
   * Lists all bars (approved and pending).
   */
  listBars(): Promise<AdminBarListItemDto[]>;

  /**
   * Approves or rejects a bar.
   * @param adminId - Admin performing the action.
   * @param barId - Bar id.
   * @param approved - Approval state.
   */
  setBarApproval(
    adminId: string,
    barId: string,
    approved: boolean,
  ): Promise<boolean>;

  /**
   * Soft deletes a bar.
   */
  deleteBar(adminId: string, barId: string): Promise<boolean>;

  /**
   * Lists all reviews.
   */
  listReviews(): Promise<AdminReviewListItemDto[]>;

  /**
   * Approves or rejects a review.
   */
  setReviewApproval(
    adminId: string,
    reviewId: string,
    approved: boolean,
  ): Promise<boolean>;

  /**
   * Soft deletes a review.
   */
  deleteReview(adminId: string, reviewId: string): Promise<boolean>;

  /**
   * Lists all users.
   */
  listUsers(): Promise<AdminUserListItemDto[]>;

  /**
   * Updates a user's role.
   */
  setUserRole(
    adminId: string,
    userId: string,
    role: UserRole,
  ): Promise<boolean>;

  /**
   * Soft deletes a user.
   */
  deleteUser(adminId: string, userId: string): Promise<boolean>;

  /**
   * Lists all blog posts.
   */
  listBlogPosts(): Promise<AdminBlogPostListItemDto[]>;

  /**
   * Publishes or unpublishes a blog post.
   */
  setBlogPublish(
    adminId: string,
    postId: string,
    published: boolean,
  ): Promise<boolean>;

  /**
   * Soft deletes a blog post.
   */
  deleteBlogPost(adminId: string, postId: string): Promise<boolean>;

  /**
   * Lists all staff profiles.
   */
  listStaffProfiles(): Promise<AdminStaffProfileListItemDto[]>;

  /**
   * Approves or rejects a staff profile.
   */
  setStaffApproval(
    adminId: string,
    staffProfileId: string,
    approved: boolean,
  ): Promise<boolean>;

  /**
   * Soft deletes a staff profile.
   */
  deleteStaffProfile(adminId: string, staffProfileId: string): Promise<boolean>;

  /**
   * Valid roles that can be assigned via admin UI.
   */
  listAssignableRoles(): Promise<UserRole[]>;
}
