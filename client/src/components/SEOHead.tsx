import { useEffect } from "react";
import { SEOMetadata, generateMetaTags, getCanonicalUrl, siteConfig } from "@/lib/seo";

interface SEOHeadProps {
  metadata: SEOMetadata;
  path?: string;
}

export default function SEOHead({ metadata, path = "/" }: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = metadata.title;

    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", metadata.description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = metadata.description;
      document.head.appendChild(meta);
    }

    // Update keywords
    if (metadata.keywords && metadata.keywords.length > 0) {
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) {
        keywordsMeta.setAttribute("content", metadata.keywords.join(", "));
      } else {
        const meta = document.createElement("meta");
        meta.name = "keywords";
        meta.content = metadata.keywords.join(", ");
        document.head.appendChild(meta);
      }
    }

    // Update Open Graph tags
    const metaTags = generateMetaTags(metadata);
    Object.entries(metaTags).forEach(([name, content]) => {
      const selector = name.startsWith("og:") || name.startsWith("twitter:")
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;

      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        if (name.startsWith("og:") || name.startsWith("twitter:")) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    });

    // Update canonical URL
    const canonicalUrl = getCanonicalUrl(path);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Update robots meta
    if (metadata.robots) {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.setAttribute("content", metadata.robots);
      } else {
        const meta = document.createElement("meta");
        meta.name = "robots";
        meta.content = metadata.robots;
        document.head.appendChild(meta);
      }
    }

    // Update Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    if (ogUrl) {
      ogUrl.setAttribute("content", canonicalUrl);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:url");
      meta.setAttribute("content", canonicalUrl);
      document.head.appendChild(meta);
    }

    // Update Twitter handle
    const twitterHandle = document.querySelector('meta[name="twitter:creator"]');
    if (!twitterHandle && siteConfig.twitter) {
      const meta = document.createElement("meta");
      meta.name = "twitter:creator";
      meta.content = siteConfig.twitter;
      document.head.appendChild(meta);
    }
  }, [metadata, path]);

  return null;
}

