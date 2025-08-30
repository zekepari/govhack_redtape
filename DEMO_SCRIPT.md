# 🎭 RedTape Demo Script

## 🚀 **Demo Flow - Business Context**

### **Step 1: Landing Page**

- Navigate to `http://localhost:3000`
- Show the landing page with mascot and context cards
- Click **"Go to Dashboard"** button

### **Step 2: Dashboard Overview**

- Point out the clean sidebar with context switching
- Show the Business context is active (red highlight)
- Explain the chat-first design

### **Step 3: Business Context Detection**

**Type in chat:**

```
I'm a painting business in QLD
```

**Expected Response:**

- Assistant asks for ABN
- ABN form appears inline in chat
- Explains why ABN helps with compliance

### **Step 4: ABN Lookup**

**Enter ABN in form:**

```
12 345 678 901
```

**Click "Look up"**

**Expected Response:**

- Shows "Painters Club QLD" found
- Shows location: postcode 4507, Queensland (City of Moreton Bay)
- Memory toast appears: "Memory updated: Added Painters Club QLD business details"
- Business details form appears asking for more info

### **Step 5: Business Details**

**Fill out the form:**

- **Employees:** `3`
- **Contractors:** `2`
- **Interstate:** ✅ Check the box
- **Additional info:** `We specialize in residential house painting and use eco-friendly paints`

**Click "Continue"**

**Expected Response:**

- Assistant confirms all details
- Right sidebar appears with Business Context
- Shows jurisdiction: Federal → Queensland → City of Moreton Bay
- Quick suggestion bubbles appear

### **Step 6: Follow-up Questions**

**Click on any suggestion bubble, for example:**

```
Workers compensation for 3 employees
```

**Expected Response:**

- Detailed answer about workers comp
- "What applies to you" chips show: Painters Club QLD, 3 Employees, etc.
- Action steps with "Add to checklist" buttons
- Citations to relevant laws
- New suggestion bubbles appear

### **Step 7: Demonstrate Features**

**Show the right sidebar:**

- Business Context with all details
- Jurisdiction breakdown (Federal/State/Local)
- Compliance status indicators

**Show the memory system:**

- Point out how profile was built through conversation
- Show consent-driven updates

**Show the checklist:**

- Click "Add to checklist" on any action item
- Show how obligations become trackable tasks

### **Step 8: Context Switching**

**Click "Student" in the sidebar**

**Expected Response:**

- Chat resets (ephemeral)
- New welcome message for student context
- Right sidebar disappears (no business context)
- Different suggestions appear

---

## 🎯 **Key Demo Points to Highlight**

### **1. Chat-First Experience**

- "Unlike traditional government portals, RedTape is conversation-first"
- "Just tell us about your situation in plain English"

### **2. Portfolio-Driven Personalization**

- "Notice how the assistant remembers your business details"
- "Every answer is filtered to your specific situation"
- "Chips show exactly why you're seeing this advice"

### **3. Consent-Driven Memory**

- "See the memory toast? You control what information is saved"
- "Undo, view, or edit your profile anytime"

### **4. Actionable Guidance**

- "Not just information - actionable next steps"
- "Add obligations directly to your checklist"
- "Track your compliance progress"

### **5. Trust & Transparency**

- "Every answer includes citations to official sources"
- "Federal → State → Local jurisdiction mapping"
- "Government-verified data only"

### **6. Ephemeral Chats**

- "Chats don't persist - only the useful facts do"
- "Switch contexts anytime for different guidance"
- "Clean slate for each conversation"

---

## 🔄 **Alternative Demo Paths**

### **Housing Context:**

```
I'm looking to buy my first home in Melbourne
```

### **Student Context:**

```
I'm an international student on a 485 visa
```

### **Travel Context:**

```
I need to visit family in India for 3 months
```

### **Corporate Context:**

```
We're planning a new development project in Brisbane
```

---

## ⚡ **Quick Recovery Commands**

If something breaks during demo:

**Reset Chat:**

- Click "New Chat" button

**Switch Context:**

- Click any context in sidebar to reset

**Clear Business Data:**

- Memory toast "Undo" button
- Or refresh page

---

## 🎪 **Demo Tips**

1. **Start with the problem:** "Navigating Australian compliance is confusing"
2. **Show the solution:** "RedTape makes it conversational and personal"
3. **Highlight the magic:** "It learns about you and adapts guidance"
4. **Emphasize trust:** "All backed by official government sources"
5. **Show the future:** "Imagine this for every government interaction"

**Total Demo Time:** 3-5 minutes

---

## 🏢 **Corporate Context Demo Flow**

### **Step 1: Switch to Corporate Mode**

- Click **"Corporate"** in the left sidebar
- Chat resets to corporate context
- Notice the orange corporate branding

### **Step 2: Upload Development Document**

- Notice the upload button (📄) in the chat input bar (only visible in corporate mode)
- Click the upload button in the chat input
- Upload **any PDF file** (content doesn't matter - we'll pretend it's development docs)
- File appears as user message: "📄 Uploaded: [filename]"
- Processing begins automatically (3 seconds)

**Expected Response (after 3 seconds):**

- "I've analyzed your document [filename] for the Brisbane development project"
- Shows compliance gap analysis
- Right sidebar appears with project context

### **Step 4: Review Compliance Analysis**

**Right sidebar shows:**

- **Project Context**: Brisbane Development Corp, Mixed-Use Development, Brisbane CBD
- **Compliance Overview**: Environmental (covered), Planning (partial), Safety (missing)
- **Brisbane Jurisdiction**: Federal → State → Local breakdown
- **Gap Summary**: 2 covered, 1 partial, 3 missing

**Chat shows detailed breakdown:**

- Environmental: ✅ Covered (EIA, Water Management)
- Planning & Zoning: ⚠️ Partial (Missing Heritage Assessment)
- Safety & Construction: ❌ Missing (Safety Plan, Fire Design, Accessibility)

### **Step 5: Follow-up Questions**

**Click suggestion bubbles:**

- "How do I get a Heritage Assessment?"
- "What's required for fire safety design?"
- "Brisbane City Council development fees"
- "Timeline for development approval"

### **Key Corporate Demo Points:**

- **Document Analysis**: Upload → Instant compliance review
- **Gap Analysis**: Green/Amber/Red coverage mapping
- **Jurisdiction Mapping**: Federal/State/Local requirements
- **Actionable Steps**: Specific next actions with "Add to checklist"
- **Citations**: Direct links to relevant regulations

**Corporate Demo Time:** 2-3 minutes
