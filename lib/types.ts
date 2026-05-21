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
  createdAt: string;
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
