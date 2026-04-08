import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3).max(128),
  description: z.string().min(10).max(1000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  type: z.enum([
    "DJNight",
    "LadiesNight",
    "LiveMusic",
    "HappyHour",
    "ThemeNight",
    "SpecialEvent",
  ]),
  barId: z.string().max(64).optional(),
  imageUrl: z.string().url().max(256).optional(),
});
