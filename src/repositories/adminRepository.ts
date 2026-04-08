import { db } from "@/lib/db";
import type { AdminBarListItemDto } from "@/domain/dtos/AdminBarListItemDto";
import type { AdminBlogPostListItemDto } from "@/domain/dtos/AdminBlogPostListItemDto";
import type { AdminOverviewStatsDto } from "@/domain/dtos/AdminOverviewStatsDto";
import type { AdminReviewListItemDto } from "@/domain/dtos/AdminReviewListItemDto";
import type { AdminStaffProfileListItemDto } from "@/domain/dtos/AdminStaffProfileListItemDto";
import type { AdminUserListItemDto } from "@/domain/dtos/AdminUserListItemDto";
import type { BarArea } from "@/domain/dtos/BarArea";
import type { BarCategory } from "@/domain/dtos/BarCategory";
import type { UserRole } from "@/domain/dtos/UserRole";
import type { IAdminRepository } from "@/domain/interfaces/IAdminRepository";
import type { CreateBlogPostData } from "@/domain/dtos/CreateBlogPostData";
import type { BlogPostDto } from "@/domain/dtos/BlogPostDto";
import type { CreateBarData } from "@/domain/dtos/CreateBarData";
import type { BarDto } from "@/domain/dtos/BarDto";
import type { CreateEventData } from "@/domain/dtos/CreateEventData";
import type { EventDto, EventType } from "@/domain/dtos/EventDto";
import type { CreateStaffProfileData } from "@/domain/dtos/CreateStaffProfileData";
import type { StaffProfileDto } from "@/domain/dtos/StaffProfileDto";

/**
 * Admin repository backed by Prisma.
 */
export const adminRepository: IAdminRepository = {
  /**
   * Creates a new blog post as admin.
   */
  async createBlogPost(adminId: string, data: CreateBlogPostData): Promise<BlogPostDto> {
    // Generate slug from title (simple kebab-case)
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const post = await db.blogPost.create({
      data: {
        slug,

        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        tags:
          data.tags && Array.isArray(data.tags) && data.tags.length > 0
            ? data.tags.join(",")
            : null,
        coverImageUrl: data.imageUrl || null,
        isPublished: false,
        authorId: adminId,
        createdBy: adminId,
        updatedBy: adminId,
      },
    });
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      authorName: null, // Not resolved here
      publishedAt: post.publishedAt ?? new Date(),
      category: null,
      tags: post.tags
        ? post.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      imageUrl: post.coverImageUrl,
    };
  },
  /**
   * Creates a new bar as admin.
   */
  async createBar(adminId: string, data: CreateBarData): Promise<BarDto> {
    // Generate slug from name (simple kebab-case)
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const bar = await db.bar.create({
      data: {
        slug,

        name: data.name,
        area: data.area,
        category: data.category,
        description: data.description,
        address: data.address,
        phone: data.phone || null,
        website: data.website || null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        isFeatured: !!data.isFeatured,
        isApproved: false,
        ownerId: adminId, // Admin is owner for audit
        createdBy: adminId,
        updatedBy: adminId,
      },
    });
    return {
      id: bar.id,
      slug: bar.slug,
      name: bar.name,
      area: bar.area as BarArea,
      category: bar.category as BarCategory,
      isFeatured: bar.isFeatured,
      averageRating: null,
      ...(bar.latitude !== null ? { latitude: bar.latitude } : {}),
      ...(bar.longitude !== null ? { longitude: bar.longitude } : {}),
    };
  },
  /**
   * Creates a new event as admin.
   */
  async createEvent(adminId: string, data: CreateEventData): Promise<EventDto> {
    const startTime = new Date(data.date + "T" + data.time);

    const event = await db.event.create({
      data: {
        title: data.title,
        description: data.description || null,
        eventType: data.type as EventType,
        barId: data.barId ?? "", // must be a valid bar id in real use
        startTime,
        endTime: null,
        imageUrl: data.imageUrl || null,
        imageAlt: null,
        isFeatured: false,
        isApproved: false,
        createdBy: adminId,
        updatedBy: adminId,
      },
      include: {
        bar: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      eventType: event.eventType as EventType,
      startTime: event.startTime,
      endTime: event.endTime ?? null,
      barId: event.barId,
      barName: event.bar.name,
      barSlug: event.bar.slug,
      imageUrl: event.imageUrl,
      imageAlt: event.imageAlt,
    };
  },
  /**
   * Creates a new staff profile as admin.
   */
  async createStaffProfile(
    adminId: string,
    data: CreateStaffProfileData,
  ): Promise<StaffProfileDto> {
    const slug = data.displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const profile = await db.staffProfile.create({
      data: {
        slug,

        displayName: data.displayName,
        bio: data.bio || null,
        photoUrl: data.imageUrl || null,
        photoAlt: null,
        currentBar: data.barId || null,
        position: null,
        yearsExperience: null,
        specialties: null,
        isActive: true,
        isApproved: false,
        userId: adminId,
        createdBy: adminId,
        updatedBy: adminId,
      },
    });

    return {
      id: profile.id,
      displayName: profile.displayName,
      bio: profile.bio,
      photoUrl: profile.photoUrl,
      photoAlt: profile.photoAlt,
      currentBar: profile.currentBar,
      position: profile.position,
      averageRating: null,
      ratingCount: 0,
    };
  },
  /**
   * Gets admin dashboard overview stats.
   */
  async getOverviewStats(): Promise<AdminOverviewStatsDto> {
    const [
      totalBars,
      pendingBars,
      totalUsers,
      totalReviews,
      pendingReviews,
      totalBlogPosts,
    ] = await Promise.all([
      db.bar.count({ where: { deletedAt: null } }),
      db.bar.count({ where: { deletedAt: null, isApproved: false } }),
      db.user.count({ where: { deletedAt: null } }),
      db.review.count({ where: { deletedAt: null } }),
      db.review.count({ where: { deletedAt: null, isApproved: false } }),
      db.blogPost.count({ where: { deletedAt: null } }),
    ]);

    return {
      totalBars,
      pendingBars,
      totalUsers,
      totalReviews,
      pendingReviews,
      totalBlogPosts,
    };
  },

  /**
   * Lists all bars.
   */
  async listBars(): Promise<AdminBarListItemDto[]> {
    const bars = await db.bar.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        area: true,
        category: true,
        isApproved: true,
        deletedAt: true,
        createdAt: true,
      },
      orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
    });

    return bars.map((bar) => ({
      id: bar.id,
      slug: bar.slug,
      name: bar.name,
      area: bar.area as unknown as BarArea,
      category: bar.category as unknown as BarCategory,
      isApproved: bar.isApproved,
      deletedAt: bar.deletedAt,
      createdAt: bar.createdAt,
    }));
  },

  /**
   * Approves or rejects a bar.
   */
  async setBarApproval(
    adminId: string,
    barId: string,
    approved: boolean,
  ): Promise<boolean> {
    const result = await db.bar.updateMany({
      where: {
        id: barId,
        deletedAt: null,
      },
      data: {
        isApproved: approved,
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Soft deletes a bar.
   */
  async deleteBar(adminId: string, barId: string): Promise<boolean> {
    const result = await db.bar.updateMany({
      where: {
        id: barId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Lists all reviews.
   */
  async listReviews(): Promise<AdminReviewListItemDto[]> {
    const reviews = await db.review.findMany({
      select: {
        id: true,
        rating: true,
        content: true,
        isApproved: true,
        deletedAt: true,
        createdAt: true,
        bar: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
    });

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      content: review.content,
      isApproved: review.isApproved,
      deletedAt: review.deletedAt,
      createdAt: review.createdAt,
      bar: {
        id: review.bar.id,
        slug: review.bar.slug,
        name: review.bar.name,
      },
      user: {
        id: review.user.id,
        email: review.user.email,
      },
    }));
  },

  /**
   * Approves or rejects a review.
   */
  async setReviewApproval(
    adminId: string,
    reviewId: string,
    approved: boolean,
  ): Promise<boolean> {
    const result = await db.review.updateMany({
      where: {
        id: reviewId,
        deletedAt: null,
      },
      data: {
        isApproved: approved,
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Soft deletes a review.
   */
  async deleteReview(adminId: string, reviewId: string): Promise<boolean> {
    const result = await db.review.updateMany({
      where: {
        id: reviewId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Lists all users.
   */
  async listUsers(): Promise<AdminUserListItemDto[]> {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        deletedAt: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as unknown as UserRole,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
    }));
  },

  /**
   * Updates a user's role.
   */
  async setUserRole(
    adminId: string,
    userId: string,
    role: UserRole,
  ): Promise<boolean> {
    const result = await db.user.updateMany({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: {
        role: role as never,
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Soft deletes a user.
   */
  async deleteUser(adminId: string, userId: string): Promise<boolean> {
    const result = await db.user.updateMany({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Lists all blog posts.
   */
  async listBlogPosts(): Promise<AdminBlogPostListItemDto[]> {
    const posts = await db.blogPost.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        isPublished: true,
        publishedAt: true,
        deletedAt: true,
        createdAt: true,
      },
      orderBy: [{ isPublished: "asc" }, { createdAt: "desc" }],
    });

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      isPublished: post.isPublished,
      publishedAt: post.publishedAt,
      deletedAt: post.deletedAt,
      createdAt: post.createdAt,
    }));
  },

  /**
   * Publishes or unpublishes a blog post.
   */
  async setBlogPublish(
    adminId: string,
    postId: string,
    published: boolean,
  ): Promise<boolean> {
    const result = await db.blogPost.updateMany({
      where: {
        id: postId,
        deletedAt: null,
      },
      data: {
        isPublished: published,
        publishedAt: published ? new Date() : null,
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Soft deletes a blog post.
   */
  async deleteBlogPost(adminId: string, postId: string): Promise<boolean> {
    const result = await db.blogPost.updateMany({
      where: {
        id: postId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Lists all staff profiles.
   */
  async listStaffProfiles(): Promise<AdminStaffProfileListItemDto[]> {
    const profiles = await db.staffProfile.findMany({
      select: {
        id: true,
        slug: true,
        displayName: true,
        isApproved: true,
        isActive: true,
        deletedAt: true,
        createdAt: true,
      },
      orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
    });

    return profiles.map((profile) => ({
      id: profile.id,
      slug: profile.slug,
      displayName: profile.displayName,
      isApproved: profile.isApproved,
      isActive: profile.isActive,
      deletedAt: profile.deletedAt,
      createdAt: profile.createdAt,
    }));
  },

  /**
   * Approves or rejects a staff profile.
   */
  async setStaffApproval(
    adminId: string,
    staffProfileId: string,
    approved: boolean,
  ): Promise<boolean> {
    const result = await db.staffProfile.updateMany({
      where: {
        id: staffProfileId,
        deletedAt: null,
      },
      data: {
        isApproved: approved,
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Soft deletes a staff profile.
   */
  async deleteStaffProfile(
    adminId: string,
    staffProfileId: string,
  ): Promise<boolean> {
    const result = await db.staffProfile.updateMany({
      where: {
        id: staffProfileId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedBy: adminId,
      },
    });

    return result.count > 0;
  },

  /**
   * Valid roles that can be assigned via admin UI.
   */
  async listAssignableRoles(): Promise<UserRole[]> {
    return ["Visitor", "BarOwner", "BlogWriter", "Admin"];
  },
};
