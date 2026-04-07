/**
 * Public staff rating representation for staff profile detail views.
 */
export type StaffRatingDto = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  userName: string | null;
};

/**
 * Public staff profile representation for list views.
 */
export type StaffProfileDto = {
  id: string;
  displayName: string;
  bio: string | null;
  photoUrl: string | null;
  photoAlt: string | null;
  currentBar: string | null;
  position: string | null;
  averageRating: number | null;
  ratingCount: number;
};

/**
 * Public staff profile representation for detail views.
 */
export type StaffProfileDetailDto = StaffProfileDto & {
  galleryImageUrls: string[];
  ratings: StaffRatingDto[];
};
