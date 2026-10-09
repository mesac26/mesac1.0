import type { FacultyMember, DepartmentProgram, Lab, DepartmentOverview } from "@/types";

export const facultyDriveUrl =
  "https://docs.google.com/spreadsheets/d/1piGoyDXXS-rAC8SQzLHBRRNzE8flb-R3VoJRYT_3YnE/edit?gid=474521214#gid=474521214";

export const mockDepartmentOverview: DepartmentOverview = {
  name: "Division of Mechanical Engineering",
  establishedYear: 1995,
  school: "School of Engineering",
  university: "Cochin University of Science and Technology (CUSAT)",
  summary:
    "The Mechanical Engineering Division established in 1995 is the largest division of the School of Engineering in terms of faculty size and laboratory infrastructure. The curriculum is continuously reviewed to adapt to evolving technological demands and to satisfy the needs of both national and international industry, integrating modern advances in electronics, computation, and automation into core mechanical systems.",
  mission: [
    "Imparting quality education to students and enhancing their skills to make them globally competitive mechanical engineers.",
    "Maintaining vital, state-of-the-art research facilities to provide students and faculty with opportunities to create, interpret, apply, and disseminate knowledge.",
    "Developing linkages with world-class R&D organizations and educational institutions in India and abroad for excellence in teaching, research, and consultancy practices.",
  ],
  vision:
    "The Mechanical Engineering Division strives to be recognized globally for outstanding education and research, developing well-qualified engineers who are innovative, entrepreneurial, and successful in advanced fields of engineering and technology.",
};

export const mockDepartmentHOD: FacultyMember = {
  id: "faculty-hod-dr-franklin",
  slNo: 1,
  name: "Dr. Franklin R John",
  designation: "Professor & Head of Division",
  role: "Professor & HOD",
  department: "Division of Mechanical Engineering, School of Engineering, CUSAT",
  specialization: "Advanced Manufacturing & CNC Technology",
  img: "https://cdn.corenexis.com/f/2H2Y2w3Pdvr.png",
};

export const mockDepartmentFaculty: FacultyMember[] = [
  {
    id: "faculty-01",
    slNo: 1,
    name: "Dr. Franklin R John",
    designation: "Professor & Head of Division",
    role: "Professor & HOD",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Advanced Manufacturing & CNC Technology",
    img: "https://cdn.corenexis.com/f/2H2Y2w3Pdvr.png",
  },
  {
    id: "faculty-02",
    slNo: 2,
    name: "Dr. K. K. Saju",
    designation: "Professor",
    role: "Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Machine Design, Tribology & Biomechanics",
  },
  {
    id: "faculty-03",
    slNo: 3,
    name: "Dr. Akhil S. Karun, MIE",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Thermal Science & Materials Engineering",
  },
  {
    id: "faculty-04",
    slNo: 4,
    name: "Dr. Harikrishnan. S.",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Fluid Power Systems & Heat Transfer",
  },
  {
    id: "faculty-05",
    slNo: 5,
    name: "Dr. James Varghese",
    designation: "Professor",
    role: "Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Composite Materials & Metallurgy",
  },
  {
    id: "faculty-06",
    slNo: 6,
    name: "Dr. Jayadas.N.H",
    designation: "Professor",
    role: "Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Vibration Analysis & Applied Mechanics",
  },
  {
    id: "faculty-07",
    slNo: 7,
    name: "Dr. Gireesh Kumaran Thampi.B.S",
    designation: "Professor",
    role: "Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Industrial Engineering & Ergonomics",
  },
  {
    id: "faculty-08",
    slNo: 8,
    name: "Dr. Joshy.P. J",
    designation: "Associate Professor",
    role: "Associate Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Manufacturing Process & Production Tech",
  },
  {
    id: "faculty-09",
    slNo: 9,
    name: "Dr. Tide P. S.",
    designation: "Professor",
    role: "Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Fluid Dynamics, Aerodynamics & Turbomachinery",
  },
  {
    id: "faculty-10",
    slNo: 10,
    name: "Dr. Biju N",
    designation: "Professor",
    role: "Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Thermal Engineering & Energy Systems",
  },
  {
    id: "faculty-11",
    slNo: 11,
    name: "Dr. Senthil Prakash M N",
    designation: "Professor",
    role: "Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "CAD/CAM, Robotics & Automation",
  },
  {
    id: "faculty-12",
    slNo: 12,
    name: "Dr. Salaji S",
    designation: "Associate Professor",
    role: "Associate Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Mechanical Systems & Design",
  },
  {
    id: "faculty-13",
    slNo: 13,
    name: "Rashid Kareem",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Production & Mechanical Engineering",
  },
  {
    id: "faculty-14",
    slNo: 14,
    name: "Vishnuprasad S",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Thermal Sciences & Applied Mechanics",
  },
  {
    id: "faculty-15",
    slNo: 15,
    name: "Nidheesh Narayan",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Manufacturing Systems & CAD",
  },
  {
    id: "faculty-16",
    slNo: 16,
    name: "Neethu Elsa John M",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Materials Science & Kinematics",
  },
  {
    id: "faculty-17",
    slNo: 17,
    name: "Pramod Ramakrishnan",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Industrial Engineering & Operations",
  },
  {
    id: "faculty-18",
    slNo: 18,
    name: "Dr. Sivaraj Murugan",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Mechatronics & Robotics",
  },
  {
    id: "faculty-19",
    slNo: 19,
    name: "Venugopal K P",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Design Engineering & Fluid Power",
  },
  {
    id: "faculty-20",
    slNo: 20,
    name: "Radhakrishnan P V",
    designation: "Assistant Professor",
    role: "Assistant Professor",
    department: "Division of Mechanical Engineering, SOE CUSAT",
    specialization: "Automotive Systems & Thermodynamics",
  },
];

export const mockDepartmentPrograms: DepartmentProgram[] = [
  {
    id: "prog-btech",
    name: "B.Tech in Mechanical Engineering",
    degree: "B.Tech",
    duration: "4 Years (8 Semesters)",
    intake: "90 Seats",
    description:
      "Comprehensive undergraduate engineering program covering solid mechanics, thermodynamics, fluid machinery, CAD/CAM, and manufacturing technology.",
  },
  {
    id: "prog-mtech-thermal",
    name: "M.Tech in Thermal Engineering",
    degree: "M.Tech",
    duration: "2 Years (4 Semesters)",
    intake: "18 Seats",
    description:
      "Postgraduate program in thermal sciences, computational fluid dynamics (CFD), cryogenic engineering, heat exchanger design, and energy systems.",
  },
  {
    id: "prog-mtech-iem",
    name: "M.Tech in Industrial Engineering & Management",
    degree: "M.Tech",
    duration: "2 Years (4 Semesters)",
    intake: "18 Seats",
    description:
      "Postgraduate specialization in supply chain engineering, operations research, total quality management, ergonomics, and production systems.",
  },
  {
    id: "prog-phd",
    name: "Ph.D. Doctoral Research Program",
    degree: "Ph.D.",
    duration: "3 - 5 Years",
    intake: "Research Fellowships",
    description:
      "Doctoral research in composite materials, microfluidics, tribology, thermal sciences, robotic kinematics, and advanced mechanical modeling.",
  },
];

export const mockDepartmentLabs: Lab[] = [
  {
    id: "lab-thermal",
    name: "Thermal Engineering & IC Engines Laboratory",
    description:
      "Experimental facility for testing internal combustion engines, fuel properties, and heat transfer characteristics.",
  },
  {
    id: "lab-fluid",
    name: "Fluid Mechanics & Hydraulics Laboratory",
    description:
      "Hydrodynamic test facility for open-channel flow, pipe flow, and impulse and reaction hydraulic turbines.",
  },
  {
    id: "lab-cadcam",
    name: "CAD / CAM & Robotics Center",
    description:
      "Computational facility for computer-aided design, geometric modeling, finite element analysis, and CNC machining.",
  },
  {
    id: "lab-metallurgy",
    name: "Metallurgy & Material Testing Laboratory",
    description:
      "Material testing facility for mechanical property evaluation of metals, polymers, and engineering specimens.",
  },
  {
    id: "lab-manufacturing",
    name: "Advanced Manufacturing & Machine Shop",
    description:
      "Machine shop facility equipped with conventional and specialized machine tools for engineering practice.",
  },
  {
    id: "lab-mechatronics",
    name: "Mechatronics & Instrumentation Laboratory",
    description:
      "Laboratory for sensors, instrumentation, pneumatic and hydraulic circuits, and microcontroller-based automation.",
  },
];
