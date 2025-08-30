"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  Home,
  Plane,
  Building2,
  GraduationCap,
  Send,
  MessageSquare,
  CheckCircle,
  Sparkles,
  Shield,
  Bot,
  Plus,
  ArrowRight,
  X,
  Menu,
  ExternalLink,
  ChevronRight,
  MapPin,
  Building,
  Upload,
  FileText,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { usePortfolio, type ContextMode, type ChecklistItem } from "../contexts/PortfolioContext";
import { MemoryToast } from "../components/MemoryToast";

type ChallengeArea = "tax" | "services" | "data" | "compliance";

interface Citation {
  title: string;
  source: "Federal Register" | "ATO Dataset" | "ABS API" | "State Legislation";
  url?: string;
}

interface Jurisdiction {
  level: "federal" | "state" | "local";
  name: string;
  role: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    // Multi-challenge coverage
    challengeAreas?: ChallengeArea[];
    
    // Portfolio context chips
    appliesTo?: string[];
    
    // Universal features
    actions?: string[];
    citations?: Citation[];
    
    // Visual navigator
    jurisdictions?: Jurisdiction[];
    
    // Quick actions (adaptive)
    quickSuggestions?: string[];
    
    // Checklist items
    checklistItems?: Array<{
      title: string;
      description?: string;
      dueDate?: string;
      agency: string;
      priority: "high" | "medium" | "low";
      category: ChallengeArea;
    }>;
  };
  showForm?: "abn" | "business-details" | "document-upload" | "portfolio-setup";
}

interface BusinessContext {
  businessName?: string;
  abn?: string;
  industry?: string;
  postcode?: string;
  state?: string;
  localGov?: string;
  employees?: number;
  contractors?: number;
  interstate?: boolean;
  additionalInfo?: string;
}

interface CorporateContext {
  companyName?: string;
  projectType?: string;
  location?: string;
  uploadedDocs?: string[];
  complianceGaps?: Array<{
    category: string;
    status: "covered" | "partial" | "missing";
    requirements: string[];
  }>;
}

// Challenge area colors and labels
const challengeConfig = {
  tax: { label: "Tax & Compliance", color: "bg-red-500", textColor: "text-red-500" },
  services: { label: "Government Services", color: "bg-blue-500", textColor: "text-blue-500" },
  data: { label: "Data & Insights", color: "bg-green-500", textColor: "text-green-500" },
  compliance: { label: "Regulatory Navigation", color: "bg-purple-500", textColor: "text-purple-500" },
};

// AI routing logic
const analyzeQuestion = (question: string, portfolio: any): ChallengeArea[] => {
  const challengeAreas: ChallengeArea[] = [];
  const lowerQuestion = question.toLowerCase();
  
  // Tax keywords
  if (/\b(tax|gst|bas|abn|payg|super|deduction|ato|quarterly|annual|return)\b/i.test(lowerQuestion)) {
    challengeAreas.push("tax");
  }
  
  // Services keywords  
  if (/\b(support|benefit|payment|job|unemployed|study|visa|centrelink|medicare|services|apply)\b/i.test(lowerQuestion)) {
    challengeAreas.push("services");
  }
  
  // Data keywords
  if (/\b(data|dataset|stats|statistics|api|abs|research|insights|trends|numbers)\b/i.test(lowerQuestion)) {
    challengeAreas.push("data");
  }
  
  // Compliance keywords
  if (/\b(permit|license|regulation|compliance|agency|law|legal|requirement|obligation|council)\b/i.test(lowerQuestion)) {
    challengeAreas.push("compliance");
  }
  
  // If no specific area detected, default to compliance
  if (challengeAreas.length === 0) {
    challengeAreas.push("compliance");
  }
  
  return challengeAreas;
};

const contextOptions = [
  { id: "business", icon: Briefcase, label: "Business", color: "bg-red-500" },
  {
    id: "student",
    icon: GraduationCap,
    label: "Student",
    color: "bg-blue-500",
  },
  { id: "housing", icon: Home, label: "Housing", color: "bg-green-500" },
  { id: "travel", icon: Plane, label: "Travel", color: "bg-purple-500" },
  {
    id: "corporate",
    icon: Building2,
    label: "Corporate",
    color: "bg-orange-500",
  },
];

export default function DashboardPage() {
  const { state, switchContext, addChecklistItem, toggleChecklistItem, removeChecklistItem } = usePortfolio();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMemoryToast, setShowMemoryToast] = useState(false);
  const [businessContext, setBusinessContext] = useState<BusinessContext>({});
  const [corporateContext, setCorporateContext] = useState<CorporateContext>(
    {}
  );
  const [abnInput, setAbnInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [businessDetailsForm, setBusinessDetailsForm] = useState({
    employees: "",
    contractors: "",
    interstate: false,
    additionalInfo: "",
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your RedTape assistant. I can help you with tax compliance, government services, data insights, and regulatory navigation across all levels of Australian government. What would you like to know?",
      timestamp: new Date(),
      metadata: {
        quickSuggestions: [
          "How do I register for GST?",
          "What support is available after job loss?",
          "Show me employment statistics for my area",
          "What permits do I need for my business?",
        ],
      },
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    // Universal AI routing and response generation
    setTimeout(() => {
      const challengeAreas = analyzeQuestion(currentInput, state.portfolio);
      let aiResponse: ChatMessage;

      // Multi-challenge response logic
      if (
        (currentInput.toLowerCase().includes("painting") || currentInput.toLowerCase().includes("painter")) &&
        (currentInput.toLowerCase().includes("qld") || currentInput.toLowerCase().includes("queensland")) &&
        currentInput.toLowerCase().includes("employees")
      ) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Great! A painting business in Queensland. I can help you with tax obligations, licensing requirements, government support programs, and industry data. To give you personalized guidance across all these areas, do you have an ABN?",
          timestamp: new Date(),
          showForm: "abn",
          metadata: {
            challengeAreas: ["tax", "compliance", "services", "data"],
            appliesTo: ["Painting Business", "Queensland"],
          },
        };
      } else if (
        currentInput.toLowerCase().includes("development") ||
        currentInput.toLowerCase().includes("brisbane") ||
        currentInput.toLowerCase().includes("project")
      ) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I can help you with development compliance, including regulatory requirements, tax implications, relevant datasets, and available government support. Would you like to upload project documents for comprehensive analysis?",
          timestamp: new Date(),
          showForm: "document-upload",
          metadata: {
            challengeAreas: ["compliance", "tax", "data", "services"],
          },
        };
      } else {
        // Generate multi-challenge response
        const responseContent = generateUniversalResponse(currentInput, challengeAreas, state.portfolio);
        
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseContent.content,
          timestamp: new Date(),
          metadata: {
            challengeAreas,
            appliesTo: responseContent.appliesTo,
            actions: responseContent.actions,
            citations: responseContent.citations,
            jurisdictions: responseContent.jurisdictions,
            quickSuggestions: responseContent.quickSuggestions,
            checklistItems: responseContent.checklistItems,
          },
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Universal response generator
  const generateUniversalResponse = (question: string, challengeAreas: ChallengeArea[], portfolio: any) => {
    const lowerQuestion = question.toLowerCase();
    
    // Sample responses that cover multiple challenge areas
    if (lowerQuestion.includes("gst") || lowerQuestion.includes("register")) {
      return {
        content: `GST registration affects multiple aspects of your business:\n\n**Tax Compliance:** You need to register if your turnover exceeds $75,000\n**Government Services:** Access to business support programs\n**Data Insights:** Your industry has a 23% GST registration rate\n**Regulatory Requirements:** State-specific licensing may also apply`,
        appliesTo: portfolio.business ? [`${portfolio.business.businessName || 'Your Business'}`, portfolio.business.state || 'Australia'] : ['Business Owner'],
        actions: [
          "Register for GST via ATO Business Portal",
          "Set up quarterly BAS reporting",
          "Review state licensing requirements",
          "Explore business support programs"
        ],
        citations: [
          { title: "GST Registration Requirements", source: "ATO Dataset" as const },
          { title: "Business Support Programs", source: "Federal Register" as const },
          { title: "Industry Statistics", source: "ABS API" as const }
        ],
        jurisdictions: [
          { level: "federal" as const, name: "Australian Taxation Office", role: "GST Registration" },
          { level: "state" as const, name: portfolio.business?.state || "State Government", role: "Business Licensing" },
          { level: "local" as const, name: portfolio.business?.localGov || "Local Council", role: "Permits & Approvals" }
        ],
        quickSuggestions: [
          "How do I lodge my first BAS?",
          "What business grants are available?",
          "Show me industry benchmarks",
          "What local permits do I need?"
        ],
        checklistItems: [
          {
            title: "Register for GST",
            description: "Complete GST registration via ATO",
            agency: "Australian Taxation Office",
            priority: "high" as const,
            category: "tax" as const
          },
          {
            title: "Set up BAS reporting",
            description: "Configure quarterly business activity statements",
            agency: "Australian Taxation Office",
            priority: "high" as const,
            category: "tax" as const
          }
        ]
      };
    }
    
    // Default universal response
    return {
      content: `I can help you with "${question}" across multiple areas:\n\n${challengeAreas.map(area => `**${challengeConfig[area].label}:** Relevant requirements and opportunities`).join('\n')}\n\nWhat specific aspect would you like to explore first?`,
      appliesTo: portfolio.business ? [`${portfolio.business.businessName || 'Your Business'}`] : ['Individual'],
      actions: ["Explore specific requirements", "Review applicable regulations", "Check available support"],
      citations: [{ title: "Australian Government Requirements", source: "Federal Register" as const }],
      jurisdictions: [
        { level: "federal" as const, name: "Australian Government", role: "Policy & Legislation" },
        { level: "state" as const, name: "State Government", role: "Implementation" },
        { level: "local" as const, name: "Local Government", role: "Local Requirements" }
      ],
      quickSuggestions: challengeAreas.map(area => `Tell me more about ${challengeConfig[area].label.toLowerCase()}`),
      checklistItems: []
    };
  };

  const handleAddToChecklist = (item: any) => {
    addChecklistItem(item);
    // Show confirmation toast
    setShowMemoryToast(true);
  };

  const handleAbnSubmit = () => {
    if (!abnInput.trim()) return;

    setIsTyping(true);

    // Mock ABN lookup - only returns business name, postcode, state
    setTimeout(() => {
      const businessData: BusinessContext = {
        businessName: "Painters Club QLD",
        abn: abnInput,
        postcode: "4507",
        state: "Queensland",
        localGov: "City of Moreton Bay",
      };

      setBusinessContext(businessData);
      setShowMemoryToast(true);

      const response: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content:
          "Great! I found your business: Painters Club QLD, located in postcode 4507, Queensland (City of Moreton Bay).\n\nTo give you the most accurate compliance guidance, I need a few more details:",
        timestamp: new Date(),
        showForm: "business-details",
      };

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
      setAbnInput("");
    }, 2000);
  };

  const handleBusinessDetailsSubmit = () => {
    setIsTyping(true);

    setTimeout(() => {
      // Update business context with additional details
      const updatedContext: BusinessContext = {
        ...businessContext,
        employees: parseInt(businessDetailsForm.employees) || 0,
        contractors: parseInt(businessDetailsForm.contractors) || 0,
        interstate: businessDetailsForm.interstate,
        additionalInfo: businessDetailsForm.additionalInfo,
        industry: "Painting Services",
      };

      setBusinessContext(updatedContext);

      const response: ChatMessage = {
        id: (Date.now() + 3).toString(),
        role: "assistant",
        content: `Perfect! Now I have everything I need:\n\n• Painters Club QLD\n• ${
          businessDetailsForm.employees
        } employees\n• ${businessDetailsForm.contractors} contractors\n• ${
          businessDetailsForm.interstate
            ? "Operating interstate"
            : "Operating in Queensland only"
        }\n\nI can now give you specific compliance guidance. What would you like to know about?`,
        timestamp: new Date(),
        metadata: {
          appliesTo: [
            "Painters Club QLD",
            "City of Moreton Bay QLD",
            `${businessDetailsForm.employees} Employees`,
            `${businessDetailsForm.contractors} Contractors`,
            "Painting Services",
          ],
          quickSuggestions: [
            "What painting licenses do I need in QLD?",
            `Workers compensation for ${businessDetailsForm.employees} employees`,
            "Public liability insurance requirements",
            "Chemical handling and safety regulations",
            "Local council permit requirements",
          ],
        },
      };

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);

      // Reset form
      setBusinessDetailsForm({
        employees: "",
        contractors: "",
        interstate: false,
        additionalInfo: "",
      });
    }, 2000);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleDocumentUpload = (file: File) => {
    setUploadedFile(file);
    setIsTyping(true);

    // Mock document analysis
    setTimeout(() => {
      const corporateData: CorporateContext = {
        companyName: "Brisbane Development Corp",
        projectType: "Mixed-Use Development",
        location: "Brisbane CBD",
        uploadedDocs: [file.name],
        complianceGaps: [
          {
            category: "Environmental",
            status: "covered",
            requirements: [
              "Environmental Impact Assessment",
              "Water Management Plan",
            ],
          },
          {
            category: "Planning & Zoning",
            status: "partial",
            requirements: [
              "Development Application",
              "Building Code Compliance",
              "Heritage Assessment (MISSING)",
            ],
          },
          {
            category: "Safety & Construction",
            status: "missing",
            requirements: [
              "Construction Safety Plan (MISSING)",
              "Fire Safety Design (MISSING)",
              "Accessibility Compliance (MISSING)",
            ],
          },
        ],
      };

      setCorporateContext(corporateData);
      setShowMemoryToast(true);

      const response: ChatMessage = {
        id: (Date.now() + 3).toString(),
        role: "assistant",
        content: `I've analyzed your document "${file.name}" for the Brisbane development project.\n\nHere's your compliance coverage analysis:`,
        timestamp: new Date(),
        metadata: {
          appliesTo: [
            "Brisbane Development Corp",
            "Mixed-Use Development",
            "Brisbane CBD",
          ],
          actions: [
            "Obtain Heritage Assessment from Brisbane City Council",
            "Develop Construction Safety Plan (AS 1657:2018)",
            "Complete Fire Safety Design (BCA compliance)",
            "Ensure accessibility compliance (DDA requirements)",
          ],
          citations: [
            "Brisbane City Plan 2014",
            "Queensland Development Code",
            "Building Code of Australia",
            "Disability Discrimination Act 1992",
          ],
          quickSuggestions: [
            "How do I get a Heritage Assessment?",
            "What's required for fire safety design?",
            "Brisbane City Council development fees",
            "Timeline for development approval",
          ],
        },
      };

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 3000);
  };

  // Remove context selection - we now use universal chat
  const selectedContextOption = { icon: Bot, label: "Universal", color: "bg-primary" };

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Compact Sidebar */}
      <div className="drawer-side">
        <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
        <aside className="min-h-full w-64 bg-base-100 border-r border-base-300 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-bold text-red">
                RedTape
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="btn btn-ghost btn-sm btn-square lg:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="p-4 border-b border-base-300">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">
              Your Portfolio
            </h3>
            <div className="space-y-2">
              {state.portfolio.business && (
                <div className="bg-base-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      {state.portfolio.business.businessName || "Business"}
                    </span>
                  </div>
                  {state.portfolio.business.industry && (
                    <p className="text-xs text-base-content/70 mt-1">
                      {state.portfolio.business.industry}
                    </p>
                  )}
                </div>
              )}
              {state.portfolio.individual && (
                <div className="bg-base-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Individual</span>
                  </div>
                  {state.portfolio.individual.visaType && (
                    <p className="text-xs text-base-content/70 mt-1">
                      {state.portfolio.individual.visaType}
                    </p>
                  )}
                </div>
              )}
              {!state.portfolio.business && !state.portfolio.individual && (
                <div className="text-center py-4">
                  <p className="text-sm text-base-content/70">
                    No portfolio data yet
                  </p>
                  <button className="btn btn-xs btn-primary mt-2">
                    Set up profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Universal Checklist */}
          <div className="p-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                Universal Checklist
              </h3>
              <span className="text-xs text-base-content/70">
                {state.checklist.length} items
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {state.checklist.slice(0, 5).map((item) => (
                <div key={item.id} className="bg-base-200 rounded p-2">
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 ${
                        item.completed
                          ? "bg-success border-success"
                          : "border-base-content/30"
                      }`}
                    >
                      {item.completed && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${
                        item.completed ? "line-through opacity-60" : ""
                      }`}>
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-xs px-1 py-0.5 rounded text-white ${
                          item.category === "tax" ? "bg-red-500" :
                          item.category === "services" ? "bg-blue-500" :
                          item.category === "data" ? "bg-green-500" :
                          item.category === "compliance" ? "bg-purple-500" :
                          "bg-gray-500"
                        }`}>
                          {challengeConfig[item.category]?.label || item.category}
                        </span>
                        <span className={`text-xs px-1 py-0.5 rounded ${
                          item.priority === "high" ? "bg-error" :
                          item.priority === "medium" ? "bg-warning" : "bg-info"
                        } text-white`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {state.checklist.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-base-content/70">
                    No checklist items yet
                  </p>
                  <p className="text-xs text-base-content/50 mt-1">
                    Items will appear here from chat conversations
                  </p>
                </div>
              )}
              
              {state.checklist.length > 5 && (
                <div className="text-center">
                  <button className="text-xs text-primary hover:underline">
                    View all {state.checklist.length} items
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Trust Footer */}
          <div className="p-4 bg-success/5 border-t border-success/10">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-xs font-semibold text-success">
                Government Verified
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Main Chat Layout */}
      <div className="drawer-content flex h-screen">
        {/* Chat Area - Full Width */}
        <main className="flex-1 flex flex-col">
          {/* Minimal Header */}
          <header className="border-b border-base-300 p-4 bg-base-100 flex-shrink-0">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="btn btn-ghost btn-sm btn-square lg:hidden"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  {selectedContextOption && (
                    <>
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center ${selectedContextOption.color}`}
                      >
                        <selectedContextOption.icon className="w-3 h-3 text-white" />
                      </div>
                                        <span className="font-medium">
                    RedTape Universal Assistant
                  </span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: "welcome-new",
                      role: "assistant",
                      content:
                        "Hi! I'm your RedTape assistant. I can help you with tax compliance, government services, data insights, and regulatory navigation across all levels of Australian government. What would you like to know?",
                      timestamp: new Date(),
                      metadata: {
                        quickSuggestions: [
                          "How do I register for GST?",
                          "What support is available after job loss?",
                          "Show me employment statistics for my area",
                          "What permits do I need for my business?",
                        ],
                      },
                    },
                  ]);
                  setBusinessContext({});
                  setCorporateContext({});
                }}
                className="btn btn-ghost btn-sm"
              >
                New Chat
              </button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
                <div className="space-y-8">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-4">
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {message.role === "user" ? (
                            <div className="w-8 h-8 bg-base-300 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selectedContextOption?.color || "bg-primary"
                              }`}
                            >
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Message */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {message.role === "user"
                                ? "You"
                                : "RedTape Assistant"}
                            </span>
                            <span className="text-xs text-base-content/50">
                              {isClient ? message.timestamp.toLocaleTimeString('en-AU', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false 
                              }) : '--:--'}
                            </span>
                          </div>

                          <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-line text-base leading-relaxed">
                              {message.content}
                            </p>
                          </div>

                          {/* Challenge Area Tags */}
                          {message.metadata?.challengeAreas && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {message.metadata.challengeAreas.map((area) => (
                                <span
                                  key={area}
                                  className={`badge badge-sm text-white ${
                                    area === "tax" ? "bg-red-500" :
                                    area === "services" ? "bg-blue-500" :
                                    area === "data" ? "bg-green-500" :
                                    area === "compliance" ? "bg-purple-500" :
                                    "bg-gray-500"
                                  }`}
                                >
                                  {challengeConfig[area]?.label}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* ABN Form */}
                          {message.showForm === "abn" && (
                            <div className="bg-base-200 rounded-lg p-4 max-w-md">
                              <h4 className="font-semibold mb-3">
                                Enter your ABN
                              </h4>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={abnInput}
                                  onChange={(e) => setAbnInput(e.target.value)}
                                  placeholder="12 345 678 901"
                                  className="input input-bordered input-sm flex-1"
                                />
                                <button
                                  onClick={handleAbnSubmit}
                                  disabled={!abnInput.trim()}
                                  className="btn btn-primary btn-sm"
                                >
                                  Look up
                                </button>
                              </div>
                              <p className="text-xs text-base-content/70 mt-2">
                                This helps me find your specific compliance
                                requirements
                              </p>
                            </div>
                          )}

                          {/* Document Upload Form */}
                          {message.showForm === "document-upload" && (
                            <div className="bg-base-200 rounded-lg p-4 max-w-lg">
                              <h4 className="font-semibold mb-4">
                                Upload Project Documents
                              </h4>
                              <div className="space-y-4">
                                <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                  <Upload className="w-8 h-8 text-base-content/50 mx-auto mb-2" />
                                  <p className="text-sm font-medium mb-1">
                                    Drop files here or click to browse
                                  </p>
                                  <p className="text-xs text-base-content/70">
                                    PDF, DOC, DOCX up to 10MB
                                  </p>
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleDocumentUpload(file);
                                    }}
                                    className="hidden"
                                    id="file-upload"
                                  />
                                  <label
                                    htmlFor="file-upload"
                                    className="btn btn-primary btn-sm mt-3"
                                  >
                                    Select Document
                                  </label>
                                </div>

                                {uploadedFile && (
                                  <div className="bg-base-100 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-primary" />
                                      <span className="text-sm font-medium">
                                        {uploadedFile.name}
                                      </span>
                                      <span className="text-xs text-base-content/70">
                                        ({Math.round(uploadedFile.size / 1024)}
                                        KB)
                                      </span>
                                    </div>
                                  </div>
                                )}

                                <p className="text-xs text-base-content/70">
                                  I'll analyze your documents against Australian
                                  development regulations and identify any
                                  compliance gaps.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Business Details Form */}
                          {message.showForm === "business-details" && (
                            <div className="bg-base-200 rounded-lg p-4 max-w-lg">
                              <h4 className="font-semibold mb-4">
                                Tell me more about your business
                              </h4>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="label label-text text-xs">
                                      Number of employees
                                    </label>
                                    <input
                                      type="number"
                                      value={businessDetailsForm.employees}
                                      onChange={(e) =>
                                        setBusinessDetailsForm((prev) => ({
                                          ...prev,
                                          employees: e.target.value,
                                        }))
                                      }
                                      placeholder="0"
                                      className="input input-bordered input-sm w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="label label-text text-xs">
                                      Number of contractors
                                    </label>
                                    <input
                                      type="number"
                                      value={businessDetailsForm.contractors}
                                      onChange={(e) =>
                                        setBusinessDetailsForm((prev) => ({
                                          ...prev,
                                          contractors: e.target.value,
                                        }))
                                      }
                                      placeholder="0"
                                      className="input input-bordered input-sm w-full"
                                    />
                                  </div>
                                </div>

                                <div className="form-control">
                                  <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                      type="checkbox"
                                      checked={businessDetailsForm.interstate}
                                      onChange={(e) =>
                                        setBusinessDetailsForm((prev) => ({
                                          ...prev,
                                          interstate: e.target.checked,
                                        }))
                                      }
                                      className="checkbox checkbox-primary checkbox-sm"
                                    />
                                    <span className="label-text text-sm">
                                      Do you operate interstate?
                                    </span>
                                  </label>
                                </div>

                                <div>
                                  <label className="label label-text text-xs">
                                    Additional information (optional)
                                  </label>
                                  <textarea
                                    value={businessDetailsForm.additionalInfo}
                                    onChange={(e) =>
                                      setBusinessDetailsForm((prev) => ({
                                        ...prev,
                                        additionalInfo: e.target.value,
                                      }))
                                    }
                                    placeholder="Any specific details about your business operations..."
                                    className="textarea textarea-bordered textarea-sm w-full h-20"
                                  />
                                </div>

                                <button
                                  onClick={handleBusinessDetailsSubmit}
                                  className="btn btn-primary btn-sm w-full"
                                >
                                  Continue
                                </button>
                              </div>
                            </div>
                          )}

                          {/* RedTape Answer Block */}
                          {message.role === "assistant" && message.metadata && (
                            <div className="space-y-4">
                              {/* What Applies to You */}
                              {message.metadata.appliesTo && (
                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                                  <p className="text-sm font-semibold mb-2 text-primary">
                                    What applies to you:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {message.metadata.appliesTo.map(
                                      (item, i) => (
                                        <span
                                          key={i}
                                          className="badge badge-primary"
                                        >
                                          {item}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Action Steps */}
                              {message.metadata.actions && (
                                <div className="bg-base-200 rounded-lg p-4">
                                  <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    Next steps:
                                  </p>
                                  <ol className="space-y-3">
                                    {message.metadata.actions.map(
                                      (action, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-3"
                                        >
                                          <span className="w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {i + 1}
                                          </span>
                                          <div className="flex-1">
                                            <span className="text-sm">
                                              {action}
                                            </span>
                                            <button 
                                              onClick={() => handleAddToChecklist({
                                                title: action,
                                                agency: "Government Agency",
                                                priority: "medium",
                                                category: message.metadata?.challengeAreas?.[0] || "compliance"
                                              })}
                                              className="btn btn-xs btn-primary ml-2"
                                            >
                                              <Plus className="w-3 h-3" />
                                              Add to checklist
                                            </button>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ol>
                                </div>
                              )}

                              {/* Citations */}
                              {message.metadata.citations && (
                                <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                                  <p className="text-sm font-semibold mb-2 text-info">
                                    Sources & Citations:
                                  </p>
                                  <div className="space-y-2">
                                    {message.metadata.citations.map(
                                      (citation, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                          <ExternalLink className="w-3 h-3 text-info mt-0.5 flex-shrink-0" />
                                          <div>
                                            <Link
                                              href={citation.url || "/dashboard"}
                                              className="text-sm text-info hover:underline font-medium"
                                            >
                                              {citation.title}
                                            </Link>
                                            <p className="text-xs text-info/70">
                                              {citation.source}
                                            </p>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Jurisdictions Navigator */}
                              {message.metadata.jurisdictions && (
                                <div className="bg-base-200 rounded-lg p-4">
                                  <p className="text-sm font-semibold mb-3">
                                    Regulatory Pathway:
                                  </p>
                                  <div className="flex items-center gap-2 text-xs flex-wrap">
                                    {message.metadata.jurisdictions.map((jurisdiction, i) => (
                                      <div key={i} className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                          <span className={`badge ${
                                            jurisdiction.level === "federal" ? "badge-error" :
                                            jurisdiction.level === "state" ? "badge-warning" :
                                            "badge-success"
                                          }`}>
                                            {jurisdiction.name}
                                          </span>
                                          <span className="text-xs text-base-content/70">
                                            {jurisdiction.role}
                                          </span>
                                        </div>
                                        {i < message.metadata.jurisdictions!.length - 1 && (
                                          <ChevronRight className="w-3 h-3 text-base-content/50" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                                                        {/* Legacy Visual Navigator - now handled in jurisdictions */}
                          {businessContext.state && !message.metadata?.jurisdictions && (
                            <div className="bg-base-200 rounded-lg p-4">
                              <p className="text-sm font-semibold mb-3">
                                Regulatory Pathway:
                              </p>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="badge badge-error">
                                  Federal (ATO)
                                </span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="badge badge-warning">
                                  Queensland
                                </span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="badge badge-success">
                                  {businessContext.localGov}
                                </span>
                              </div>
                            </div>
                          )}

                              {/* Corporate Compliance Analysis */}
                              {corporateContext.complianceGaps && (
                                  <div className="bg-base-200 rounded-lg p-4">
                                    <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4 text-warning" />
                                      Compliance Gap Analysis:
                                    </p>
                                    <div className="space-y-3">
                                      {corporateContext.complianceGaps.map(
                                        (gap, i) => (
                                          <div key={i} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              <span
                                                className={`w-3 h-3 rounded-full ${
                                                  gap.status === "covered"
                                                    ? "bg-success"
                                                    : gap.status === "partial"
                                                    ? "bg-warning"
                                                    : "bg-error"
                                                }`}
                                              ></span>
                                              <span className="font-medium text-sm">
                                                {gap.category}
                                              </span>
                                              <span
                                                className={`badge badge-xs ${
                                                  gap.status === "covered"
                                                    ? "badge-success"
                                                    : gap.status === "partial"
                                                    ? "badge-warning"
                                                    : "badge-error"
                                                }`}
                                              >
                                                {gap.status}
                                              </span>
                                            </div>
                                            <ul className="ml-5 space-y-1">
                                              {gap.requirements.map(
                                                (req, j) => (
                                                  <li
                                                    key={j}
                                                    className="text-xs flex items-center gap-2"
                                                  >
                                                    {req.includes("MISSING") ? (
                                                      <AlertCircle className="w-3 h-3 text-error" />
                                                    ) : (
                                                      <CheckCircle className="w-3 h-3 text-success" />
                                                    )}
                                                    <span
                                                      className={
                                                        req.includes("MISSING")
                                                          ? "text-error"
                                                          : ""
                                                      }
                                                    >
                                                      {req}
                                                    </span>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Action Bubbles */}
                      {message.role === "assistant" &&
                        message.metadata?.quickSuggestions && (
                          <div className="ml-12 flex flex-wrap gap-2">
                            {message.metadata.quickSuggestions.map(
                              (suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() =>
                                    handleQuickSuggestion(suggestion)
                                  }
                                  className="btn btn-sm btn-outline rounded-full hover:btn-primary"
                                >
                                  {suggestion}
                                </button>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedContextOption?.color || "bg-primary"
                        }`}
                      >
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            RedTape Assistant
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="loading loading-dots loading-sm"></span>
                          <span className="text-sm text-base-content/70">
                            Checking regulations...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div className="border-t border-base-300 p-6 bg-base-100 flex-shrink-0">
                <div className="max-w-3xl mx-auto">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Ask about tax, compliance, government services, data, or upload documents..."
                        className="input input-bordered w-full input-lg rounded-full focus:border-primary shadow-sm pr-12"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Add file upload message to chat
                              const fileMessage: ChatMessage = {
                                id: Date.now().toString(),
                                role: "user",
                                content: `📄 Uploaded: ${file.name}`,
                                timestamp: new Date(),
                              };
                              setMessages((prev) => [...prev, fileMessage]);
                              handleDocumentUpload(file);
                            }
                          }}
                          className="hidden"
                          id="chat-file-upload"
                        />
                        <label
                          htmlFor="chat-file-upload"
                          className="btn btn-ghost btn-sm btn-circle"
                          title="Upload documents for analysis"
                        >
                          <Upload className="w-4 h-4" />
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="btn btn-primary btn-circle btn-lg shadow-sm"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-base-content/60">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-success" />
                      Government verified
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-primary" />
                      Personalized guidance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Context Panel - Business Info */}
            {businessContext.businessName && (
              <div className="w-80 bg-base-200 border-l border-base-300 p-6 space-y-6 overflow-y-auto">
                {/* Business Context */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    Business Context
                  </h3>
                  <div className="bg-base-100 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-xs text-base-content/70">
                        Business Name
                      </span>
                      <p className="font-semibold">
                        {businessContext.businessName}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-base-content/70">
                        Industry
                      </span>
                      <p className="font-medium">
                        {businessContext.industry || "Painting Services"}
                      </p>
                    </div>
                    {businessContext.employees !== undefined && (
                      <div>
                        <span className="text-xs text-base-content/70">
                          Employees
                        </span>
                        <p className="font-medium">
                          {businessContext.employees}
                        </p>
                      </div>
                    )}
                    {businessContext.contractors !== undefined && (
                      <div>
                        <span className="text-xs text-base-content/70">
                          Contractors
                        </span>
                        <p className="font-medium">
                          {businessContext.contractors}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs text-base-content/70">ABN</span>
                      <p className="font-mono text-sm">{businessContext.abn}</p>
                    </div>
                  </div>
                </div>

                {/* Jurisdiction */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Your Jurisdiction
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                      <span className="text-xs font-semibold text-error">
                        Federal
                      </span>
                      <p className="text-sm">Australian Taxation Office</p>
                    </div>
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                      <span className="text-xs font-semibold text-warning">
                        State
                      </span>
                      <p className="text-sm">Queensland Government</p>
                    </div>
                    <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                      <span className="text-xs font-semibold text-success">
                        Local
                      </span>
                      <p className="text-sm">{businessContext.localGov}</p>
                    </div>
                  </div>
                </div>

                {/* Compliance Overview */}
                <div>
                  <h3 className="font-semibold mb-4">Compliance Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Business Registration</span>
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Workers Compensation</span>
                      <div className="w-4 h-4 border-2 border-warning rounded"></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Public Liability</span>
                      <div className="w-4 h-4 border-2 border-error rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Context Panel - Corporate Info */}
            {corporateContext.companyName && (
                <div className="w-80 bg-base-200 border-l border-base-300 p-6 space-y-6 overflow-y-auto">
                  {/* Project Context */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      Project Context
                    </h3>
                    <div className="bg-base-100 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-xs text-base-content/70">
                          Company
                        </span>
                        <p className="font-semibold">
                          {corporateContext.companyName}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-base-content/70">
                          Project Type
                        </span>
                        <p className="font-medium">
                          {corporateContext.projectType}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-base-content/70">
                          Location
                        </span>
                        <p className="font-medium">
                          {corporateContext.location}
                        </p>
                      </div>
                      {corporateContext.uploadedDocs && (
                        <div>
                          <span className="text-xs text-base-content/70">
                            Documents
                          </span>
                          <p className="font-medium">
                            {corporateContext.uploadedDocs.length} uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compliance Overview */}
                  <div>
                    <h3 className="font-semibold mb-4">Compliance Overview</h3>
                    <div className="space-y-3">
                      {corporateContext.complianceGaps?.map((gap, i) => (
                        <div key={i} className="bg-base-100 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {gap.category}
                            </span>
                            <span
                              className={`w-3 h-3 rounded-full ${
                                gap.status === "covered"
                                  ? "bg-success"
                                  : gap.status === "partial"
                                  ? "bg-warning"
                                  : "bg-error"
                              }`}
                            ></span>
                          </div>
                          <div className="text-xs text-base-content/70">
                            {
                              gap.requirements.filter(
                                (r) => !r.includes("MISSING")
                              ).length
                            }{" "}
                            of {gap.requirements.length} covered
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brisbane Jurisdiction */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Brisbane Jurisdiction
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                        <span className="text-xs font-semibold text-error">
                          Federal
                        </span>
                        <p className="text-sm">Dept. of Environment & Energy</p>
                      </div>
                      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                        <span className="text-xs font-semibold text-warning">
                          State
                        </span>
                        <p className="text-sm">Queensland Government</p>
                      </div>
                      <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                        <span className="text-xs font-semibold text-success">
                          Local
                        </span>
                        <p className="text-sm">Brisbane City Council</p>
                      </div>
                    </div>
                  </div>

                  {/* Gap Summary */}
                  <div>
                    <h3 className="font-semibold mb-4">Gap Summary</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          Covered
                        </span>
                        <span className="font-bold">2</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          Partial
                        </span>
                        <span className="font-bold">1</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-error" />
                          Missing
                        </span>
                        <span className="font-bold">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </main>
      </div>

      {/* Memory Toast */}
      {showMemoryToast && (
        <MemoryToast
          message={
            businessContext.businessName
              ? `Memory updated: Added ${businessContext.businessName} business details to your profile`
              : corporateContext.companyName
              ? `Memory updated: Added ${corporateContext.companyName} project details to your profile`
              : "Memory updated: Added item to your checklist"
          }
          onUndo={() => {
            if (businessContext.businessName) {
              setBusinessContext({});
            } else if (corporateContext.companyName) {
              setCorporateContext({});
            }
            setShowMemoryToast(false);
          }}
          onView={() => setShowMemoryToast(false)}
          onEdit={() => setShowMemoryToast(false)}
          onClose={() => setShowMemoryToast(false)}
        />
      )}
    </div>
  );
}
