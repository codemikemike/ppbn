import bcrypt from "bcryptjs";
import pino from "pino";

import { db } from "../src/lib/db";
import { EventType } from "../src/generated/prisma";

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

  // --- BLOG POSTS ---
  const blogPosts = [
    {
      slug: "top-10-hostess-bars-2026",
      title: "Top 10 Hostess Bars in Phnom Penh 2026",
      category: "Guide",
      excerpt:
        "Discover the most popular hostess bars in Phnom Penh for 2026. Our guide covers the best venues, atmosphere, and what to expect for a great night out.",
      content: "Full content for Top 10 Hostess Bars in Phnom Penh 2026...",
      isPublished: true,
      readTime: 8,
    },
    {
      slug: "street-136-vs-riverside-comparison",
      title: "Street 136 vs Riverside: The Ultimate Nightlife Comparison",
      category: "Comparison",
      excerpt:
        "We break down the pros and cons of Phnom Penh's two most famous nightlife areas. Which is right for your next night out?",
      content: "Full content for Street 136 vs Riverside...",
      isPublished: true,
      readTime: 6,
    },
    {
      slug: "first-timers-guide-phnom-penh-nightlife",
      title: "A First Timer's Guide to Phnom Penh Nightlife",
      category: "Tips",
      excerpt:
        "New to Phnom Penh? Here are essential tips and advice for making the most of your first nightlife experience in Cambodia's capital.",
      content: "Full content for First Timer's Guide...",
      isPublished: true,
      readTime: 5,
    },
    {
      slug: "best-happy-hour-deals-phnom-penh",
      title: "Best Happy Hour Deals in Phnom Penh",
      category: "Deals",
      excerpt:
        "Save money and enjoy the best drinks with our roundup of Phnom Penh's top happy hour offers for 2026.",
      content: "Full content for Best Happy Hour Deals...",
      isPublished: true,
      readTime: 4,
    },
    {
      slug: "safety-tips-nightlife-cambodia",
      title: "Safety Tips for Nightlife in Cambodia",
      category: "Safety",
      excerpt:
        "Stay safe while enjoying the city's vibrant nightlife. Our safety tips cover everything from transport to personal security.",
      content: "Full content for Safety Tips...",
      isPublished: true,
      readTime: 4,
    },
    {
      slug: "evolution-of-phnom-penh-bar-scene",
      title: "The Evolution of Phnom Penhs Bar Scene",
      category: "History",
      excerpt:
        "A look back at how Phnom Penh's bar scene has changed over the years, from classic venues to modern hotspots.",
      content: "Full content for Evolution of Phnom Penh Bar Scene...",
      isPublished: true,
      readTime: 10,
    },
  ];

  await Promise.all(
    blogPosts.map((post) =>
      db.blogPost.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          isPublished: post.isPublished,
          authorId: adminUser.id,
          tags: post.category,
        },
        create: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          isPublished: post.isPublished,
          authorId: adminUser.id,
          tags: post.category,
        },
      }),
    ),
  );

  // --- STAFF PROFILES ---
  const staffData = [
    { name: "Srey Leak", bar: "Rose Bar", role: "Hostess" },
    { name: "Chantrea", bar: "Secrets Bar", role: "Hostess" },
    { name: "Bopha", bar: "Martini Bar", role: "Bartender" },
    { name: "Kolab", bar: "Honeypot Bar", role: "Hostess" },
    { name: "Maly", bar: "Rose Bar", role: "Hostess" },
    { name: "Rachana", bar: "Alaska Bar", role: "Bartender" },
    { name: "Sokha", bar: "Angry Birds Bar", role: "Hostess" },
    { name: "Thida", bar: "Secrets Bar", role: "Hostess" },
  ];

  for (const [i, staff] of staffData.entries()) {
    const staffEmail = `staff${i + 1}@ppbn.com`;
    const staffPassword = await hashPassword("Staff1234!");
    const staffUser = await db.user.upsert({
      where: { email: staffEmail },
      update: {
        name: staff.name,
        password: staffPassword,
        role: "Staff",
        deletedAt: null,
      },
      create: {
        email: staffEmail,
        password: staffPassword,
        role: "Staff",
        name: staff.name,
      },
    });
    await db.staffProfile.upsert({
      where: { userId: staffUser.id },
      update: {
        displayName: staff.name,
        currentBar: staff.bar,
        position: staff.role,
        isApproved: true,
        bio: "Friendly and welcoming staff member",
      },
      create: {
        slug: staff.name.toLowerCase().replace(/\s+/g, "-"),
        userId: staffUser.id,
        displayName: staff.name,
        currentBar: staff.bar,
        position: staff.role,
        isApproved: true,
        bio: "Friendly and welcoming staff member",
      },
    });
    // Add a random rating 4-5
    await db.staffRating.create({
      data: {
        staffProfile: { connect: { userId: staffUser.id } },
        user: { connect: { id: adminUser.id } },
        rating: 4 + Math.floor(Math.random() * 2),
        comment: "Great service!",
      },
    });
  }

  // --- EVENTS ---
  const eventData = [
    {
      id: "e1e1e1e1-e1e1-4e1e-8e1e-111111111111",
      title: "Ladies Night at Rose Bar",
      date: "2026-04-12T20:00:00+07:00",
      barSlug: "rose-bar",
      eventType: EventType.LadiesNight,
    },
    {
      id: "e2e2e2e2-e2e2-4e2e-8e2e-222222222222",
      title: "Live Band Night at Martini Bar",
      date: "2026-04-15T19:30:00+07:00",
      barSlug: "martini-bar",
      eventType: EventType.LiveMusic,
    },
    {
      id: "e3e3e3e3-e3e3-4e3e-8e3e-333333333333",
      title: "Happy Hour at Honeypot Bar",
      date: "2026-04-20T18:00:00+07:00",
      barSlug: "honeypot-bar",
      eventType: EventType.HappyHour,
    },
    {
      id: "e4e4e4e4-e4e4-4e4e-8e4e-444444444444",
      title: "DJ Night at Secrets Bar",
      date: "2026-04-25T21:00:00+07:00",
      barSlug: "secrets-bar",
      eventType: EventType.DJNight,
    },
    {
      id: "e5e5e5e5-e5e5-4e5e-8e5e-555555555555",
      title: "Theme Night at Angry Birds Bar",
      date: "2026-05-03T20:00:00+07:00",
      barSlug: "angry-birds-bar",
      eventType: EventType.ThemeNight,
    },
    {
      id: "e6e6e6e6-e6e6-4e6e-8e6e-666666666666",
      title: "Special Event at Alaska Bar",
      date: "2026-05-10T19:00:00+07:00",
      barSlug: "alaska-bar",
      eventType: EventType.SpecialEvent,
    },
  ];

  for (const event of eventData) {
    const bar = await db.bar.findUnique({ where: { slug: event.barSlug } });
    if (!bar) continue;
    await db.event.upsert({
      where: { id: event.id },
      update: {
        title: event.title,
        barId: bar.id,
        eventType: event.eventType,
        startTime: new Date(event.date),
        isApproved: true,
      },
      create: {
        id: event.id,
        title: event.title,
        barId: bar.id,
        eventType: event.eventType,
        startTime: new Date(event.date),
        isApproved: true,
      },
    });
  }

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
