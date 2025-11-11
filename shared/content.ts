export interface Profile {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  profileImage?: string;
  linkedin?: string;
  twitter?: string;
  stats: {
    yearsOfExperience: string;
    totalFundingSecured: string;
    countries: string;
    winningRate: string;
  };
  bio: {
    short: string;
    full: string;
  };
  mission: string;
  philosophy: string[];
  sectors: string[];
  regions: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  sector: string;
  contractValue: string;
  country: string;
  description: string;
  keyAchievements: string[];
  image: string;
  featured: boolean;
  order?: number | null;
}

export interface Insight {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
}

export interface ContentData {
  profile: Profile;
  caseStudies: CaseStudy[];
  insights: Insight[];
}

