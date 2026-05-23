"use client";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, } from "react";
import { seedProfile } from "@/lib/dummy-data";
const STORAGE_KEY = "xonet-profile-v1";
function loadProfile() {
    if (typeof window === "undefined")
        return seedProfile;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return seedProfile;
        const parsed = JSON.parse(raw);
        return {
            ...seedProfile,
            ...parsed,
            skills: parsed.skills?.length ? parsed.skills : seedProfile.skills,
            experience: parsed.experience?.length ? parsed.experience : seedProfile.experience,
            links: { ...seedProfile.links, ...parsed.links },
            resume: { ...seedProfile.resume, ...parsed.resume },
        };
    }
    catch {
        return seedProfile;
    }
}
let profile = seedProfile;
const listeners = new Set();
function persist() {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
}
function emit() {
    listeners.forEach((l) => l());
}
function setProfile(next) {
    profile = next;
    persist();
    emit();
}
function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
const ProfileStoreContext = createContext(null);
export function ProfileStoreProvider({ children }) {
    useSyncExternalStore((cb) => {
        listeners.add(cb);
        return () => listeners.delete(cb);
    }, () => profile, () => seedProfile);
    useEffect(() => {
        setProfile(loadProfile());
    }, []);
    const updateProfile = useCallback((updates) => {
        setProfile({ ...profile, ...updates });
    }, []);
    const setSkills = useCallback((skills) => {
        setProfile({ ...profile, skills });
    }, []);
    const addSkill = useCallback((skill) => {
        const trimmed = skill.trim();
        if (!trimmed || profile.skills.includes(trimmed))
            return;
        setProfile({ ...profile, skills: [...profile.skills, trimmed] });
    }, []);
    const removeSkill = useCallback((skill) => {
        setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
    }, []);
    const addExperience = useCallback((entry) => {
        const newEntry = { ...entry, id: generateId("exp") };
        setProfile({ ...profile, experience: [newEntry, ...profile.experience] });
    }, []);
    const updateExperience = useCallback((id, updates) => {
        setProfile({
            ...profile,
            experience: profile.experience.map((e) => e.id === id ? { ...e, ...updates } : e),
        });
    }, []);
    const deleteExperience = useCallback((id) => {
        setProfile({
            ...profile,
            experience: profile.experience.filter((e) => e.id !== id),
        });
    }, []);
    const resetProfile = useCallback(() => {
        setProfile(structuredClone(seedProfile));
    }, []);
    const value = {
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
    return (<ProfileStoreContext.Provider value={value}>{children}</ProfileStoreContext.Provider>);
}
export function useProfileStore() {
    const ctx = useContext(ProfileStoreContext);
    if (!ctx)
        throw new Error("useProfileStore must be used within ProfileStoreProvider");
    return ctx;
}
