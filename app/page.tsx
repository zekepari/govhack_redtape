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
import { ContextSelection } from "./components/ContextSelection";

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
              Your AI-powered guide through laws, regulations, and government
              requirements. Get personalised answers, instant compliance checks,
              and actionable next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/dashboard" className="btn btn-secondary btn-lg">
                Start new chat
              </Link>
              <Link href="/dashboard" className="btn btn-outline btn-lg">
                Review profile
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

      {/* Context Selection */}
      <ContextSelection />

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
            How RedTape works
          </h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Get personalized guidance in three simple steps
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
                Choose your context
              </h3>
              <p className="text-base-content/70">
                Select whether you&apos;re a business owner, student, looking
                for housing, planning travel, or managing corporate compliance
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
              <h3 className="text-xl font-semibold mb-2">Ask your questions</h3>
              <p className="text-base-content/70">
                Chat naturally about your situation. RedTape filters through
                thousands of regulations to find what applies to you
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
            <h3 className="text-xl font-semibold mb-2">Get clear actions</h3>
            <p className="text-base-content/70">
              Receive step-by-step guidance, save requirements to your
              checklist, and export compliance documentation
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-base-200 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to stay compliant
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              RedTape combines AI-powered guidance with official government data
              to give you accurate, personalized compliance advice
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
                    Smart Chat Assistant
                  </h3>
                  <p className="text-base-content/70">
                    Ask questions in plain English and get instant, accurate
                    answers
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Plain-language summaries of complex regulations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Step-by-step action plans tailored to your situation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Direct citations to laws, agencies, and official sources
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Follow-up suggestions to explore related requirements
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
                  <h3 className="text-2xl font-bold mb-2">
                    Personal Portfolio
                  </h3>
                  <p className="text-base-content/70">
                    Build your profile once, get personalized guidance forever
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Store business info: ABN, industry, employees, location
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Track personal details: visa status, income, housing goals
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Automatic filtering of regulations to your situation
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
                    Compliance Checklists
                  </h3>
                  <p className="text-base-content/70">
                    Turn obligations into actionable tasks you can track
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Save requirements from any chat conversation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Track deadlines and mark tasks as complete
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Export to PDF for record-keeping or sharing
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
                  <h3 className="text-2xl font-bold mb-2">Corporate Mode</h3>
                  <p className="text-base-content/70">
                    Advanced tools for businesses and legal teams
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Upload policies and compliance documents
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    AI-powered gap analysis against regulations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Coverage reports: see what&apos;s covered, partial, or
                    missing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base-content/80">
                    Export comprehensive compliance documentation
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

      {/* Stats & Impact Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
              50K+
            </div>
            <p className="text-lg text-base-content/70">
              Compliance questions answered
            </p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
              1,200+
            </div>
            <p className="text-lg text-base-content/70">
              Government regulations tracked
            </p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
              98%
            </div>
            <p className="text-lg text-base-content/70">
              User satisfaction rate
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="divider my-12"></div>

        {/* Final Message */}
        <div className="text-center max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Navigate compliance with confidence
          </h3>
          <p className="text-lg text-base-content/70 mb-8">
            RedTape is your trusted companion for understanding Australian
            government requirements. From business registration to visa
            applications, we&apos;re here to make compliance simple.
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
