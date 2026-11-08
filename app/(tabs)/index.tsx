import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHistory, useSettings, useTranslation } from "@/hooks";
import { useTheme } from "@/hooks/useColorScheme";
import { Card, CardTitle, Chip, IconButton, PrimaryButton } from "@/components/ui";
import { PlayerColors } from "@/constants/Colors";
import { MainContextDefaultValue } from "@/contexts/MainContext";
import { headToHead } from "@/utils/gameStats";

const PRESETS = [10, 20, 30, 60, 90];

export default function Menu() {
  const theme = useTheme();
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const history = useHistory();
  const {
    gameTimer,
    player1Name,
    player2Name,
    handleGameTimerChange,
    handlePlayer1NameChange,
    handlePlayer2NameChange,
    swapPlayers,
    setPlayerNames,
  } = useSettings();

  const [w1, w2] = headToHead(history, [player1Name, player2Name]);

  const start = () => {
    // Blank names fall back to the defaults so the board never shows an empty label.
    const defaults = MainContextDefaultValue.playerNames;
    setPlayerNames([player1Name.trim() || defaults[0], player2Name.trim() || defaults[1]]);
    router.push("/game");
  };

  const nameInput = (
    value: string,
    onChange: (s: string) => void,
    color: string,
    placeholder: string
  ) => (
    <View style={[styles.nameRow, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <TextInput
        value={value}
        onChangeText={onChange}
        maxLength={16}
        placeholder={placeholder}
        placeholderTextColor={theme.icon}
        accessibilityLabel={placeholder}
        returnKeyType="done"
        style={[styles.nameInput, { color: theme.text, textAlign: isRTL ? "right" : "left" }]}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
          <Text style={[styles.title, { color: theme.text }]}>{t.appName}</Text>
          <Text style={[styles.tagline, { color: theme.icon }]}>{t.tagline}</Text>
        </View>

        <Card>
          <CardTitle>{t.whoIsPlaying}</CardTitle>
          {nameInput(player1Name, handlePlayer1NameChange, PlayerColors.blue.main, t.player1Name)}
          <View style={styles.vsRow}>
            <View style={[styles.line, { backgroundColor: theme.icon }]} />
            <Text style={[styles.vs, { color: theme.icon }]}>VS</Text>
            <IconButton icon="swap-vertical" label={t.swapPlayers} onPress={swapPlayers} size={36} />
            <View style={[styles.line, { backgroundColor: theme.icon }]} />
          </View>
          {nameInput(player2Name, handlePlayer2NameChange, PlayerColors.red.main, t.player2Name)}
          {w1 + w2 > 0 && (
            <Text style={[styles.h2h, { color: theme.icon }]}>
              {t.headToHead}:{"  "}
              <Text style={{ color: PlayerColors.blue.main, fontWeight: "800" }}>{w1}</Text>
              {"  –  "}
              <Text style={{ color: PlayerColors.red.main, fontWeight: "800" }}>{w2}</Text>
            </Text>
          )}
        </Card>

        <Card>
          <CardTitle>{t.gameTimer}</CardTitle>
          <View style={styles.stepper}>
            <IconButton icon="remove" label={t.decreaseTimer} onPress={() => handleGameTimerChange(gameTimer - 5)} />
            <Text style={[styles.value, { color: theme.text }]}>{gameTimer}s</Text>
            <IconButton icon="add" label={t.increaseTimer} onPress={() => handleGameTimerChange(gameTimer + 5)} />
          </View>
          <View style={styles.wrapRow}>
            {PRESETS.map((p) => (
              <Chip key={p} selected={p === gameTimer} label={`${p}s`} onPress={() => handleGameTimerChange(p)} />
            ))}
          </View>
        </Card>

        <PrimaryButton label={t.startGame} icon="play" onPress={start} />

        <Card>
          <CardTitle>{t.howToPlayTitle}</CardTitle>
          {[t.step1, t.step2, t.step3, t.step4(gameTimer)].map((step, i) => (
            <View key={i} style={[styles.step, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.text, textAlign: isRTL ? "right" : "left" }]}>
                {step}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 16, padding: 20, paddingBottom: 40 },
  hero: { alignItems: "center", gap: 6, marginTop: 8 },
  logo: { width: 84, height: 84, borderRadius: 20 },
  title: { fontSize: 30, fontWeight: "800" },
  tagline: { fontSize: 15, textAlign: "center" },
  nameRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  nameInput: { flex: 1, height: 50, fontSize: 18, fontWeight: "600" },
  vsRow: { flexDirection: "row", alignItems: "center", gap: 10, width: "100%" },
  line: { flex: 1, height: 1, opacity: 0.4 },
  vs: { fontWeight: "800", fontSize: 14 },
  h2h: { fontSize: 15 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 24 },
  value: { fontSize: 34, fontWeight: "800", minWidth: 90, textAlign: "center", fontVariant: ["tabular-nums"] },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  step: { gap: 12, alignItems: "flex-start", width: "100%" },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumText: { color: "#fff", fontWeight: "800" },
  stepText: { flex: 1, fontSize: 15, lineHeight: 22 },
});
