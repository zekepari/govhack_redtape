RedTape is a Next.js 15 app that pairs Clerk auth with an Azure OpenAI-powered universal assistant for tax, services, and compliance. Portfolio data and the universal checklist are now persisted to `localStorage` so users keep context between sessions; a settings page lets users reset local data and sign out.

## Getting Started

```bash
npm run dev
# or: bun dev / pnpm dev / yarn dev
```

Open http://localhost:3000 and sign in with Clerk to access the dashboard and settings. Add your Azure OpenAI credentials in `.env` and set `ABR_GUID` for live ABN lookups.

## Key Paths
- `app/dashboard/page.tsx` — main assistant UI and forms
- `app/settings/page.tsx` — account info, local reset, logout
- `app/contexts/PortfolioContext.tsx` — portfolio/checklist state (persisted to localStorage)
- `app/api/chat/route.ts` — Azure OpenAI chat endpoint
- `app/api/abn/route.ts` — ABR lookup proxy

## Resetting Local Data
Use the Settings page “Reset profile & checklist” or clear the `redtape-portfolio-v1` key from browser storage. Settings also provides a Clerk logout button.
