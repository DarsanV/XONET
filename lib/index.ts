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
export { TaskStoreProvider, useTaskStore } from "./task-store";
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
