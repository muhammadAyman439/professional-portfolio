import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { pageSEO } from "@/lib/seo";
import { insights } from "@/data/insights";

export default function Insights() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(insights.map((i) => i.category)))];
  const filteredInsights =
    selectedCategory === "all"
      ? insights
      : insights.filter((i) => i.category === selectedCategory);

  return (
    <div className="w-full">
      <SEOHead metadata={pageSEO.insights} path="/insights" />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="container relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
              Insights
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Thoughts on proposal strategy, leadership, and industry trends
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 border-b border-foreground/10">
        <div className="container max-w-6xl">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                }`}
              >
                {category === "all" ? "All Articles" : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          <div className="space-y-12">
            {filteredInsights.map((article, index) => (
              <article
                key={article.id}
                className="pb-12 border-b border-foreground/10 last:border-b-0 last:pb-0 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="mb-4 flex items-center gap-4 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 hover:text-primary transition-colors">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Read More Link */}
                <button className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold group">
                  Read Full Article
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </article>
            ))}
          </div>

          {filteredInsights.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-foreground/70">
                No articles found in this category. Try a different filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-foreground/2">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Subscribe to receive new insights on proposal strategy and leadership directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-background border border-foreground/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

