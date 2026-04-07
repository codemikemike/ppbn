import { db } from "@/lib/db";
import type { IAuditLogRepository } from "@/domain/interfaces/IAuditLogRepository";
import type { AuditLogDto } from "@/domain/dtos/AuditLogDto";
import type { CreateAuditLogData } from "@/domain/dtos/CreateAuditLogData";
import type { AuditAction } from "@/domain/dtos/AuditAction";
import { Prisma } from "@/generated/prisma";
import type { AuditLog } from "@/generated/prisma";

function toAuditLogDto(auditLog: AuditLog): AuditLogDto {
  return {
    id: auditLog.id,
    userId: auditLog.userId,
    action: auditLog.action as AuditAction,
    entityType: auditLog.entityType,
    entityId: auditLog.entityId,
    oldValues: auditLog.oldValues as Record<string, unknown> | null,
    newValues: auditLog.newValues as Record<string, unknown> | null,
    ipAddress: auditLog.ipAddress,
    userAgent: auditLog.userAgent,
    createdAt: auditLog.createdAt,
  };
}

/**
 * Audit log repository backed by Prisma.
 * @returns An IAuditLogRepository implementation.
 */
export const auditLogRepository: IAuditLogRepository = {
  /**
   * Creates a new audit log record.
   * @param data - Audit log creation data.
   * @returns The created audit log DTO.
   */
  async create(data: CreateAuditLogData): Promise<AuditLogDto> {
    const auditLog = await db.auditLog.create({
      data: {
        userId: data.userId ?? null,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        oldValues: data.oldValues
          ? (data.oldValues as Prisma.InputJsonValue)
          : Prisma.DbNull,
        newValues: data.newValues
          ? (data.newValues as Prisma.InputJsonValue)
          : Prisma.DbNull,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
    });

    return toAuditLogDto(auditLog);
  },

  /**
   * Finds audit logs by entity type and entity id.
   * @param entityType - Entity type (e.g. "User", "Bar").
   * @param entityId - Entity id.
   * @returns Audit log DTOs ordered by newest first.
   */
  async findByEntityId(
    entityType: string,
    entityId: string,
  ): Promise<AuditLogDto[]> {
    const auditLogs = await db.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return auditLogs.map(toAuditLogDto);
  },

  /**
   * Finds audit logs for a specific user.
   * @param userId - User id.
   * @returns Audit log DTOs ordered by newest first.
   */
  async findByUserId(userId: string): Promise<AuditLogDto[]> {
    const auditLogs = await db.auditLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return auditLogs.map(toAuditLogDto);
  },

  /**
   * Finds audit logs for a specific action.
   * @param action - Audit action.
   * @returns Audit log DTOs ordered by newest first.
   */
  async findByAction(action: AuditAction): Promise<AuditLogDto[]> {
    const auditLogs = await db.auditLog.findMany({
      where: {
        action,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return auditLogs.map(toAuditLogDto);
  },

  /**
   * Returns the most recent audit logs.
   * @param limit - Maximum number of records to return.
   * @returns Audit log DTOs ordered by newest first.
   */
  async findRecent(limit: number): Promise<AuditLogDto[]> {
    const auditLogs = await db.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return auditLogs.map(toAuditLogDto);
  },
};
