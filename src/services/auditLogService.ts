import type { IAuditLogRepository } from "@/domain/interfaces/IAuditLogRepository";
import type { AuditLogDto } from "@/domain/dtos/AuditLogDto";
import type { CreateAuditLogData } from "@/domain/dtos/CreateAuditLogData";
import type { AuditAction } from "@/domain/dtos/AuditAction";
import { auditLogRepository } from "@/repositories/auditLogRepository";

export class AuditLogService {
  constructor(private auditLogRepository: IAuditLogRepository) {}

  async log(data: CreateAuditLogData): Promise<AuditLogDto> {
    return this.auditLogRepository.create(data);
  }

  async logAction(
    action: AuditAction,
    entityType: string,
    entityId: string,
    userId?: string | null,
    options?: {
      oldValues?: Record<string, unknown> | null;
      newValues?: Record<string, unknown> | null;
      ipAddress?: string | null;
      userAgent?: string | null;
    },
  ): Promise<AuditLogDto> {
    return this.auditLogRepository.create({
      userId: userId ?? null,
      action,
      entityType,
      entityId,
      oldValues: options?.oldValues ?? null,
      newValues: options?.newValues ?? null,
      ipAddress: options?.ipAddress ?? null,
      userAgent: options?.userAgent ?? null,
    });
  }

  async getEntityHistory(
    entityType: string,
    entityId: string,
  ): Promise<AuditLogDto[]> {
    return this.auditLogRepository.findByEntityId(entityType, entityId);
  }

  async getUserActivity(userId: string): Promise<AuditLogDto[]> {
    return this.auditLogRepository.findByUserId(userId);
  }

  async getActionLogs(action: AuditAction): Promise<AuditLogDto[]> {
    return this.auditLogRepository.findByAction(action);
  }

  async getRecentActivity(limit = 100): Promise<AuditLogDto[]> {
    return this.auditLogRepository.findRecent(limit);
  }
}

export const auditLogService = new AuditLogService(auditLogRepository);
