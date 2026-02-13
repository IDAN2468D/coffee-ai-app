"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { TIER_BENEFITS, UserTier } from "@/lib/tiers";
import type { ServerActionResponse, ContextData, DynamicPriceResult, TimeOfDay, WeatherCondition } from "@/src/types";

// --- Constants ---

const HAPPY_HOUR_START = 14; // 14:00
const HAPPY_HOUR_END = 17;   // 17:00
const HAPPY_HOUR_DISCOUNT = 0.15; // 15% off
const PRICE_FLOOR_RATIO = 0.50;   // Never below 50% of base price
const PASTRY_TAG = "PASTRY";

const GetDynamicPriceSchema = z.object({
    productId: z.string().min(1),
});

// Israel timezone
const ISRAEL_TZ = "Asia/Jerusalem";

// --- Helpers ---

function getIsraelHour(): number {
    const now = new Date();
    const israelTime = new Date(now.toLocaleString("en-US", { timeZone: ISRAEL_TZ }));
    return israelTime.getHours();
}

function getTimeOfDay(): TimeOfDay {
    const hour = getIsraelHour();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 18) return "Afternoon";
    return "Evening";
}

function getSimulatedWeather(): WeatherCondition {
    // Simulated weather — can be replaced with a real API later
    const conditions: WeatherCondition[] = ["Sunny", "Rainy", "Cold"];
    const seed = new Date().getDate() % conditions.length;
    return conditions[seed];
}

function getGreeting(timeOfDay: TimeOfDay, weather: WeatherCondition): string {
    const greetings: Record<TimeOfDay, Record<WeatherCondition, string>> = {
        Morning: {
            Sunny: "☀️ בוקר טוב! יום שמשי מושלם לאספרסו קר",
            Rainy: "🌧️ בוקר גשום? קפוצ'ינו חם יחמם אותך",
            Cold: "❄️ בוקר קריר! התחילו עם קפה חם וממרח שוקולד",
        },
        Afternoon: {
            Sunny: "☀️ צהריים טובים! זמן למנוחה עם אייס לאטה",
            Rainy: "🌧️ אחה״צ גשום — מאפה חם ותה ילוו אותך",
            Cold: "❄️ אחה״צ קריר, מושלם לשוקו חם עם קצפת",
        },
        Evening: {
            Sunny: "🌅 ערב טוב! נעים להירגע עם תה צמחים",
            Rainy: "🌧️ ערב גשום וקסום — קפה דקף ועוגיה?",
            Cold: "❄️ ערב קריר? תתחממו עם לאטה קינמון",
        },
    };

    return greetings[timeOfDay][weather];
}

function getRecommendedTags(timeOfDay: TimeOfDay, weather: WeatherCondition): string[] {
    const tags: string[] = [];

    // Time-based tags
    if (timeOfDay === "Morning") tags.push("Morning", "Energy");
    if (timeOfDay === "Afternoon") tags.push("Afternoon", "Refreshing");
    if (timeOfDay === "Evening") tags.push("Evening", "Relaxing");

    // Weather-based tags
    if (weather === "Rainy") tags.push("Rainy", "Comfort");
    if (weather === "Cold") tags.push("Cold", "Warming");
    if (weather === "Sunny") tags.push("Sunny", "Refreshing");

    return [...new Set(tags)]; // Deduplicate
}

/**
 * @Architect — getContextData
 *
 * Determines time-of-day and weather context for the Smart Hero.
 * Weather is SIMULATED (deterministic based on day of month).
 * This runs server-side and does NOT block FCP — called in RSC page.tsx.
 */
export async function getContextData(): Promise<ServerActionResponse<ContextData>> {
    try {
        const timeOfDay = getTimeOfDay();
        const weather = getSimulatedWeather();
        const greeting = getGreeting(timeOfDay, weather);
        const recommendedTags = getRecommendedTags(timeOfDay, weather);

        // Find a matching product to recommend
        const recommendedProduct = await prisma.product.findFirst({
            where: {
                isArchived: false,
                tags: { hasSome: recommendedTags },
            },
            select: { name: true },
        });

        return {
            success: true,
            data: {
                timeOfDay,
                weather,
                greeting,
                recommendedTags,
                recommendedProduct: recommendedProduct?.name || undefined,
            },
        };
    } catch (error) {
        console.error("[Brewmaster] Context error:", error);
        // Graceful fallback — never fail the page render
        return {
            success: true,
            data: {
                timeOfDay: getTimeOfDay(),
                weather: "Sunny",
                greeting: "!שלום! ברוכים הבאים",
                recommendedTags: [],
            },
        };
    }
}

/**
 * @Architect — getDynamicPrice
 *
 * Calculates the dynamic price for a product.
 * If 14:00–17:00 Israel time AND product has "PASTRY" tag → 15% discount.
 *
 * SAFETY: Price floor at 50% of base price — never drops below that.
 */
export async function getDynamicPrice(
    rawInput: { productId: string }
): Promise<ServerActionResponse<DynamicPriceResult>> {
    try {
        const validated = GetDynamicPriceSchema.safeParse(rawInput);
        if (!validated.success) {
            return { success: false, error: "מזהה מוצר לא תקין" };
        }
        const { productId } = validated.data;
        const session = await getServerSession(authOptions);
        const userEmail = session?.user?.email;

        let userTier: UserTier = 'SILVER';

        if (userEmail) {
            const user = await prisma.user.findUnique({
                where: { email: userEmail },
                select: { tier: true }
            });
            if (user && user.tier) {
                userTier = (user.tier as UserTier) || 'SILVER';
            }
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { price: true, tags: true },
        });

        if (!product) {
            return { success: false, error: "מוצר לא נמצא" };
        }

        const hour = getIsraelHour();
        const isHappyHour = hour >= HAPPY_HOUR_START && hour < HAPPY_HOUR_END;
        const isPastry = product.tags.includes(PASTRY_TAG);

        let finalPrice = product.price;
        let discountPercent = 0;

        const benefits = TIER_BENEFITS[userTier];
        const tierDiscount = benefits.happyHourDiscount;

        if (isHappyHour && isPastry) {
            discountPercent = tierDiscount * 100;
            finalPrice = product.price * (1 - tierDiscount);

            // Price floor: never below 50% of base price
            const floor = product.price * PRICE_FLOOR_RATIO;
            if (finalPrice < floor) {
                finalPrice = floor;
                discountPercent = 50;
            }
        }

        return {
            success: true,
            data: {
                originalPrice: product.price,
                finalPrice: Math.round(finalPrice * 100) / 100,
                discountPercent,
                isHappyHour: isHappyHour && isPastry,
            },
        };
    } catch (error) {
        console.error("[Brewmaster] Dynamic price error:", error);
        return { success: false, error: "שגיאה בחישוב מחיר" };
    }
}

/**
 * @Architect — isHappyHourActive
 *
 * Simple check if we're currently in happy hour.
 * Used by client components to decide if they should show the banner.
 */
export async function isHappyHourActive(): Promise<boolean> {
    const hour = getIsraelHour();
    return hour >= HAPPY_HOUR_START && hour < HAPPY_HOUR_END;
}
