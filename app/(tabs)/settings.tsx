import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppTextInput from "@/components/textInput/AppTextInput";
import { setPreference, usePreferences, useSettings, useTranslation } from "@/hooks";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors, PlayerColors } from "@/constants/Colors";

const PRESETS = [5, 10, 20, 30, 60];

export default function Settings() {
  const theme = Colors[useColorScheme() ?? "light"];
  const { t, isRTL } = useTranslation();
  const prefs = usePreferences();
  const {
    gameTimer,
    player1Name,
    player2Name,
    handleGameTimerChange,
    handlePlayer1NameChange,
    handlePlayer2NameChange,
  } = useSettings();

  // No forced RTL layout (needs an app reload); just align headings to the reading side.
  const cardTitle = [
    styles.cardTitle,
    { color: theme.icon, alignSelf: isRTL ? "flex-end" : "flex-start" } as const,
  ];

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme.text }]}>{t.settings}</Text>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={cardTitle}>{t.appearance}</Text>
        <Segmented
          theme={theme}
          value={prefs.theme}
          onChange={(v) => setPreference("theme", v)}
          options={[
            { value: "system", label: t.system, icon: "phone-portrait-outline" },
            { value: "light", label: t.light, icon: "sunny-outline" },
            { value: "dark", label: t.dark, icon: "moon-outline" },
          ]}
        />
        <Text style={cardTitle}>{t.language}</Text>
        <Segmented
          theme={theme}
          value={prefs.language}
          onChange={(v) => setPreference("language", v)}
          options={[
            { value: "en", label: "English" },
            { value: "ar", label: "العربية" },
          ]}
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={cardTitle}>{t.players}</Text>
        <AppTextInput
          label={t.player1Name}
          value={player1Name}
          maxLength={16}
          onChangeText={handlePlayer1NameChange}
          textProps={{ style: { color: PlayerColors.blue.main } }}
          style={{ ...styles.input, color: theme.text, borderColor: PlayerColors.blue.main }}
        />
        <AppTextInput
          label={t.player2Name}
          value={player2Name}
          maxLength={16}
          onChangeText={handlePlayer2NameChange}
          textProps={{ style: { color: PlayerColors.red.main } }}
          style={{ ...styles.input, color: theme.text, borderColor: PlayerColors.red.main }}
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={cardTitle}>{t.gameTimer}</Text>
        <View style={styles.stepper}>
          <StepButton
            icon="remove"
            label={t.decreaseTimer}
            color={theme.text}
            onPress={() => handleGameTimerChange(gameTimer - 1)}
          />
          <Text style={[styles.value, { color: theme.text }]}>{gameTimer}s</Text>
          <StepButton
            icon="add"
            label={t.increaseTimer}
            color={theme.text}
            onPress={() => handleGameTimerChange(gameTimer + 1)}
          />
        </View>
        <View style={styles.presets}>
          {PRESETS.map((p) => (
            <Chip
              key={p}
              theme={theme}
              selected={p === gameTimer}
              label={`${p}s`}
              onPress={() => handleGameTimerChange(p)}
            />
          ))}
        </View>
        <Text style={[styles.help, { color: theme.icon }]}>{t.howToPlay(gameTimer)}</Text>
      </View>
    </ScrollView>
  );
}

type Theme = (typeof Colors)["light"];
type IconName = React.ComponentProps<typeof Ionicons>["name"];

function Chip(props: {
  theme: Theme;
  selected: boolean;
  label: string;
  icon?: IconName;
  onPress: () => void;
}) {
  const { theme, selected, label, icon, onPress } = props;
  const fg = selected ? theme.background : theme.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: theme.tint, backgroundColor: selected ? theme.tint : "transparent" },
        pressed && { opacity: 0.6 },
      ]}
    >
      {icon && <Ionicons name={icon} size={16} color={fg} />}
      <Text style={{ color: fg, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}

function Segmented<V extends string>(props: {
  theme: Theme;
  value: V;
  onChange: (v: V) => void;
  options: { value: V; label: string; icon?: IconName }[];
}) {
  return (
    <View style={styles.presets}>
      {props.options.map((o) => (
        <Chip
          key={o.value}
          theme={props.theme}
          selected={o.value === props.value}
          label={o.label}
          icon={o.icon}
          onPress={() => props.onChange(o.value)}
        />
      ))}
    </View>
  );
}

function StepButton(props: {
  icon: "add" | "remove";
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={props.label}
      hitSlop={8}
      style={({ pressed }) => [styles.step, { borderColor: props.color }, pressed && { opacity: 0.5 }]}
    >
      <Ionicons name={props.icon} size={24} color={props.color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", gap: 20, padding: 24 },
  title: { fontSize: 32, fontWeight: "bold" },
  card: { width: "100%", maxWidth: 380, borderRadius: 20, padding: 20, gap: 16, alignItems: "center" },
  cardTitle: { fontSize: 13, fontWeight: "700", letterSpacing: 1.5 },
  input: { width: 260, height: 48, borderRadius: 12, borderWidth: 2, paddingHorizontal: 14 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 24 },
  step: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  value: { fontSize: 32, fontWeight: "bold", minWidth: 80, textAlign: "center", fontVariant: ["tabular-nums"] },
  presets: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  help: { fontSize: 14, textAlign: "center", lineHeight: 20 },
});
