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
import { loadHistory } from "@/hooks/useHistory";
import { useColorScheme } from "@/hooks/useColorScheme";
import MainProvider, { loadMainSettings, MainSettings } from "@/contexts/MainProvider";
import { MainContextDefaultValue } from "@/contexts/MainContext";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Everything persisted is loaded behind the splash so nothing flashes or gets overwritten.
  const [initial, setInitial] = useState<MainSettings | null>(null);
  useEffect(() => {
    Promise.all([loadPreferences(), loadHistory(), loadMainSettings()])
      .then(([, , main]) => setInitial(main))
      .catch(() => setInitial(MainContextDefaultValue));
  }, []);

  const ready = fontsLoaded && initial !== null;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <MainProvider initial={initial}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* No swipe-back: frantic taps near the edge must not leave the game. */}
          <Stack.Screen name="game" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="history/[id]" options={{ headerBackTitle: "" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </MainProvider>
  );
}
