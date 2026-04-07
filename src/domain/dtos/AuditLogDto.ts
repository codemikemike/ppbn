import type { AuditAction } from "./AuditAction";

export type AuditLogDto = {
  id: string;
  userId: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
};
