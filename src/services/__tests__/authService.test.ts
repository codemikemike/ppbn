import { beforeAll, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";

import type { IUserRepository } from "@/domain/interfaces/IUserRepository";
import type { RegisterDto } from "@/domain/dtos/RegisterDto";
import type { CreateUserData } from "@/domain/dtos/CreateUserData";
import type { UserDto } from "@/domain/dtos/UserDto";
import {
  EmailExistsError,
  UnauthorizedError,
  ValidationError,
} from "@/domain/errors/DomainErrors";

vi.mock("../auditLogService", () => {
  return {
    auditLogService: {
      logAction: vi.fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock("@/repositories/userRepository", () => {
  return {
    userRepository: {
      findByEmail: vi.fn(async () => null),
      findById: vi.fn(async () => null),
      create: vi.fn(async () => {
        throw new Error("Unexpected call to default userRepository mock");
      }),
      findByEmailWithPassword: vi.fn(async () => null),
      findByIdWithPassword: vi.fn(async () => null),
      updateProfile: vi.fn(async () => {
        throw new Error("Unexpected call to updateProfile in default mock");
      }),
      getDashboardStats: vi.fn(async () => ({
        reviewsCount: 0,
        favoriteBarsCount: 0,
        staffRatingsCount: 0,
      })),
      listMyReviews: vi.fn(async () => []),
      setResetToken: vi.fn().mockResolvedValue(undefined),
      findByResetToken: vi.fn().mockResolvedValue(null),
      updatePassword: vi.fn().mockResolvedValue(undefined),
    } satisfies IUserRepository,
  };
});

let AuthService: typeof import("../authService").AuthService;

beforeAll(async () => {
  ({ AuthService } = await import("../authService"));
});

const createFakeUserRepository = (overrides?: Partial<IUserRepository>) => {
  const base: IUserRepository = {
    findByEmail: async () => null,
    findById: async () => null,
    create: async (data: CreateUserData) => {
      const user: UserDto = {
        id: "user_1",
        email: data.email,
        name: data.name,
        role: data.role,
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return user;
    },
    findByEmailWithPassword: async () => null,
    findByIdWithPassword: async () => null,
    updateProfile: async () => {
      throw new Error("Unexpected call to updateProfile in fake repository");
    },
    getDashboardStats: async () => ({
      reviewsCount: 0,
      favoriteBarsCount: 0,
      staffRatingsCount: 0,
    }),
    listMyReviews: async () => [],
    setResetToken: vi.fn().mockResolvedValue(undefined),
    findByResetToken: vi.fn().mockResolvedValue(null),
    updatePassword: vi.fn().mockResolvedValue(undefined),
  };

  return {
    ...base,
    ...overrides,
  } satisfies IUserRepository;
};

describe("AuthService.registerUser", () => {
  it("validates email format", async () => {
    const repo = createFakeUserRepository();
    const service = new AuthService(repo);

    const dto: RegisterDto = {
      name: "Test User",
      email: "not-an-email",
      password: "Password1",
    };

    try {
      await service.registerUser(dto);
      throw new Error("Expected registerUser to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect(err).toMatchObject({
        code: "VALIDATION_ERROR",
        statusCode: 400,
      });

      const validationError = err as ValidationError;
      expect(
        validationError.issues.some((issue) => issue.field === "email"),
      ).toBe(true);
    }
  });

  it("throws on duplicate email", async () => {
    const repo = createFakeUserRepository({
      findByEmail: async () => ({
        id: "existing",
        email: "test@example.com",
        name: "Existing",
        role: "RegisteredUser",
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });

    const service = new AuthService(repo);

    const dto: RegisterDto = {
      name: "Test User",
      email: "test@example.com",
      password: "Password1",
    };

    await expect(service.registerUser(dto)).rejects.toBeInstanceOf(
      EmailExistsError,
    );
  });
});

describe("AuthService.authenticateUser", () => {
  it("throws on wrong password", async () => {
    const passwordHash = await bcrypt.hash("CorrectPassword1", 10);

    const repo = createFakeUserRepository({
      findByEmailWithPassword: async () => ({
        id: "user_1",
        email: "test@example.com",
        name: "Test User",
        role: "RegisteredUser",
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: passwordHash,
      }),
    });

    const service = new AuthService(repo);

    try {
      await service.authenticateUser("test@example.com", "WrongPassword1");
      throw new Error("Expected authenticateUser to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedError);
      expect(err).toMatchObject({
        code: "UNAUTHORIZED",
        statusCode: 401,
        message: "Invalid email or password",
      });
    }
  });
});
