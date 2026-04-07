import type { AuditLogDto } from "../dtos/AuditLogDto";
import type { CreateAuditLogData } from "../dtos/CreateAuditLogData";
import type { AuditAction } from "../dtos/AuditAction";

export interface IAuditLogRepository {
  create(data: CreateAuditLogData): Promise<AuditLogDto>;
  findByEntityId(entityType: string, entityId: string): Promise<AuditLogDto[]>;
  findByUserId(userId: string): Promise<AuditLogDto[]>;
  findByAction(action: AuditAction): Promise<AuditLogDto[]>;
  findRecent(limit: number): Promise<AuditLogDto[]>;
}
