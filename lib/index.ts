export { isNavActive, mainNavItems, type NavItem } from "./navigation";
export {
  CURRENT_FREELANCER_ID,
  EXPERIENCE_LEVELS,
  TASK_CATEGORIES,
  earningsTrend,
  myWorks,
  projectStatus,
  seedApplications,
  seedFreelancers,
  seedTasks,
  type WorkItem,
} from "./dummy-data";
export { ProfileStoreProvider, useProfileStore } from "./profile-store";
export { TaskStoreProvider, useTaskStore } from "./task-store";
export { seedProfile } from "./dummy-data";
export type { ExperienceEntry, ProfessionalLinks, UserProfile } from "./types";
export type {
  Application,
  ApplicationStatus,
  CreateTaskInput,
  ExperienceLevel,
  Freelancer,
  PaymentStatus,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "./types";
export { cn } from "./utils";
