import type { AuditLogDto } from "../dtos/AuditLogDto";
import type { CreateAuditLogData } from "../dtos/CreateAuditLogData";
import type { AuditAction } from "../dtos/AuditAction";

/**
 * Contract for audit log persistence and lookup.
 */
export interface IAuditLogRepository {
  /**
   * Creates a new audit log record.
   * @param data - Audit log creation data.
   * @returns The created audit log DTO.
   */
  create(data: CreateAuditLogData): Promise<AuditLogDto>;

  /**
   * Finds audit logs by entity type and entity id.
   * @param entityType - Entity type (e.g. "User", "Bar").
   * @param entityId - Entity id.
   * @returns Audit log DTOs ordered by newest first.
   */
  findByEntityId(entityType: string, entityId: string): Promise<AuditLogDto[]>;

  /**
   * Finds audit logs for a specific user.
   * @param userId - User id.
   * @returns Audit log DTOs ordered by newest first.
   */
  findByUserId(userId: string): Promise<AuditLogDto[]>;

  /**
   * Finds audit logs for a specific action.
   * @param action - Audit action.
   * @returns Audit log DTOs ordered by newest first.
   */
  findByAction(action: AuditAction): Promise<AuditLogDto[]>;

  /**
   * Returns the most recent audit logs.
   * @param limit - Maximum number of records to return.
   * @returns Audit log DTOs ordered by newest first.
   */
  findRecent(limit: number): Promise<AuditLogDto[]>;
}
