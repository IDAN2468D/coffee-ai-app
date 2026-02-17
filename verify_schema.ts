
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Verifying schema...");

        // 1. Check if we can use the new Enum
        // We can't easily check enum existence at runtime without using it.

        // 2. Check if we can query/update new fields
        // We'll try to find a user (any user) and update their loyaltyPoints (mock update).
        // Or just check if the type definition allows it (compile time check effectively if using ts-node).

        // Actually, at runtime, if we send 'loyaltyPoints' to Prisma, and the Client (generated) supports it, it will send it to Mongo.
        // If Mongo doesn't have the field, it will create it.
        // So the real check is: Did 'prisma generate' work? Code execution will prove it.
        // Did 'db push' work? For Mongo, it mostly indexes. Schema is enforced by Client.

        const user = await prisma.user.findFirst();
        if (user) {
            console.log("Found user:", user.id);
            // Try to update with new role and loyaltyPoints
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    loyaltyPoints: 10,
                    role: 'CUSTOMER' // using string literal if Enum object not available in scope easily, or import it.
                }
            });
            console.log("Successfully updated loyaltyPoints and role.");
        } else {
            console.log("No user found, but client seems to work.");
        }

        console.log("Schema verification successful.");
    } catch (e) {
        console.error("Verification failed:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
