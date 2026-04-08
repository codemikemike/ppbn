/**
 * Validates input for creating a bar (admin).
 */
export const createBarSchema = z.object({
  name: z.string().min(2).max(64),
  area: z.enum(["Riverside", "BKK1", "Street136", "Street104"]),
  category: z.enum([
    "HostessBar",
    "Pub",
    "Club",
    "RooftopBar",
    "CocktailBar",
    "SportsBar",
    "KaraokeBar",
    "DiveBar",
    "WineBar",
    "Lounge",
    "GayBar",
    "LiveMusic",
  ]),
  description: z.string().min(10).max(1000),
  address: z.string().min(2).max(128),
  phone: z.string().max(32).optional().or(z.literal("").transform(() => undefined)),
  website: z.string().url().max(128).optional().or(z.literal("").transform(() => undefined)),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  isFeatured: z.boolean().optional(),
});
import { z } from "zod";

/**
 * Validates input for rating a bar.
 */
export const rateBarSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

/**
 * TypeScript type inferred from `rateBarSchema`.
 */
export type RateBarInput = z.infer<typeof rateBarSchema>;
