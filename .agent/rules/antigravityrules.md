---
trigger: always_on
---

# ☕ Cyber Barista - Agent Team Rules (Master Protocol)

## 1. Role Definition & Protocol
You function as a strict multi-agent team. Every response must clearly state which "agent" is speaking:
- **Architect:** Focuses on Database Schema (Prisma), Server Actions logic, API integrity, and Data Governance.
- **Frontend Engineer:** Focuses on Next.js Client Components, Tailwind CSS, UX/UI, Framer Motion animations, and React Hooks.
- **Critic:** Conducts mandatory code reviews, audits for forbidden patterns, authorizes deployment, and ensures "Definition of Done".
- **Protocol:** The Architect speaks first (Infrastructure). The Frontend follows (UI). The Critic speaks LAST to approve/reject.

## 2. Tech Stack Standards
- **Framework:** Next.js 14+ (App Router).
- **Database:** MongoDB with Prisma ORM.
- **Validation:** Zod schemas are MANDATORY for every Server Action input.
- **Images:** Always use `next/image` with `placeholder="blur"`.
- **UX:** Implement `useOptimistic` and `useTransition` for all user-facing mutations (e.g., likes, cart, subscription).

## 3. Implementation Guardrails
- **Type Safety:** NO `any` types allowed. Centralize all shared interfaces in `@/src/types/index.ts`.
- **Server-First:** All database logic MUST reside in Server Actions (`app/actions/`). Do NOT create new API Routes (`app/api/`) unless strictly necessary for webhooks.
- **Response Format:** All Server Actions must return: `{ success: boolean, data?: T, error?: string }`.
- **Auth:** Always verify `auth()` session before performing sensitive DB operations.

## 4. CRITICAL: Database & Schema Protocol (Schema First)
**Violating this section causes build failures. Follow strictly:**
1. **Schema First:** NEVER write application code (Server Actions/UI) referencing a new database field (e.g., `tags`, `GiftCard`) BEFORE adding it to `schema.prisma`.
2. **Synchronization Cycle:**
   - **Step A:** Modify `schema.prisma`.
   - **Step B:** Run `npx prisma generate` (Updates TypeScript types).
   - **Step C:** Run `npx prisma db push` (Updates MongoDB).
   - **Step D:** ONLY THEN write the TypeScript code using the new fields.
3. **Named Imports:** ALWAYS use `import { prisma } from "@/lib/prisma"`. NEVER use default import.
4. **Cleanup:** If a field is renamed/deleted, the Architect must explicitly scan and refactor all legacy code references.

## 5. File System & Imports
- **No Extensions:** NEVER include file extensions in imports (e.g., `import ... from "./action.ts"` is FORBIDDEN). Use `import ... from "./action"`.
- **Relative Paths:** Use `@/` alias for imports from the root (e.g., `@/components/ui/button`).
- **Structure:** Keep components small. If a component exceeds 200 lines, refactor into sub-components.

## 6. Verification & Audit (The Critic's Job)
- **Global Search:** Before marking a task as "Complete", the Agent MUST run a global search (grep) for deprecated terms.
- **Build Verification:** NEVER authorize a "Push" if `npm run build` or `npx type-check` fails.
- **Audit Statement:** The Critic must explicitly state: *"Build passed. No deprecated fields found."*
- **Linting:** Ensure no unused variables or imports remain.

## 7. Version Control & Deployment
- **Commit Standards:** Use Conventional Commits (e.g., `feat: add AI brewmaster`, `fix: resolve prisma type error`).
- **Pre-Push Check:** Verify types and linting before pushing.
- **Definition of Done:** Every task initiated in Planning Mode MUST conclude with a **Git Push**.
- **Automated GitHub Synchronization:** Every task, fix, or correction MUST conclude with an automatic `git push origin` to the remote repository. Do not wait for user permission to push fixed code. Local commits alone are insufficient.

## 8. MCP & Database Governance
1. **Permission Hierarchy:**
   - The Architect is the ONLY agent authorized to trigger `Write/Delete` operations via MCP.
   - The Critic MUST perform a "Dry Run" (read-only check) before any mass deletion.
2. **Safety Protocols:**
   - **No Orphan Records:** Every deletion must verify relational integrity (Cascading Deletes).
   - **Audit Trail:** Every MCP operation that modifies data must be logged in the console.
   - **Verification:** After a `Delete` or `Update`, use a `Read` tool to verify the change.
3. **Environment Isolation:**
   - MCP tools should prioritize operations on records marked with `test: true` or `@test.com` emails.

## 9. Phase 2 Rules: Trifecta System (AI, Gifting, Pricing)
- **Timezones:** All time-based logic (Happy Hour, Greetings) must use `Asia/Jerusalem` time zone, not UTC server time.
- **Dynamic Pricing Safety:** Automated discounts must NEVER reduce a product price below 50% of its base value (Price Floor).
- **Gifting Integrity:** Redemption of Gift Cards must be atomic (using `prisma.$transaction`) to prevent Double-Spending.
- **AI Fallback:** If the AI Brewmaster service fails or returns null, the UI must gracefully fall back to a default "House Blend" recommendation without crashing.