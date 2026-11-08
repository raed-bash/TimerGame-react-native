import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { loadPreferences } from "@/hooks/usePreferences";
import { useColorScheme } from "@/hooks/useColorScheme";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [prefsLoaded, setPrefsLoaded] = useState(false);
  useEffect(() => {
    loadPreferences().finally(() => setPrefsLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded && prefsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, prefsLoaded]);

  if (!loaded || !prefsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
