import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearHistory, setPreference, useHistory, usePreferences, useTranslation } from "@/hooks";
import { useTheme } from "@/hooks/useColorScheme";
import { Card, CardTitle, PrimaryButton, Segmented } from "@/components/ui";

export default function Settings() {
  const theme = useTheme();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const history = useHistory();

  // Two-tap confirm instead of a dialog (Alert has no buttons on web).
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>{t.settings}</Text>

        <Card>
          <CardTitle>{t.appearance}</CardTitle>
          <Segmented
            value={prefs.theme}
            onChange={(v) => setPreference("theme", v)}
            options={[
              { value: "system", label: t.system, icon: "phone-portrait-outline" },
              { value: "light", label: t.light, icon: "sunny-outline" },
              { value: "dark", label: t.dark, icon: "moon-outline" },
            ]}
          />
        </Card>

        <Card>
          <CardTitle>{t.language}</CardTitle>
          <Segmented
            value={prefs.language}
            onChange={(v) => setPreference("language", v)}
            options={[
              { value: "en", label: "English" },
              { value: "ar", label: "العربية" },
            ]}
          />
        </Card>

        <Card>
          <CardTitle>{t.vibration}</CardTitle>
          <Segmented
            value={prefs.vibration}
            onChange={(v) => setPreference("vibration", v)}
            options={[
              { value: "on", label: t.on, icon: "pulse-outline" },
              { value: "off", label: t.off, icon: "remove-circle-outline" },
            ]}
          />
        </Card>

        <Card>
          <CardTitle>{t.data}</CardTitle>
          {history.length === 0 && confirming === false ? (
            <Text style={{ color: theme.icon }}>{t.noGames}</Text>
          ) : (
            <PrimaryButton
              label={confirming ? t.tapAgainToConfirm : `${t.clearHistory} (${history.length})`}
              icon="trash-outline"
              color="#DC2626"
              outline={!confirming}
              onPress={() => {
                if (!confirming) return setConfirming(true);
                clearHistory();
                setConfirming(false);
              }}
            />
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 14, padding: 20, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: "800", alignSelf: "stretch" },
});
