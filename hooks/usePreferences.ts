import { useSyncExternalStore } from "react";
import { AsyncStorageHelpers } from "@/utils";

export type ThemePreference = "system" | "light" | "dark";
export type Language = "en" | "ar";
export type Preferences = { theme: ThemePreference; language: Language; vibration: "on" | "off" };

// Module-level store: the root layout (outside MainContext) also needs the theme.
let prefs: Preferences = { theme: "system", language: "en", vibration: "on" };
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
  prefs = { ...prefs, [key]: value };
  notify();
  AsyncStorageHelpers.setItem(key, value);
}

export async function loadPreferences() {
  const theme = await AsyncStorageHelpers.getItem("theme");
  const language = await AsyncStorageHelpers.getItem("language");
  const vibration = await AsyncStorageHelpers.getItem("vibration");
  prefs = {
    theme: theme === "light" || theme === "dark" ? theme : "system",
    language: language === "ar" ? "ar" : "en",
    vibration: vibration === "off" ? "off" : "on",
  };
  notify();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const getPreferences = () => prefs;

export default function usePreferences() {
  return useSyncExternalStore(subscribe, () => prefs);
}
