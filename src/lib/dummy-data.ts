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

export const myWorks: WorkItem[] = [
  { id: "w1", project: "Brand site relaunch", client: "Aurora Studio", status: "Active", payment: "$4,200", progress: 72, deadline: "Oct 22, 2026" },
  { id: "w2", project: "Investor portal v2", client: "Northwind Capital", status: "Active", payment: "$8,500", progress: 41, deadline: "Nov 10, 2026" },
  { id: "w3", project: "Mobile onboarding redesign", client: "Layerframe", status: "In Review", payment: "$2,800", progress: 95, deadline: "Oct 18, 2026" },
  { id: "w4", project: "Customer dashboard MVP", client: "Helios Labs", status: "Completed", payment: "$6,400", progress: 100, deadline: "Sep 28, 2026" },
  { id: "w5", project: "Marketing automation tool", client: "Quill & Co.", status: "Completed", payment: "$3,900", progress: 100, deadline: "Sep 12, 2026" },
  { id: "w6", project: "AI search prototype", client: "Helios Labs", status: "Active", payment: "$5,100", progress: 28, deadline: "Nov 24, 2026" },
];
