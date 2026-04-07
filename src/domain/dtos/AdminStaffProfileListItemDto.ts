/**
 * Admin list row for a staff profile.
 */
export type AdminStaffProfileListItemDto = {
  id: string;
  slug: string;
  displayName: string;
  isApproved: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
};
