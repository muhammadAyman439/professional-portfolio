import { profile } from "@/data/profile";

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  robots?: string;
}

export const siteConfig = {
  name: profile.name,
  description: profile.bio.short,
  url: "https://example.com",
  ogImage: "https://example.com/og-image.png",
  twitter: "@johndoe",
  author: profile.name,
};

export const defaultSEO: SEOMetadata = {
  title: `${profile.name} – ${profile.title}`,
  description: profile.tagline,
  keywords: [
    "proposals manager",
    "thought leader",
    "proposal strategy",
    "business development",
    profile.name,
  ],
  ogType: "website",
  robots: "index, follow",
};

export const pageSEO: Record<string, SEOMetadata> = {
  home: {
    title: `${profile.name} – ${profile.title}`,
    description: profile.tagline,
    keywords: [
      "proposals manager",
      "thought leader",
      "proposal strategy",
      "business development",
      "consulting",
      profile.name,
    ],
    ogType: "website",
  },
  about: {
    title: `About ${profile.name} – Proposals Manager & Thought Leader`,
    description: profile.bio.short,
    keywords: [
      "about",
      "biography",
      "experience",
      "proposal management",
      "leadership",
      profile.name,
    ],
    ogType: "profile",
  },
  portfolio: {
    title: `Case Studies – ${profile.name}`,
    description:
      "Representative case studies showcasing proposal strategy, team leadership, and business impact.",
    keywords: [
      "case studies",
      "portfolio",
      "proposals",
      "wins",
      "achievements",
      "clients",
      profile.name,
    ],
    ogType: "website",
  },
  insights: {
    title: `Insights – ${profile.name}`,
    description:
      "Thoughts on proposal strategy, leadership, and industry trends.",
    keywords: [
      "insights",
      "articles",
      "blog",
      "proposal strategy",
      "leadership",
      "thought leadership",
      profile.name,
    ],
    ogType: "website",
  },
  contact: {
    title: `Let's Connect – ${profile.name}`,
    description:
      "Get in touch to discuss proposal strategy, leadership development, or business opportunities.",
    keywords: [
      "contact",
      "connect",
      "email",
      "message",
      "inquiry",
      profile.name,
    ],
    ogType: "website",
  },
};

export function generateMetaTags(metadata: SEOMetadata) {
  const tags: Record<string, string> = {
    "og:title": metadata.title,
    "og:description": metadata.description,
    "og:type": metadata.ogType || "website",
    "twitter:card": "summary_large_image",
    "twitter:title": metadata.title,
    "twitter:description": metadata.description,
  };

  if (metadata.ogImage) {
    tags["og:image"] = metadata.ogImage;
    tags["twitter:image"] = metadata.ogImage;
  }

  return tags;
}

export function getCanonicalUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

// Structured Data - Person JSON-LD
export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: profile.bio.short,
  url: "https://example.com",
  email: profile.email,
  telephone: profile.phone,
  sameAs: [profile.linkedin],
  image: "https://example.com/profile-image.jpg",
  worksFor: {
    "@type": "Organization",
    name: "Independent Consultant",
  },
};

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: profile.name,
  description: profile.bio.short,
  url: "https://example.com",
  logo: "https://example.com/logo.png",
  sameAs: [profile.linkedin],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: profile.email,
    telephone: profile.phone,
  },
};

