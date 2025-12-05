import {
  ArrowRight,
  CheckCircle,
  FileText,
  Shield,
  MessageSquare,
  User,
  ClipboardCheck,
  Building,
  ShieldCheck,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: Shield,
    title: "Trusted Sources",
    description:
      "Every answer backed by official government data and legislation",
  },
  {
    icon: FileText,
    title: "Personalised Guidance",
    description: "Filters apply based on your specific situation and context",
  },
  {
    icon: CheckCircle,
    title: "Actionable Checklists",
    description: "Export compliance requirements and track your progress",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <nav className="navbar bg-base-100 border-b border-base-300 py-4">
        <div className="container mx-auto grid grid-cols-3 items-center px-4 md:px-6 lg:px-8">
          {/* Logo - Left */}
          <div className="justify-self-start">
            <Link
              href="/"
              className="text-4xl font-black text-red tracking-tight"
            >
              RedTape
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="justify-self-center">
            <ul className="menu menu-horizontal px-1 gap-2">
              <li>
                <Link
                  href="/chat"
                  className="btn btn-ghost text-base font-medium"
                >
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="btn btn-ghost text-base font-medium"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate"
                  className="btn btn-ghost text-base font-medium"
                >
                  Corporate
                </Link>
              </li>
            </ul>
          </div>

          {/* Login Button - Right */}
          <div className="justify-self-end">
            <Link href="/dashboard" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto relative">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Navigate Australian compliance with{" "}
              <span className="gradient-text">confidence</span>
            </h1>
            <p className="text-xl md:text-2xl text-base-content/70 mb-8">
              One AI assistant for tax compliance, government services, data
              insights, and regulatory navigation. Get personalised answers
              across all levels of Australian government.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                Start Universal Chat
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/dashboard" className="btn btn-secondary btn-lg">
                Build Your Portfolio
              </Link>
              <Link href="/dashboard" className="btn btn-outline btn-lg">
                View Demo
              </Link>
            </div>

            {/* Mascot */}
            <div className="absolute -left-32 md:-left-20 bottom-0 translate-y-3/4 size-64">
              <Image
                src="/mascot.png"
                alt="RedTape Mascot"
                width={320}
                height={320}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Unified Government Services */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            All your government needs in one place
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Ask any question and get comprehensive answers covering tax,
            services, data, and compliance
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-red-500/20">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Tax & Compliance</h3>
              <p className="text-sm text-base-content/70">
                GST, BAS, PAYG, superannuation, and ATO obligations
              </p>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-blue-500/20">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Government Services</h3>
              <p className="text-sm text-base-content/70">
                Centrelink, Medicare, visa support, and life events
              </p>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-green-500/20">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Data & Insights</h3>
              <p className="text-sm text-base-content/70">
                ABS statistics, industry trends, and dataset access
              </p>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-purple-500/20">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Regulatory Navigation</h3>
              <p className="text-sm text-base-content/70">
                Permits, licenses, and multi-level government requirements
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Try the Universal Assistant
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-base-200 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for clarity and trust
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Mascot Reading Document */}
          <div className="absolute right-44 bottom-0 translate-y-1/4 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            <Image
              src="/mascot_reading_document.png"
              alt="RedTape Mascot Reading Document"
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How the unified experience works
          </h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            One chat, one portfolio, all government services covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Set up your portfolio
              </h3>
              <p className="text-base-content/70">
                Enter your business details, visa status, or personal situation
                once. This powers personalized answers across all areas.
              </p>
            </div>
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-base-300"></div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Ask anything</h3>
              <p className="text-base-content/70">
                One question can hit multiple areas: &quot;What do I need as a
                new business?&quot; covers tax, compliance, support programs,
                and
                industry data.
              </p>
            </div>
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-base-300"></div>
          </div>

          {/* Step 3 */}
          <div className="bg-base-100 p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Universal checklist</h3>
            <p className="text-base-content/70">
              All obligations go into one checklist: tax deadlines, permit
              applications, support program eligibility, and compliance
              requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-base-200 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete government guidance, unified experience
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              RedTape combines AI-powered guidance with official government data
              to give you accurate, personalized compliance advice across all
              areas of government interaction
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Smart Chat Assistant */}
            <div className="bg-base-100 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Universal AI Assistant
                  </h3>
                  <p className="text-base-content/70">
                    One chat interface that routes questions to the right
                    government departments and provides comprehensive,
                    cross-domain answers
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Comprehensive responses: tax + compliance + services + data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Portfolio-driven personalization across all government
                    levels
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Federal Register, ATO datasets, ABS API, and state
                    legislation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Adaptive quick actions based on your portfolio context
                  </span>
                </li>
              </ul>
            </div>

            {/* Personal Portfolio */}
            <div className="bg-base-100 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Portfolio Twin</h3>
                  <p className="text-base-content/70">
                    Your digital twin that powers all government interactions
                    with consent-driven memory updates
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Business context: ABN, industry, employees, interstate
                    operations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Individual context: visa, study status, work rights,
                    dependants
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Smart filtering: tax thresholds, service eligibility, data
                    relevance
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Privacy-first: edit or delete your data anytime
                  </span>
                </li>
              </ul>
            </div>

            {/* Compliance Checklists */}
            <div className="bg-base-100 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Universal Checklist
                  </h3>
                  <p className="text-base-content/70">
                    One checklist for all areas: tax deadlines, permit
                    applications, service eligibility, and compliance
                    requirements
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Unified tracking: BAS lodgment, permit renewal, benefit
                    applications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Priority-based organization: high (tax), medium (permits),
                    low (data)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Comprehensive compliance roadmap export across all
                    government areas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Links to relevant forms and agency contacts
                  </span>
                </li>
              </ul>
            </div>

            {/* Corporate Mode */}
            <div className="bg-base-100 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Document Analysis</h3>
                  <p className="text-base-content/70">
                    Upload any document and get comprehensive compliance
                    analysis
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Document upload works in any context: business, individual,
                    corporate
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Cross-domain gap analysis: tax, compliance, services, data
                    coverage
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Visual navigator: Federal → State → Local jurisdiction
                    mapping
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Unified compliance documentation across all government
                    departments
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust & Transparency Banner */}
          <div className="mt-12 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-2xl p-8 md:p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Built on trust and transparency
              </h3>
              <p className="text-lg text-base-content/70 mb-6">
                Every answer includes citations to official sources. You can
                always see why you&apos;re getting specific advice and verify it
                yourself.
              </p>
              <div className="flex flex-wrap gap-8 justify-center">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-red-500" />
                  <span className="font-semibold">Government data only</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-red-500" />
                  <span className="font-semibold">Direct law citations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-red-500" />
                  <span className="font-semibold">Transparent reasoning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Impact Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Complete government guidance solution
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-red-500/10 rounded-2xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">
              100%
            </div>
            <p className="text-sm font-semibold text-red-500 mb-1">
              Tax & Compliance
            </p>
            <p className="text-xs text-base-content/70">
              ATO integration complete
            </p>
          </div>
          <div className="bg-blue-500/10 rounded-2xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
              100%
            </div>
            <p className="text-sm font-semibold text-blue-500 mb-1">
              Government Services
            </p>
            <p className="text-xs text-base-content/70">
              Life-event navigation
            </p>
          </div>
          <div className="bg-green-500/10 rounded-2xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">
              100%
            </div>
            <p className="text-sm font-semibold text-green-500 mb-1">
              Data & Insights
            </p>
            <p className="text-xs text-base-content/70">ABS API connected</p>
          </div>
          <div className="bg-purple-500/10 rounded-2xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">
              100%
            </div>
            <p className="text-sm font-semibold text-purple-500 mb-1">
              Regulatory Navigation
            </p>
            <p className="text-xs text-base-content/70">Multi-level mapping</p>
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-12"></div>

        {/* Final Message */}
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Complete government services, one unified experience
          </h3>
          <p className="text-lg text-base-content/70 mb-8">
            RedTape proves that government interaction doesn&apos;t need silos.
            One
            portfolio twin, one universal chat, one comprehensive checklist
            covering tax, services, data, and compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              Get started now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/dashboard" className="btn btn-outline btn-lg">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold">RedTape</p>
          <p>GovHack 2024 • Making compliance accessible for all Australians</p>
        </div>
      </footer>
    </div>
  );
}
