import type { Event } from "@/types";

// Hosted event images
const daikin1 = "/images/events/daikin-workshop-2025-1.jpg";
const daikin2 = "/images/events/daikin-workshop-2025-2.jpg";
const induction1 = "/images/events/studind-1.jpg";
const induction2 = "/images/events/studind-2.jpg";
const daad1 = "/images/events/daad.jpg";
const cfd1 = "/images/events/cfd1.jpg";
const cfd2 = "/images/events/cfd2.jpg";
const controlValves1 = "/images/events/control.jpg";
const placement1 = "/images/events/placement-1.jpg";
const placement2 = "/images/events/placement-2.jpg";
const industrialImmersion1 = "/images/events/industrial-1.jpg";
const farewell1 = "/images/events/farewell-1.jpg";
const farewell2 = "/images/events/farewell-2.jpg";
const spacecraft1 = "/images/events/spaceCraft.jpg";
const lathe1 = "/images/events/almt.jpg";
const generator1 = "/images/events/generator.jpg";
const cfd2022_1 = "/images/events/CFD.jpg";

export const mockEvents: Event[] = [
  {
    id: "daikin-workshop-2025",
    slug: "daikin-workshop-2025",
    images: [daikin1, daikin2],
    tag: "Workshop",
    title: "DAIKIN WORKSHOP 2025",
    date: "2025",
    location: "Daikin Centre of Excellence & SOE CUSAT",
    coordinator: "Department of Mechanical Engineering & Daikin Experts",
    desc: "The Daikin Workshop on Refrigeration and Air Conditioning (RAC) topics, a collaborative event with the Mechanical Engineering department, was a significant highlight for students interested in HVAC technology. The session offered insights into the latest advancements and practical applications in the RAC field, delivered by industry experts from Daikin. This session was immediately followed by a visit to the Daikin Centre of Excellence.",
    fullDetails:
      "This hands-on experience allowed participants to witness cutting-edge Daikin technology and equipment firsthand, solidifying their understanding and bridging the gap between classroom concepts and real-world industrial practice.",
    status: "completed",
    isFeatured: true,
    galleryAlbumId: "album-workshops-2025",
  },
  {
    id: "student-induction-2024",
    slug: "student-induction-2024",
    images: [induction1, induction2],
    tag: "Flagship",
    title: "STUDENT INDUCTION PROGRAM 2024",
    date: "2024",
    location: "School of Engineering, CUSAT",
    coordinator: "MESAC Executive Committee",
    desc: "The Student Induction Program, an inspiring initiative by the Mechanical Engineering Students Association of CUSAT (MESAC). This event marked the beginning of an exciting journey for new members as they join a community dedicated to professional growth, collaboration, and academic excellence.",
    fullDetails:
      "With this successful induction, MESAC has welcomed a new cohort of motivated individuals ready to make their mark. The association promises a calendar packed with events, workshops, and collaborations that will empower members to enhance their skills and achieve their aspirations.",
    status: "completed",
    isFeatured: true,
    galleryAlbumId: "album-events-2024",
  },
  {
    id: "daad-info-session",
    slug: "daad-info-session",
    images: [daad1],
    tag: "Seminar",
    title: "DAAD INFORMATION SESSION",
    date: "November 8, 2024",
    location: "SOE, SDPK Hall, CUSAT",
    coordinator: "MESAC & DAAD Representatives",
    desc: "We are excited to share the successful completion of the DAAD (German Academic Exchange Service) information session on 8th November 2024, hosted by MESAC at SOE, SDPK Hall. Participants gained valuable insights into pursuing master's studies in Germany, covering application processes, scholarships, and academic culture.",
    fullDetails:
      "Our heartfelt thanks to the DAAD representatives for their guidance and to all attendees for their enthusiastic participation. This event reflects the growing interest in German higher education, and we look forward to seeing its positive impact on students' futures.",
    status: "completed",
    galleryAlbumId: "album-sessions-2024",
  },
  {
    id: "cfd-workshop-2024",
    slug: "cfd-workshop-2024",
    images: [cfd1, cfd2],
    tag: "Workshop",
    title: "2-DAY WORKSHOP ON COMPUTATIONAL FLUID DYNAMICS",
    date: "2024",
    location: "Mechanical Block, SOE CUSAT",
    coordinator: "Mr. Abdul Gafoor, Mr. Ritu Raj Kumar, Mr. Sumit Sarvankar (IIT Madras)",
    desc: "We are delighted for the successful completion of a 12-hour Computational Fluid Dynamics (CFD) course conducted by PhD research scholars Mr. Abdul Gafoor, Mr. Ritu Raj Kumar, and Mr. Sumit Sarvankar from IIT Madras' Aerospace Department.",
    fullDetails:
      "Designed for Mechanical Engineering students, the course introduced the fundamentals of CFD and demonstrated its wide-ranging applications in industries such as aerospace and environmental engineering. Students gained valuable insights into using CFD for academic projects, bridging the gap between theory and real-world problem-solving.",
    status: "completed",
  },
  {
    id: "session-control-valves",
    slug: "session-control-valves",
    images: [controlValves1],
    tag: "Seminar",
    title: "SESSION ON CONTROL VALVES",
    date: "2024",
    location: "SOE CUSAT Auditorium",
    coordinator: "Department of Mechanical Engineering & Industry Experts",
    desc: "An expert session dedicated to industrial control valves, valve sizing, actuation mechanisms, and fluid control dynamics. Participants explored practical industrial engineering concepts, troubleshooting, and real-world process automation applications.",
    fullDetails:
      "Students learned about globe valves, butterfly valves, pneumatic actuators, and pressure regulation systems vital in thermal power plants and petrochemical processing facilities.",
    status: "completed",
  },
  {
    id: "placement-training",
    slug: "placement-training",
    images: [placement1, placement2],
    tag: "Seminar",
    title: "PLACEMENT TRAINING",
    date: "2024",
    location: "SOE, CUSAT",
    coordinator: "MESAC, Pragmatix Learning, ACES, CESA & ESCA",
    desc: "MESAC, in collaboration with Pragmatix Learning, successfully hosted a two-day training program designed to equip B.Tech students with vital skills for career success. Day one featured Quantitative Aptitude and Logical Reasoning, and day two focused on Group Discussions, Personal Interviews, and Resume Writing.",
    fullDetails:
      "The immersive program bridged the gap between academics and industry demands, empowering students with the skills to excel in placements and beyond. MESAC extends its gratitude to Pragmatix Learning, ACES, CESA, and ESCA for making this initiative a success.",
    status: "completed",
  },
  {
    id: "industrial-immersion-phase2",
    slug: "industrial-immersion-phase2",
    images: [industrialImmersion1],
    tag: "Workshop",
    title: "INDUSTRIAL IMMERSION PHASE 2",
    date: "2024",
    location: "Hindustan Machine Tools (HMT)",
    coordinator: "MESAC & HMT Team",
    desc: "MESAC proudly announces the successful completion of the second phase of its Industrial Immersion Program, hosted by Hindustan Machine Tools (HMT). This unique opportunity provided students with firsthand insights into the operations of one of India's leading industrial organizations.",
    fullDetails:
      "The visit bridged the gap between academic learning and practical application, offering an in-depth understanding of large-scale manufacturing. HMT's expertise, professionalism, and warm hospitality made the experience both informative and memorable.",
    status: "completed",
  },
  {
    id: "farewell-alumni-meet",
    slug: "farewell-alumni-meet",
    images: [farewell1, farewell2],
    tag: "Flagship",
    title: "FAREWELL AND ALUMNI MEET",
    date: "May 12, 2024",
    location: "Polymer Science Auditorium, CUSAT",
    coordinator: "MESAC Community & Faculty",
    desc: "On 12th May, the MESAC community gathered in the Polymer Science Auditorium to bid an emotional farewell to two of its most beloved educators, Panicker Sir and Bhasi Sir. The event was a touching tribute, filled with gratitude, nostalgia, and admiration.",
    fullDetails:
      "Students, alumni, and faculty came together to honor the remarkable careers of these teachers who have dedicated decades to shaping young minds with their wisdom and commitment. Speeches, a heartfelt video montage, and personal anecdotes celebrated their unmatched contributions.",
    status: "completed",
  },
  {
    id: "spacecraft-autonomy",
    slug: "spacecraft-autonomy",
    images: [spacecraft1],
    tag: "Seminar",
    title: "SPACE CRAFT AUTONOMY",
    date: "April 27, 2023 · 10:00 AM",
    location: "Seminar Hall, New Laboratory Block, SOE",
    coordinator: "Dr. Krishna Dev Kumar (Prof. Space Systems Eng. & Dir. AI)",
    desc: "A special lecture on Space craft autonomy by Dr. Krishna Dev Kumar, Prof. Space Systems Engineering and Director of Artificial Intelligence, in accordance with MESAC and IIC. Dr. Krishna has more than 25 years of experience and has taken over hundreds of lectures worldwide. He is also ranked 73 among top scientists around the world.",
    fullDetails:
      "Dr. Krishna Dev Kumar shared insights on space dynamics, intelligent control, and AI applications in autonomous satellite systems.",
    status: "completed",
  },
  {
    id: "advanced-lathe-machine-tools",
    slug: "advanced-lathe-machine-tools",
    images: [lathe1],
    tag: "Workshop",
    title: "ADVANCED LATHE AND MACHINE TOOLS",
    date: "2023",
    location: "Central Workshop, SOE CUSAT",
    coordinator: "Division of Mechanical Engineering & MESAC",
    desc: "The workshop gave an introduction to various Machining Operations using Lathe and various other machine tools. The participants were provided with hands-on working on Lathe operations such as Facing, Turning, Slotting, Cutting, Drilling, Chamfering, Tapering, Threading, and Knurling.",
    fullDetails:
      "The technical know-how of a Machining Operation was learnt by the participants and the usages of each tools were explained in each different operations.",
    status: "completed",
  },
  {
    id: "generator-overhauling-workshop",
    slug: "generator-overhauling-workshop",
    images: [generator1],
    tag: "Workshop",
    title: "GENERATOR OVERHAULING WORKSHOP",
    date: "2023",
    location: "Mechanical Workshop Lab, CUSAT",
    coordinator: "MESAC Technical Team",
    desc: "The workshop was a remarkable opportunity to learn more about the working of a generator, why it should be overhauled over time and the technical know-how, all by real time hands-on experience.",
    fullDetails:
      "It involved disassembly of an old generator, understanding the various parts and the troubleshooting, imparting necessary repairs, and making it back into its working condition as good as new.",
    status: "completed",
  },
  {
    id: "cfd-workshop-2022",
    slug: "cfd-workshop-2022",
    images: [cfd2022_1],
    tag: "Workshop",
    title: "CFD WORKSHOP 2022",
    date: "November 4 & 5, 2022",
    location: "School of Engineering, CUSAT",
    coordinator: "Sam Joy & CB Vishnu (CFD Engineers, Krewx)",
    desc: "In association with Krewx, MESAC (Mechanical Engineering Students Association of CUSAT) conducted a CFD workshop at School of Engineering, CUSAT on November 4 & 5, 2022.",
    fullDetails:
      "Speakers Sam Joy and CB Vishnu guided students through computational fluid dynamics basics, grid independence tests, and industrial case studies.",
    status: "completed",
  },
];
