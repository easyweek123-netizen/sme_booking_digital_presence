# AI Tools Architecture Refactor Plan

> **Created:** December 2024  
> **Status:** ✅ Implemented  
> **Related:** [AI_PRD.md](./AI_PRD.md), [CURRENT_STATUS.md](./CURRENT_STATUS.md)

---

## Overview

Refactor the AI tool calling system to a clean **3-step process** with:
- Decorator-based auto-registration
- Base handler class with shared validation/logging
- Unified proposal creation
- Simplified frontend execution

This makes adding new tools trivial while improving error handling and context passing.

---

## Goals

1. Reduce tool addition from **10 steps to 3 steps**
2. Improve context passing (AI uses IDs internally, speaks naturally to users)
3. Add consistent error logging
4. Simplify frontend proposal execution

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         SHARED PACKAGE                          │
│  shared/src/tools/                                              │
│  ├── service.tools.ts   ← All service schemas + types          │
│  ├── helpers.ts         ← createProposal(), ToolResult builder │
│  └── index.ts           ← Single export point                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                           BACKEND                                │
│  common/tools/                                                   │
│  ├── tool-handler.decorator.ts  ← @ToolHandler() decorator      │
│  ├── tool-discovery.service.ts  ← Auto-finds decorated handlers │
│  ├── base-tool.handler.ts       ← Shared validation/logging     │
│  └── tool.registry.ts           ← Auto-populated registry       │
│                                                                  │
│  services/tools/                                                 │
│  ├── create.tool.ts   ← @ToolHandler('services_create')         │
│  ├── update.tool.ts                                              │
│  ├── delete.tool.ts                                              │
│  └── list.tool.ts                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                │
│  hooks/useProposalExecution.ts  ← Single execute/cancel hook    │
│  config/actionRegistry.ts       ← UI config only (no mutations) │
│  components/canvas/             ← Simplified ActionsRenderer    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Shared Package Reorganization

### 1.1 Create tools directory structure

Move schemas from `shared/src/schemas/actions/` to `shared/src/tools/`:

**File: `shared/src/tools/service.tools.ts`**
- Move all service action schemas here
- Export types inferred from Zod

**File: `shared/src/tools/helpers.ts`**
- `createProposal(type, data)` - generates proposalId, sets executionMode
- `ToolResultBuilder` - success/error helpers with consistent structure

**File: `shared/src/tools/index.ts`**
- Export `ChatActionSchema` union
- Export all types
- Export helpers

**File: `shared/src/index.ts`**
- Update to export from new location

### 1.2 Keep backward compatibility

- Keep old exports working during migration
- Remove old files after backend/frontend updated

---

## Phase 2: Backend - Decorator and Base Handler

### 2.1 Create tool infrastructure

**File: `backend/src/common/tools/tool-handler.decorator.ts`**

```typescript
export interface ToolHandlerOptions {
  name: string;
  description: string;
}

export function ToolHandler(options: ToolHandlerOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata('tool:options', options, target);
    Reflect.defineMetadata('tool:handler', true, target);
  };
}
```

**File: `backend/src/common/tools/base-tool.handler.ts`**

```typescript
export abstract class BaseToolHandler<TArgs = unknown> {
  protected readonly logger = new Logger(this.constructor.name);
  
  abstract readonly schema: z.ZodSchema<TArgs>;
  abstract execute(args: TArgs, ctx: ToolContext): Promise<ToolResult>;
  
  // Shared: validate args, catch errors, log
  async handle(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    const parsed = this.schema.safeParse(args);
    if (!parsed.success) {
      this.logger.warn('Validation failed', { args, error: parsed.error });
      return ToolResult.validationError(parsed.error);
    }
    try {
      const result = await this.execute(parsed.data, ctx);
      this.logger.log('Executed successfully', { args });
      return result;
    } catch (error) {
      this.logger.error('Execution failed', { args, error });
      return ToolResult.error('Something went wrong. Please try again.');
    }
  }
}
```

**File: `backend/src/common/tools/tool-discovery.service.ts`**
- Uses NestJS `DiscoveryService` to find all `@ToolHandler` decorated classes
- Auto-registers them in `ToolRegistry` on module init

### 2.2 Migrate service handlers

Refactor existing handlers in `backend/src/services/tools/`:

```typescript
// Example: create.tool.ts
@ToolHandler({
  name: 'services_create',
  description: 'Create a new service for the business',
})
@Injectable()
export class CreateServiceTool extends BaseToolHandler<CreateServiceArgs> {
  schema = CreateServiceArgsSchema;

  constructor(private services: ServicesService) { super(); }

  async execute(args: CreateServiceArgs, ctx: ToolContext): Promise<ToolResult> {
    return ToolResult.withProposal(
      createProposal('service:create', { 
        businessId: ctx.businessId, 
        service: args 
      }),
      `I prepared "${args.name}" for $${args.price}. Please confirm.`
    );
  }
}
```

### 2.3 Update context passing

**File: `backend/src/chat/prompts/templates.ts`**
- Add instruction: "Use IDs from tool results for subsequent operations. Never mention IDs to users."

**Files: `update.tool.ts`, `delete.tool.ts`**
- Accept `id` OR `name` parameter (prefer ID, fallback to name lookup)

### 2.4 Update chat module

**File: `backend/src/chat/chat.module.ts`**
- Import `ToolsModule` with discovery service
- Remove manual handler injection from `ToolRegistry`

---

## Phase 3: Frontend - Simplified Execution

### 3.1 Create unified execution hook

**File: `frontend/src/hooks/useProposalExecution.ts`**

```typescript
export function useProposalExecution() {
  // Centralized: execute mutation, send result, update UI
  const execute = async (proposal: ChatAction, formData?: unknown) => { ... };
  const cancel = async (proposal: ChatAction) => { ... };
  return { execute, cancel };
}
```

### 3.2 Simplify action registry

**File: `frontend/src/config/actionRegistry.ts`**
- Remove `getMutation` from config (moved to execution hook)
- Keep only: `component`, `title`, `getProps`

### 3.3 Simplify ActionsRenderer

**File: `frontend/src/components/canvas/ActionsRenderer.tsx`**
- Use `useProposalExecution()` instead of callback chains
- Cleaner component: `<Component onSubmit={(data) => execute(proposal, data)} />`

---

## Final: 3-Step Process to Add New Tool

| Step | File | What to Do |
|------|------|------------|
| **1** | `shared/src/tools/[domain].tools.ts` | Add Zod action schema |
| **2** | `backend/src/[domain]/tools/[op].tool.ts` | Create handler with `@ToolHandler()` |
| **3** | `frontend/src/config/actionRegistry.ts` | Add UI config |

---

## Files Changed Summary

| Package | New Files | Modified Files |
|---------|-----------|----------------|
| **shared** | `tools/service.tools.ts`, `tools/helpers.ts`, `tools/index.ts` | `index.ts` |
| **backend** | `common/tools/tool-handler.decorator.ts`, `common/tools/base-tool.handler.ts`, `common/tools/tool-discovery.service.ts` | `services/tools/*.ts`, `chat/chat.module.ts`, `chat/tool.registry.ts`, `chat/prompts/templates.ts` |
| **frontend** | - | `hooks/useProposalExecution.ts`, `config/actionRegistry.ts`, `components/canvas/ActionsRenderer.tsx` |

---

## Migration Strategy

1. **Phase 1**: Add new infrastructure alongside existing code
2. **Phase 2**: Migrate service tools one by one
3. **Phase 3**: Remove old code after all tools migrated
4. **Phase 4**: Add new entity tools (bookings, customers) using new pattern

---

## Implementation Status

- [x] Create shared/src/tools/ with service.tools.ts, helpers.ts, and index.ts
- [x] Create @ToolHandler decorator and tool-discovery.service.ts
- [x] Create BaseToolHandler with validation, error handling, and logging
- [x] Migrate 4 service handlers to use decorator and base class
- [x] Update system prompt for ID-based context passing
- [x] Create useProposalExecution hook for unified execute/cancel
- [x] Simplify actionRegistry to UI config only, update ActionsRenderer
- [x] Remove old files and verify 3-step process works end-to-end

