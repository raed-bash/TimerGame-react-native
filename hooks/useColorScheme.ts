import { useColorScheme as useSystemColorScheme } from "react-native";
import usePreferences from "./usePreferences";

/** The system scheme, unless the user picked light/dark in Settings. */
export function useColorScheme() {
  const system = useSystemColorScheme();
  const { theme } = usePreferences();
  return theme === "system" ? system : theme;
}
