import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, "../../.env") });
const prisma = new PrismaClient();
const server = new Server({
    name: "coffee-prisma-explorer",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * List available tools.
 * Exposes tools to read products and categories.
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
        ],
    };
});
/**
 * Handle tool calls.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === "list_products") {
            const limit = args?.limit || 10;
            const products = await prisma.product.findMany({
                take: limit,
                include: { category: true },
            });
            return {
                content: [{ type: "text", text: JSON.stringify(products, null, 2) }],
            };
        }
        if (name === "get_user_count") {
            const count = await prisma.user.count();
            return {
                content: [{ type: "text", text: `Total users: ${count}` }],
            };
        }
        if (name === "get_recent_orders") {
            const limit = args?.limit || 5;
            const orders = await prisma.order.findMany({
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { user: true, items: { include: { product: true } } },
            });
            return {
                content: [{ type: "text", text: JSON.stringify(orders, null, 2) }],
            };
        }
        throw new Error(`Tool not found: ${name}`);
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
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
