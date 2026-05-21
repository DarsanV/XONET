import type { Application, Freelancer, Task, UserProfile } from "@/lib/types";

export const earningsTrend = [
  { month: "Jan", earnings: 3200 },
  { month: "Feb", earnings: 4100 },
  { month: "Mar", earnings: 3800 },
  { month: "Apr", earnings: 5200 },
  { month: "May", earnings: 4800 },
  { month: "Jun", earnings: 6100 },
  { month: "Jul", earnings: 7400 },
  { month: "Aug", earnings: 6800 },
  { month: "Sep", earnings: 8200 },
];

export const projectStatus = [
  { name: "Active", value: 8 },
  { name: "In Review", value: 3 },
  { name: "Completed", value: 24 },
  { name: "Draft", value: 2 },
];

export const recommendedJobs = [
  {
    id: "r1",
    title: "Full-stack engineer for fintech dashboard",
    client: "Northwind Capital",
    budget: "$4,500",
    deadline: "3 weeks",
    match: 96,
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: "r2",
    title: "Design system overhaul for SaaS platform",
    client: "Layerframe",
    budget: "$3,200",
    deadline: "2 weeks",
    match: 92,
    tags: ["Figma", "Design System", "Tailwind"],
  },
  {
    id: "r3",
    title: "AI integration for internal CRM tools",
    client: "Helios Labs",
    budget: "$6,800",
    deadline: "5 weeks",
    match: 89,
    tags: ["OpenAI", "TypeScript", "RAG"],
  },
];

export const exploreJobs = [
  {
    id: "e1",
    title: "Mobile-first marketing site redesign",
    description:
      "Looking for a senior front-end engineer to rebuild our marketing site with modern animation and a polished design system.",
    budget: "$3,800",
    deadline: "Oct 14, 2026",
    match: 94,
    tags: ["Next.js", "Tailwind", "Framer Motion"],
  },
  {
    id: "e2",
    title: "Enterprise analytics dashboard",
    description:
      "Build interactive dashboards with complex filters, exports, and role-based access for our B2B platform.",
    budget: "$7,200",
    deadline: "Nov 02, 2026",
    match: 88,
    tags: ["React", "D3", "TypeScript"],
  },
  {
    id: "e3",
    title: "Shopify Hydrogen migration",
    description:
      "Migrate legacy Shopify storefront to Hydrogen with custom checkout extensions and improved Core Web Vitals.",
    budget: "$5,400",
    deadline: "Oct 28, 2026",
    match: 81,
    tags: ["Shopify", "Hydrogen", "Remix"],
  },
  {
    id: "e4",
    title: "AI-assisted content workflow",
    description:
      "Design and ship an internal tool for editors to draft, review, and publish AI-assisted long-form content.",
    budget: "$4,100",
    deadline: "Nov 18, 2026",
    match: 90,
    tags: ["OpenAI", "Next.js", "Supabase"],
  },
  {
    id: "e5",
    title: "Realtime collaboration features",
    description:
      "Add multiplayer cursors, presence, and live document editing using Yjs and WebSockets.",
    budget: "$6,000",
    deadline: "Dec 05, 2026",
    match: 86,
    tags: ["Yjs", "WebSockets", "React"],
  },
  {
    id: "e6",
    title: "Design tokens & theming engine",
    description:
      "Architect a multi-brand theming system across web and mobile with a shared token pipeline.",
    budget: "$3,500",
    deadline: "Oct 30, 2026",
    match: 83,
    tags: ["Style Dictionary", "Design Tokens"],
  },
];

export type WorkItem = {
  id: string;
  project: string;
  client: string;
  status: "Active" | "Completed" | "In Review";
  payment: string;
  progress: number;
  deadline: string;
};

export const seedProfile: UserProfile = {
  fullName: "Alex Mercer",
  headline: "Senior Full-Stack Engineer",
  email: "alex@xonet.io",
  location: "Lisbon, Portugal",
  hourlyRate: "95",
  available: true,
  bio: "Senior engineer with 9+ years building polished web products for startups and growth-stage teams. I care about craft, performance, and shipping things people actually use.",
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "PostgreSQL",
    "Figma",
    "Next.js",
    "AI / LLMs",
  ],
  experience: [
    {
      id: "exp-1",
      role: "Senior Engineer",
      company: "Helios Labs",
      duration: "2023 — Present",
      description:
        "Lead full-stack delivery for B2B analytics products. Own architecture, mentoring, and client-facing demos.",
    },
    {
      id: "exp-2",
      role: "Front-end Lead",
      company: "Layerframe",
      duration: "2020 — 2023",
      description:
        "Shipped design system and marketing site relaunch. Improved Core Web Vitals by 40%.",
    },
    {
      id: "exp-3",
      role: "Full-stack Developer",
      company: "Quill & Co.",
      duration: "2017 — 2020",
      description:
        "Built content workflows and subscription billing for a media SaaS platform.",
    },
  ],
  links: {
    github: "github.com/alexmercer",
    linkedin: "linkedin.com/in/alexmercer",
    portfolio: "alexmercer.dev",
  },
  resume: {
    fileName: "alex-mercer-resume.pdf",
    updatedAt: "3 days ago",
    size: "412 KB",
  },
};

export const TASK_CATEGORIES = [
  "Engineering",
  "Design",
  "AI & Data",
  "Marketing",
  "DevOps",
  "Product",
] as const;

export const EXPERIENCE_LEVELS = [
  "Entry",
  "Intermediate",
  "Senior",
  "Expert",
] as const;

/** Default freelancer profile used when applying from Explore */
export const CURRENT_FREELANCER_ID = "f1";

export const seedTasks: Task[] = [
  {
    id: "task-seed-1",
    title: "Mobile-first marketing site redesign",
    description:
      "Looking for a senior front-end engineer to rebuild our marketing site with modern animation and a polished design system.",
    skills: ["Next.js", "Tailwind", "Framer Motion"],
    budget: "$3,800",
    deadline: "Oct 14, 2026",
    experienceLevel: "Senior",
    category: "Engineering",
    status: "Open",
    match: 94,
    paymentStatus: "Unpaid",
    createdAt: "2026-05-01T10:00:00.000Z",
  },
  {
    id: "task-seed-2",
    title: "Enterprise analytics dashboard",
    description:
      "Build interactive dashboards with complex filters, exports, and role-based access for our B2B platform.",
    skills: ["React", "D3", "TypeScript"],
    budget: "$7,200",
    deadline: "Nov 02, 2026",
    experienceLevel: "Expert",
    category: "Engineering",
    status: "In Progress",
    match: 88,
    assignedFreelancerId: "f2",
    paymentStatus: "Partial",
    createdAt: "2026-04-15T10:00:00.000Z",
  },
  {
    id: "task-seed-3",
    title: "Shopify Hydrogen migration",
    description:
      "Migrate legacy Shopify storefront to Hydrogen with custom checkout extensions and improved Core Web Vitals.",
    skills: ["Shopify", "Hydrogen", "Remix"],
    budget: "$5,400",
    deadline: "Oct 28, 2026",
    experienceLevel: "Senior",
    category: "Engineering",
    status: "Open",
    match: 81,
    paymentStatus: "Unpaid",
    createdAt: "2026-05-05T10:00:00.000Z",
  },
  {
    id: "task-seed-4",
    title: "AI-assisted content workflow",
    description:
      "Design and ship an internal tool for editors to draft, review, and publish AI-assisted long-form content.",
    skills: ["OpenAI", "Next.js", "Supabase"],
    budget: "$4,100",
    deadline: "Nov 18, 2026",
    experienceLevel: "Intermediate",
    category: "AI & Data",
    status: "Open",
    match: 90,
    paymentStatus: "Unpaid",
    createdAt: "2026-05-08T10:00:00.000Z",
  },
  {
    id: "task-seed-5",
    title: "Realtime collaboration features",
    description:
      "Add multiplayer cursors, presence, and live document editing using Yjs and WebSockets.",
    skills: ["Yjs", "WebSockets", "React"],
    budget: "$6,000",
    deadline: "Dec 05, 2026",
    experienceLevel: "Senior",
    category: "Engineering",
    status: "Completed",
    match: 86,
    assignedFreelancerId: "f3",
    paymentStatus: "Paid",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "task-seed-6",
    title: "Design tokens & theming engine",
    description:
      "Architect a multi-brand theming system across web and mobile with a shared token pipeline.",
    skills: ["Style Dictionary", "Design Tokens", "Figma"],
    budget: "$3,500",
    deadline: "Oct 30, 2026",
    experienceLevel: "Senior",
    category: "Design",
    status: "Open",
    match: 83,
    paymentStatus: "Unpaid",
    createdAt: "2026-05-10T10:00:00.000Z",
  },
];

export const seedFreelancers: Freelancer[] = [
  {
    id: "f1",
    name: "Alex Mercer",
    headline: "Senior Full-Stack Engineer",
    location: "Lisbon, Portugal",
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
    rate: "$95/hr",
    match: 96,
    available: true,
  },
  {
    id: "f2",
    name: "Priya Shah",
    headline: "Data Visualization Specialist",
    location: "Berlin, Germany",
    skills: ["React", "D3", "TypeScript", "Python"],
    rate: "$88/hr",
    match: 91,
    available: true,
  },
  {
    id: "f3",
    name: "Marcus Chen",
    headline: "Realtime Systems Engineer",
    location: "Toronto, Canada",
    skills: ["Yjs", "WebSockets", "React", "Rust"],
    rate: "$110/hr",
    match: 89,
    available: false,
  },
  {
    id: "f4",
    name: "Elena Rossi",
    headline: "Product Designer & Design Systems",
    location: "Milan, Italy",
    skills: ["Figma", "Design Tokens", "Tailwind", "React"],
    rate: "$82/hr",
    match: 87,
    available: true,
  },
  {
    id: "f5",
    name: "Jordan Blake",
    headline: "AI/ML Integration Engineer",
    location: "Austin, USA",
    skills: ["OpenAI", "Python", "Next.js", "Supabase", "RAG"],
    rate: "$105/hr",
    match: 93,
    available: true,
  },
  {
    id: "f6",
    name: "Samira Okonkwo",
    headline: "E-commerce & Shopify Expert",
    location: "London, UK",
    skills: ["Shopify", "Hydrogen", "Remix", "Liquid"],
    rate: "$78/hr",
    match: 85,
    available: true,
  },
];

export const seedApplications: Application[] = [
  {
    id: "app-seed-1",
    taskId: "task-seed-1",
    freelancerId: "f4",
    coverLetter:
      "I've led three marketing site redesigns with motion-heavy hero sections and component libraries. Happy to share case studies.",
    proposedRate: "$3,600 fixed",
    status: "Pending",
    appliedAt: "2026-05-12T14:00:00.000Z",
  },
  {
    id: "app-seed-2",
    taskId: "task-seed-1",
    freelancerId: "f1",
    coverLetter:
      "Your stack matches my daily toolkit. I can deliver a polished v1 in three weeks with weekly demos.",
    proposedRate: "$3,800 fixed",
    status: "Pending",
    appliedAt: "2026-05-13T09:30:00.000Z",
  },
  {
    id: "app-seed-3",
    taskId: "task-seed-3",
    freelancerId: "f6",
    coverLetter:
      "Completed two Hydrogen migrations last quarter with measurable CWV improvements. Available to start immediately.",
    proposedRate: "$5,200 fixed",
    status: "Pending",
    appliedAt: "2026-05-14T11:00:00.000Z",
  },
  {
    id: "app-seed-4",
    taskId: "task-seed-4",
    freelancerId: "f5",
    coverLetter:
      "Built similar editorial AI workflows for a media startup. Strong on guardrails, review flows, and cost controls.",
    proposedRate: "$4,000 fixed",
    status: "Pending",
    appliedAt: "2026-05-11T16:45:00.000Z",
  },
  {
    id: "app-seed-5",
    taskId: "task-seed-2",
    freelancerId: "f2",
    coverLetter: "Accepted and assigned to enterprise analytics dashboard.",
    proposedRate: "$7,000 fixed",
    status: "Accepted",
    appliedAt: "2026-04-20T10:00:00.000Z",
  },
];

export const myWorks: WorkItem[] = [
  { id: "w1", project: "Brand site relaunch", client: "Aurora Studio", status: "Active", payment: "$4,200", progress: 72, deadline: "Oct 22, 2026" },
  { id: "w2", project: "Investor portal v2", client: "Northwind Capital", status: "Active", payment: "$8,500", progress: 41, deadline: "Nov 10, 2026" },
  { id: "w3", project: "Mobile onboarding redesign", client: "Layerframe", status: "In Review", payment: "$2,800", progress: 95, deadline: "Oct 18, 2026" },
  { id: "w4", project: "Customer dashboard MVP", client: "Helios Labs", status: "Completed", payment: "$6,400", progress: 100, deadline: "Sep 28, 2026" },
  { id: "w5", project: "Marketing automation tool", client: "Quill & Co.", status: "Completed", payment: "$3,900", progress: 100, deadline: "Sep 12, 2026" },
  { id: "w6", project: "AI search prototype", client: "Helios Labs", status: "Active", payment: "$5,100", progress: 28, deadline: "Nov 24, 2026" },
];
