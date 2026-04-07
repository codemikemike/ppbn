/**
 * Result returned after creating a tip for a staff profile.
 */
export type TipStaffResultDto = {
  /**
   * Whether the tip was recorded successfully.
   */
  success: boolean;

  /**
   * The id of the created tip record.
   */
  tipId: string;
};
