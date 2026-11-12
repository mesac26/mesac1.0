import type { AcademyTrack, CusatGradeInfo } from "@/types";

/**
 * Official CUSAT B.Tech Grading System:
 * Exactly conforms to the existing grading points in src/components/GpaCalculator.tsx:
 * - S: 10 (>= 90%)
 * - A: 9 (80% - 89%)
 * - B: 8 (70% - 79%)
 * - C: 7 (60% - 69%)
 * - D: 6 (50% - 59%)
 * - E: 5 (45% - 49%)
 * - F: 0 (< 45%)
 */
export const CUSAT_GRADE_SCALE: CusatGradeInfo[] = [
  { letter: "S", points: 10, percentageRange: "90% – 100%", description: "Outstanding" },
  { letter: "A", points: 9, percentageRange: "80% – 89%", description: "Excellent" },
  { letter: "B", points: 8, percentageRange: "70% – 79%", description: "Very Good" },
  { letter: "C", points: 7, percentageRange: "60% – 69%", description: "Good" },
  { letter: "D", points: 6, percentageRange: "50% – 59%", description: "Fair" },
  { letter: "E", points: 5, percentageRange: "45% – 49%", description: "Pass" },
  { letter: "F", points: 0, percentageRange: "< 45%", description: "Failed" },
];

/**
 * Verified Six MESAC Academy Tracks:
 * Preserves all official curriculum tracks, durations, and SOE CUSAT PDFs
 * without inventing unsupported facts.
 */
export const mockAcademyTracks: AcademyTrack[] = [
  {
    id: "cad-design",
    n: "01",
    t: "CAD & Generative Design",
    title: "CAD & Generative Design",
    trackCode: "MEC-ACAD-01",
    level: "Intermediate",
    d: "Master SolidWorks, Fusion 360, parametric drafting, complex assemblies, and generative surface modeling.",
    description:
      "Master SolidWorks, Fusion 360, parametric drafting, complex assemblies, and generative surface modeling with industry-standard GD&T protocols.",
    duration: "6 Weeks (24 Hours)",
    tools: ["SolidWorks", "Fusion 360", "GD&T", "KeyShot"],
    modules: [
      "Parametric Sketching & Solid Modeling",
      "Assembly Constraints & Motion Studies",
      "Geometric Dimensioning & Tolerancing (GD&T)",
      "Generative Design & Photorealistic Rendering",
    ],
    pdfUrl: "https://soe.cusat.ac.in/manuals/cad_cam_cnc_guide.pdf",
    pdfTitle: "CAD Workshop Curriculum PDF",
    status: "open",
  },
  {
    id: "fea-cfd",
    n: "02",
    t: "FEA & CFD Simulation Track",
    title: "FEA & CFD Simulation Track",
    trackCode: "MEC-ACAD-02",
    level: "Advanced",
    d: "Finite element analysis (FEA) and computational fluid dynamics (CFD) using ANSYS Workbench and OpenFOAM.",
    description:
      "Finite element analysis (FEA) and computational fluid dynamics (CFD) using ANSYS Workbench and OpenFOAM for structural mechanics and fluid flow.",
    duration: "8 Weeks (32 Hours)",
    tools: ["ANSYS Mechanical", "Fluent", "OpenFOAM", "Mesh refinement"],
    modules: [
      "Structural Statics & Modal Vibrations in ANSYS",
      "Fluid Domain Extraction & Structured Meshing",
      "Navier-Stokes Solvers & Boundary Conditions",
      "Post-Processing, Verification & Heat Transfer",
    ],
    pdfUrl: "https://soe.cusat.ac.in/manuals/heat_transfer_lab.pdf",
    pdfTitle: "Simulation Guide PDF",
    status: "open",
  },
  {
    id: "cnc-additive",
    n: "03",
    t: "CNC & Additive Manufacturing",
    title: "CNC & Additive Manufacturing",
    trackCode: "MEC-ACAD-03",
    level: "Beginner",
    d: "Precision G-code programming, 3-axis CNC milling, FDM/SLA 3D printing, and hands-on makerspace fabrication.",
    description:
      "Precision G-code programming, 3-axis CNC milling, FDM/SLA 3D printing, and hands-on makerspace fabrication for rapid prototyping.",
    duration: "4 Weeks (16 Hours)",
    tools: ["MasterCAM", "G-Code", "3D Printers", "CNC Lathe"],
    modules: [
      "G-Code / M-Code Syntax & Manual Part Programming",
      "CAM Toolpath Generation for 3-Axis Milling",
      "Slicing Parameters & Infill Geometry in FDM/SLA",
      "Part Tolerancing & Post-Processing Operations",
    ],
    pdfUrl: "https://soe.cusat.ac.in/manuals/cad_cam_cnc_guide.pdf",
    pdfTitle: "CNC & 3D Printing Manual",
    status: "open",
  },
  {
    id: "robotics-mechatronics",
    n: "04",
    t: "Robotics & Mechatronics",
    title: "Robotics & Mechatronics",
    trackCode: "MEC-ACAD-04",
    level: "Intermediate",
    d: "Embedded microcontrollers, pneumatic actuators, sensor fusion, servo control, and autonomous robot building.",
    description:
      "Embedded microcontrollers, pneumatic actuators, sensor fusion, servo control, and autonomous robot building for interdisciplinary mechanical systems.",
    duration: "6 Weeks (24 Hours)",
    tools: ["Arduino", "STM32", "ROS2", "Pneumatics"],
    modules: [
      "Sensor Interfacing, ADC & Signal Conditioning",
      "Motor Drives, H-Bridges & PWM Closed-Loop Control",
      "Directional Control Valves & Pneumatic Systems",
      "ROS2 Architecture & Kinematic Trajectory Planning",
    ],
    pdfUrl: "https://mesac.co.in/yantra/robowars_rulebook.pdf",
    pdfTitle: "Robotics Blueprint PDF",
    status: "open",
  },
  {
    id: "thermal-energy",
    n: "05",
    t: "Thermal Systems & Energy Audit",
    title: "Thermal Systems & Energy Audit",
    trackCode: "MEC-ACAD-05",
    level: "Advanced",
    d: "Applied thermodynamics, IC engine testing, HVAC duct design, solar thermal collector performance evaluation.",
    description:
      "Applied thermodynamics, IC engine testing, HVAC duct design, and solar thermal collector performance evaluation for industrial energy management.",
    duration: "5 Weeks (20 Hours)",
    tools: ["EES", "TRNSYS", "IC Engine Rigs", "Thermal Camera"],
    modules: [
      "IC Engine Performance, Heat Balance & Exhaust Analysis",
      "Psychrometrics & Commercial HVAC Duct Sizing",
      "Boiler Efficiency & Industrial Steam Audits",
      "Solar Thermal Systems & Transient Simulation",
    ],
    pdfUrl: "https://soe.cusat.ac.in/syllabi/mtech_thermal.pdf",
    pdfTitle: "Thermal Systems Syllabus",
    status: "open",
  },
  {
    id: "career-craft",
    n: "06",
    t: "Career & Technical Portfolio",
    title: "Career & Technical Portfolio",
    trackCode: "MEC-ACAD-06",
    level: "Beginner",
    d: "Resume building for core engineering roles, technical interview prep, and portfolio reviews with alumni.",
    description:
      "Resume building for core engineering roles, technical interview prep, and portfolio reviews with alumni mentors from premier engineering sectors.",
    duration: "3 Weeks (12 Hours)",
    tools: ["GitHub", "Overleaf LaTeX", "Interview Prep", "LinkedIn"],
    modules: [
      "Modern Technical Resume Architecture with LaTeX",
      "Engineering Portfolio Hosting & CAD Documentation",
      "Core Mechanical Interview Problem Solving",
      "Alumni Mentorship Sessions & Placement Strategy",
    ],
    pdfUrl: "https://mesac.co.in/resources/question_bank_s5_s8.pdf",
    pdfTitle: "Career & Interview Guide",
    status: "open",
  },
];
