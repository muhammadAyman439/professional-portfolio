import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Filter } from "lucide-react";
import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { pageSEO } from "@/lib/seo";
import { caseStudies } from "@/data/caseStudies";

export default function Portfolio() {
  const [selectedSector, setSelectedSector] = useState("all");

  const sectors = ["all", ...Array.from(new Set(caseStudies.map((cs) => cs.sector)))];

  const filteredCaseStudies =
    selectedSector === "all"
      ? caseStudies
      : caseStudies.filter((cs) => cs.sector === selectedSector);

  return (
    <div className="w-full">
      <SEOHead metadata={pageSEO.portfolio} path="/portfolio" />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="container relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Representative engagements showcasing proposal strategy, team leadership, and business impact
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 border-b border-foreground/10">
        <div className="container max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Filter size={20} className="text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wide">Filter by Sector</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
                  selectedSector === sector
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                }`}
              >
                {sector === "all" ? "All Sectors" : sector}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="section-padding">
        <div className="container max-w-6xl">
          <div className="space-y-16">
            {filteredCaseStudies.map((caseStudy, index) => (
              <div
                key={caseStudy.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-16 border-b border-foreground/10 last:border-b-0 last:pb-0 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className={`relative h-80 rounded-lg overflow-hidden ${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <img
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                      {caseStudy.sector}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    {caseStudy.title}
                  </h3>

                  <p className="text-foreground/70 mb-6 leading-relaxed">
                    {caseStudy.description}
                  </p>

                  {/* Key Achievements */}
                  <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-foreground/60 mb-4">
                      Key Achievements
                    </p>
                    <div className="space-y-3">
                      {caseStudy.keyAchievements.map((achievement, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-foreground/80">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-foreground/10">
                    <div>
                      <p className="text-xs text-foreground/50 uppercase tracking-widest font-semibold">
                        Contract Value
                      </p>
                      <p className="text-2xl font-display font-bold text-primary mt-2">
                        {caseStudy.contractValue}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/50 uppercase tracking-widest font-semibold">
                        Outcome
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-2">
                        {caseStudy.outcome}
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground/60 text-sm">
                    <span className="font-semibold text-foreground">Client:</span> {caseStudy.client}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredCaseStudies.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-foreground/70">
                No case studies found in this sector. Try a different filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-foreground/2">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Discuss Your Proposal Challenges?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Let's explore how proposal strategy and excellence can drive business growth.
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

