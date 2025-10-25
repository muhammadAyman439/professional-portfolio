import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Globe, Briefcase, Users } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { pageSEO } from "@/lib/seo";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <div className="w-full">
      <SEOHead metadata={pageSEO.about} path="/about" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

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
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-lg blur-2xl"></div>
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
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold group">
                  Let's Connect
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Philosophy */}
      <section className="section-padding bg-foreground/2">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="animate-fadeInUp">
              <h3 className="text-2xl font-display font-bold mb-4">Mission</h3>
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                {profile.mission}
              </p>
              <p className="text-foreground/60">
                I believe that proposal excellence is a strategic business function, not just a compliance exercise. By elevating how organizations approach proposals, we unlock competitive advantage and build stronger client relationships.
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
      <section className="section-padding">
        <div className="container max-w-6xl">
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
                {profile.regions.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-foreground/2 rounded-lg hover:bg-foreground/5 transition-colors"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <p className="text-foreground/80">{region}</p>
                  </div>
                ))}
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
            <div className="flex gap-6 animate-fadeInUp">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Understand the Opportunity</h3>
                <p className="text-foreground/70">
                  Deep analysis of the client's needs, competitive landscape, and strategic priorities. This foundation informs everything that follows.
                </p>
              </div>
            </div>

            <div className="flex gap-6 animate-fadeInUp" style={{ animationDelay: "100ms" }}>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Develop Strategy</h3>
                <p className="text-foreground/70">
                  Craft a compelling positioning that differentiates your organization and addresses the client's key evaluation criteria.
                </p>
              </div>
            </div>

            <div className="flex gap-6 animate-fadeInUp" style={{ animationDelay: "200ms" }}>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Execute with Excellence</h3>
                <p className="text-foreground/70">
                  Rigorous execution with attention to compliance, clarity, and consistency. Every section reinforces your core message.
                </p>
              </div>
            </div>

            <div className="flex gap-6 animate-fadeInUp" style={{ animationDelay: "300ms" }}>
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                  <span className="text-primary font-bold text-lg">4</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Deliver & Learn</h3>
                <p className="text-foreground/70">
                  Submit with confidence and capture lessons learned. Every proposal is an opportunity to improve and refine your process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Let's Work Together
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Whether you're looking to improve your proposal process, develop proposal strategy, or build a winning team, I'm here to help.
          </p>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold group">
              Get in Touch
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

