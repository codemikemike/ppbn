import { db } from "@/lib/db";
import type { BarDto } from "@/domain/dtos/BarDto";
import type { BarArea } from "@/domain/dtos/BarArea";
import type { BarCategory } from "@/domain/dtos/BarCategory";
import type { IBarRepository } from "@/domain/interfaces/IBarRepository";
import type { Bar } from "@/generated/prisma";

const toBarDto = (bar: Bar): BarDto => ({
  id: bar.id,
  slug: bar.slug,
  name: bar.name,
  area: bar.area as unknown as BarArea,
  category: bar.category as unknown as BarCategory,
  isFeatured: bar.isFeatured,
});

export const barRepository: IBarRepository = {
  async findApproved(): Promise<BarDto[]> {
    const bars = await db.bar.findMany({
      where: {
        isApproved: true,
        deletedAt: null,
      },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    });

    return bars.map(toBarDto);
  },
};
