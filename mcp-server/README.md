# Coffee Prisma MCP Server

This is an MCP (Model Context Protocol) server that allows an AI (like Claude or Antigravity) to explore your Coffee App database.

## Features
- `list_products`: List products from the database.
- `get_user_count`: Get the total number of users.
- `get_recent_orders`: See latest orders and who made them.

## Setup for Claude Desktop

To use this with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "coffee-explorer": {
      "command": "node",
      "args": [
        "C:/Users/Lenovo/Desktop/App/coffee-ai-app/mcp-server/build/index.js"
      ],
      "env": {
        "DATABASE_URL": "YOUR_MONGODB_URL_HERE"
      }
    }
  }
}
```

> **Note:** Make sure the `DATABASE_URL` is correctly set in your root `.env` file, or pass it explicitly in the config.

## Development

1. Install dependencies: `npm install`
2. Generate Prisma client: `npx prisma generate --schema=../prisma/schema.prisma`
3. Build: `npm run build`
4. Run: `node build/index.js`
