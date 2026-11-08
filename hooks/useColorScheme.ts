import { useColorScheme as useSystemColorScheme } from "react-native";
import usePreferences from "./usePreferences";
import { Colors } from "@/constants/Colors";

/** The system scheme, unless the user picked light/dark in Settings. */
export function useColorScheme() {
  const system = useSystemColorScheme();
  const { theme } = usePreferences();
  return theme === "system" ? system : theme;
}

/** The active colour palette. */
export function useTheme() {
  return Colors[useColorScheme() ?? "light"];
}
