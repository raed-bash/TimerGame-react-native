import { useSyncExternalStore } from "react";
import { AsyncStorageHelpers } from "@/utils";

export type ThemePreference = "system" | "light" | "dark";
export type Language = "en" | "ar";
export type Preferences = { theme: ThemePreference; language: Language };

// Module-level store: the root layout (outside MainContext) also needs the theme.
let prefs: Preferences = { theme: "system", language: "en" };
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
  prefs = {
    theme: theme === "light" || theme === "dark" ? theme : "system",
    language: language === "ar" ? "ar" : "en",
  };
  notify();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export default function usePreferences() {
  return useSyncExternalStore(subscribe, () => prefs);
}
