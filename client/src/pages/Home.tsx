import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Award, Users, TrendingUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { pageSEO } from "@/lib/seo";
import { profile } from "@/data/profile";
import { caseStudies } from "@/data/caseStudies";

export default function Home() {
  const featuredCaseStudies = caseStudies.filter((cs) => cs.featured).slice(0, 3);

  return (
    <div className="w-full">
      <SEOHead metadata={pageSEO.home} path="/" />

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
                  {profile.stats.years}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Years Experience</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {profile.stats.proposals}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Winning Proposals</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {profile.stats.clients}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Clients Served</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                  {profile.stats.successRate}
                </div>
                <p className="text-sm text-foreground/60 mt-2">Success Rate</p>
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
            {featuredCaseStudies.map((caseStudy, index) => (
              <div
                key={caseStudy.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className={`relative h-80 rounded-lg overflow-hidden ${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <img
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
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
                  <div className="mb-6 space-y-2">
                    {caseStudy.keyAchievements.slice(0, 2).map((achievement, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-foreground/70">{achievement}</p>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-foreground/10">
                    <div>
                      <p className="text-xs text-foreground/50 uppercase tracking-wide">Contract Value</p>
                      <p className="text-xl font-bold text-primary">{caseStudy.contractValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/50 uppercase tracking-wide">Outcome</p>
                      <p className="text-sm font-semibold text-foreground">{caseStudy.outcome}</p>
                    </div>
                  </div>

                  <Link href="/portfolio" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold">
                    View All Case Studies
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
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
                <Award className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proposal Strategy</h3>
              <p className="text-foreground/70">
                End-to-end proposal strategy from opportunity assessment through contract award, with focus on differentiation and competitive positioning.
              </p>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: "100ms" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Leadership</h3>
              <p className="text-foreground/70">
                Building and leading high-performing proposal teams, establishing proposal processes, and developing proposal talent.
              </p>
            </div>

            <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compliance Excellence</h3>
              <p className="text-foreground/70">
                Rigorous compliance management, requirement analysis, and quality assurance to ensure proposal completeness and accuracy.
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
            Ready to Elevate Your Proposal Excellence?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Whether you're looking to improve your proposal process, build a winning team, or develop proposal strategy, I'm here to help.
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

