"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
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
import {
  usePortfolio,
  type ContextMode,
  type ChecklistItem,
} from "../contexts/PortfolioContext";
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
  showForm?:
    | "abn"
    | "business-details"
    | "bank-integration"
    | "document-upload"
    | "jobseeker-details"
    | "carer-details"
    | "student-details";
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
  tax: {
    label: "Tax & Compliance",
    color: "bg-red-500",
    textColor: "text-red-500",
  },
  services: {
    label: "Government Services",
    color: "bg-blue-500",
    textColor: "text-blue-500",
  },
  data: {
    label: "Data & Insights",
    color: "bg-green-500",
    textColor: "text-green-500",
  },
  compliance: {
    label: "Regulatory Navigation",
    color: "bg-purple-500",
    textColor: "text-purple-500",
  },
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
  const {
    state,
    switchContext,
    addChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
    addRoleModule,
    removeRoleModule,
  } = usePortfolio();
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
  const [jobseekerForm, setJobseekerForm] = useState({
    hasMyGov: false,
    previousIncome: "",
    dependents: "",
    housingStatus: "",
  });
  const [carerForm, setCarerForm] = useState({
    careType: "",
    hoursPerWeek: "",
    hasOtherIncome: false,
    relationshipToCared: "",
  });
  const [studentForm, setStudentForm] = useState({
    studyType: "",
    workType: "",
    annualIncome: "",
    hasHECSDebt: false,
  });
  const [bankForm, setBankForm] = useState({
    linkBank: false,
    provider: "",
  });
  const [detectedContext, setDetectedContext] = useState<string | null>(null);
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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({
            role,
            content,
          })),
          portfolio: state.portfolio,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach RedTape model");
      }

      const data = await response.json();

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          data?.message?.content ||
          "I hit a bureaucratic snag and couldn't draft a reply. Please try again.",
        timestamp: new Date(),
        metadata: data?.message?.metadata,
        showForm: data?.message?.showForm,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "The compliance hotline is busy and I couldn't reach the model. Please retry in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
        content: `Perfect! Now I understand your business:\n\n• Painters Club QLD\n• ${
          businessDetailsForm.employees
        } employees\n• ${businessDetailsForm.contractors} contractors\n• ${
          businessDetailsForm.interstate
            ? "Operating interstate"
            : "Operating in Queensland only"
        }\n\nFor comprehensive tax analysis, would you like to connect your business banking to automatically track expenses and income?`,
        timestamp: new Date(),
        showForm: "bank-integration",
      };

      setMessages((prev) => [...prev, response]);

      // Add business owner role module
      addRoleModule("businessOwner", {
        businessName: businessContext.businessName || "Business",
        abn: businessContext.abn || "",
        industry: "Painting Services",
        employees: parseInt(businessDetailsForm.employees) || 0,
        contractors: parseInt(businessDetailsForm.contractors) || 0,
        location: `${businessContext.localGov}, ${businessContext.state}`,
      });

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
  const selectedContextOption = {
    icon: Bot,
    label: "Universal",
    color: "bg-primary",
  };

  return (
    <div className="min-h-screen">
      <SignedOut>
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
          <div className="bg-base-100 border border-base-300 rounded-xl p-6 shadow-lg max-w-md w-full space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm uppercase tracking-wide text-base-content/60">
                  Restricted Access
                </p>
                <h1 className="text-xl font-semibold">RedTape Dashboard</h1>
              </div>
            </div>
            <p className="text-sm text-base-content/70">
              Please sign in to continue. We need to confirm your identity
              before issuing any compliance guidance.
            </p>
            <div className="space-y-2">
              <SignInButton mode="modal">
                <button className="btn btn-primary w-full">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-ghost w-full">Create an account</button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
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
                  <div className="flex items-center gap-2">
                    <UserButton afterSignOutUrl="/" />
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="btn btn-ghost btn-sm btn-square lg:hidden"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contextual Portfolio Modules */}
              <div className="p-4 border-b border-base-300">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">
              Your Profiles
            </h3>
            <div className="space-y-2">
              {/* Business Owner Module */}
              {state.portfolio.roles?.businessOwner && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Business Owner</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="text-base-content/70">Business:</span>{" "}
                      {state.portfolio.roles.businessOwner.businessName}
                    </p>
                    <p>
                      <span className="text-base-content/70">Industry:</span>{" "}
                      {state.portfolio.roles.businessOwner.industry}
                    </p>
                    <p>
                      <span className="text-base-content/70">Employees:</span>{" "}
                      {state.portfolio.roles.businessOwner.employees}
                    </p>
                  </div>
                </div>
              )}

              {/* JobSeeker Module */}
              {state.portfolio.roles?.jobseeker && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Job Seeker</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="text-base-content/70">Income:</span>{" "}
                      {state.portfolio.roles.jobseeker.previousIncome}
                    </p>
                    <p>
                      <span className="text-base-content/70">Housing:</span>{" "}
                      {state.portfolio.roles.jobseeker.housingStatus}
                    </p>
                    <p>
                      <span className="text-base-content/70">MyGov:</span>{" "}
                      {state.portfolio.roles.jobseeker.hasMyGov ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              )}

              {/* Carer Module */}
              {state.portfolio.roles?.carer && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Carer</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="text-base-content/70">Care type:</span>{" "}
                      {state.portfolio.roles.carer.careType}
                    </p>
                    <p>
                      <span className="text-base-content/70">Hours/week:</span>{" "}
                      {state.portfolio.roles.carer.hoursPerWeek}
                    </p>
                    <p>
                      <span className="text-base-content/70">
                        Relationship:
                      </span>{" "}
                      {state.portfolio.roles.carer.relationshipToCared}
                    </p>
                  </div>
                </div>
              )}

              {/* Student Module */}
              {state.portfolio.roles?.student && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Student</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="text-base-content/70">Study:</span>{" "}
                      {state.portfolio.roles.student.studyType}
                    </p>
                    <p>
                      <span className="text-base-content/70">Work:</span>{" "}
                      {state.portfolio.roles.student.workType}
                    </p>
                    <p>
                      <span className="text-base-content/70">Income:</span>{" "}
                      {state.portfolio.roles.student.annualIncome}
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!state.portfolio.roles?.businessOwner &&
                !state.portfolio.roles?.jobseeker &&
                !state.portfolio.roles?.carer &&
                !state.portfolio.roles?.student && (
                  <div className="text-center py-4">
                    <p className="text-sm text-base-content/70">
                      No profile modules yet
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                      Profiles will appear as you chat about different topics
                    </p>
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
                      <p
                        className={`text-xs font-medium ${
                          item.completed ? "line-through opacity-60" : ""
                        }`}
                      >
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`text-xs px-1 py-0.5 rounded text-white ${
                            item.category === "tax"
                              ? "bg-red-500"
                              : item.category === "services"
                              ? "bg-blue-500"
                              : item.category === "data"
                              ? "bg-green-500"
                              : item.category === "compliance"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {challengeConfig[item.category]?.label ||
                            item.category}
                        </span>
                        <span
                          className={`text-xs px-1 py-0.5 rounded ${
                            item.priority === "high"
                              ? "bg-error"
                              : item.priority === "medium"
                              ? "bg-warning"
                              : "bg-info"
                          } text-white`}
                        >
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
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-primary">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium">
                    RedTape Universal Assistant
                  </span>
                  {detectedContext && (
                    <>
                      <span className="text-base-content/50">•</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`badge badge-sm ${
                            detectedContext === "Business"
                              ? "badge-error"
                              : detectedContext === "Services"
                              ? "badge-info"
                              : detectedContext === "Data"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {detectedContext} Context
                        </span>
                        <button
                          onClick={() => {
                            setDetectedContext(null);
                            setMessages([
                              {
                                id: "welcome-reset",
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
                          className="btn btn-ghost btn-xs"
                        >
                          Change
                        </button>
                      </div>
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
                              {isClient
                                ? message.timestamp.toLocaleTimeString(
                                    "en-AU",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    }
                                  )
                                : "--:--"}
                            </span>
                          </div>

                          <div className="prose prose-sm max-w-none">
                            <div
                              className="whitespace-pre-line text-base leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: message.content
                                  .replace(
                                    /\*\*(.*?)\*\*/g,
                                    "<strong>$1</strong>"
                                  )
                                  .replace(/\n/g, "<br />"),
                              }}
                            />
                          </div>

                          {/* Challenge Area Tags */}
                          {message.metadata?.challengeAreas && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {message.metadata.challengeAreas.map((area) => (
                                <span
                                  key={area}
                                  className={`badge badge-sm text-white ${
                                    area === "tax"
                                      ? "bg-red-500"
                                      : area === "services"
                                      ? "bg-blue-500"
                                      : area === "data"
                                      ? "bg-green-500"
                                      : area === "compliance"
                                      ? "bg-purple-500"
                                      : "bg-gray-500"
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
                              <div className="flex gap-2 mb-3">
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
                              <div className="flex justify-center">
                                <button
                                  onClick={() => {
                                    // Skip ABN and continue with general business guidance
                                    const response: ChatMessage = {
                                      id: (Date.now() + 5).toString(),
                                      role: "assistant",
                                      content:
                                        "No problem! I can still help you with general painting business requirements in Queensland. What would you like to know about?",
                                      timestamp: new Date(),
                                      metadata: {
                                        appliesTo: [
                                          "Painting Business",
                                          "Queensland",
                                        ],
                                        quickSuggestions: [
                                          "What licenses do I need?",
                                          "Fair Work obligations",
                                          "Tax requirements",
                                          "Safety regulations",
                                        ],
                                      },
                                    };
                                    setMessages((prev) => [...prev, response]);
                                  }}
                                  className="btn btn-ghost btn-sm"
                                >
                                  No, skip this
                                </button>
                              </div>
                              <p className="text-xs text-base-content/70 mt-2 text-center">
                                ABN helps me find your specific compliance
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

                          {/* JobSeeker Details Form */}
                          {message.showForm === "jobseeker-details" && (
                            <div className="bg-base-200 rounded-lg p-4 max-w-lg">
                              <h4 className="font-semibold mb-4">
                                Your Employment Situation
                              </h4>
                              <div className="space-y-4">
                                <div className="form-control">
                                  <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                      type="checkbox"
                                      checked={jobseekerForm.hasMyGov}
                                      onChange={(e) =>
                                        setJobseekerForm((prev) => ({
                                          ...prev,
                                          hasMyGov: e.target.checked,
                                        }))
                                      }
                                      className="checkbox checkbox-primary checkbox-sm"
                                    />
                                    <span className="label-text text-sm">
                                      I have a myGov account
                                    </span>
                                  </label>
                                </div>

                                <div>
                                  <label className="label label-text text-xs">
                                    Previous annual income
                                  </label>
                                  <select
                                    value={jobseekerForm.previousIncome}
                                    onChange={(e) =>
                                      setJobseekerForm((prev) => ({
                                        ...prev,
                                        previousIncome: e.target.value,
                                      }))
                                    }
                                    className="select select-bordered select-sm w-full"
                                  >
                                    <option value="">Select range</option>
                                    <option value="under-30k">
                                      Under $30,000
                                    </option>
                                    <option value="30k-60k">
                                      $30,000 - $60,000
                                    </option>
                                    <option value="60k-100k">
                                      $60,000 - $100,000
                                    </option>
                                    <option value="over-100k">
                                      Over $100,000
                                    </option>
                                  </select>
                                </div>

                                <div>
                                  <label className="label label-text text-xs">
                                    Dependents
                                  </label>
                                  <input
                                    type="number"
                                    value={jobseekerForm.dependents}
                                    onChange={(e) =>
                                      setJobseekerForm((prev) => ({
                                        ...prev,
                                        dependents: e.target.value,
                                      }))
                                    }
                                    placeholder="0"
                                    className="input input-bordered input-sm w-full"
                                  />
                                </div>

                                <div>
                                  <label className="label label-text text-xs">
                                    Housing situation
                                  </label>
                                  <select
                                    value={jobseekerForm.housingStatus}
                                    onChange={(e) =>
                                      setJobseekerForm((prev) => ({
                                        ...prev,
                                        housingStatus: e.target.value,
                                      }))
                                    }
                                    className="select select-bordered select-sm w-full"
                                  >
                                    <option value="">Select status</option>
                                    <option value="own">Own home</option>
                                    <option value="rent">Renting</option>
                                    <option value="family">
                                      Living with family
                                    </option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>

                                <button
                                  onClick={() => {
                                    setIsTyping(true);
                                    setTimeout(() => {
                                      const response: ChatMessage = {
                                        id: (Date.now() + 4).toString(),
                                        role: "assistant",
                                        content: `Based on your situation, here's what you're eligible for:\n\n**JobSeeker Payment:** $${
                                          jobseekerForm.dependents === "0"
                                            ? "693.10"
                                            : "745.20"
                                        } per fortnight\n**Rent Assistance:** ${
                                          jobseekerForm.housingStatus === "rent"
                                            ? "Up to $157.20/fortnight available"
                                            : "Not applicable (homeowner)"
                                        }\n**Training Support:** Free access to Skills Training programs\n\nNext steps:`,
                                        timestamp: new Date(),
                                        metadata: {
                                          challengeAreas: [
                                            "services",
                                            "tax",
                                            "data",
                                          ],
                                          appliesTo: [
                                            "Job Seeker",
                                            `${jobseekerForm.dependents} Dependents`,
                                            jobseekerForm.housingStatus ===
                                            "rent"
                                              ? "Renter"
                                              : "Homeowner",
                                          ],
                                          actions: [
                                            jobseekerForm.hasMyGov
                                              ? "Apply for JobSeeker via myGov"
                                              : "Create myGov account first",
                                            "Book Centrelink appointment",
                                            jobseekerForm.housingStatus ===
                                            "rent"
                                              ? "Apply for Rent Assistance"
                                              : "Review other support options",
                                            "Register for Skills Training Program",
                                          ],
                                          citations: [
                                            {
                                              title: "JobSeeker Payment Rates",
                                              source: "Federal Register",
                                            },
                                            {
                                              title:
                                                "Rent Assistance Guidelines",
                                              source: "ATO Dataset",
                                            },
                                            {
                                              title: "Employment Services",
                                              source: "ABS API",
                                            },
                                          ],
                                          quickSuggestions: [
                                            "How do I book a Centrelink appointment?",
                                            "What training programs are available?",
                                            "How long does approval take?",
                                            "Can I work while on JobSeeker?",
                                          ],
                                        },
                                      };
                                      setMessages((prev) => [
                                        ...prev,
                                        response,
                                      ]);

                                      // Add jobseeker role module
                                      addRoleModule("jobseeker", {
                                        hasMyGov: jobseekerForm.hasMyGov,
                                        previousIncome:
                                          jobseekerForm.previousIncome,
                                        dependents: jobseekerForm.dependents,
                                        housingStatus:
                                          jobseekerForm.housingStatus,
                                      });

                                      setIsTyping(false);
                                      setShowMemoryToast(true);
                                    }, 2000);
                                  }}
                                  className="btn btn-primary btn-sm w-full"
                                >
                                  Get my eligibility
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Carer Details Form */}
                          {message.showForm === "carer-details" && (
                            <div className="bg-base-200 rounded-lg p-4 max-w-lg">
                              <h4 className="font-semibold mb-4">
                                Caring Details
                              </h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="label label-text text-xs">
                                    Type of care
                                  </label>
                                  <select
                                    value={carerForm.careType}
                                    onChange={(e) =>
                                      setCarerForm((prev) => ({
                                        ...prev,
                                        careType: e.target.value,
                                      }))
                                    }
                                    className="select select-bordered select-sm w-full"
                                  >
                                    <option value="">Select type</option>
                                    <option value="elderly">
                                      Elderly parent
                                    </option>
                                    <option value="disability">
                                      Person with disability
                                    </option>
                                    <option value="child-disability">
                                      Child with disability
                                    </option>
                                    <option value="medical">
                                      Medical condition
                                    </option>
                                  </select>
                                </div>

                                <div>
                                  <label className="label label-text text-xs">
                                    Hours of care per week
                                  </label>
                                  <select
                                    value={carerForm.hoursPerWeek}
                                    onChange={(e) =>
                                      setCarerForm((prev) => ({
                                        ...prev,
                                        hoursPerWeek: e.target.value,
                                      }))
                                    }
                                    className="select select-bordered select-sm w-full"
                                  >
                                    <option value="">Select hours</option>
                                    <option value="part-time">
                                      Less than 25 hours
                                    </option>
                                    <option value="constant">
                                      Constant care (25+ hours)
                                    </option>
                                  </select>
                                </div>

                                <div>
                                  <label className="label label-text text-xs">
                                    Relationship
                                  </label>
                                  <select
                                    value={carerForm.relationshipToCared}
                                    onChange={(e) =>
                                      setCarerForm((prev) => ({
                                        ...prev,
                                        relationshipToCared: e.target.value,
                                      }))
                                    }
                                    className="select select-bordered select-sm w-full"
                                  >
                                    <option value="">
                                      Select relationship
                                    </option>
                                    <option value="parent">Parent</option>
                                    <option value="partner">
                                      Partner/Spouse
                                    </option>
                                    <option value="child">Child</option>
                                    <option value="other-family">
                                      Other family member
                                    </option>
                                    <option value="friend">Friend</option>
                                  </select>
                                </div>

                                <div className="form-control">
                                  <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                      type="checkbox"
                                      checked={carerForm.hasOtherIncome}
                                      onChange={(e) =>
                                        setCarerForm((prev) => ({
                                          ...prev,
                                          hasOtherIncome: e.target.checked,
                                        }))
                                      }
                                      className="checkbox checkbox-primary checkbox-sm"
                                    />
                                    <span className="label-text text-sm">
                                      I have other income
                                    </span>
                                  </label>
                                </div>

                                <button
                                  onClick={() => {
                                    setIsTyping(true);
                                    setTimeout(() => {
                                      const isEligibleForPayment =
                                        carerForm.hoursPerWeek === "constant";
                                      const response: ChatMessage = {
                                        id: (Date.now() + 4).toString(),
                                        role: "assistant",
                                        content: `Based on your caring situation, here's what you're eligible for:\n\n**${
                                          isEligibleForPayment
                                            ? "Carer Payment"
                                            : "Carer Allowance"
                                        }:** ${
                                          isEligibleForPayment
                                            ? "$971.50 per fortnight"
                                            : "$144.80 per fortnight"
                                        }\n**Carer Gateway:** Free counselling and respite services\n**Medicare:** Additional rebates for carer health checks\n\nYour next steps:`,
                                        timestamp: new Date(),
                                        metadata: {
                                          challengeAreas: ["services", "data"],
                                          appliesTo: [
                                            "Carer",
                                            carerForm.careType === "elderly"
                                              ? "Elderly Care"
                                              : "Disability Care",
                                            carerForm.hoursPerWeek ===
                                            "constant"
                                              ? "Full-time Carer"
                                              : "Part-time Carer",
                                          ],
                                          actions: [
                                            isEligibleForPayment
                                              ? "Apply for Carer Payment"
                                              : "Apply for Carer Allowance",
                                            "Register with Carer Gateway",
                                            "Book carer health check with GP",
                                            "Access respite services in your area",
                                          ],
                                          citations: [
                                            {
                                              title: "Carer Payment Guidelines",
                                              source: "Federal Register",
                                            },
                                            {
                                              title: "Carer Support Services",
                                              source: "ABS API",
                                            },
                                            {
                                              title: "Medicare Carer Benefits",
                                              source: "Federal Register",
                                            },
                                          ],
                                          quickSuggestions: [
                                            "How do I apply online?",
                                            "What documents do I need?",
                                            "Can I work while caring?",
                                            "Where can I get respite help?",
                                          ],
                                        },
                                      };
                                      setMessages((prev) => [
                                        ...prev,
                                        response,
                                      ]);

                                      // Add carer role module
                                      addRoleModule("carer", {
                                        careType: carerForm.careType,
                                        hoursPerWeek: carerForm.hoursPerWeek,
                                        relationshipToCared:
                                          carerForm.relationshipToCared,
                                        hasOtherIncome:
                                          carerForm.hasOtherIncome,
                                      });

                                      setIsTyping(false);
                                      setShowMemoryToast(true);
                                    }, 2000);
                                  }}
                                  className="btn btn-primary btn-sm w-full"
                                >
                                  Check my eligibility
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Student Details Form */}
                          {message.showForm === "student-details" && (
                            <div className="bg-base-200 rounded-lg p-4 max-w-lg">
                              <h4 className="font-semibold mb-4">
                                Student & Work Details
                              </h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="label label-text text-xs">
                                    Type of study
                                  </label>
                                  <select
                                    value={studentForm.studyType}
                                    onChange={(e) =>
                                      setStudentForm((prev) => ({
                                        ...prev,
                                        studyType: e.target.value,
                                      }))
                                    }
                                    className="select select-bordered select-sm w-full"
                                  >
                                    <option value="">Select type</option>
                                    <option value="university">
                                      University degree
                                    </option>
                                    <option value="tafe">
                                      TAFE/VET course
                                    </option>
                                    <option value="apprenticeship">
                                      Apprenticeship
                                    </option>
                                    <option value="other">Other study</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="label label-text text-xs">
                                    Type of work
                                  </label>
                                  <select
                                    value={studentForm.workType}
                                    onChange={(e) =>
                                      setStudentForm((prev) => ({
                                        ...prev,
                                        workType: e.target.value,
                                      }))
                                    }
                                    className="select select-bordered select-sm w-full"
                                  >
                                    <option value="">Select work type</option>
                                    <option value="retail">
                                      Retail/hospitality
                                    </option>
                                    <option value="tutoring">
                                      Tutoring/teaching
                                    </option>
                                    <option value="office">
                                      Office/admin work
                                    </option>
                                    <option value="delivery">
                                      Delivery/gig work
                                    </option>
                                    <option value="other">Other work</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="label label-text text-xs">
                                    Annual income estimate
                                  </label>
                                  <select
                                    value={studentForm.annualIncome}
                                    onChange={(e) =>
                                      setStudentForm((prev) => ({
                                        ...prev,
                                        annualIncome: e.target.value,
                                      }))
                                    }
                                    className="select select-bordered select-sm w-full"
                                  >
                                    <option value="">Select range</option>
                                    <option value="under-10k">
                                      Under $10,000
                                    </option>
                                    <option value="10k-18k">
                                      $10,000 - $18,200
                                    </option>
                                    <option value="18k-30k">
                                      $18,200 - $30,000
                                    </option>
                                    <option value="over-30k">
                                      Over $30,000
                                    </option>
                                  </select>
                                </div>

                                <div className="form-control">
                                  <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                      type="checkbox"
                                      checked={studentForm.hasHECSDebt}
                                      onChange={(e) =>
                                        setStudentForm((prev) => ({
                                          ...prev,
                                          hasHECSDebt: e.target.checked,
                                        }))
                                      }
                                      className="checkbox checkbox-primary checkbox-sm"
                                    />
                                    <span className="label-text text-sm">
                                      I have a HECS-HELP debt
                                    </span>
                                  </label>
                                </div>

                                <button
                                  onClick={() => {
                                    setIsTyping(true);
                                    setTimeout(() => {
                                      const needsToLodge =
                                        studentForm.annualIncome !==
                                          "under-10k" &&
                                        studentForm.annualIncome !== "10k-18k";
                                      const response: ChatMessage = {
                                        id: (Date.now() + 4).toString(),
                                        role: "assistant",
                                        content: `Here's your tax situation as a ${
                                          studentForm.studyType
                                        } student:\n\n**Tax Threshold:** ${
                                          needsToLodge
                                            ? "You need to lodge a tax return"
                                            : "You may not need to lodge (under $18,200)"
                                        }\n**Deductions Available:** Course materials, work uniforms, transport\n**HECS Impact:** ${
                                          studentForm.hasHECSDebt
                                            ? "Repayments start at $51,550 income"
                                            : "No HECS debt to consider"
                                        }\n\nYour personalized guidance:`,
                                        timestamp: new Date(),
                                        metadata: {
                                          challengeAreas: ["tax", "services"],
                                          appliesTo: [
                                            studentForm.studyType ===
                                            "university"
                                              ? "University Student"
                                              : "TAFE Student",
                                            studentForm.workType === "retail"
                                              ? "Retail Worker"
                                              : "Part-time Worker",
                                            studentForm.annualIncome ||
                                              "Low Income",
                                          ],
                                          actions: [
                                            needsToLodge
                                              ? "Lodge tax return by 31 October"
                                              : "Consider lodging for refund",
                                            "Save receipts for textbooks and course materials",
                                            "Record work-related transport costs",
                                            studentForm.hasHECSDebt
                                              ? "Monitor income for HECS threshold"
                                              : "Keep study expense records",
                                          ],
                                          citations: [
                                            {
                                              title: "Student Tax Obligations",
                                              source: "ATO Dataset",
                                            },
                                            {
                                              title:
                                                "Education Deductions Guide",
                                              source: "Federal Register",
                                            },
                                            {
                                              title: "HECS-HELP Information",
                                              source: "ATO Dataset",
                                            },
                                          ],
                                          quickSuggestions: [
                                            "Can I claim my laptop?",
                                            "What about textbook costs?",
                                            "How do I track work expenses?",
                                            "When do HECS repayments start?",
                                          ],
                                        },
                                      };
                                      setMessages((prev) => [
                                        ...prev,
                                        response,
                                      ]);

                                      // Add student role module
                                      addRoleModule("student", {
                                        studyType: studentForm.studyType,
                                        workType: studentForm.workType,
                                        annualIncome: studentForm.annualIncome,
                                        hasHECSDebt: studentForm.hasHECSDebt,
                                      });

                                      setIsTyping(false);
                                      setShowMemoryToast(true);
                                    }, 2000);
                                  }}
                                  className="btn btn-primary btn-sm w-full"
                                >
                                  Get my tax guidance
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Bank Integration Form */}
                          {message.showForm === "bank-integration" && (
                            <div className="bg-base-200 rounded-lg p-4 max-w-lg">
                              <h4 className="font-semibold mb-4">
                                Connect Your Business Banking
                              </h4>
                              <div className="space-y-4">
                                <p className="text-sm text-base-content/70">
                                  Link your business accounts to automatically
                                  track expenses and income for tax purposes.
                                </p>

                                <div className="grid grid-cols-3 gap-2">
                                  <button
                                    onClick={() =>
                                      setBankForm({
                                        linkBank: true,
                                        provider: "CommBank",
                                      })
                                    }
                                    className={`btn btn-sm ${
                                      bankForm.provider === "CommBank"
                                        ? "btn-primary"
                                        : "btn-outline"
                                    }`}
                                  >
                                    CommBank
                                  </button>
                                  <button
                                    onClick={() =>
                                      setBankForm({
                                        linkBank: true,
                                        provider: "ANZ",
                                      })
                                    }
                                    className={`btn btn-sm ${
                                      bankForm.provider === "ANZ"
                                        ? "btn-primary"
                                        : "btn-outline"
                                    }`}
                                  >
                                    ANZ
                                  </button>
                                  <button
                                    onClick={() =>
                                      setBankForm({
                                        linkBank: true,
                                        provider: "Westpac",
                                      })
                                    }
                                    className={`btn btn-sm ${
                                      bankForm.provider === "Westpac"
                                        ? "btn-primary"
                                        : "btn-outline"
                                    }`}
                                  >
                                    Westpac
                                  </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={() =>
                                      setBankForm({
                                        linkBank: true,
                                        provider: "PayPal",
                                      })
                                    }
                                    className={`btn btn-sm ${
                                      bankForm.provider === "PayPal"
                                        ? "btn-primary"
                                        : "btn-outline"
                                    }`}
                                  >
                                    PayPal
                                  </button>
                                  <button
                                    onClick={() =>
                                      setBankForm({
                                        linkBank: true,
                                        provider: "Stripe",
                                      })
                                    }
                                    className={`btn btn-sm ${
                                      bankForm.provider === "Stripe"
                                        ? "btn-primary"
                                        : "btn-outline"
                                    }`}
                                  >
                                    Stripe
                                  </button>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      if (bankForm.provider) {
                                        // Mock bank connection and transaction analysis
                                        setIsTyping(true);
                                        setTimeout(() => {
                                          const response: ChatMessage = {
                                            id: (Date.now() + 3).toString(),
                                            role: "assistant",
                                            content: `Connected to ${bankForm.provider}! I've analyzed your business transactions:\n\n**Business Income:** $127,450 (last 12 months)\n**Business Expenses:** $34,200 (paint, equipment, fuel)\n**Tax Obligations:** GST registration required, $12,745 GST owed\n**Deductions Available:** $8,500 in vehicle expenses, $3,200 equipment depreciation\n\nWhat would you like to know about your tax situation?`,
                                            timestamp: new Date(),
                                            metadata: {
                                              challengeAreas: [
                                                "tax",
                                                "compliance",
                                                "data",
                                              ],
                                              appliesTo: [
                                                "Painters Club QLD",
                                                `${bankForm.provider} Connected`,
                                                "GST Required",
                                                "$127k Turnover",
                                              ],
                                              actions: [
                                                "Register for GST immediately",
                                                "Set up quarterly BAS lodgments",
                                                "Claim vehicle expense deductions",
                                                "Review equipment depreciation schedule",
                                              ],
                                              citations: [
                                                {
                                                  title:
                                                    "GST Registration Requirements",
                                                  source: "ATO Dataset",
                                                },
                                                {
                                                  title:
                                                    "Business Expense Deductions",
                                                  source: "ATO Dataset",
                                                },
                                                {
                                                  title: "BAS Lodgment Guide",
                                                  source: "Federal Register",
                                                },
                                              ],
                                              quickSuggestions: [
                                                "How do I register for GST?",
                                                "What can I claim as deductions?",
                                                "When are my BAS due dates?",
                                                "How much tax will I owe?",
                                              ],
                                            },
                                          };
                                          setMessages((prev) => [
                                            ...prev,
                                            response,
                                          ]);

                                          // Add comprehensive business module with tax data
                                          addRoleModule("businessOwner", {
                                            businessName:
                                              businessContext.businessName ||
                                              "Business",
                                            abn: businessContext.abn || "",
                                            industry: "Painting Services",
                                            employees: 0, // Will be updated in business details
                                            contractors: 0,
                                            location: `${businessContext.localGov}, ${businessContext.state}`,
                                            bankConnected: bankForm.provider,
                                            annualIncome: 127450,
                                            annualExpenses: 34200,
                                            gstRequired: true,
                                          });

                                          setIsTyping(false);
                                          setShowMemoryToast(true);
                                        }, 3000);
                                      }
                                    }}
                                    disabled={!bankForm.provider}
                                    className="btn btn-primary btn-sm flex-1"
                                  >
                                    Connect & Analyze
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Skip bank integration, go to business details
                                      const response: ChatMessage = {
                                        id: (Date.now() + 3).toString(),
                                        role: "assistant",
                                        content:
                                          "No problem! I can still help with compliance guidance. Let me get some basic business details:",
                                        timestamp: new Date(),
                                        showForm: "business-details",
                                      };
                                      setMessages((prev) => [
                                        ...prev,
                                        response,
                                      ]);
                                    }}
                                    className="btn btn-ghost btn-sm"
                                  >
                                    Skip
                                  </button>
                                </div>

                                <p className="text-xs text-base-content/70">
                                  Secure connection via Open Banking. We never
                                  store your banking credentials.
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
                                              onClick={() =>
                                                handleAddToChecklist({
                                                  title: action,
                                                  agency: "Government Agency",
                                                  priority: "medium",
                                                  category:
                                                    message.metadata
                                                      ?.challengeAreas?.[0] ||
                                                    "compliance",
                                                })
                                              }
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
                                        <div
                                          key={i}
                                          className="flex items-start gap-2"
                                        >
                                          <ExternalLink className="w-3 h-3 text-info mt-0.5 flex-shrink-0" />
                                          <div>
                                            <Link
                                              href={
                                                citation.url || "/dashboard"
                                              }
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
                                    {message.metadata.jurisdictions.map(
                                      (jurisdiction, i) => (
                                        <div
                                          key={i}
                                          className="flex items-center gap-2"
                                        >
                                          <div className="flex items-center gap-1">
                                            <span
                                              className={`badge ${
                                                jurisdiction.level === "federal"
                                                  ? "badge-error"
                                                  : jurisdiction.level ===
                                                    "state"
                                                  ? "badge-warning"
                                                  : "badge-success"
                                              }`}
                                            >
                                              {jurisdiction.name}
                                            </span>
                                            <span className="text-xs text-base-content/70">
                                              {jurisdiction.role}
                                            </span>
                                          </div>
                                          {i <
                                            message.metadata.jurisdictions!
                                              .length -
                                              1 && (
                                            <ChevronRight className="w-3 h-3 text-base-content/50" />
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Legacy Visual Navigator - now handled in jurisdictions */}
                              {businessContext.state &&
                                !message.metadata?.jurisdictions && (
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
                                            {gap.requirements.map((req, j) => (
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
                                            ))}
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
                      <p className="font-medium">{corporateContext.location}</p>
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
      </SignedIn>
    </div>
  );
}
