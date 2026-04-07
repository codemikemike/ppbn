import bcrypt from "bcryptjs";
import pino from "pino";

import { db } from "../src/lib/db";

const logger = pino({ name: "prisma-seed" });

const hashPassword = async (plainTextPassword: string): Promise<string> =>
  bcrypt.hash(plainTextPassword, 10);

async function main() {
  const adminEmail = "admin@ppbn.com";
  const adminPlainPassword = "Admin1234!";

  const ownerEmail = "owner@ppbn.com";
  const ownerPlainPassword = "Owner1234!";

  const [adminPasswordHash, ownerPasswordHash] = await Promise.all([
    hashPassword(adminPlainPassword),
    hashPassword(ownerPlainPassword),
  ]);

  const adminUser = await db.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "Admin",
      password: adminPasswordHash,
      name: "Admin",
      deletedAt: null,
    },
    create: {
      email: adminEmail,
      password: adminPasswordHash,
      role: "Admin",
      name: "Admin",
    },
  });

  const barOwnerUser = await db.user.upsert({
    where: { email: ownerEmail },
    update: {
      role: "BarOwner",
      password: ownerPasswordHash,
      name: "Bar Owner",
      deletedAt: null,
    },
    create: {
      email: ownerEmail,
      password: ownerPasswordHash,
      role: "BarOwner",
      name: "Bar Owner",
    },
  });

  void adminUser;

  const bars = [
    {
      slug: "rose-bar",
      name: "Rose Bar",
      area: "Street136" as const,
      category: "HostessBar" as const,
      description:
        "Big bar with pool table. Purple walls. Disco club theme. Around 20-30 girls working. Very popular bar on Street 136.",
      openingHours: "5PM - 2AM",
      isFeatured: true,
      isApproved: true,
      latitude: 11.5625,
      longitude: 104.9168,
    },
    {
      slug: "secrets-bar",
      name: "Secrets Bar",
      area: "Street104" as const,
      category: "HostessBar" as const,
      description:
        "Big place spread across multiple rooms. Many sofas and chairs. Live Music on Friday and Saturday. More than 20 girls. Security on door.",
      openingHours: "6PM - 3AM",
      isFeatured: true,
      isApproved: true,
      latitude: 11.558,
      longitude: 104.929,
    },
    {
      slug: "honeypot-bar",
      name: "Honeypot Bar",
      area: "Street136" as const,
      category: "HostessBar" as const,
      description:
        "Popular biker-friendly bar. Famous weekly Joker lucky draw. About 10 girls working.",
      openingHours: "7PM - 2AM",
      isFeatured: false,
      isApproved: true,
      latitude: 11.5624,
      longitude: 104.9167,
    },
    {
      slug: "angry-birds-bar",
      name: "Angry Birds Bar",
      area: "Street136" as const,
      category: "HostessBar" as const,
      description:
        "Beautiful red themed bar. Dance pole. 12-15 girls working. Fun atmosphere.",
      openingHours: "6PM - 2AM",
      isFeatured: false,
      isApproved: true,
      latitude: 11.5623,
      longitude: 104.9166,
    },
    {
      slug: "martini-bar",
      name: "Martini Bar",
      area: "Riverside" as const,
      category: "HostessBar" as const,
      description:
        "Well known bar on Street 174 near Riverside. Classic Phnom Penh nightlife spot.",
      openingHours: "4PM - 1AM",
      isFeatured: true,
      isApproved: true,
      latitude: 11.5637,
      longitude: 104.9282,
    },
    {
      slug: "alaska-bar",
      name: "Alaska Bar",
      area: "Street136" as const,
      category: "HostessBar" as const,
      description:
        "Beautiful bar design with pool table. VIP room upstairs. Known for friendly atmosphere.",
      openingHours: "6PM - 2AM",
      isFeatured: false,
      isApproved: true,
      latitude: 11.5622,
      longitude: 104.9165,
    },
  ];

  await Promise.all(
    bars.map((bar) =>
      db.bar.upsert({
        where: { slug: bar.slug },
        update: {
          name: bar.name,
          description: bar.description,
          openingHours: bar.openingHours,
          area: bar.area,
          category: bar.category,
          isFeatured: bar.isFeatured,
          isApproved: bar.isApproved,
          latitude: bar.latitude,
          longitude: bar.longitude,
          deletedAt: null,
          ownerId: barOwnerUser.id,
        },
        create: {
          slug: bar.slug,
          name: bar.name,
          description: bar.description,
          openingHours: bar.openingHours,
          area: bar.area,
          category: bar.category,
          isFeatured: bar.isFeatured,
          isApproved: bar.isApproved,
          latitude: bar.latitude,
          longitude: bar.longitude,
          ownerId: barOwnerUser.id,
        },
      }),
    ),
  );

  logger.info(
    {
      adminEmail,
      ownerEmail,
      barsSeeded: bars.length,
    },
    "Seed completed",
  );
}

main()
  .catch((err: unknown) => {
    logger.error({ err }, "Seed failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
