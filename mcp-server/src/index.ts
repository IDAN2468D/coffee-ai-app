import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
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
                name: "get_product_count",
                description: "Get the total number of products in the database",
                inputSchema: {
                    type: "object",
                    properties: {},
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
                name: "list_categories",
                description: "List all product categories",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "get_public_gallery",
                description: "Get recent AI generated images from the public gallery",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", default: 10 }
                    },
                },
            },
            {
                name: "get_user_gallery",
                description: "Get AI generated images for a specific user",
                inputSchema: {
                    type: "object",
                    properties: {
                        userId: { type: "string" },
                        limit: { type: "number", default: 10 }
                    },
                    required: ["userId"]
                },
            },
            {
                name: "toggle_image_privacy",
                description: "Toggle the public/private status of an AI generated image",
                inputSchema: {
                    type: "object",
                    properties: {
                        imageId: { type: "string" }
                    },
                    required: ["imageId"]
                },
            },
            {
                name: "get_user_points",
                description: "Get the current points balance for a user",
                inputSchema: {
                    type: "object",
                    properties: {
                        userId: { type: "string" }
                    },
                    required: ["userId"]
                },
            },
            {
                name: "add_points",
                description: "Add points to a user's balance",
                inputSchema: {
                    type: "object",
                    properties: {
                        userId: { type: "string" },
                        points: { type: "number", description: "Amount of points to add" }
                    },
                    required: ["userId", "points"]
                },
            },
            {
                name: "get_richest_users",
                description: "Get users with the most points",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", default: 10 }
                    },
                },
            },
            {
                name: "get_most_favorited",
                description: "Get products that appear in the most user favorites lists",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", default: 5 }
                    },
                },
            },
            {
                name: "get_orders_by_status",
                description: "Get orders filtered by their status",
                inputSchema: {
                    type: "object",
                    properties: {
                        status: { type: "string", enum: ["pending", "processing", "completed", "cancelled"] },
                        limit: { type: "number", default: 10 }
                    },
                    required: ["status"]
                },
            },
            {
                name: "get_sales_report",
                description: "Get sales report with total revenue and order count",
                inputSchema: {
                    type: "object",
                    properties: {
                        startDate: { type: "string", description: "Start date (ISO format)" },
                        endDate: { type: "string", description: "End date (ISO format)" }
                    },
                },
            },
            {
                name: "get_top_customers",
                description: "Get top customers based on total spending",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: { type: "number", default: 5 }
                    },
                },
            },
            {
                name: "search_users",
                description: "Search users by name or email",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string" }
                    },
                    required: ["query"]
                },
            },
            {
                name: "update_product_price",
                description: "(Deprecated) עדכון מחיר של מוצר - עדיף להשתמש ב-update_product",
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
                name: "update_product",
                description: "עדכון פרטי מוצר (שם, מחיר, תמונה, וכו')",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "ה-ID של המוצר לעדכון" },
                        name: { type: "string" },
                        description: { type: "string" },
                        price: { type: "number" },
                        categoryId: { type: "string" },
                        image: { type: "string", description: "URL של התמונה" },
                        isArchived: { type: "boolean" }
                    },
                    required: ["id"]
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
                        categoryId: { type: "string" },
                        image: { type: "string" }
                    },
                    required: ["name", "price", "categoryId"]
                }
            },
            {
                name: "search_products",
                description: "Search for products by name or description",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string" }
                    },
                    required: ["query"]
                }
            },
            {
                name: "get_products_by_category",
                description: "Get products belonging to a specific category",
                inputSchema: {
                    type: "object",
                    properties: {
                        categoryName: { type: "string" }
                    },
                    required: ["categoryName"]
                }
            },
            {
                name: "get_order_details",
                description: "Get full details of a specific order",
                inputSchema: {
                    type: "object",
                    properties: {
                        orderId: { type: "string" }
                    },
                    required: ["orderId"]
                }
            },
            {
                name: "update_order_status",
                description: "Update the status of an order",
                inputSchema: {
                    type: "object",
                    properties: {
                        orderId: { type: "string" },
                        status: { type: "string", enum: ["pending", "processing", "completed", "cancelled"] }
                    },
                    required: ["orderId", "status"]
                }
            },
            {
                name: "create_order",
                description: "Create a new order based on product IDs and quantities. Calculates total price on server side.",
                inputSchema: {
                    type: "object",
                    properties: {
                        userId: { type: "string" },
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    productId: { type: "string" },
                                    quantity: { type: "integer" },
                                    size: { type: "string" }
                                },
                                required: ["productId", "quantity"]
                            }
                        }
                    },
                    required: ["userId", "items"]
                }
            }
        ]
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

        if (name === "get_product_count") {
            const count = await prisma.product.count();
            return {
                content: [{ type: "text", text: `Total products: ${count}` }],
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

        if (name === "update_product") {
            const { id, ...data } = args as any;

            const updatedProduct = await prisma.product.update({
                where: { id },
                data: data
            });

            return {
                content: [{
                    type: "text",
                    text: `✅ המוצר "${updatedProduct.name}" עודכן בהצלחה.`
                }]
            };
        }

        // והוסף את זה בתוך CallToolRequestSchema
        if (name === "create_product") {
            const { name, description, price, categoryId, image } = args as any;
            const newProduct = await prisma.product.create({
                data: { name, description, price, categoryId, image }
            });
            return {
                content: [{ type: "text", text: `המוצר ${newProduct.name} נוצר בהצלחה!` }]
            };
        }

        if (name === "search_products") {
            const { query } = args as { query: string };
            const products = await prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } }
                    ]
                },
                include: { category: true }
            });
            return {
                content: [{ type: "text", text: JSON.stringify(products, null, 2) }]
            };
        }

        if (name === "get_products_by_category") {
            const { categoryName } = args as { categoryName: string };
            const products = await prisma.product.findMany({
                where: {
                    category: {
                        name: { contains: categoryName, mode: "insensitive" }
                    }
                },
                include: { category: true }
            });
            return {
                content: [{ type: "text", text: JSON.stringify(products, null, 2) }]
            };
        }

        if (name === "get_order_details") {
            const { orderId } = args as { orderId: string };
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    user: true,
                    items: {
                        include: { product: true }
                    }
                }
            });
            return {
                content: [{ type: "text", text: JSON.stringify(order, null, 2) }]
            };
        }

        if (name === "update_order_status") {
            const { orderId, status } = args as { orderId: string, status: string };
            const updatedOrder = await prisma.order.update({
                where: { id: orderId },
                data: { status }
            });
            return {
                content: [{ type: "text", text: `Order ${orderId} status updated to ${status}` }]
            };
        }

        if (name === "create_order") {
            const { userId, items } = args as {
                userId: string;
                items: { productId: string; quantity: number; size?: string }[];
            };

            // 1. Validate that all products exist and get their prices
            const productIds = items.map(item => item.productId);
            const products = await prisma.product.findMany({
                where: { id: { in: productIds } }
            });

            const productMap = new Map(products.map(p => [p.id, p]));
            const missingProductIds = productIds.filter(id => !productMap.has(id));

            if (missingProductIds.length > 0) {
                throw new Error(`One or more products not found: ${missingProductIds.join(", ")}`);
            }

            // 2. Calculate total amount and prepare order items data
            let totalAmount = 0;
            const orderItemsData = items.map(item => {
                const product = productMap.get(item.productId)!;
                const itemTotal = product.price * item.quantity;
                totalAmount += itemTotal;

                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    size: item.size || "M" // Default size if not provided
                };
            });

            // 3. Create the order and items in a transaction
            const newOrder = await prisma.$transaction(async (tx) => {
                return await tx.order.create({
                    data: {
                        userId,
                        total: totalAmount,
                        status: "pending",
                        items: {
                            create: orderItemsData
                        }
                    },
                    include: {
                        items: true
                    }
                });
            });

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        message: "Order created successfully",
                        orderId: newOrder.id,
                        totalAmount: newOrder.total,
                        itemCount: newOrder.items.length
                    }, null, 2)
                }]
            };
        }

        if (name === "list_categories") {
            const categories = await prisma.category.findMany({
                include: { _count: { select: { products: true } } }
            });
            return {
                content: [{ type: "text", text: JSON.stringify(categories, null, 2) }]
            };
        }

        if (name === "get_sales_report") {
            const { startDate, endDate } = args as { startDate?: string, endDate?: string };
            const where: any = {};
            if (startDate || endDate) {
                where.createdAt = {};
                if (startDate) where.createdAt.gte = new Date(startDate);
                if (endDate) where.createdAt.lte = new Date(endDate);
            }

            const aggregates = await prisma.order.aggregate({
                _sum: { total: true },
                _count: { id: true },
                where
            });

            return {
                content: [{
                    type: "text", text: `Sales Report:
Total Revenue: ${aggregates._sum.total || 0}
Total Orders: ${aggregates._count.id}
Period: ${startDate || 'Beginning'} - ${endDate || 'Now'}
` }]
            };
        }

        if (name === "get_top_customers") {
            const limit = (args?.limit as number) || 5;
            const topUsers = await prisma.order.groupBy({
                by: ['userId'],
                _sum: { total: true },
                orderBy: {
                    _sum: {
                        total: 'desc',
                    }
                },
                take: limit,
            });

            const userIds = topUsers.map(u => u.userId);
            const users = await prisma.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true, name: true, email: true }
            });

            const result = topUsers.map(u => {
                const userInfo = users.find(usr => usr.id === u.userId);
                return {
                    userId: u.userId,
                    name: userInfo?.name || 'Unknown',
                    email: userInfo?.email || 'N/A',
                    totalSpent: u._sum.total
                };
            });

            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            };
        }

        if (name === "search_users") {
            const { query } = args as { query: string };
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } }
                    ]
                },
                take: 10
            });
            return {
                content: [{ type: "text", text: JSON.stringify(users, null, 2) }]
            };
        }

        if (name === "get_public_gallery") {
            const limit = (args?.limit as number) || 10;
            const images = await prisma.coffeeImage.findMany({
                where: { isPublic: true },
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true } } }
            });
            return {
                content: [{ type: "text", text: JSON.stringify(images, null, 2) }]
            };
        }

        if (name === "get_user_gallery") {
            const { userId, limit } = args as { userId: string, limit?: number };
            const images = await prisma.coffeeImage.findMany({
                where: { userId },
                take: limit || 10,
                orderBy: { createdAt: 'desc' }
            });
            return {
                content: [{ type: "text", text: JSON.stringify(images, null, 2) }]
            };
        }

        if (name === "toggle_image_privacy") {
            const { imageId } = args as { imageId: string };
            const image = await prisma.coffeeImage.findUnique({ where: { id: imageId } });
            if (!image) throw new Error("Image not found");

            const updated = await prisma.coffeeImage.update({
                where: { id: imageId },
                data: { isPublic: !image.isPublic }
            });

            return {
                content: [{ type: "text", text: `Image ${imageId} is now ${updated.isPublic ? 'Public' : 'Private'}` }]
            };
        }

        if (name === "get_user_points") {
            const { userId } = args as { userId: string };
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { points: true, name: true } });
            return {
                content: [{ type: "text", text: `User ${user?.name || userId} has ${user?.points || 0} points` }]
            };
        }

        if (name === "add_points") {
            const { userId, points } = args as { userId: string, points: number };
            const updated = await prisma.user.update({
                where: { id: userId },
                data: { points: { increment: points } }
            });
            return {
                content: [{ type: "text", text: `Added ${points} points. New balance: ${updated.points}` }]
            };
        }

        if (name === "get_richest_users") {
            const limit = (args?.limit as number) || 10;
            const users = await prisma.user.findMany({
                orderBy: { points: 'desc' },
                take: limit,
                select: { id: true, name: true, email: true, points: true }
            });
            return {
                content: [{ type: "text", text: JSON.stringify(users, null, 2) }]
            };
        }

        if (name === "get_most_favorited") {
            const limit = (args?.limit as number) || 5;
            // Fetch all favoriteIds
            const users = await prisma.user.findMany({
                select: { favoriteIds: true }
            });

            const productCounts: Record<string, number> = {};
            users.forEach(u => {
                u.favoriteIds.forEach(pid => {
                    productCounts[pid] = (productCounts[pid] || 0) + 1;
                });
            });

            // Sort and take top N
            const sorted = Object.entries(productCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, limit);

            // Fetch product details
            const topProducts = await Promise.all(sorted.map(async ([pid, count]) => {
                const product = await prisma.product.findUnique({ where: { id: pid }, select: { name: true } });
                return {
                    productId: pid,
                    name: product?.name || 'Unknown',
                    favoritesCount: count
                };
            }));

            return {
                content: [{ type: "text", text: JSON.stringify(topProducts, null, 2) }]
            };
        }

        if (name === "get_orders_by_status") {
            const { status, limit } = args as { status: string, limit?: number };
            const orders = await prisma.order.findMany({
                where: { status },
                take: limit || 10,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true } } }
            });
            return {
                content: [{ type: "text", text: JSON.stringify(orders, null, 2) }]
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

const app = express();
app.use(cors());

const transports = new Map<string, SSEServerTransport>();

app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/messages", res);
    transports.set(transport.sessionId, transport);

    transport.onclose = () => {
        transports.delete(transport.sessionId);
    };

    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.get(sessionId);

    if (!transport) {
        res.status(404).send("Session not found");
        return;
    }

    await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Coffee Prisma MCP server running on port ${PORT}`);
});