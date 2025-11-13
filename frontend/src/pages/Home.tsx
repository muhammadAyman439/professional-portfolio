import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Target, Lightbulb, Network } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { buildPageSEO } from "@/lib/seo";
import { Spinner } from "@/components/ui/spinner";
import { useCaseStudies, useProfile } from "@/hooks/useContent";
import HoverImage from "@/components/HoverImage";
import LottieAnimation from "@/components/LottieAnimation";

export default function Home() {
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useProfile();
  const {
    data: caseStudies,
    isLoading: isCaseStudiesLoading,
    isError: isCaseStudiesError,
  } = useCaseStudies();

  const featuredCaseStudies = (caseStudies ?? [])
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .filter((cs) => cs.featured)
    .slice(0, 3);
  const pageMetadata = profile ? buildPageSEO(profile).home : buildPageSEO().home;

  if (isProfileLoading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-foreground/60">
          <Spinner className="size-6" />
          <span>Loading portfolio…</span>
        </div>
      </div>
    );
  }

  if (isProfileError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-foreground/70">
          <p className="text-lg font-semibold">We couldn't load the profile content.</p>
          <p className="text-sm">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SEOHead metadata={pageMetadata} path="/" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>

       

        {/* Document Review - Compliance & Quality */}
        <div className="absolute bottom-32 left-8 w-28 h-28 md:w-40 md:h-40 opacity-35 pointer-events-none float-slow-animation">
          <LottieAnimation src="https://assets9.lottiefiles.com/packages/lf20_gkgqj2yq.json" speed={0.6} />
        </div>

        <div className="container relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center animate-fadeInUp">
            {/* Name and Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-4 leading-tight">
              {profile.name}
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-6 gradient-text">
              {profile.title}
            </p>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              {profile.tagline}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 py-8 border-t border-b border-foreground/10">
              <div>
                <div className="text-3xl md:text-4xl font-roboto font-semibold tracking-tight gradient-text">
                  {isProfileLoading ? <Spinner className="size-6" /> : profile.stats.yearsOfExperience}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Years of experience</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-roboto font-semibold tracking-tight gradient-text">
                  {isProfileLoading ? <Spinner className="size-6" /> : profile.stats.totalFundingSecured}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Total Funding Secured</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-roboto font-semibold tracking-tight gradient-text">
                  {isProfileLoading ? <Spinner className="size-6" /> : profile.stats.countries}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Countries</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-roboto font-semibold tracking-tight gradient-text">
                  {isProfileLoading ? <Spinner className="size-6" /> : profile.stats.winningRate}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Winning Rate</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portfolio">
                <Button className="bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950 px-8 py-6 text-base font-semibold group">
                  View Portfolio
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-base font-semibold border-foreground/20 text-foreground hover:bg-foreground/5"
                >
                  Let's Connect
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 opacity-50 pointer-events-none">
          <LottieAnimation src="https://assets3.lottiefiles.com/packages/lf20_uu0x8lqv.json" speed={0.6} />
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="section-padding bg-foreground/2">
        <div className="container max-w-6xl">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Featured Work
            </h2>
            <p className="text-lg text-foreground/60">
              Representative case studies demonstrating strategic impact and proposal excellence
            </p>
          </div>

          <div className="space-y-12">
            {isCaseStudiesLoading && (
              <div className="flex justify-center py-16">
                <div className="flex items-center gap-3 text-foreground/60">
                  <Spinner className="size-6" />
                  <span>Loading case studies…</span>
                </div>
              </div>
            )}
            {!isCaseStudiesLoading &&
              !isCaseStudiesError &&
              featuredCaseStudies.map((caseStudy, index) => (
              <div
                key={caseStudy.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className={`relative h-80 rounded-lg overflow-hidden ${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <HoverImage
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  <div className="mb-4">
                    <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                      {caseStudy.sector}
                    </span>
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-3">{caseStudy.title}</h3>
                  <p className="text-foreground/70 mb-4">{caseStudy.description}</p>

                  {/* Key Achievements */}
                  {caseStudy.keyAchievements && caseStudy.keyAchievements.filter(a => a.trim()).length > 0 && (
                    <div className="mb-6 space-y-2">
                      {caseStudy.keyAchievements.filter(a => a.trim()).slice(0, 2).map((achievement, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-foreground/70">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-foreground/10">
                    <div>
                      <p className="text-xs text-foreground/50 uppercase tracking-wide">Contract Value</p>
                      <p className="text-xl font-bold text-primary">{caseStudy.contractValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/50 uppercase tracking-wide">Country</p>
                      <p className="text-sm font-semibold text-foreground">{caseStudy.country}</p>
                    </div>
                  </div>

                  <Link href="/portfolio" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold">
                    View All Case Studies
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              ))}
            {!isCaseStudiesLoading && (isCaseStudiesError || featuredCaseStudies.length === 0) && (
              <div className="text-center text-foreground/60 py-16">
                No featured case studies available right now.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="section-padding relative overflow-hidden">
        {/* Target Goal - RFP Requirements */}
        <div className="absolute top-16 left-8 w-40 h-40 md:w-56 md:h-56 opacity-30 pointer-events-none float-animation">
          <LottieAnimation src="https://assets1.lottiefiles.com/packages/lf20_u4yrau.json" speed={0.6} />
        </div>

        {/* Document Writing - Proposal Development */}
        <div className="absolute top-1/2 right-8 w-36 h-36 md:w-48 md:h-48 opacity-25 pointer-events-none float-slow-animation">
          <LottieAnimation src="https://assets1.lottiefiles.com/packages/lf20_1pxqjqps.json" speed={0.6} />
        </div>

     

        <div className="container max-w-6xl relative z-10">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Areas of Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fadeInUp">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proposal Strategy & Competitive Bidding Leadership</h3>
              <p className="text-foreground/70 mb-4">
                Designing and leading end-to-end proposal development strategies for large-scale, mission-driven organizations across the MEA region.
              </p>
              <p className="text-foreground/70 mb-4">
                Bringing a structured, compliance-driven approach that elevates technical scores, differentiates value propositions, and maximizes winning potential in highly competitive procurement environments.
              </p>
              <p className="text-sm text-primary font-medium">
                Focus: RFP analysis, solution positioning, bid management, scoring optimization.
              </p>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Development & Public Sector Program Design</h3>
              <p className="text-foreground/70 mb-4">
                Translating national and organizational priorities into implementable, outcomes-based project frameworks.
              </p>
              <p className="text-foreground/70 mb-4">
                Expert in shaping programs in youth employability, digital transformation, and economic inclusion — aligned with donor expectations and government strategies to secure sustained impact and funding approvals.
              </p>
              <p className="text-sm text-primary font-medium">
                Focus: Theory of change, KPIs, logical frameworks, sustainability & scalability planning.
              </p>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Network className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Stakeholder Coordination & High-Performance Delivery</h3>
              <p className="text-foreground/70 mb-4">
                Driving collaboration among global institutions, government entities, private providers, and technical experts to produce cohesive, compliant, and persuasive submissions.
              </p>
              <p className="text-foreground/70 mb-4">
                Ensuring seamless collaboration, clear accountability, and precision in every deliverable — from narrative to budget and annexes.
              </p>
              <p className="text-sm text-primary font-medium">
                Focus: Consortium alignment, process optimization, quality assurance, compliance control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Preview */}
      <section className="section-padding bg-foreground/2 relative overflow-hidden">
        {/* Analytics Chart - Bid Strategy & Data */}
        <div className="absolute top-16 right-12 w-40 h-40 md:w-56 md:h-56 opacity-25 pointer-events-none float-slow-animation">
          <LottieAnimation src="https://assets4.lottiefiles.com/packages/lf20_qp1q7mct.json" speed={0.6} />
        </div>

        <div className="container max-w-6xl relative z-10">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Latest Insights
            </h2>
            <p className="text-lg text-foreground/60">
              Thoughts on proposal strategy, leadership, and industry trends
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Placeholder for insights preview */}
            <Link href="/insights" className="group">
              <div className="bg-background border border-foreground/10 rounded-lg p-8 hover:border-primary/50 transition-all duration-300">
                <p className="text-sm text-primary uppercase tracking-wide font-semibold mb-3">
                  Proposal Strategy
                </p>
                <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                  The Proposal as Strategy
                </h3>
                <p className="text-foreground/70 mb-4">
                  Why your bid is more than a document—it's a strategic instrument that tells a compelling story.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  Read More
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>

            <Link href="/insights" className="group">
              <div className="bg-background border border-foreground/10 rounded-lg p-8 hover:border-primary/50 transition-all duration-300">
                <p className="text-sm text-primary uppercase tracking-wide font-semibold mb-3">
                  Leadership
                </p>
                <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                  Building High-Performing Teams
                </h3>
                <p className="text-foreground/70 mb-4">
                  Leadership lessons from 200+ wins and the practices that drive consistent proposal success.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  Read More
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/insights">
              <Button
                className="bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950 px-8 py-6 text-base font-semibold"
              >
                View All Insights
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        
        {/* Team Partnership - Collaboration & Winning Bids */}
        <div className="absolute top-1/2 -translate-y-1/2 right-12 w-48 h-48 md:w-64 md:h-64 opacity-20 pointer-events-none float-animation">
          <LottieAnimation src="https://assets2.lottiefiles.com/packages/lf20_myejiggj.json" speed={0.6} />
        </div>

        <div className="container relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
          Let's Turn Your Next Bid into a Win.
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
          From strategy to submission, I partner with teams to deliver proposals that score higher and secure funding.
          </p>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950 px-8 py-6 text-base font-semibold group">
              Let's Connect
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

