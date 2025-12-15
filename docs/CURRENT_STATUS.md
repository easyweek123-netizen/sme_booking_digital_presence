# BookEasy - Current Status

**Last Updated:** December 15, 2024

---

## Quick Context

| Item | Status |
|------|--------|
| Current Phase | AI-First Foundation (Phase 2 Complete) |
| Completed | Phase 1 (Onboarding, Chat Route, AI Integration), Phase 2 (Function Calling) |
| Next Up | Phase 3 - Calendar Integration |
| Blockers | None |

---

## Current Phase: AI-First Foundation

See [AI_PRD.md](./AI_PRD.md) for full strategy.

### Phase 1.1 - Conversational Onboarding ✅ Complete

Replaced 3-step wizard with conversational chat-style onboarding.

**What was built:**
- Reusable chat components (`components/chat/`)
- Conversational onboarding flow (`components/ConversationalOnboarding/`)
- Split layout with step indicators
- 3-step flow: Business Name → Category → Google Login

### Phase 1.2 - Chat Route ✅ Complete

| Task | Status |
|------|--------|
| Add `/dashboard/chat` as chat route | ✅ Done |
| Add AI Chat to sidebar menu (first item) | ✅ Done |
| Professional chat UI with polish | ✅ Done |
| Redirect after onboarding to `/dashboard/chat` | ✅ Done |
| Sticky input, scrolling messages | ✅ Done |
| Empty state with helper text | ✅ Done |
| "New chat" button | ✅ Done |

### Phase 1.3 - AI Integration ✅ Complete

| Task | Status |
|------|--------|
| Backend ChatModule (controller, service) | ✅ Done |
| Groq/OpenAI SDK integration | ✅ Done |
| Environment-based AI config (API key, base URL, model) | ✅ Done |
| System prompt with business context | ✅ Done |
| Conversation history (per user, last 30 messages) | ✅ Done |
| Owner resolution interceptor + @OwnerId decorator | ✅ Done |
| Frontend chatApi (RTK Query) | ✅ Done |
| Chat state persistence (Redux) | ✅ Done |
| Typing indicator (proper design) | ✅ Done |
| Chat UI aesthetics polish | ✅ Done |

---

### Phase 2: Function Calling ✅ Complete

| Task | Status |
|------|--------|
| ToolHandler interface & ToolResult type | ✅ Done |
| ToolRegistry for routing tool calls | ✅ Done |
| `manage_service` tool (get/create/update/delete) | ✅ Done |
| ServiceToolHandler in services module | ✅ Done |
| ServiceFormCard component for chat actions | ✅ Done |
| ChatAction discriminated union types | ✅ Done |
| ServiceCard extraction for reuse | ✅ Done |
| OpenAI 2-call pattern implementation | ✅ Done |

**Architecture:**
```
ChatService → ToolRegistry → ServiceToolHandler
                          → (future handlers)
```

### Phase 3: Calendar Integration (Future)
- [ ] Google Calendar 2-way sync
- [ ] Calendar view in dashboard

### Phase 4: User Testing (Future)
- [ ] Present to 2 real users
- [ ] Collect feedback

---

## Codebase State

### Frontend Structure
```
frontend/src/
├── pages/
│   ├── landing/index.tsx           # Landing page
│   ├── onboarding/index.tsx        # Conversational onboarding
│   ├── dashboard/
│   │   ├── index.tsx               # Dashboard router
│   │   ├── DashboardChat.tsx       # AI Chat interface
│   │   ├── DashboardOverview.tsx
│   │   ├── DashboardBookings.tsx
│   │   ├── DashboardServices.tsx
│   │   └── DashboardSettings.tsx
│   ├── booking/index.tsx           # Public booking page
│   └── legal/                      # Terms, Privacy
├── components/
│   ├── chat/                       # Reusable chat components
│   │   ├── ChatMessage.tsx         # Message bubble (renders actions)
│   │   ├── ChatInput.tsx           # Text input
│   │   ├── Suggestions.tsx         # Category buttons
│   │   ├── AllMessages.tsx         # Message container
│   │   ├── TypingIndicator.tsx     # Typing dots animation
│   │   └── ServiceFormCard.tsx     # Service create/update/delete form
│   ├── ConversationalOnboarding/   # Onboarding flow
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SplitLayout.tsx
│   │   └── PublicLayout.tsx
│   ├── Dashboard/
│   │   ├── DashboardLayout.tsx     # Dashboard layout
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   └── ServiceCard.tsx         # Reusable service display card
│   └── icons/                      # SVG icons (SparkleIcon, etc.)
├── types/
│   ├── chat.types.ts               # Chat message, ChatAction types
│   └── business.types.ts           # Service, Business types
├── store/
│   ├── api/chatApi.ts              # RTK Query for chat
│   └── slices/chatSlice.ts         # Chat state persistence
└── contexts/
    ├── AuthContext.tsx             # Firebase auth state
    └── TourContext.tsx             # Tour state management
```

### Backend Structure
```
backend/src/
├── chat/                           # AI Chat module
│   ├── chat.controller.ts          # /chat/init, /chat endpoints
│   ├── chat.service.ts             # OpenAI/Groq integration + function calling
│   ├── chat.module.ts              # Module definition
│   ├── tool.registry.ts            # Routes tool calls to handlers
│   └── dto/chat.dto.ts             # Request/response DTOs, ChatAction
├── common/
│   ├── interfaces/
│   │   └── tool.interface.ts       # ToolHandler, ToolResult, ToolDefinition
│   ├── interceptors/
│   │   └── owner-resolver.interceptor.ts  # Resolves ownerId
│   └── decorators/
│       └── owner.decorator.ts      # @OwnerId() decorator
├── services/
│   ├── services.service.ts         # Service CRUD
│   └── service.tool-handler.ts     # manage_service tool handler
├── auth/                           # Firebase auth integration
├── business/                       # Business CRUD
├── bookings/                       # Booking management
├── customers/                      # Verified customers
├── email/                          # Resend email service
└── admin/                          # Admin endpoints
```

### AI Configuration (Environment Variables)
```
AI_API_KEY=         # Groq or OpenAI API key
AI_BASE_URL=        # https://api.groq.com/openai/v1 or OpenAI URL
AI_MODEL=           # llama-3.3-70b-versatile (default)
```

### Function Calling Architecture

```
User Message → ChatService
                   ↓
              OpenAI API (with tools)
                   ↓
              tool_calls detected?
                   ↓ yes
              ToolRegistry.process()
                   ↓
              ServiceToolHandler.handle()
                   ↓
              ToolResult (data for FE)
                   ↓
              ChatService → buildServiceAction()
                   ↓
              ChatResponseDto with ChatAction
                   ↓
              Frontend renders ServiceFormCard/ServiceCard
```

**Adding new tools:**
1. Create `{domain}.tool-handler.ts` in domain module
2. Implement `ToolHandler` interface
3. Register in `ToolRegistry`
4. Add action type to `ChatAction` union
5. Handle in `ChatMessage.tsx` renderAction()

---

## Third-Party Services

| Service | Purpose | Status |
|---------|---------|--------|
| Firebase | Authentication | Configured |
| Resend | Transactional emails | Configured |
| Groq/OpenAI | AI chat | Configured |

---

## Key Files Reference

| Purpose | File |
|---------|------|
| Strategy | `docs/AI_PRD.md` |
| Original PRD | `docs/PRD.md` |
| Frontend Guide | `docs/FRONTEND_GUIDE.md` |
| Backend Guide | `docs/BACKEND_GUIDE.md` |
| Phase 1.1 Plan | `docs/ai-first/phase1-1-simplified-onboarding-plan.md` |
| Tool Interface | `backend/src/common/interfaces/tool.interface.ts` |
| Tool Registry | `backend/src/chat/tool.registry.ts` |
| Service Tool Handler | `backend/src/services/service.tool-handler.ts` |
| Chat Types (FE) | `frontend/src/types/chat.types.ts` |
| Chat DTOs (BE) | `backend/src/chat/dto/chat.dto.ts` |
