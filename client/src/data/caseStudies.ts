export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  sector: string;
  contractValue: string;
  outcome: string;
  description: string;
  keyAchievements: string[];
  image: string;
  featured: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "Government Infrastructure Modernization",
    client: "Federal Department of Transportation",
    sector: "Government & Infrastructure",
    contractValue: "$850M",
    outcome: "Won - 94% compliance score",
    description:
      "Led proposal strategy for a complex multi-year infrastructure modernization program. Coordinated 12-person team across 3 locations to deliver a 500+ page proposal addressing 47 compliance requirements.",
    keyAchievements: [
      "Achieved 94% compliance score (industry average: 78%)",
      "Reduced proposal cycle time by 35%",
      "Established new proposal process framework",
      "Client awarded additional $200M in follow-on work",
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    featured: true,
  },
  {
    id: "2",
    title: "Enterprise Cloud Migration Program",
    client: "Global Financial Services Firm",
    sector: "Enterprise Technology",
    contractValue: "$320M",
    outcome: "Won - Selected from 8 competitors",
    description:
      "Developed winning proposal for a 5-year enterprise cloud migration and managed services engagement. Positioned client's unique methodology and risk mitigation approach against strong competition.",
    keyAchievements: [
      "Won against 8 qualified competitors",
      "Secured 3-year extension worth $180M",
      "Established strategic partnership framework",
      "Improved proposal win rate by 23%",
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    featured: true,
  },
  {
    id: "3",
    title: "Healthcare System Digital Transformation",
    client: "Regional Healthcare Network",
    sector: "Healthcare & Life Sciences",
    contractValue: "$180M",
    outcome: "Won - Highest-rated proposal",
    description:
      "Led proposal development for a comprehensive digital transformation program across 15 hospitals. Emphasized patient outcomes and operational efficiency in a highly regulated environment.",
    keyAchievements: [
      "Highest-rated proposal in evaluation",
      "Demonstrated 40% efficiency improvement",
      "Secured 5-year partnership",
      "Expanded to 3 additional health systems",
    ],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    id: "4",
    title: "Defense Contractor Capability Expansion",
    client: "Leading Defense Contractor",
    sector: "Government & Defense",
    contractValue: "$420M",
    outcome: "Won - Strategic partnership",
    description:
      "Managed proposal for a major capability expansion program. Navigated complex security requirements and demonstrated organizational readiness for scaled operations.",
    keyAchievements: [
      "Navigated 12 security compliance areas",
      "Established long-term partnership",
      "Secured additional task orders worth $280M",
      "Built proposal center of excellence",
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    id: "5",
    title: "Construction & Engineering Consortium Bid",
    client: "International Construction Consortium",
    sector: "Infrastructure & Construction",
    contractValue: "$1.2B",
    outcome: "Won - Largest proposal managed",
    description:
      "Coordinated proposal for a landmark infrastructure project involving 6 international partners. Managed complex teaming agreements and multi-language compliance requirements.",
    keyAchievements: [
      "Largest proposal managed ($1.2B value)",
      "Coordinated 6 international partners",
      "Delivered in 3 languages",
      "Achieved 96% compliance across all requirements",
    ],
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=500&fit=crop",
    featured: true,
  },
  {
    id: "6",
    title: "Telecom Infrastructure Modernization",
    client: "National Telecommunications Provider",
    sector: "Enterprise Technology",
    contractValue: "$280M",
    outcome: "Won - Innovative approach recognized",
    description:
      "Developed proposal emphasizing innovative technology approach and operational excellence. Differentiated through unique risk mitigation and customer success strategies.",
    keyAchievements: [
      "Recognized for innovation in approach",
      "Secured 7-year master service agreement",
      "Expanded to 5 additional service lines",
      "Achieved 92% customer satisfaction",
    ],
    image: "https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=800&h=500&fit=crop",
    featured: false,
  },
];

