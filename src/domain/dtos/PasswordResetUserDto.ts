/**
 * DTO used for password reset lookups.
 */
export type PasswordResetUserDto = {
  /**
   * User id.
   */
  id: string;

  /**
   * When the reset token expires.
   */
  passwordResetExpiry: Date | null;
};
