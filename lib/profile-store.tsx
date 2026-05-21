"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { seedProfile } from "@/lib/dummy-data";
import type { ExperienceEntry, UserProfile } from "@/lib/types";

const STORAGE_KEY = "xonet-profile-v1";

type ProfileStoreValue = {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setSkills: (skills: string[]) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addExperience: (entry: Omit<ExperienceEntry, "id">) => void;
  updateExperience: (id: string, updates: Partial<ExperienceEntry>) => void;
  deleteExperience: (id: string) => void;
  resetProfile: () => void;
};

function loadProfile(): UserProfile {
  if (typeof window === "undefined") return seedProfile;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedProfile;
    const parsed = JSON.parse(raw) as UserProfile;
    return {
      ...seedProfile,
      ...parsed,
      skills: parsed.skills?.length ? parsed.skills : seedProfile.skills,
      experience: parsed.experience?.length ? parsed.experience : seedProfile.experience,
      links: { ...seedProfile.links, ...parsed.links },
      resume: { ...seedProfile.resume, ...parsed.resume },
    };
  } catch {
    return seedProfile;
  }
}

let profile: UserProfile = seedProfile;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function setProfile(next: UserProfile) {
  profile = next;
  persist();
  emit();
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const ProfileStoreContext = createContext<ProfileStoreValue | null>(null);

export function ProfileStoreProvider({ children }: { children: ReactNode }) {
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => profile,
    () => seedProfile,
  );

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile({ ...profile, ...updates });
  }, []);

  const setSkills = useCallback((skills: string[]) => {
    setProfile({ ...profile, skills });
  }, []);

  const addSkill = useCallback((skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || profile.skills.includes(trimmed)) return;
    setProfile({ ...profile, skills: [...profile.skills, trimmed] });
  }, []);

  const removeSkill = useCallback((skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  }, []);

  const addExperience = useCallback((entry: Omit<ExperienceEntry, "id">) => {
    const newEntry: ExperienceEntry = { ...entry, id: generateId("exp") };
    setProfile({ ...profile, experience: [newEntry, ...profile.experience] });
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<ExperienceEntry>) => {
    setProfile({
      ...profile,
      experience: profile.experience.map((e) =>
        e.id === id ? { ...e, ...updates } : e,
      ),
    });
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter((e) => e.id !== id),
    });
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(structuredClone(seedProfile));
  }, []);

  const value: ProfileStoreValue = {
    profile,
    updateProfile,
    setSkills,
    addSkill,
    removeSkill,
    addExperience,
    updateExperience,
    deleteExperience,
    resetProfile,
  };

  return (
    <ProfileStoreContext.Provider value={value}>{children}</ProfileStoreContext.Provider>
  );
}

export function useProfileStore() {
  const ctx = useContext(ProfileStoreContext);
  if (!ctx) throw new Error("useProfileStore must be used within ProfileStoreProvider");
  return ctx;
}
