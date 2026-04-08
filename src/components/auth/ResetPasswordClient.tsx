"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ValidationIssue = {
  field: string;
  message: string;
};

/**
 * Client-side reset password UI.
 *
 * Reads the reset token from the query string: `/reset-password?token=...`.
 *
 * @returns The reset-password form UI.
 */
export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!token) {
      errors.token = "Reset token is missing";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setValidationErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = (await response.json()) as
        | { message?: string; error?: string; issues?: ValidationIssue[] }
        | undefined;

      if (!response.ok) {
        if (data?.issues) {
          const errors: Record<string, string> = {};
          data.issues.forEach((issue) => {
            errors[issue.field] = issue.message;
          });
          setValidationErrors(errors);
          return;
        }

        setError(data?.error ?? "Unable to reset password. Please try again.");
        return;
      }

      setPassword("");
      setConfirmPassword("");
      setSuccessMessage(
        data?.message ?? "Password updated successfully. You can now log in.",
      );
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Reset password UI error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ppbn-page min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <Card className="glass-card glow-red w-full max-w-md rounded-[1.75rem]">
        <CardHeader className="space-y-1">
          <CardTitle className="font-display text-gradient-red text-2xl font-black uppercase tracking-[-0.08em] text-center">
            Reset password
          </CardTitle>
          <CardDescription className="text-center">
            Choose a new password for your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {successMessage ? (
              <Alert>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            ) : null}

            {validationErrors.token ? (
              <Alert variant="destructive">
                <AlertDescription>{validationErrors.token}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                disabled={isLoading || !token}
                className={`ppbn-input ${validationErrors.password ? "border-[#cc0000]" : ""}`}
              />
              {validationErrors.password ? (
                <p className="text-sm text-[#ff4444]">
                  {validationErrors.password}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                disabled={isLoading || !token}
                className={`ppbn-input ${validationErrors.confirmPassword ? "border-[#cc0000]" : ""}`}
              />
              {validationErrors.confirmPassword ? (
                <p className="text-sm text-[#ff4444]">
                  {validationErrors.confirmPassword}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full rounded-sm bg-[#cc0000] text-white hover:bg-[#ff0000]"
              disabled={isLoading || !token}
            >
              {isLoading ? "Submitting..." : "Reset password"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-white"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
