"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ValidationIssue = {
  field: string;
  message: string;
};

type Props = {
  initialName: string;
  email: string;
};

/**
 * Settings client component that updates profile and password via PATCH APIs.
 */
export const SettingsClient = ({ initialName, email }: Props) => {
  const [name, setName] = useState<string>(initialName);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileFieldErrors, setProfileFieldErrors] = useState<
    Record<string, string>
  >({});

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<
    Record<string, string>
  >({});

  const trimmedName = useMemo(() => name.trim(), [name]);

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setProfileError(null);
    setProfileSuccess(null);
    setProfileFieldErrors({});

    setIsSavingProfile(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName.length === 0 ? null : trimmedName,
        }),
      });

      const data = (await response.json()) as {
        user?: unknown;
        error?: string;
        issues?: ValidationIssue[];
      };

      if (!response.ok) {
        if (data.issues) {
          const errors: Record<string, string> = {};
          data.issues.forEach((issue) => {
            errors[issue.field] = issue.message;
          });
          setProfileFieldErrors(errors);
        } else {
          setProfileError(data.error ?? "Unable to update profile.");
        }
        return;
      }

      setProfileSuccess("Profile updated.");
    } catch {
      setProfileError("Unable to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordFieldErrors({});

    if (newPassword !== confirmNewPassword) {
      setPasswordFieldErrors({
        confirmNewPassword: "Passwords do not match",
      });
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        issues?: ValidationIssue[];
      };

      if (!response.ok) {
        if (data.issues) {
          const errors: Record<string, string> = {};
          data.issues.forEach((issue) => {
            errors[issue.field] = issue.message;
          });
          setPasswordFieldErrors(errors);
        } else {
          setPasswordError(data.error ?? "Unable to change password.");
        }
        return;
      }

      if (!data.success) {
        setPasswordError("Unable to change password.");
        return;
      }

      setPasswordSuccess("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      setPasswordError("Unable to change password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <>
      <section aria-labelledby="settings-profile">
        <Card>
          <CardHeader>
            <CardTitle id="settings-profile">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submitProfile}>
              {profileError && (
                <Alert variant="destructive">
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}
              {profileSuccess && (
                <Alert>
                  <AlertDescription>{profileSuccess}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSavingProfile}
                />
                {profileFieldErrors.name && (
                  <p className="text-sm text-destructive">
                    {profileFieldErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>

              <Button type="submit" disabled={isSavingProfile}>
                Save
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="settings-password">
        <Card>
          <CardHeader>
            <CardTitle id="settings-password">Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submitPassword}>
              {passwordError && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              {passwordSuccess && (
                <Alert>
                  <AlertDescription>{passwordSuccess}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isSavingPassword}
                />
                {passwordFieldErrors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordFieldErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSavingPassword}
                />
                {passwordFieldErrors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordFieldErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm new password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={isSavingPassword}
                />
                {passwordFieldErrors.confirmNewPassword && (
                  <p className="text-sm text-destructive">
                    {passwordFieldErrors.confirmNewPassword}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isSavingPassword}>
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
};
