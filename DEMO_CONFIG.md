# 🎛️ RedTape Demo Configuration

## 📝 **Easy Demo Editing**

Edit the triggers and responses in `/app/lib/demoFlows.ts` to customize demo behavior.

---

## 🎯 **Current Demo Triggers**

### **Challenge 1: Smarter Services**

**Job Loss:**

- **Trigger:** `lost my job` OR `jobseeker` OR `unemployed`
- **Test phrase:** `I just lost my job, what government help can I get?`

**Carer:**

- **Trigger:** `carer` OR `caring for` OR `become a carer`
- **Test phrase:** `I've just become a carer for my mum, what do I need to do?`

---

### **Challenge 2: Your Tax Just Happens**

**Cafe Owner:**

- **Trigger:** `café` OR `cafe` OR `6 staff` OR `coffee shop`
- **Test phrase:** `I run a café with 6 staff — what tax stuff do I need to know?`

**Student Worker:**

- **Trigger:** `student tax return` OR `student working` OR `part-time tax`
- **Test phrase:** `What can I claim on my tax return as a student working part-time?`

---

### **Challenge 3: Navigating Data Landscape**

**Employment Data:**

- **Trigger:** `employment rates` OR `young people` OR `youth unemployment`
- **Test phrase:** `Where can I see employment rates for young people?`

**Business Statistics:**

- **Trigger:** `small businesses` AND `apprentices` OR `apprentice statistics`
- **Test phrase:** `How many small businesses in Queensland hire apprentices?`

---

### **Challenge 4: Red Tape Navigator**

**Painting Business:**

- **Trigger:** `painting business` OR `painter` OR `start painting business`
- **Test phrase:** `I want to start a painting business in QLD, what rules do I follow?`

**Corporate Compliance:**

- **Trigger:** `development project` OR `brisbane` OR `corporate compliance`
- **Test phrase:** Upload any PDF file via chat input upload button

---

## ⚙️ **How to Edit Demos**

1. Open `/app/lib/demoFlows.ts`
2. Find the demo you want to edit
3. Modify:

   - **`trigger`**: Keywords that activate the demo
   - **`content`**: The AI response text
   - **`challengeAreas`**: Which challenges are covered
   - **`appliesTo`**: Context chips shown
   - **`actions`**: Next steps with "Add to checklist" buttons
   - **`quickSuggestions`**: Follow-up question bubbles

4. Save and test with your new triggers!

---

## 🎭 **Demo Flow Structure**

```typescript
{
  id: "unique-id",
  challenge: "Challenge Name",
  trigger: ["keyword1", "keyword2", "phrase"],
  response: {
    content: "AI response with **bold** formatting",
    challengeAreas: ["tax", "services", "data", "compliance"],
    appliesTo: ["Context", "Location"],
    actions: ["Step 1", "Step 2"],
    citations: [
      { title: "Source Title", source: "ATO Dataset" }
    ],
    quickSuggestions: ["Question 1?", "Question 2?"],
    showForm: "abn" // Optional: "abn", "business-details", "document-upload"
  }
}
```

---

## 🚀 **Adding New Demo Flows**

1. Add new object to `demoFlows` array
2. Define triggers and response
3. Test with your new phrase
4. Update this config file with the new trigger

Easy demo customization without touching the main dashboard code! 🎉

## 🏆 **GovHack Project Submission**

**Team name:** Bin Chicken LLC

**Project name:** RedTape

**Description:**

```
RedTape is an AI-powered assistant that helps Australians navigate government compliance with confidence. Unlike traditional government portals that force users into silos, RedTape provides a unified conversational interface that automatically routes questions across tax, services, data, and regulatory domains.

Key features:
• Universal chat interface that detects context from natural language questions
• Portfolio twin system that builds personalized profiles through conversation
• Consent-driven memory updates with full user control
• Interactive forms for ABN lookup, bank integration, and document analysis
• Cross-domain responses covering tax obligations, government services, data insights, and regulatory requirements
• Visual jurisdiction mapping (Federal → State → Local)
• Unified checklist that tracks obligations across all government areas
• Real-time compliance gap analysis for business documents

RedTape demonstrates that the four GovHack challenges aren't separate problems - they're interconnected aspects of citizen interaction with government. By unifying them in one intelligent interface, we've created a comprehensive solution that makes government accessible for all Australians.
```

**Tag list:**

```
AI, government services, tax compliance, regulatory navigation, data insights, chatbot, portfolio management, document analysis, unified experience, Australian government, Next.js, TypeScript, DaisyUI
```

**Data story:**

```
RedTape integrates multiple government data sources to provide comprehensive guidance:

• ATO Dataset: Business registration data, tax obligations, GST thresholds, BAS requirements
• Federal Register: Legislation, policy documents, service eligibility criteria
• ABS API: Employment statistics, business demographics, industry benchmarks
• State Legislation: Licensing requirements, local regulations, permit processes

The platform demonstrates cross-domain data utilization by connecting business ABN lookups with tax obligations, employment statistics with service eligibility, and regulatory requirements with industry-specific data. This unified approach eliminates the need for users to navigate multiple government websites and datasets separately.

Example: A painting business query automatically pulls ABN details from ATO, cross-references with Queensland licensing requirements, provides industry employment statistics, and suggests relevant government support programs - all from a single question.
```

**Source code url:**

```
https://github.com/[your-username]/govhack-redtape
```

**Video url:**

```
[Your demo video URL when recorded]
```

**Homepage url:**

```
https://redtape-govhack.vercel.app
```

This positions RedTape as a comprehensive solution that addresses all GovHack challenges through a unified user experience! 🎉
