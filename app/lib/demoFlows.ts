// 🎭 RedTape Demo Flow Configuration
// Edit triggers and responses here for easy demo customization

export interface DemoFlow {
  id: string;
  challenge: string;
  trigger: string[];
  response: {
    content: string;
    challengeAreas: string[];
    appliesTo: string[];
    actions?: string[];
    citations?: Array<{ title: string; source: string }>;
    jurisdictions?: Array<{ level: string; name: string; role: string }>;
    quickSuggestions?: string[];
    showForm?:
      | "abn"
      | "business-details"
      | "document-upload"
      | "jobseeker-details"
      | "carer-details"
      | "student-details";
    interactiveOptions?: Array<{
      label: string;
      value: string;
      followUp: string;
    }>;
  };
}

export const demoFlows: DemoFlow[] = [
  // Challenge 1: Smarter Services
  {
    id: "job-loss",
    challenge: "Smarter Services",
    trigger: ["lost my job", "jobseeker", "unemployed"],
    response: {
      content:
        "I'm sorry to hear about your job loss. I can help you navigate government support services.\n\nTo give you the most accurate guidance, I need to understand your situation better:",
      challengeAreas: ["services", "tax", "data"],
      appliesTo: ["Job Seeker", "Australia"],
      showForm: "jobseeker-details",
      quickSuggestions: [
        "Am I eligible for rent assistance?",
        "How do I report job applications?",
        "What training programs are available?",
        "How long does JobSeeker approval take?",
      ],
    },
  },

  {
    id: "carer",
    challenge: "Smarter Services",
    trigger: ["carer", "caring for", "become a carer"],
    response: {
      content:
        "Becoming a carer is a big responsibility. I can help you access the right government support.\n\nTo determine which services you're eligible for, I need some details about your caring situation:",
      challengeAreas: ["services", "data"],
      appliesTo: ["Carer", "Australia"],
      showForm: "carer-details",
      quickSuggestions: [
        "How much is Carer Payment?",
        "What respite services are available?",
        "Can I work while caring?",
        "How do I access emergency support?",
      ],
    },
  },

  // Challenge 2: Your Tax Just Happens
  {
    id: "cafe-owner",
    challenge: "Your Tax Just Happens",
    trigger: ["café", "cafe", "6 staff", "coffee shop"],
    response: {
      content:
        "A café with 6 staff has several tax obligations. Let me break this down:\n\n**Tax Compliance:** GST registration required (>$75k turnover)\n**Payroll Obligations:** PAYG withholding, superannuation\n**Employee Requirements:** Single Touch Payroll reporting\n\nDo you have an ABN for your café?",
      challengeAreas: ["tax", "compliance", "services"],
      appliesTo: ["Café Owner", "6 Employees"],
      showForm: "abn",
      quickSuggestions: [
        "How do I set up Single Touch Payroll?",
        "Can I claim coffee machine depreciation?",
        "What's the super guarantee rate?",
        "When are BAS lodgments due?",
      ],
    },
  },

  {
    id: "student-tax",
    challenge: "Your Tax Just Happens",
    trigger: ["student tax return", "student working", "part-time tax"],
    response: {
      content:
        "As a student working part-time, you have specific tax deduction opportunities. To give you accurate guidance, I need to know more about your situation:",
      challengeAreas: ["tax", "services"],
      appliesTo: ["Student", "Part-time Worker"],
      showForm: "student-details",
      quickSuggestions: [
        "Can I claim my laptop?",
        "What about travel to uni?",
        "Do I need to lodge if I earned under $18k?",
        "How do I get my payment summary?",
      ],
    },
  },

  // Challenge 3: Navigating Data Landscape
  {
    id: "employment-data",
    challenge: "Navigating Data Landscape",
    trigger: ["employment rates", "young people", "youth unemployment"],
    response: {
      content:
        "I can help you find employment data for young people:\n\n**Data Source:** ABS Labour Force Survey (monthly updates)\n**Current Stats:** Youth unemployment 8.1% (15-24 years)\n**Regional Breakdown:** Available by state and SA4 regions\n\nWhich specific area interests you?",
      challengeAreas: ["data", "services"],
      appliesTo: ["Data Researcher", "Australia"],
      citations: [
        { title: "Labour Force Survey", source: "ABS API" },
        { title: "Youth Employment Programs", source: "Federal Register" },
      ],
      quickSuggestions: [
        "Compare with education stats?",
        "Show regional breakdown?",
        "What support programs exist?",
        "Historical trends over 5 years?",
      ],
    },
  },

  {
    id: "business-apprentices",
    challenge: "Navigating Data Landscape",
    trigger: ["small businesses", "apprentices", "apprentice statistics"],
    response: {
      content:
        "Great question! I can cross-reference multiple datasets:\n\n**ABS Business Data:** 2.5M small businesses in Australia\n**Education Data:** 220k apprentices nationally\n**Cross-Analysis:** 12% of small businesses employ apprentices\n**Queensland Specific:** 15% higher apprentice uptake than national average",
      challengeAreas: ["data", "services", "compliance"],
      appliesTo: ["Business Owner", "Queensland"],
      citations: [
        { title: "Small Business Statistics", source: "ABS API" },
        { title: "Apprenticeship Data", source: "Federal Register" },
        { title: "Business Incentives", source: "ATO Dataset" },
      ],
      jurisdictions: [
        { level: "federal", name: "ABS", role: "Business Statistics" },
        {
          level: "federal",
          name: "Department of Education",
          role: "Apprentice Data",
        },
        {
          level: "state",
          name: "Queensland Government",
          role: "State Incentives",
        },
      ],
      quickSuggestions: [
        "What incentives exist for hiring apprentices?",
        "Show me training provider data",
        "Compare with other states",
        "What's the completion rate?",
      ],
    },
  },

  // Challenge 4: Red Tape Navigator
  {
    id: "painting-business",
    challenge: "Red Tape Navigator",
    trigger: [
      "painting business",
      "start painting business",
      "painting company",
    ],
    response: {
      content:
        "Great! Starting a painting business. Do you have an ABN? This helps me give you personalized guidance across tax, licensing, and compliance requirements.",
      challengeAreas: ["compliance", "tax", "services"],
      appliesTo: ["Painting Business"],
      showForm: "abn",
    },
  },

  {
    id: "corporate-compliance",
    challenge: "Red Tape Navigator",
    trigger: ["development project", "brisbane", "corporate compliance"],
    response: {
      content:
        "I can help you with development compliance, including regulatory requirements, tax implications, relevant datasets, and available government support. Would you like to upload project documents for comprehensive analysis?",
      challengeAreas: ["compliance", "tax", "data", "services"],
      appliesTo: ["Corporate", "Brisbane"],
      showForm: "document-upload",
    },
  },
];

// Helper function to match triggers
export function findMatchingFlow(input: string): DemoFlow | null {
  const lowerInput = input.toLowerCase();

  for (const flow of demoFlows) {
    const hasMatch = flow.trigger.some((trigger) =>
      lowerInput.includes(trigger.toLowerCase())
    );

    if (hasMatch) {
      return flow;
    }
  }

  return null;
}
