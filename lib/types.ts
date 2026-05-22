export type TaskStatus = "Open" | "In Progress" | "Completed";
export type ExperienceLevel = "Entry" | "Intermediate" | "Senior" | "Expert";
export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";
export type PaymentStatus = "Unpaid" | "Partial" | "Paid";

export type Task = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  budget: string;
  deadline: string;
  experienceLevel: ExperienceLevel;
  category: string;
  status: TaskStatus;
  match: number;
  assignedFreelancerId?: string;
  paymentStatus: PaymentStatus;
  progress: number;
  lastActivity?: string;
  lastActivityAt?: string;
  createdAt: string;
};

export type WorkItem = {
  id: string;
  taskId: string;
  freelancerId: string;
  project: string;
  client: string;
  status: "Active" | "Completed" | "In Review";
  payment: string;
  progress: number;
  deadline: string;
  lastUpdatedAt: string;
};

export type TaskMessage = {
  id: string;
  taskId: string;
  sender: "client" | "freelancer";
  text: string;
  sentAt: string;
};

export type Freelancer = {
  id: string;
  name: string;
  headline: string;
  location: string;
  skills: string[];
  rate: string;
  match: number;
  available: boolean;
};

export type Application = {
  id: string;
  taskId: string;
  freelancerId: string;
  coverLetter: string;
  proposedRate: string;
  status: ApplicationStatus;
  appliedAt: string;
};

export type CreateTaskInput = {
  title: string;
  description: string;
  skills: string[];
  budget: string;
  deadline: string;
  experienceLevel: ExperienceLevel;
  category: string;
};

export type UpdateTaskInput = Partial<
  Omit<Task, "id" | "createdAt" | "match">
> & { match?: number };

export type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
};

export type ProfessionalLinks = {
  github: string;
  linkedin: string;
  portfolio: string;
};

export type UserProfile = {
  fullName: string;
  headline: string;
  email: string;
  location: string;
  hourlyRate: string;
  available: boolean;
  bio: string;
  skills: string[];
  experience: ExperienceEntry[];
  links: ProfessionalLinks;
  resume: {
    fileName: string;
    updatedAt: string;
    size: string;
  };
};
