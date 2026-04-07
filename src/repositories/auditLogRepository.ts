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

export const auditLogRepository: IAuditLogRepository = {
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
