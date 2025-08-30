0. Product Pillars
   • Clarity over cleverness – plain language, short answers, visible citations.
   • Ephemeral chats, persistent portfolio – chats reset; extracted facts update a visible “memory.”
   • Context-first – every screen adapts to the user’s role (Business / Student / Housing / Travel / Corporate).
   • Explainability – always show “why you’re seeing this” and relevant sources.

⸻

1. Tech & Libraries
   • Framework: Next.js 15 (App Router)
   • Styling: Tailwind CSS + DaisyUI
   • Icons: lucide-react
   • Animations: framer-motion (subtle only)
   • Charts/graphs: recharts (if needed)

⸻

2. Theme & Tokens

Brand tone

Confident, civic, trustworthy. Clear hierarchy, generous whitespace, strong headings. BOLD RED branding.

DaisyUI theme (redtape)
• Primary: #D9392D (RedTape BOLD RED - main brand color)
• Secondary: #1F2937 (dark neutral for contrast)
• Accent: #0A65CC (blue for complementary actions)
• Neutral: #1F2937
• Base-100: #FFFFFF
• Base-200: #F5F7FA
• Base-300: #E5E7EB
• Info: #2563EB
• Success: #16A34A
• Warning: #F59E0B
• Error: #DC2626

Rounding: box 1rem, button 0.75rem, badge 1.9rem.
Buttons: sentence case.

Typography
• Headings: text-2xl / text-xl / text-lg
• Body: text-base
• Small: text-sm
• Line-height: 1.6

⸻

3. Layout Rules
   • Max width: max-w-screen-lg (content) or max-w-screen-xl (dashboards).
   • Gutters: px-4 md:px-6 lg:px-8.
   • Section spacing: py-6 md:py-8.
   • Cards for major sections; no floating div soup.
   • Always show a page title + short description + primary action.

⸻

4. Core UI Patterns

Context Launcher

Grid of cards for Business / Student / Housing / Travel / Corporate.
Each card: icon + label + short description.

Consentful Memory Toast

After portfolio change, show:
“Memory updated for this session: Painter in QLD, Employees: 3.”
Buttons: Undo • View • Edit.

Quick-Action Bubbles

Appear under assistant replies.
3–5 max, tailored to profile. Example for business: “Local permits” • “State laws” • “Financing options.”

Answer Block
• Title (echo question)
• Summary (2–4 bullets)
• “What applies to you” (chips: e.g., ABN QLD, Employees: 3)
• Steps / Next actions (ordered list)
• Citations (expandable, with sources)
• Checklist button

Checklist Panel

Right drawer (desktop) or bottom sheet (mobile).
Each item: label + due date hint + external link.
Exportable to PDF.

Visual Navigator

Simple horizontal flow: Federal → State → Local.
Agency chips clickable to scroll to citations.

Document Dropzone

Corporate mode only.
Drag-drop PDFs → summary shows Green/Amber/Red coverage.
“Show gaps” expands missing obligations.

⸻

5. Components & Styling
   • Buttons:
   • Primary: btn btn-primary
   • Secondary: btn btn-secondary
   • Ghost: btn btn-ghost
   • Inputs: input input-bordered w-full
   • Cards: card bg-base-100 shadow-sm
   • Badges:
   • Ghost for filters
   • Success/Warning/Error for status

Spacing:
• Inside cards: p-5 md:p-6
• Between stacked elements: space-y-4
• Between major sections: mt-8 md:mt-10

Corners: rounded-xl (cards), rounded-lg (inputs/buttons).
Shadows: shadow-sm by default.

⸻

6. Accessibility & Content
   • Contrast: minimum AA for all text.
   • Focus states: always visible.
   • Keyboard accessible.
   • Text: sentence case, no jargon, explain acronyms.

⸻

7. Page Templates
   • Landing: title, subtitle, context grid, “Start new chat.”
   • Chat: mode switcher, stream, quick-actions, checklist drawer, input at bottom.
   • Portfolio: “What we know” (chips) + “Where it’s used.” Buttons for Edit / Clear / Privacy.
   • Corporate: doc upload, coverage summary, gap list, export button.

⸻

8. Empty, Loading, Error States
   • Empty: friendly prompt + 2–3 suggested actions.
   • Loading: skeletons, no blocking spinners.
   • No results: show best links, ask clarifying question.
   • Error: plain message + retry.

⸻

9. Do & Don’t

Do
• Use DaisyUI components.
• Keep answers scannable.
• Always show at least 2 quick-action bubbles.
• Provide “Add to checklist.”

Don’t
• Don’t center long paragraphs.
• Don’t hide citations behind more than 1 click.
• Don’t use more than 1 primary button per screen.
• Don’t rely only on color to show meaning.

⸻

10. Copy Snippets
    • Memory toast:
    “Memory updated for this session: {{facts}}.” Undo • View • Edit
    • Why this answer:
    “Shown because your session profile includes: {{chips}}.”
    • Checklist CTA:
    “Add this requirement to your checklist.”
    • No determination:
    “I can’t determine this precisely from public data. Here are relevant links and the next step I recommend.”

⸻

11. QA Checklist
    • data-theme="redtape" applied
    • Mobile-friendly at 360px
    • Contrast at least AA
    • Answer block has Summary / Applies to you / Steps / Citations
    • At least 2 quick-action bubbles
    • Checklist works (add/remove)
    • Visual Navigator shows agencies (mocked OK)
    • Keyboard focusable
