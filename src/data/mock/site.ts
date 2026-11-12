import type { SiteSettings, HomePageContent } from "@/types";

export const mockSiteSettings: SiteSettings = {
  id: "mesac-cusat-settings",
  siteName: "MESAC CUSAT",
  organizationName: "Mechanical Engineering Students' Association (MESAC)",
  institutionName: "School of Engineering, Cochin University of Science and Technology",
  tagline:
    "Empowering Mechanical Engineers through Innovation, Industry Immersion, and Craftsmanship",
  contactEmail: "mesac@cusat.ac.in",
  contactPhone: "+91 484 257 5370",
  officeAddress:
    "Division of Mechanical Engineering, School of Engineering, CUSAT, South Kalamassery, Kochi, Kerala 682022",
  socialLinks: {
    instagram: "https://www.instagram.com/mesac_cusat/",
    linkedin: "https://www.linkedin.com/company/mesac-cusat/",
    youtube: "https://www.youtube.com/@mesaccusat",
  },
  activeAcademicYear: "2026-27",
  announcement: {
    id: "announcement-2026",
    enabled: true,
    badge: "Official",
    text: "MESAC Committee 2026-27 Announced • Explore Upcoming Flagship Workshops & Industry Visits",
    link: "/events",
  },
  meta: {
    title: "MESAC CUSAT — Mechanical Engineering Students' Association",
    description:
      "The premier student organization of the Mechanical Engineering Division at School of Engineering, Cochin University of Science and Technology (CUSAT).",
  },
};

export interface HomeStat {
  label: string;
  value: number;
  suffix?: string;
  description?: string;
}

export const mockHomeStats: HomeStat[] = [
  {
    label: "Active Members",
    value: 350,
    suffix: "+",
    description: "B.Tech & M.Tech mechanical engineering students",
  },
  {
    label: "Technical Events",
    value: 45,
    suffix: "+",
    description: "Flagship tech sessions, CAD workshops & industrial tours",
  },
  {
    label: "Industry Partners",
    value: 20,
    suffix: "+",
    description: "Corporate & academic ties (Daikin, DAAD, HMT)",
  },
  {
    label: "Years of Legacy",
    value: 15,
    suffix: "+",
    description: "Decades of mechanical excellence at SOE CUSAT",
  },
];

export const mockHomePageContent: HomePageContent = {
  hero: {
    badge: "School of Engineering • CUSAT",
    titleLine1: "MECHANICAL",
    titleHighlight: "ENGINEERING",
    titleLine2: "STUDENTS' ASSOCIATION",
    description:
      "The official platform uniting student innovators, faculty researchers, and industry pioneers to advance mechanical design, robotics, thermal sciences, and aerospace engineering.",
    primaryCtaText: "Explore Events",
    primaryCtaLink: "/events",
    secondaryCtaText: "Meet The Team",
    secondaryCtaLink: "/team",
    stats: [
      { label: "Active Members", value: "350", suffix: "+" },
      { label: "Technical Events", value: "45", suffix: "+" },
      { label: "Industry Partners", value: "20", suffix: "+" },
      { label: "Years of Legacy", value: "15", suffix: "+" },
    ],
  },
  aboutSection: {
    eyebrow: "Our Mandate",
    heading: "Bridging Theoretical Rigor and Hands-On Industrial Engineering",
    paragraphs: [
      "MESAC serves as the nerve center for co-curricular and extracurricular engineering initiatives at the Division of Mechanical Engineering, CUSAT.",
      "Through industry immersion programs, international academic seminars (DAAD), CAD/CFD design competitions, and machining workshops, MESAC prepares students for leading roles in engineering and research.",
    ],
    features: [
      {
        title: "Hands-on Technical Training",
        description:
          "Practical exposure to Lathe machining, generator overhauling, HVAC systems, and Computational Fluid Dynamics.",
      },
      {
        title: "Industry Collaboration",
        description:
          "Direct partnerships with organizations like Daikin, HMT, and Pragmatix Learning for student training and placements.",
      },
      {
        title: "Academic & Career Growth",
        description:
          "Placement preparation sessions, mock aptitude tests, GATE mentorship, and alumni guidance.",
      },
    ],
  },
  featuredEventIds: ["daikin-workshop-2025", "student-induction-2024", "daad-info-session"],
  featuredGalleryImageIds: ["daikin-2025", "daad-session", "induction-2024"],
};
