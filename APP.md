📋 RedTape Feature List

🔑 Core Experience
• Users can sign up / log in (but for prototype: lightweight entry point works too).
• Option to enter as Business or Individual.
• Ephemeral chats: each chat is temporary, clears when closed.
• Persistent profile/portfolio: structured facts remembered across chats (ABN, visa type, travel intent, housing goals, etc).
• Consent-driven memory updates: whenever data is saved to profile, user sees confirmation (“Memory updated: X”).
• Context switcher: users can select a mode (Business / Student / Housing / Travel / Corporate).

⸻

💬 Chat Assistant
• Conversational interface where user types questions.
• AI answers include:
• Plain-language summary.
• “What applies to you” section (portfolio filters).
• Step-by-step actions.
• Linked citations to laws, agencies, datasets.
• Quick-action bubbles appear under each answer with suggested follow-up questions.
• Chats can ask clarifying questions (e.g., “Do you employ staff?”).

⸻

🗂️ Portfolio (User Profile)
• Stores structured facts about the user:
• Business info: ABN, industry, state, employees, vehicles, apprentices, etc.
• Individual info: student visa, travel plans, income band, housing interest.
• Displays profile back to user in a “What we know” view.
• Users can edit, clear, or add new information at any time.
• Portfolio facts are used to personalise answers.

⸻

📑 Checklists
• Ability to add obligations or tasks from answers into a Checklist panel.
• Checklist can be:
• Viewed in a side drawer or bottom sheet.
• Marked as done / removed.
• Exported or downloaded (PDF, even mocked).
• Each checklist item shows: obligation, due hint, relevant link.

⸻

🗺️ Visual Navigator
• Simple diagram showing Federal → State → Local levels relevant to the query.
• Displays agency names/logos as clickable chips.
• Gives an overview of which bodies regulate the user’s query.

⸻

📤 Recommendations
• Context-aware suggestions appear after portfolio update or chat.
• Examples:
• After ABN entry → “Ask what state laws apply to you.”
• After saying “I employ staff” → “Ask about Fair Work obligations.”
• After adding housing intent → “Ask about first-home buyer schemes.”
• On landing, user is greeted with “Today you can ask about…” based on portfolio.

⸻

🏢 Corporate Mode
• Special flow for larger businesses or legal teams.
• Document upload: drag-drop PDF (policies, compliance docs).
• AI scans and maps coverage against relevant laws.
• Shows coverage summary (Green = covered, Amber = partial, Red = missing).
• Provides Gap Analysis: what obligations are not covered in the uploaded docs.
• Option to add missing obligations into the Checklist.

⸻

📊 Output & Trust
• Every answer includes citations and sources.
• Users can expand “Why am I seeing this?” → shows portfolio filters used.
• If AI cannot determine precisely, it should:
• Admit it can’t determine.
• Provide most relevant links.
• Suggest next step.
• Exportable compliance checklist at end of session.

⸻

🏠 Landing & Navigation
• Clean landing page with:
• Context cards (Business / Student / Housing / Travel / Corporate).
• Option to Start new chat.
• Option to Review profile.
• Minimal nav: Home • Chat • Portfolio • Corporate.

⸻

📱 Responsiveness
• Fully usable on mobile screens.
• Checklist panel collapses to bottom sheet.
• Context cards stack vertically.

⸻

🎨 UX Enhancements
• “Memory toast” whenever profile updated, with Undo/View/Edit.
• Animations: smooth fades/slides for chats and popups.
• Empty states with friendly text and suggested actions.
• Loading skeletons for cards/answers.
• Error states with retry.

⸻

🚦 Future-Ready Features (stretch goals, not needed for hackathon demo)
• Notifications/alerts when legislation changes relevant to portfolio.
• Saved “compliance twin” that grows richer over time.
• Team collaboration mode (corporate accounts).
• API integrations with ABR, ATO, Fair Work, DFAT, etc.
• Local government extensions (council-specific permits).
