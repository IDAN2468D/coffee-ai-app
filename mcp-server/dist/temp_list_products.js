import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
const prisma = new PrismaClient();
async function main() {
    try {
        const products = await prisma.product.findMany({
            include: { category: true },
        });
        console.log(JSON.stringify(products, null, 2));
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
