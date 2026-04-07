import type { IAdminRepository } from "@/domain/interfaces/IAdminRepository";
import type { AdminBarListItemDto } from "@/domain/dtos/AdminBarListItemDto";
import type { AdminBlogPostListItemDto } from "@/domain/dtos/AdminBlogPostListItemDto";
import type { AdminOverviewStatsDto } from "@/domain/dtos/AdminOverviewStatsDto";
import type { AdminReviewListItemDto } from "@/domain/dtos/AdminReviewListItemDto";
import type { AdminStaffProfileListItemDto } from "@/domain/dtos/AdminStaffProfileListItemDto";
import type { AdminUserListItemDto } from "@/domain/dtos/AdminUserListItemDto";
import type { UserRole } from "@/domain/dtos/UserRole";
import {
  approveSchema,
  publishSchema,
  updateUserRoleSchema,
} from "@/domain/validations/adminSchema";
import { NotFoundError, ValidationError } from "@/domain/errors/DomainErrors";
import { adminRepository } from "@/repositories/adminRepository";

/**
 * Admin service contract.
 */
export type AdminService = {
  getOverviewStats: () => Promise<AdminOverviewStatsDto>;

  listBars: () => Promise<AdminBarListItemDto[]>;
  setBarApproval: (
    adminId: string,
    barId: string,
    input: { approved: boolean },
  ) => Promise<void>;
  deleteBar: (adminId: string, barId: string) => Promise<void>;

  listReviews: () => Promise<AdminReviewListItemDto[]>;
  setReviewApproval: (
    adminId: string,
    reviewId: string,
    input: { approved: boolean },
  ) => Promise<void>;
  deleteReview: (adminId: string, reviewId: string) => Promise<void>;

  listUsers: () => Promise<AdminUserListItemDto[]>;
  setUserRole: (
    adminId: string,
    userId: string,
    input: { role: UserRole },
  ) => Promise<void>;
  deleteUser: (adminId: string, userId: string) => Promise<void>;
  listAssignableRoles: () => Promise<UserRole[]>;

  listBlogPosts: () => Promise<AdminBlogPostListItemDto[]>;
  setBlogPublish: (
    adminId: string,
    postId: string,
    input: { published: boolean },
  ) => Promise<void>;
  deleteBlogPost: (adminId: string, postId: string) => Promise<void>;

  listStaffProfiles: () => Promise<AdminStaffProfileListItemDto[]>;
  setStaffApproval: (
    adminId: string,
    staffProfileId: string,
    input: { approved: boolean },
  ) => Promise<void>;
  deleteStaffProfile: (
    adminId: string,
    staffProfileId: string,
  ) => Promise<void>;
};

/**
 * Creates an admin service using the given repository.
 * @param repo - Repository implementation.
 */
export const createAdminService = (repo: IAdminRepository): AdminService => ({
  getOverviewStats: async () => repo.getOverviewStats(),

  listBars: async () => repo.listBars(),
  setBarApproval: async (adminId: string, barId: string, input) => {
    const validationResult = approveSchema.safeParse(input);
    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const ok = await repo.setBarApproval(
      adminId,
      barId,
      validationResult.data.approved,
    );
    if (!ok) throw new NotFoundError("Bar not found");
  },
  deleteBar: async (adminId: string, barId: string) => {
    const ok = await repo.deleteBar(adminId, barId);
    if (!ok) throw new NotFoundError("Bar not found");
  },

  listReviews: async () => repo.listReviews(),
  setReviewApproval: async (adminId: string, reviewId: string, input) => {
    const validationResult = approveSchema.safeParse(input);
    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const ok = await repo.setReviewApproval(
      adminId,
      reviewId,
      validationResult.data.approved,
    );
    if (!ok) throw new NotFoundError("Review not found");
  },
  deleteReview: async (adminId: string, reviewId: string) => {
    const ok = await repo.deleteReview(adminId, reviewId);
    if (!ok) throw new NotFoundError("Review not found");
  },

  listUsers: async () => repo.listUsers(),
  setUserRole: async (adminId: string, userId: string, input) => {
    const validationResult = updateUserRoleSchema.safeParse(input);
    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const ok = await repo.setUserRole(
      adminId,
      userId,
      validationResult.data.role,
    );
    if (!ok) throw new NotFoundError("User not found");
  },
  deleteUser: async (adminId: string, userId: string) => {
    const ok = await repo.deleteUser(adminId, userId);
    if (!ok) throw new NotFoundError("User not found");
  },
  listAssignableRoles: async () => repo.listAssignableRoles(),

  listBlogPosts: async () => repo.listBlogPosts(),
  setBlogPublish: async (adminId: string, postId: string, input) => {
    const validationResult = publishSchema.safeParse(input);
    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const ok = await repo.setBlogPublish(
      adminId,
      postId,
      validationResult.data.published,
    );
    if (!ok) throw new NotFoundError("Blog post not found");
  },
  deleteBlogPost: async (adminId: string, postId: string) => {
    const ok = await repo.deleteBlogPost(adminId, postId);
    if (!ok) throw new NotFoundError("Blog post not found");
  },

  listStaffProfiles: async () => repo.listStaffProfiles(),
  setStaffApproval: async (adminId: string, staffProfileId: string, input) => {
    const validationResult = approveSchema.safeParse(input);
    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const ok = await repo.setStaffApproval(
      adminId,
      staffProfileId,
      validationResult.data.approved,
    );
    if (!ok) throw new NotFoundError("Staff profile not found");
  },
  deleteStaffProfile: async (adminId: string, staffProfileId: string) => {
    const ok = await repo.deleteStaffProfile(adminId, staffProfileId);
    if (!ok) throw new NotFoundError("Staff profile not found");
  },
});

/**
 * Default admin service singleton.
 */
export const adminService = createAdminService(adminRepository);
