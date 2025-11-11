import { Link, useRoute } from "wouter";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useInsights, useProfile } from "@/hooks/useContent";
import SEOHead from "@/components/SEOHead";
import { buildPageSEO } from "@/lib/seo";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export default function Article() {
  const [match, params] = useRoute<{ id: string }>("/insights/:id");
  const { data: insights, isLoading, isError } = useInsights();
  const { data: profile } = useProfile();

  const articleId = params?.id;
  const article = articleId ? insights?.find((i) => i.id === articleId) : undefined;
  const pageMetadata = profile ? buildPageSEO(profile).insights : buildPageSEO().insights;

  // Format content: convert **text** to bold and handle line breaks
  const formatContent = (content: string) => {
    return content.split("\n\n").map((paragraph, idx) => {
      // Handle bold text (**text**)
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="mb-4 last:mb-0">
          {parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              const boldText = part.slice(2, -2);
              return (
                <strong key={partIdx} className="font-semibold text-foreground">
                  {boldText}
                </strong>
              );
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <SEOHead metadata={pageMetadata} path="/insights" />
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-foreground/60">
            <Spinner className="size-6" />
            <span>Loading article…</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="w-full">
        <SEOHead metadata={pageMetadata} path="/insights" />
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold mb-4">Article Not Found</h1>
            <p className="text-lg text-foreground/70 mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/insights">
              <Button className="inline-flex items-center gap-2">
                <ArrowLeft size={18} />
                Back to Insights
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SEOHead 
        metadata={{
          ...pageMetadata,
          title: `${article.title} | ${pageMetadata.title}`,
          description: article.excerpt,
        }} 
        path={`/insights/${article.id}`} 
      />

      {/* Back Button */}
      <section className="pt-20 pb-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Link href="/insights">
            <Button 
              variant="ghost" 
              className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft size={18} />
              Back to Insights
            </Button>
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="pb-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Category */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center gap-6 text-sm text-foreground/60 mb-8 pb-8 border-b border-foreground/10">
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

          {/* Excerpt */}
          <p className="text-xl text-foreground/70 mb-8 leading-relaxed font-medium">
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <article className="prose prose-lg max-w-none">
            <div className="text-lg text-foreground/90 leading-relaxed">
              {formatContent(article.content)}
            </div>
          </article>
        </div>
      </section>

      {/* Back to Insights CTA */}
      <section className="py-16 border-t border-foreground/10">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Link href="/insights">
            <Button 
              variant="outline" 
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              View All Insights
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

