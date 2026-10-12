import type { GalleryImage, GalleryAlbum } from "@/types";

export const mockGalleryAlbums: GalleryAlbum[] = [
  {
    id: "album-workshops-2025",
    title: "Technical Workshops 2024-25",
    category: "Workshops",
    description: "Hands-on engineering workshops, CFD labs, and HVAC training at CUSAT.",
    coverImage: "/images/gallery/tw/tw-1.jpg",
    date: "2025",
    imageCount: 3,
    relatedEventId: "daikin-workshop-2025",
  },
  {
    id: "album-sessions-2024",
    title: "Expert Talks & Seminars",
    category: "Sessions",
    description: "Invited academic lectures, DAAD international studies, and industrial valves.",
    coverImage: "/images/gallery/seminar/seminar-1.jpg",
    date: "2024",
    imageCount: 2,
    relatedEventId: "daad-info-session",
  },
  {
    id: "album-events-2024",
    title: "Flagship Events & Inductions",
    category: "Events",
    description: "Welcoming new students, student chapter festivals, and annual general body.",
    coverImage: "/images/gallery/induction/induction-1.jpg",
    date: "2024",
    imageCount: 2,
    relatedEventId: "student-induction-2024",
  },
];

export const mockGalleryImages: GalleryImage[] = [
  {
    id: "daikin-2025",
    albumId: "album-workshops-2025",
    src: "/images/gallery/tw/tw-1.jpg",
    label: "DAIKIN WORKSHOP 2025",
    category: "Workshops",
    date: "2025",
    description:
      "Hands-on training session at Centre of Excellence (Air Conditioning), CUSAT Mechanical Division.",
    isFeatured: true,
  },
  {
    id: "daad-session",
    albumId: "album-sessions-2024",
    src: "/images/gallery/seminar/seminar-1.jpg",
    label: "DAAD INFORMATION SESSION",
    category: "Sessions",
    date: "2024",
    description:
      "Guidance on higher studies, doctoral programs, and research opportunities in Germany.",
  },
  {
    id: "induction-2024",
    albumId: "album-events-2024",
    src: "/images/gallery/induction/induction-1.jpg",
    label: "STUDENT INDUCTION PROGRAM 2024",
    category: "Events",
    date: "2024",
    description:
      "Welcoming the new batch of Mechanical Engineering students to School of Engineering, CUSAT.",
  },
  {
    id: "control-valves",
    albumId: "album-sessions-2024",
    src: "/images/gallery/seminar/seminar-2.jpg",
    label: "SESSION ON CONTROL VALVES",
    category: "Sessions",
    date: "2024",
    description:
      "Technical expert session on industrial fluid power, butterfly valves, and control valve dynamics.",
  },
  {
    id: "cfd-2024",
    albumId: "album-workshops-2025",
    src: "/images/gallery/tw/tw-2.jpg",
    label: "CFD WORKSHOP 2024",
    category: "Workshops",
    date: "2024",
    description:
      "Computational Fluid Dynamics framework, conservation laws, and Navier-Stokes resolution principles.",
  },
  {
    id: "farewell-2024",
    albumId: "album-events-2024",
    src: "/images/gallery/induction/induction-2.jpg",
    label: "FAREWELL AND ALUMNI MEET 2024",
    category: "Alumni",
    date: "2024",
    description:
      "Celebrating graduating mechanical engineers and strengthening the CUSAT alumni network.",
  },
  {
    id: "industrial-phase2",
    albumId: "album-workshops-2025",
    src: "/images/gallery/tw/tw-3.jpg",
    label: "INDUSTRIAL IMMERSION PHASE 2",
    category: "Workshops",
    date: "2024",
    description:
      "Field visits and industry immersion experience for senior mechanical engineering undergraduates.",
  },
];
