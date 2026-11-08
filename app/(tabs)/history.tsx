import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHistory, usePreferences, useTranslation } from "@/hooks";
import type { GameRecord } from "@/hooks";
import { useTheme } from "@/hooks/useColorScheme";
import { PlayerColors } from "@/constants/Colors";
import { formatDate, leaderboard, playTime } from "@/utils/gameStats";
import { Card, CardTitle } from "@/components/ui";

const colorOf = (p: 0 | 1) => (p === 0 ? PlayerColors.blue.main : PlayerColors.red.main);

export default function History() {
  const theme = useTheme();
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <FlatList
        data={history}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{t.history}</Text>
            {history.length > 0 && (
              <Text style={[styles.count, { color: theme.icon }]}>
                {t.gamesPlayed}: {history.length}
              </Text>
            )}
            {history.length > 0 && <Leaderboard />}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={64} color={theme.icon} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>{t.noGames}</Text>
            <Text style={[styles.emptyHint, { color: theme.icon }]}>{t.noGamesHint}</Text>
          </View>
        }
        renderItem={({ item }) => <GameRow record={item} />}
      />
    </SafeAreaView>
  );
}

const MEDALS = ["🥇", "🥈", "🥉"];

function Leaderboard() {
  const theme = useTheme();
  const { t } = useTranslation();
  const rows = leaderboard(useHistory()).slice(0, 5);
  return (
    <Card style={styles.board}>
      <CardTitle>{t.leaderboard}</CardTitle>
      {rows.map((row, i) => (
        <View key={row.name} style={styles.boardRow}>
          <Text style={styles.medal}>{MEDALS[i] ?? `${i + 1}.`}</Text>
          <Text style={[styles.boardName, { color: theme.text }]} numberOfLines={1}>
            {row.name}
          </Text>
          <Text style={[styles.boardStat, { color: theme.text }]}>
            {row.wins} {t.winsShort}
          </Text>
          <Text style={[styles.boardStat, { color: theme.icon }]}>
            {row.games} {t.gamesShort}
          </Text>
        </View>
      ))}
    </Card>
  );
}

function GameRow({ record }: { record: GameRecord }) {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = usePreferences();
  const loser = record.winner === 0 ? 1 : 0;

  return (
    <Pressable
      onPress={() => router.push(`/history/${record.id}`)}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.surface, borderLeftColor: colorOf(record.winner) },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={styles.rowMain}>
        <Text style={[styles.result, { color: theme.text }]} numberOfLines={1}>
          <Text style={{ color: colorOf(record.winner), fontWeight: "800" }}>🏆 {record.players[record.winner]}</Text>
          {"  "}
          <Text style={{ color: theme.icon }}>{t.beat}</Text>
          {"  "}
          <Text style={{ color: colorOf(loser), fontWeight: "700" }}>{record.players[loser]}</Text>
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.topic, { color: theme.text, backgroundColor: theme.background }]}>{record.topic}</Text>
          <Text style={[styles.metaText, { color: theme.icon }]}>
            ⏱ {t.sec(playTime(record))} · {t.totalTurns}: {record.turns.length}
          </Text>
        </View>
        <Text style={[styles.date, { color: theme.icon }]}>{formatDate(record.endedAt, language)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10, flexGrow: 1 },
  header: { marginBottom: 6, gap: 8 },
  board: { maxWidth: undefined, gap: 8 },
  boardRow: { flexDirection: "row", alignItems: "center", gap: 10, width: "100%" },
  medal: { width: 28, fontSize: 18, textAlign: "center" },
  boardName: { flex: 1, fontSize: 16, fontWeight: "700" },
  boardStat: { width: 52, fontSize: 14, fontWeight: "600", textAlign: "right", fontVariant: ["tabular-nums"] },
  title: { fontSize: 30, fontWeight: "800" },
  count: { fontSize: 14 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: "700" },
  emptyHint: { fontSize: 15, textAlign: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderLeftWidth: 5,
    padding: 14,
    gap: 8,
  },
  rowMain: { flex: 1, gap: 6 },
  result: { fontSize: 16 },
  meta: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  topic: { fontSize: 14, fontWeight: "700", paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, overflow: "hidden" },
  metaText: { fontSize: 13 },
  date: { fontSize: 12 },
});
