import type { Profile } from "@shared/content";

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  robots?: string;
}

const FALLBACK_PROFILE: Profile = {
  name: "Mohamed Salah Merza",
  title: "Proposals Expert & Founder of Merza Group",
  tagline: "Helping You Secure 7-Figure Deals Faster Through High-Impact Proposals",
  email: "mohamedsalah.merza@gmail.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
  linkedin: "https://www.linkedin.com/in/mohamedsalahmerza/",
  twitter: "https://twitter.com/johndoe",
  stats: {
    yearsOfExperience: "+6",
    totalFundingSecured: "$M12+",
    countries: "5+",
    winningRate: "75%",
  },
  bio: {
    short:
      "Proposals Manager with a strong record of helping organizations across the MEA region win high-value contracts and grants with over $12M in awarded project capital and 450+ proposals submitted across public, private, and nonprofit sectors.",
    full: "With 6+ years of experience in RFPs, tenders, grants, and business development, I bridge the gap between technical teams, pricing strategists, and client stakeholders to deliver customized, winning proposals. Whether it's a government TOR, a donor-funded RFQ, or a competitive NGO grant, I bring structure, strategy, and speed to every bid cycle.\n\nI specialize in:\n\n• Managing full bid lifecycles for complex service proposals\n• Writing compelling narratives in both English and Arabic\n• Aligning financial justifications with technical value\n• Designing and automating internal proposal systems\n• Coaching junior writers and building scalable bid units\n\nWhat sets me apart?\n\nI don't just submit proposals—I build pipelines, tell winning stories, and drive measurable results. I've increased win rates by 150%, improved internal workflows by 35%, and helped organizations shift from reactive bidding to proactive growth.\n\nCurrently leading the Proposals Department at EYouth, I work on regional bids for digital transformation, capacity building, training, and managed services.\n\nLet's connect if you're looking for someone who knows how to turn an RFP into a strategic growth opportunity.",
  },
  mission: "To empower organizations across the MEA region to win high-value funding and deliver meaningful impact through proposals that combine strategic clarity, operational feasibility, and measurable outcomes.",
  philosophy: [
    "Strategy First: Every winning proposal begins with a strong strategic backbone. I believe in grounding proposals in clear priorities, rigorous analysis, and a compelling value narrative that aligns with donor expectations and national agendas.",
    "Precision in Execution: Excellence is not an abstract concept; it is built through process discipline. I operate with structured systems, compliance-focused workflows, and high standards for quality assurance to consistently deliver proposals that outperform competitors.",
    "Impact Above Activity: A proposal is not just a document; it is a blueprint for real-world change. I prioritize outcomes, sustainability, and measurable impact, ensuring that every solution contributes to long-term development value rather than short-lived interventions.",
    "Collaboration as a Competitive Advantage: Successful proposals come from orchestrated, coordinated teams. I work through transparent communication, clear roles, and streamlined processes that allow multi-stakeholder teams to deliver with confidence and cohesion.",
    "Ethical, Human-Centered Work: Proposals must respect people, context, and reality. I am committed to developing solutions that are ethical, inclusive, and grounded in genuine community needs, not just what looks good on paper.",
  ],
  sectors: [
    "Human Capital & Workforce Development",
    "Entrepreneurship & Innovation",
    "Digital & Technology Enablement",
    "Youth Empowerment & Civic Engagement",
    "Public Sector Capacity Building",
    "Sustainability & Green Economy",
    "Women’s Economic Empowerment"
  ]
  ,
  regions: [
    "مصر",
    "السعودية",
    "الإمارات",
    "البحرين",
    "الكويت",
    "أمريكا"
  ]
  ,
};

export function resolveProfile(profile?: Profile): Profile {
  return profile ?? FALLBACK_PROFILE;
}

export function buildSiteConfig(profile?: Profile) {
  const data = resolveProfile(profile);
  return {
    name: data.name,
    description: data.bio.short,
    url: "https://example.com",
    ogImage: "https://example.com/og-image.png",
    twitter: "@johndoe",
    author: data.name,
  };
}

export function buildDefaultSEO(profile?: Profile): SEOMetadata {
  const data = resolveProfile(profile);
  return {
    title: `${data.name} – ${data.title}`,
    description: data.tagline,
    keywords: [
      "proposals manager",
      "thought leader",
      "proposal strategy",
      "business development",
      data.name,
    ],
    ogType: "website",
    robots: "index, follow",
  };
}

export function buildPageSEO(profile?: Profile): Record<string, SEOMetadata> {
  const data = resolveProfile(profile);
  return {
    home: {
      title: `${data.name} – ${data.title}`,
      description: data.tagline,
      keywords: [
        "proposals manager",
        "thought leader",
        "proposal strategy",
        "business development",
        "consulting",
        data.name,
      ],
      ogType: "website",
    },
    about: {
      title: `About ${data.name} – Proposals Manager & Thought Leader`,
      description: data.bio.short,
      keywords: [
        "about",
        "biography",
        "experience",
        "proposal management",
        "leadership",
        data.name,
      ],
      ogType: "profile",
    },
    portfolio: {
      title: `Case Studies – ${data.name}`,
      description:
        "Representative case studies showcasing proposal strategy, team leadership, and business impact.",
      keywords: [
        "case studies",
        "portfolio",
        "proposals",
        "wins",
        "achievements",
        "clients",
        data.name,
      ],
      ogType: "website",
    },
    insights: {
      title: `Insights – ${data.name}`,
      description:
        "Thoughts on proposal strategy, leadership, and industry trends.",
      keywords: [
        "insights",
        "articles",
        "blog",
        "proposal strategy",
        "leadership",
        "thought leadership",
        data.name,
      ],
      ogType: "website",
    },
    contact: {
      title: `Let's Connect – ${data.name}`,
      description:
        "Get in touch to discuss proposal strategy, leadership development, or business opportunities.",
      keywords: [
        "contact",
        "connect",
        "email",
        "message",
        "inquiry",
        data.name,
      ],
      ogType: "website",
    },
  };
}

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

export function buildPersonStructuredData(profile?: Profile) {
  const data = resolveProfile(profile);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.title,
    description: data.bio.short,
    url: "https://example.com",
    email: data.email,
    telephone: data.phone,
    sameAs: data.linkedin ? [data.linkedin] : [],
    image: "https://example.com/profile-image.jpg",
    worksFor: {
      "@type": "Organization",
      name: "Independent Consultant",
    },
  };
}

export function buildOrganizationSchema(profile?: Profile) {
  const data = resolveProfile(profile);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    description: data.bio.short,
    url: "https://example.com",
    logo: "https://example.com/logo.png",
    sameAs: data.linkedin ? [data.linkedin] : [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: data.email,
      telephone: data.phone,
    },
  };
}

export const siteConfig = buildSiteConfig();
export const defaultSEO = buildDefaultSEO();
export const pageSEO = buildPageSEO();
export const personStructuredData = buildPersonStructuredData();
export const organizationSchema = buildOrganizationSchema();

