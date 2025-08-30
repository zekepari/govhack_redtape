# 🔧 RedTape Technical Documentation

## 🏗️ Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + DaisyUI v5
- **State Management**: React Context API + useReducer
- **Icons**: lucide-react
- **Animations**: framer-motion (minimal, performance-focused)
- **Charts**: recharts (if needed for corporate mode)
- **Development**: Bun package manager

### Project Structure

```
/app
  /api            # API routes for AI integration
  /(auth)         # Auth group routes
    /login
    /signup
  /(main)         # Main app group
    /chat
    /portfolio
    /corporate
  /components     # Shared components
    /ui           # Base UI components
    /chat         # Chat-specific components
    /portfolio    # Portfolio components
    /corporate    # Corporate mode components
  /contexts       # React contexts
  /hooks          # Custom hooks
  /lib            # Utilities and helpers
  /types          # TypeScript types
```

## 🎨 Coding Standards & Conventions

### Component Naming

- PascalCase for components: `ChatMessage.tsx`
- camelCase for utilities: `formatDate.ts`
- kebab-case for CSS modules: `chat-message.module.css`
- Use descriptive names: `MemoryUpdateToast` not `Toast`

### File Organization

```tsx
// 1. Imports (external → internal → types)
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { ChatMessage } from "@/types/chat";

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Component
export function Component({ props }: ComponentProps) {
  // ...
}

// 4. Subcomponents (if any)
function SubComponent() {
  // ...
}
```

### TypeScript Guidelines

- Use `interface` for object shapes, `type` for unions/primitives
- Avoid `any` - use `unknown` or specific types
- Enable strict mode in tsconfig.json
- Export types from dedicated files

## 🔌 Core Systems Implementation

### 1. Context System Architecture

```tsx
// contexts/AppContext.tsx
interface AppState {
  user: User | null;
  portfolio: Portfolio;
  context: ContextMode;
  chat: ChatState;
  checklist: ChecklistItem[];
}

type ContextMode = "business" | "student" | "housing" | "travel" | "corporate";

// Use reducer for complex state updates
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "UPDATE_PORTFOLIO":
    // Show consent toast
    // Update portfolio with confirmation
    case "SWITCH_CONTEXT":
    // Change mode and update UI
  }
}
```

### 2. Portfolio/Memory System

```tsx
// Memory updates must be consent-driven
interface MemoryUpdate {
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
  confirmed: boolean;
}

// Toast notification for updates
function showMemoryToast(update: MemoryUpdate) {
  // Display: "Memory updated: [field]"
  // Actions: Undo | View | Edit
}
```

### 3. Chat Architecture

```tsx
// Ephemeral chat - doesn't persist between sessions
interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  context: ContextMode;
  sessionId: string; // Unique per chat session
}

// Message structure
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  metadata?: {
    citations?: Citation[];
    appliesTo?: string[]; // Portfolio filters
    actions?: string[]; // Step-by-step
    suggestions?: string[]; // Quick actions
  };
}
```

### 4. DaisyUI Theme Configuration

```css
/* app/globals.css */
@import "tailwindcss";
@plugin "daisyui";

[data-theme="redtape"] {
  --p: 6 90% 54%; /* #D9392D - Primary */
  --s: 213 80% 43%; /* #0A65CC - Secondary */
  --a: 174 72% 41%; /* #14B8A6 - Accent */
  --n: 216 19% 16%; /* #1F2937 - Neutral */
  --b1: 0 0% 100%; /* #FFFFFF - Base 100 */
  --b2: 216 24% 97%; /* #F5F7FA - Base 200 */
  --b3: 220 13% 91%; /* #E5E7EB - Base 300 */
  --in: 217 91% 53%; /* #2563EB - Info */
  --su: 142 71% 40%; /* #16A34A - Success */
  --wa: 33 91% 50%; /* #F59E0B - Warning */
  --er: 0 73% 53%; /* #DC2626 - Error */

  --rounded-box: 1rem;
  --rounded-btn: 0.75rem;
  --rounded-badge: 1.9rem;
}
```

## 🛠️ Utility Functions

### 1. Portfolio Utilities

```tsx
// lib/portfolio.ts
export function extractBusinessInfo(data: any): BusinessInfo {
  // Extract and validate business data
}

export function getApplicableFilters(
  portfolio: Portfolio,
  context: ContextMode
): string[] {
  // Return relevant portfolio attributes for current context
}

export function formatPortfolioDisplay(portfolio: Portfolio): DisplayItem[] {
  // Format for "What we know" view
}
```

### 2. Chat Utilities

```tsx
// lib/chat.ts
export function parseAIResponse(response: string): ChatMessage {
  // Extract sections: summary, applies-to, actions, citations
}

export function generateQuickActions(
  message: ChatMessage,
  portfolio: Portfolio
): string[] {
  // Context-aware suggestion generation
}

export function formatCitation(citation: Citation): string {
  // Format citation with source and link
}
```

### 3. Validation Utilities

```tsx
// lib/validation.ts
export function validateABN(abn: string): boolean {
  // Australian Business Number validation
}

export function validatePostcode(postcode: string, state: string): boolean {
  // Australian postcode validation
}
```

## 🎯 Performance Optimizations

### 1. Code Splitting

```tsx
// Dynamic imports for heavy components
const CorporateMode = dynamic(
  () => import("@/components/corporate/CorporateMode"),
  {
    loading: () => <LoadingSkeleton />,
  }
);
```

### 2. Memoization Strategy

```tsx
// Memoize expensive computations
const applicableFilters = useMemo(
  () => getApplicableFilters(portfolio, context),
  [portfolio, context]
);

// Memoize components with stable props
const MemoizedChatMessage = memo(ChatMessage);
```

### 3. State Updates

```tsx
// Batch updates to prevent re-renders
function updateMultipleFields(updates: Partial<Portfolio>) {
  dispatch({
    type: "BATCH_UPDATE_PORTFOLIO",
    payload: updates,
  });
}
```

## 🔐 Security Considerations

### 1. Input Sanitization

```tsx
// Sanitize user inputs before display
import DOMPurify from "isomorphic-dompurify";

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}
```

### 2. Data Privacy

- Portfolio data stored in localStorage (prototype only)
- Clear data on logout
- Consent required for all data saves
- No PII in console logs

## 📱 Responsive Design Utilities

### 1. Breakpoint Hooks

```tsx
// hooks/useBreakpoint.ts
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    // Listen to window resize
    // Update breakpoint accordingly
  }, []);

  return breakpoint;
}
```

### 2. Responsive Components

```tsx
// Conditional rendering based on breakpoint
function ChecklistPanel() {
  const breakpoint = useBreakpoint();

  if (breakpoint === "mobile") {
    return <BottomSheet>{/* content */}</BottomSheet>;
  }

  return <Drawer position="right">{/* content */}</Drawer>;
}
```

## 🧪 Testing Strategy

### 1. Component Testing

```tsx
// Use React Testing Library
describe("ChatMessage", () => {
  it("displays all required sections", () => {
    // Test summary, applies-to, actions, citations
  });

  it("shows quick action bubbles", () => {
    // Verify at least 2 bubbles appear
  });
});
```

### 2. Accessibility Testing

```tsx
// Automated a11y checks
import { axe } from "@axe-core/react";

// Manual checklist:
// - Keyboard navigation
// - Screen reader compatibility
// - Color contrast (AA minimum)
// - Focus indicators
```

## 🚀 Deployment Considerations

### Environment Variables

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=
OPENAI_API_KEY= # Server-side only
```

### Build Optimizations

```json
// next.config.ts
{
  "experimental": {
    "optimizeCss": true,
    "optimizePackageImports": ["lucide-react", "framer-motion"]
  }
}
```

## 📝 Code Snippets & Templates

### 1. Component Template

```tsx
// components/ComponentName.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ComponentNameProps {
  className?: string;
  children?: React.ReactNode;
}

export function ComponentName({ className, children }: ComponentNameProps) {
  const [state, setState] = useState();

  useEffect(() => {
    // Effect logic
  }, []);

  return <div className={cn("base-classes", className)}>{children}</div>;
}
```

### 2. API Route Template

```tsx
// app/api/route-name/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Process request

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### 3. Context Provider Template

```tsx
// contexts/ContextName.tsx
"use client";

import { createContext, useContext, useReducer } from "react";

interface ContextState {
  // State shape
}

const ContextName = createContext<{
  state: ContextState;
  dispatch: React.Dispatch<any>;
} | null>(null);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ContextName.Provider value={{ state, dispatch }}>
      {children}
    </ContextName.Provider>
  );
}

export function useContextName() {
  const context = useContext(ContextName);
  if (!context) {
    throw new Error("useContextName must be used within ContextProvider");
  }
  return context;
}
```

## 🔄 State Management Patterns

### 1. Optimistic Updates

```tsx
// Update UI immediately, rollback on error
async function updatePortfolio(field: string, value: any) {
  // 1. Optimistic update
  dispatch({ type: "UPDATE_PORTFOLIO_OPTIMISTIC", field, value });

  try {
    // 2. API call
    await api.updatePortfolio(field, value);

    // 3. Confirm update
    dispatch({ type: "UPDATE_PORTFOLIO_CONFIRM", field, value });
  } catch (error) {
    // 4. Rollback
    dispatch({ type: "UPDATE_PORTFOLIO_ROLLBACK", field });
  }
}
```

### 2. Derived State

```tsx
// Calculate derived values in selectors, not components
export function selectApplicableRegulations(state: AppState) {
  const { portfolio, context } = state;

  return regulations.filter(
    (reg) => reg.context === context && reg.applies(portfolio)
  );
}
```

## 🎨 UI Component Library

### Base Components to Create

1. `Button` - Extends DaisyUI with consistent props
2. `Card` - Wrapper with consistent spacing
3. `Input` - Form inputs with validation
4. `Badge` - Status and filter badges
5. `Toast` - Notification system
6. `Drawer` - Side panel for desktop
7. `BottomSheet` - Mobile alternative to drawer
8. `LoadingSkeleton` - Content placeholders
9. `EmptyState` - No content displays
10. `ErrorBoundary` - Error handling wrapper

## 🔑 Key Implementation Notes

1. **Ephemeral Chats**: Don't persist chat history, only extracted portfolio data
2. **Consent-Driven**: Always show what data is being saved with undo option
3. **Context-First**: Every component should adapt to current context mode
4. **Mobile-First**: Design for 360px minimum, enhance for larger screens
5. **Accessibility**: WCAG AA compliance is minimum requirement
6. **Performance**: Keep bundle size low, lazy load heavy components
7. **Type Safety**: No `any` types, full TypeScript coverage

## 🚦 Development Workflow

1. Check CHECKLIST.md for current task
2. Implement feature with TypeScript
3. Add responsive design
4. Test accessibility
5. Update portfolio if feature extracts data
6. Add to checklist functionality where applicable
7. Test on mobile (360px)
8. Update CHECKLIST.md progress

---

Remember: This is a hackathon prototype. Focus on demonstrating core value proposition over perfect code. Mock external APIs, use localStorage for persistence, and prioritize user experience over backend complexity.
