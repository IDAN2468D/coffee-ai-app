import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// טעינת .env מהתיקייה הראשית של הפרויקט
dotenv.config({ path: path.join(__dirname, "../../.env") });

const prisma = new PrismaClient();

const server = new Server(
    {
        name: "coffee-prisma-explorer",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * רשימת הכלים הזמינים ל-AI
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_products",
                description: "Get a list of all products in the coffee shop",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", default: 10 },
                    },
                },
            },
            {
                name: "get_user_count",
                description: "Get the total number of registered users",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "get_recent_orders",
                description: "Get the most recent orders",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", default: 5 },
                    },
                },
            },
            {
                name: "update_product_price",
                description: "עדכון מחיר של מוצר לפי ה-ID שלו ב-Database",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "ה-ID הייחודי של המוצר (MongoDB ID)" },
                        newPrice: { type: "number", description: "המחיר החדש להגדרה" }
                    },
                    required: ["id", "newPrice"]
                }
            },
            {
                name: "create_product",
                description: "יצירת מוצר קפה חדש ב-Database",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        price: { type: "number" },
                        categoryId: { type: "string" }
                    },
                    required: ["name", "price", "categoryId"]
                }
            }
        ],
    };
});

/**
 * לוגיקת הביצוע של הכלים
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        // 1. רשימת מוצרים
        if (name === "list_products") {
            const limit = (args?.limit as number) || 10;
            const products = await prisma.product.findMany({
                take: limit,
                include: { category: true },
            });
            return {
                content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
            };
        }

        // 2. ספירת משתמשים
        if (name === "get_user_count") {
            const count = await prisma.user.count();
            return {
                content: [{ type: "text", text: `Total users: ${count}` }],
            };
        }

        // 3. הזמנות אחרונות
        if (name === "get_recent_orders") {
            const limit = (args?.limit as number) || 5;
            const orders = await prisma.order.findMany({
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { user: true, items: { include: { product: true } } },
            });
            return {
                content: [{ type: "text", text: JSON.stringify(orders, null, 2) }],
            };
        }

        // 4. עדכון מחיר (החלק החדש שהיה חסר)
        if (name === "update_product_price") {
            const { id, newPrice } = args as { id: string; newPrice: number };

            const updatedProduct = await prisma.product.update({
                where: { id },
                data: { price: newPrice }
            });

            return {
                content: [{
                    type: "text",
                    text: `✅ המוצר "${updatedProduct.name}" עודכן בהצלחה. מחיר חדש: ${newPrice} ש"ח.`
                }],
            };
        }

        // והוסף את זה בתוך CallToolRequestSchema
        if (name === "create_product") {
            const { name, description, price, categoryId } = args as any;
            const newProduct = await prisma.product.create({
                data: { name, description, price, categoryId }
            });
            return {
                content: [{ type: "text", text: `המוצר ${newProduct.name} נוצר בהצלחה!` }]
            };
        }

        throw new Error(`Tool not found: ${name}`);
    } catch (error: any) {
        return {
            content: [{ type: "text", text: `שגיאה בביצוע הפעולה: ${error.message}` }],
            isError: true,
        };
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Coffee Prisma MCP server running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});