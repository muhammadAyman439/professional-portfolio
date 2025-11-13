import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import SEOHead from "@/components/SEOHead";
import { buildPageSEO } from "@/lib/seo";
import { Spinner } from "@/components/ui/spinner";
import { useInsights, useProfile } from "@/hooks/useContent";
import LottieAnimation from "@/components/LottieAnimation";
import apiClient from "@/api/http";
// animations loaded via CDN URLs using LottieAnimation `src`
import { cn } from "@/lib/utils";

export default function Insights() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeSuccessMessage, setSubscribeSuccessMessage] = useState<string | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const { data: insights, isLoading, isError } = useInsights();
  const { data: profile } = useProfile();
  const pageMetadata = buildPageSEO(profile).insights;

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeError(null);
    setSubscribeSuccessMessage(null);

    try {
      const trimmedEmail = newsletterEmail.trim();
      if (!trimmedEmail) {
        setSubscribeError("Please enter a valid email address.");
        return;
      }

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_NEWSLETTER_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        setSubscribeError(
          "Newsletter signups are temporarily unavailable. Please check back later.",
        );
        return;
      }

      let emailJsFailureMessage: string | null = null;

      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            subscriber_email: trimmedEmail,
            to_email: trimmedEmail,
            email: trimmedEmail,
            user_email: trimmedEmail,
            reply_to: trimmedEmail,
            name: trimmedEmail.split("@")[0] ?? "Subscriber",
            websiteLink: window.location.origin,
          },
          {
            publicKey,
          },
        );
      } catch (err: any) {
        console.error("EmailJS newsletter confirmation failed", err);
        emailJsFailureMessage =
          err?.text ??
          err?.message ??
          "We couldn't send the confirmation email automatically.";
      }

      const response = await apiClient.post("/email/newsletter", { email: trimmedEmail });

      setSubscribeSuccess(true);
      setSubscribeSuccessMessage(
        emailJsFailureMessage
          ? `${response.data?.message ?? "Subscription received."} ${emailJsFailureMessage} We'll follow up shortly.`
          : typeof response.data?.message === "string"
            ? response.data.message
            : "Successfully subscribed! Check your email for confirmation.",
      );
      setNewsletterEmail("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubscribeSuccess(false);
      }, 5000);
    } catch (err: any) {
      if (err.response) {
        const errorData = err.response.data;

        if (errorData?.details?.fieldErrors) {
          const fieldErrors = errorData.details.fieldErrors;
          const errorMessages: string[] = [];

          if (fieldErrors.email?.length) errorMessages.push(...fieldErrors.email);

          setSubscribeError(errorMessages.join(". ") || errorData.error || "Failed to subscribe");
        } else {
          setSubscribeError(errorData?.error || errorData?.message || `Failed to subscribe (${err.response.status})`);
        }
      } else if (err.request) {
        setSubscribeError("Network error. Please check your connection and try again.");
      } else {
        setSubscribeError(err.message || "Failed to subscribe. Please try again.");
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const categories = ["all", ...(insights ? Array.from(new Set(insights.map((i) => i.category))) : [])];
  const filteredInsights =
    selectedCategory === "all"
      ? insights ?? []
      : (insights ?? []).filter((i) => i.category === selectedCategory);

  return (
    <div className="w-full">
      <SEOHead metadata={pageMetadata} path="/insights" />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

        {/* Analytics Chart - Strategic Insights */}
        <div className="absolute top-24 right-12 w-40 h-40 md:w-52 md:h-52 opacity-30 pointer-events-none float-slow-animation">
          <LottieAnimation src="https://assets4.lottiefiles.com/packages/lf20_qp1q7mct.json" speed={0.6} />
        </div>

        {/* Writing Document - Content Creation */}
        <div className="absolute top-24 left-12 w-32 h-32 md:w-40 md:h-40 opacity-25 pointer-events-none float-animation">
          <LottieAnimation src="https://assets1.lottiefiles.com/packages/lf20_1pxqjqps.json" speed={0.6} />
        </div>

        {/* Target Goal - Performance Tracking */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-36 h-36 md:w-48 md:h-48 opacity-25 pointer-events-none float-slow-animation">
          <LottieAnimation src="https://assets1.lottiefiles.com/packages/lf20_u4yrau.json" speed={0.6} />
        </div>

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
          {isLoading ? (
            <div className="flex items-center gap-3 text-foreground/60">
              <Spinner className="size-5" />
              <span>Loading categories…</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize text-slate-900 border border-transparent",
                      isSelected
                        ? "bg-primary/20 border-primary text-slate-900"
                        : "bg-foreground/5 hover:bg-foreground/10"
                    )}
                  >
                    {category === "all" ? "All Articles" : category}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          {isLoading && (
            <div className="flex justify-center py-16">
              <div className="flex items-center gap-3 text-foreground/60">
                <Spinner className="size-6" />
                <span>Loading insights…</span>
              </div>
            </div>
          )}
          {!isLoading && isError && (
            <div className="text-center text-foreground/60 py-16">
              We couldn't load insights right now. Please try again later.
            </div>
          )}
          {!isLoading && !isError && (
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
                <Link href={`/insights/${article.id}`} className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold group">
                  <span className="text-primary">Read Full Article</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </article>
              ))}
            </div>
          )}

          {!isLoading && !isError && filteredInsights.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-foreground/70">
                No articles found in this category. Try a different filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-foreground/2 relative overflow-hidden">
        <div className="container max-w-6xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Subscribe to receive new insights on proposal strategy and leadership directly in your inbox.
          </p>
          {subscribeSuccess ? (
            <div className="max-w-md mx-auto bg-primary/10 border border-primary/30 rounded-lg p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4">
                <LottieAnimation src="https://assets10.lottiefiles.com/packages/lf20_touohxv0.json" loop={false} speed={0.2} />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                {subscribeSuccessMessage ?? "Subscription updated"}
              </h3>
              <p className="text-sm text-foreground/70">
                You can close this message or continue exploring insights.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              {subscribeError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {subscribeError}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (subscribeError) setSubscribeError(null);
                  }}
                  required
                  disabled={isSubscribing}
                  className="flex-1 px-4 py-3 bg-background border border-foreground/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
                <Button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-primary hover:bg-primary/90 text-slate-900 dark:text-slate-950 px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

