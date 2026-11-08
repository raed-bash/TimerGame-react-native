import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { removeRecord, useHistory, usePreferences, useTranslation } from "@/hooks";
import { useTheme } from "@/hooks/useColorScheme";
import { Card, CardTitle, PrimaryButton } from "@/components/ui";
import { PlayerColors } from "@/constants/Colors";
import { formatDate, playerStats, playTime } from "@/utils/gameStats";

const colorOf = (p: 0 | 1) => (p === 0 ? PlayerColors.blue.main : PlayerColors.red.main);

export default function GameDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = usePreferences();
  const record = useHistory().find((r) => r.id === id);

  // Two-tap delete instead of a dialog (Alert has no buttons on web).
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  if (!record) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ title: t.gameDetails }} />
        <Text style={{ color: theme.text, fontSize: 16 }}>{t.notFound}</Text>
      </View>
    );
  }

  const longest = Math.max(...record.turns.map((x) => x.duration), 0.01);
  const lastIndex = record.turns.length - 1;

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: t.gameDetails }} />

      <View style={styles.hero}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={[styles.winner, { color: colorOf(record.winner) }]}>{t.wins(record.players[record.winner])}</Text>
        <Text style={[styles.topic, { color: theme.text, backgroundColor: theme.surface }]}>{record.topic}</Text>
      </View>

      <Card>
        <View style={styles.infoGrid}>
          <Info label={t.date} value={formatDate(record.endedAt, language)} />
          <Info label={t.gameTimer} value={t.sec(record.gameTimer)} />
          <Info label={t.playTime} value={t.sec(playTime(record))} />
          <Info label={t.totalTurns} value={String(record.turns.length)} />
        </View>
      </Card>

      <View style={styles.players}>
        {([0, 1] as const).map((p) => {
          const s = playerStats(record, p);
          const dash = "—";
          return (
            <Card key={p} style={[styles.playerCard, { borderTopColor: colorOf(p) }]}>
              <Text style={[styles.playerName, { color: colorOf(p) }]} numberOfLines={1}>
                {record.winner === p ? "🏆 " : ""}
                {record.players[p]}
              </Text>
              <Stat label={t.answers} value={String(s.answers)} big />
              <Stat label={t.avgAnswer} value={s.avg === null ? dash : t.sec(s.avg)} />
              <Stat label={t.fastest} value={s.fastest === null ? dash : t.sec(s.fastest)} />
              <Stat label={t.slowest} value={s.slowest === null ? dash : t.sec(s.slowest)} />
              <Stat label={t.finalTime} value={t.sec(record.finalTimers[p])} />
            </Card>
          );
        })}
      </View>

      <Card>
        <CardTitle>{t.timeline}</CardTitle>
        {record.turns.map((turn, i) => (
          <View key={i} style={styles.turn}>
            <Text style={[styles.turnNum, { color: theme.icon }]}>{i + 1}</Text>
            <Text style={[styles.turnName, { color: colorOf(turn.player) }]} numberOfLines={1}>
              {record.players[turn.player]}
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  { width: `${Math.max(4, (turn.duration / longest) * 100)}%`, backgroundColor: colorOf(turn.player) },
                  i === lastIndex && styles.barTimedOut,
                ]}
              />
            </View>
            <Text style={[styles.turnTime, { color: theme.text }]}>
              {i === lastIndex ? "⏰" : t.sec(turn.duration)}
            </Text>
          </View>
        ))}
        <Text style={[styles.footnote, { color: theme.icon }]}>⏰ = {t.timedOut}</Text>
      </Card>

      <PrimaryButton
        label={confirming ? t.tapAgainToConfirm : t.deleteGame}
        icon="trash-outline"
        color="#DC2626"
        outline={!confirming}
        onPress={() => {
          if (!confirming) return setConfirming(true);
          removeRecord(record.id);
          router.back();
        }}
      />
    </ScrollView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.info}>
      <Text style={[styles.infoLabel, { color: theme.icon }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function Stat({ label, value, big }: { label: string; value: string; big?: boolean }) {
  const theme = useTheme();
  return (
    <View style={styles.stat}>
      <Text style={[styles.statLabel, { color: theme.icon }]}>{label}</Text>
      <Text style={[big ? styles.statBig : styles.statValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16, gap: 14, alignItems: "center", paddingBottom: 40 },
  hero: { alignItems: "center", gap: 6 },
  trophy: { fontSize: 56 },
  winner: { fontSize: 26, fontWeight: "800", textAlign: "center" },
  topic: { fontSize: 18, fontWeight: "800", paddingHorizontal: 16, paddingVertical: 4, borderRadius: 14, overflow: "hidden" },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", width: "100%", rowGap: 12 },
  info: { width: "50%", alignItems: "center", gap: 2 },
  infoLabel: { fontSize: 12, fontWeight: "600" },
  infoValue: { fontSize: 15, fontWeight: "700", textAlign: "center" },
  players: { flexDirection: "row", gap: 10, width: "100%", maxWidth: 420 },
  playerCard: { flex: 1, borderTopWidth: 5, gap: 8, padding: 14 },
  playerName: { fontSize: 17, fontWeight: "800" },
  stat: { alignItems: "center" },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 15, fontWeight: "700" },
  statBig: { fontSize: 30, fontWeight: "800" },
  turn: { flexDirection: "row", alignItems: "center", gap: 8, width: "100%" },
  turnNum: { width: 22, fontSize: 12, textAlign: "right", fontVariant: ["tabular-nums"] },
  turnName: { width: 70, fontSize: 13, fontWeight: "700" },
  barTrack: { flex: 1, height: 12 },
  bar: { height: 12, borderRadius: 6 },
  barTimedOut: { opacity: 0.45 },
  turnTime: { width: 52, fontSize: 13, textAlign: "right", fontVariant: ["tabular-nums"] },
  footnote: { fontSize: 12, alignSelf: "flex-start" },
});
