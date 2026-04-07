import { Suspense } from "react";

import ResetPasswordClient from "@/components/auth/ResetPasswordClient";

/**
 * Reset password page.
 *
 * @returns The reset-password page.
 */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordClient />
    </Suspense>
  );
}
