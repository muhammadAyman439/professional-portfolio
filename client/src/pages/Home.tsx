import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Target, Lightbulb, Network } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { buildPageSEO } from "@/lib/seo";
import { Spinner } from "@/components/ui/spinner";
import { useCaseStudies, useProfile } from "@/hooks/useContent";
import HoverImage from "@/components/HoverImage";

export default function Home() {
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useProfile();
  const {
    data: caseStudies,
    isLoading: isCaseStudiesLoading,
    isError: isCaseStudiesError,
  } = useCaseStudies();

  const featuredCaseStudies = (caseStudies ?? []).filter((cs) => cs.featured).slice(0, 3);
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

        <div className="container relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center animate-fadeInUp">
            {/* Name and Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-4 leading-tight">
              {profile.name}
            </h1>
            <p className="text-2xl md:text-3xl text-primary font-light mb-6">
              {profile.title}
            </p>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              {profile.tagline}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 py-8 border-t border-b border-foreground/10">
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {isProfileLoading ? <Spinner className="size-6" /> : profile.stats.yearsOfExperience}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Years of experience</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {isProfileLoading ? <Spinner className="size-6" /> : profile.stats.totalFundingSecured}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Total Funding Secured</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {isProfileLoading ? <Spinner className="size-6" /> : profile.stats.countries}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Countries</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {isProfileLoading ? <Spinner className="size-6" /> : profile.stats.winningRate}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Winning Rate</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/portfolio">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold group">
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
      <section className="section-padding">
        <div className="container max-w-6xl">
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
      <section className="section-padding bg-foreground/2">
        <div className="container max-w-6xl">
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
                variant="outline"
                className="px-8 py-6 text-base font-semibold border-foreground/20 text-foreground hover:bg-foreground/5"
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
        <div className="container relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
          Let’s Turn Your Next Bid into a Win.
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
          From strategy to submission, I partner with teams to deliver proposals that score higher and secure funding.
          </p>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold group">
              Let's Connect
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

