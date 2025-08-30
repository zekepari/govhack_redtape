"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  Home,
  Plane,
  Building2,
  GraduationCap,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  MessageSquare,
  FileText,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { usePortfolio } from "../contexts/PortfolioContext";
import { MemoryToast } from "../components/MemoryToast";

const contextModes = [
  {
    id: "business" as const,
    icon: Briefcase,
    label: "Business",
    color: "text-red-500",
  },
  {
    id: "student" as const,
    icon: GraduationCap,
    label: "Student",
    color: "text-blue-500",
  },
  {
    id: "housing" as const,
    icon: Home,
    label: "Housing",
    color: "text-green-500",
  },
  {
    id: "travel" as const,
    icon: Plane,
    label: "Travel",
    color: "text-purple-500",
  },
  {
    id: "corporate" as const,
    icon: Building2,
    label: "Corporate",
    color: "text-orange-500",
  },
];

export default function DashboardPage() {
  const { state, switchContext, clearPortfolio } = usePortfolio();
  const [showMemoryToast, setShowMemoryToast] = useState(false);

  // Get context-specific recommendations
  const getRecommendations = () => {
    switch (state.contextMode) {
      case "business":
        return [
          "What licenses do I need for construction in QLD?",
          "Fair Work obligations for 5 employees",
          "GST registration requirements",
        ];
      case "student":
        return [
          "Student visa work restrictions",
          "How to apply for TFN",
          "University enrollment requirements",
        ];
      case "housing":
        return [
          "First home buyer schemes in your state",
          "Rental rights and responsibilities",
          "Home loan eligibility calculator",
        ];
      case "travel":
        return [
          "Visa requirements for your destination",
          "Travel insurance obligations",
          "Customs and quarantine rules",
        ];
      case "corporate":
        return [
          "Upload compliance documents for analysis",
          "Directors' duties and obligations",
          "Corporate governance requirements",
        ];
    }
  };

  const getPortfolioDisplay = () => {
    const items = [];

    if (state.portfolio.business) {
      const {
        abn,
        industry,
        state: bizState,
        employees,
      } = state.portfolio.business;
      if (abn) items.push({ label: "ABN", value: abn });
      if (industry) items.push({ label: "Industry", value: industry });
      if (bizState) items.push({ label: "State", value: bizState });
      if (employees) items.push({ label: "Employees", value: `${employees}` });
    }

    if (state.portfolio.individual) {
      const { visaType, housingGoals } = state.portfolio.individual;
      if (visaType) items.push({ label: "Visa", value: visaType });
      if (housingGoals) items.push({ label: "Housing", value: housingGoals });
    }

    return items;
  };

  const portfolioItems = getPortfolioDisplay();
  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <header className="bg-base-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-red">
              RedTape
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard" className="btn btn-ghost">
                Chat
              </Link>
              <Link href="/dashboard" className="btn btn-ghost">
                Portfolio
              </Link>
              <Link href="/dashboard" className="btn btn-ghost">
                Corporate
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Context & Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Context Switcher */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Your Context</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {contextModes.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => switchContext(mode.id)}
                        className={`btn ${
                          state.contextMode === mode.id
                            ? "btn-primary"
                            : "btn-outline"
                        } flex-col h-auto py-4`}
                      >
                        <Icon className={`w-6 h-6 ${mode.color}`} />
                        <span className="text-xs mt-1">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Portfolio Overview */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title text-2xl">
                    What we know about you
                  </h2>
                  <div className="flex gap-2">
                    <Link href="/dashboard" className="btn btn-sm btn-ghost">
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={clearPortfolio}
                      className="btn btn-sm btn-ghost text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                  </div>
                </div>

                {portfolioItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolioItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                      >
                        <span className="text-sm text-base-content/70">
                          {item.label}
                        </span>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
                    <p className="text-base-content/70 mb-4">
                      No profile information yet
                    </p>
                    <Link href="/dashboard" className="btn btn-primary btn-sm">
                      <Plus className="w-4 h-4" />
                      Add Information
                    </Link>
                  </div>
                )}

                <div className="mt-4 p-3 bg-info/10 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Privacy note:</span> Your
                    information is used only to personalize guidance. You can
                    edit or delete it anytime.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors">
                    <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Business registration requirements
                      </p>
                      <p className="text-sm text-base-content/70">
                        Chat • 2 hours ago
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-base-content/30" />
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors">
                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">
                        Added GST registration to checklist
                      </p>
                      <p className="text-sm text-base-content/70">
                        Checklist • Yesterday
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-base-content/30" />
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Completed ABN application</p>
                      <p className="text-sm text-base-content/70">
                        Checklist • 3 days ago
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-base-content/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Recommendations */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="btn btn-primary btn-block justify-start"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Start new chat
                  </Link>
                  <Link
                    href="/dashboard"
                    className="btn btn-outline btn-block justify-start"
                  >
                    <FileText className="w-5 h-5" />
                    View checklist
                  </Link>
                  {state.contextMode === "corporate" && (
                    <Link
                      href="/dashboard"
                      className="btn btn-outline btn-block justify-start"
                    >
                      <Building2 className="w-5 h-5" />
                      Upload documents
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="card bg-gradient-to-br from-red-500/10 to-red-600/10 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-red-500" />
                  <h3 className="text-xl font-bold">Recommended for you</h3>
                </div>
                <p className="text-sm text-base-content/70 mb-4">
                  Based on your {state.contextMode} context
                </p>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <Link
                      key={index}
                      href="/dashboard"
                      className="block p-3 bg-base-100 rounded-lg hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium pr-2">{rec}</p>
                        <ArrowRight className="w-4 h-4 text-base-content/30 group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-4">Compliance Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile completeness</span>
                    <span className="text-sm font-bold">40%</span>
                  </div>
                  <progress
                    className="progress progress-primary"
                    value="40"
                    max="100"
                  ></progress>
                  <p className="text-xs text-base-content/70">
                    Add more information to get personalized guidance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Memory Toast */}
      {showMemoryToast && (
        <MemoryToast
          message="Portfolio updated with your business information"
          onUndo={() => {
            // Handle undo
            setShowMemoryToast(false);
          }}
          onView={() => {
            // Navigate to dashboard
            window.location.href = "/dashboard";
          }}
          onEdit={() => {
            // Navigate to dashboard
            window.location.href = "/dashboard";
          }}
          onClose={() => setShowMemoryToast(false)}
        />
      )}
    </div>
  );
}
