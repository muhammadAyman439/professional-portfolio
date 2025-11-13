import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Globe, Briefcase } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { buildPageSEO } from "@/lib/seo";
import { Spinner } from "@/components/ui/spinner";
import { useProfile } from "@/hooks/useContent";
import HoverImage from "@/components/HoverImage";
import LottieAnimation from "@/components/LottieAnimation";
import type { ApproachStep, ProfileCTA } from "@/types/content";

const DEFAULT_MISSION_SUPPORTING =
  "I aim to elevate the quality of proposal development across the sector transforming fragmented inputs into cohesive, fundable solutions that drive employment, digital transformation, and inclusive growth.";

const DEFAULT_APPROACH_STEPS: ApproachStep[] = [
  {
    title: "Deep Understanding Before Action",
    description:
      "Every engagement begins with clarity. I start by mapping the mandate, donor expectations, relevant policies, and the competitive landscape.",
    focus: "Focus: Needs analysis, RFP deconstruction, stakeholder alignment.",
  },
  {
    title: "Strategy-Led Proposal Architecture",
    description:
      "Winning proposals require more than good writing—they need a strong core. I build a strategic framework that defines the solution, the differentiators, the impact pathways, and the technical scoring logic.",
    focus: "Focus: Value proposition, solution logic, theory of change, scoring strategy.",
  },
  {
    title: "Collaborative, High-Performance Delivery",
    description:
      "I work as an extension of the internal team, creating a structured environment where technical experts, managers, and partners contribute effectively.",
    focus: "Focus: Team coordination, input management, structured workflows.",
  },
  {
    title: "Precision, Compliance & Quality Assurance",
    description:
      "Compliance is the foundation of competitiveness. I apply quality checks across all components—technical, financial, operational, and annexes—to ensure the submission meets every requirement and maximizes evaluation scores.",
    focus: "Focus: Checklists, compliance matrices, revision cycles, formatting standards.",
  },
  {
    title: "Impact-Centered Design",
    description:
      "Strong proposals do more than answer questions—they demonstrate long-term value. I design programs with clear KPIs, sustainability mechanisms, risk strategies, and measurable outcomes, ensuring proposals are not only fundable but implementable at scale.",
    focus: "Focus: KPIs, M&E logic, sustainability models, risk mitigation.",
  },
  {
    title: "Delivery That Builds Internal Capacity",
    description:
      "My approach strengthens organizations beyond a single submission. I transfer processes, templates, and systems that help teams operate more efficiently and independently in future bids.",
    focus: "Focus: Templates, playbooks, knowledge transfer, continuous improvement.",
  },
];

const DEFAULT_CTA: ProfileCTA = {
  heading: "Let's Work Together",
  body:
    "Whether you're looking to improve your proposal process, develop proposal strategy, or build a winning team, I'm here to help.",
  buttonLabel: "Get in Touch",
  buttonHref: "/contact",
};

export default function About() {
  const { data: profile, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-foreground/60">
          <Spinner className="size-6" />
          <span>Loading profile…</span>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-foreground/70">
          <p className="text-lg font-semibold">We couldn't load the profile content.</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  const pageMetadata = buildPageSEO(profile).about;
  const missionSupporting = profile.missionSupporting?.trim() || DEFAULT_MISSION_SUPPORTING;
  const approachSteps = profile.approach.length ? profile.approach : DEFAULT_APPROACH_STEPS;
  const cta = profile.cta ?? DEFAULT_CTA;
  const isCTAExternal = cta.buttonHref.startsWith("http://") || cta.buttonHref.startsWith("https://");

  return (
    <div className="w-full">
      <SEOHead metadata={pageMetadata} path="/about" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

        

        {/* Analytics - Strategic Program Design */}
        <div className="absolute bottom-24 right-12 w-28 h-28 md:w-36 md:h-36 opacity-30 pointer-events-none float-slow-animation">
          <LottieAnimation src="https://assets4.lottiefiles.com/packages/lf20_qp1q7mct.json" speed={0.6} />
        </div>

        <div className="container relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
              About Me
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto">
              {profile.bio.short}
            </p>
          </div>
        </div>
      </section>

      {/* Professional Photo & Bio */}
      <section className="section-padding">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative animate-slideInLeft">
              <div className="aspect-square rounded-lg overflow-hidden border border-foreground/10">
                <HoverImage
                  src={profile.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-lg blur-2xl pointer-events-none"></div>
            </div>

            {/* Bio */}
            <div className="animate-slideInRight">
              <h2 className="text-4xl font-display font-bold mb-6">
                {profile.name}
              </h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed whitespace-pre-line">
                {profile.bio.full}
              </p>

              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950 px-8 py-6 text-base font-semibold group">
                  Let's Connect
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Philosophy */}
      <section className="section-padding bg-foreground/2 relative overflow-hidden">
        {/* Target - Mission Objectives & RFP Focus */}
        <div className="absolute bottom-12 left-12 w-36 h-36 md:w-48 md:h-48 opacity-25 pointer-events-none float-animation">
          <LottieAnimation src="https://assets1.lottiefiles.com/packages/lf20_u4yrau.json" speed={0.6} />
        </div>

        <div className="container max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="animate-fadeInUp">
              <h3 className="text-2xl font-display font-bold mb-4">Mission</h3>
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                {profile.mission}
              </p>
              <p className="text-foreground/60">
                {missionSupporting}
              </p>
            </div>

            {/* Philosophy */}
            <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
              <h3 className="text-2xl font-display font-bold mb-6">Core Philosophy</h3>
              <div className="space-y-4">
                {profile.philosophy.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-1 h-1 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-foreground/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors & Regions */}
      <section className="section-padding relative overflow-hidden">
   

        <div className="container max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Sectors */}
            <div className="animate-fadeInUp">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="text-primary" size={28} />
                <h3 className="text-2xl font-display font-bold">Sectors</h3>
              </div>
              <div className="space-y-3">
                {profile.sectors.map((sector, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-foreground/2 rounded-lg hover:bg-foreground/5 transition-colors"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <p className="text-foreground/80">{sector}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-primary" size={28} />
                <h3 className="text-2xl font-display font-bold">Regions</h3>
              </div>
              <div className="space-y-3">
                {profile.regions.map((region, index) => {
                  // Map Arabic region names to English and flags
                  const regionMap: Record<string, { english: string; flag: string }> = {
                    "مصر": { english: "Egypt", flag: "🇪🇬" },
                    "السعودية": { english: "Saudi Arabia", flag: "🇸🇦" },
                    "الإمارات": { english: "UAE", flag: "🇦🇪" },
                    "البحرين": { english: "Bahrain", flag: "🇧🇭" },
                    "الكويت": { english: "Kuwait", flag: "🇰🇼" },
                    "أمريكا": { english: "United States", flag: "🇺🇸" },
                  };
                  
                  const regionInfo = regionMap[region] || { english: region, flag: "🌍" };
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-foreground/2 rounded-lg hover:bg-foreground/5 transition-colors"
                    >
                      <span className="text-2xl" role="img" aria-label={regionInfo.english}>
                        {regionInfo.flag}
                      </span>
                      <div className="flex items-center gap-2">
                        <p className="text-foreground font-medium">{region}</p>
                        <span className="text-foreground/40">•</span>
                        <p className="text-foreground/70">{regionInfo.english}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section-padding bg-foreground/2">
        <div className="container max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center">
            My Approach
          </h2>

          <div className="space-y-8">
            {approachSteps.map((step, index) => (
              <div
                key={`${step.title}-${index}`}
                className="flex gap-6 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                    <span className="text-primary font-bold text-lg">{index + 1}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-foreground/70 mb-2">{step.description}</p>
                  {step.focus && (
                    <p className="text-sm text-primary font-medium">{step.focus}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {cta.heading}
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            {cta.body}
          </p>
          {isCTAExternal ? (
            <a
              href={cta.buttonHref || DEFAULT_CTA.buttonHref}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950 px-8 py-6 text-base font-semibold group">
                {cta.buttonLabel || DEFAULT_CTA.buttonLabel}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </a>
          ) : (
            <Link href={cta.buttonHref || DEFAULT_CTA.buttonHref}>
              <Button className="bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950 px-8 py-6 text-base font-semibold group">
                {cta.buttonLabel || DEFAULT_CTA.buttonLabel}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

