import { Modal, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import PlayerSection from "./PlayerSection";
import Ball from "./Ball";
import { IconButton, PrimaryButton } from "./ui";
import MainContext from "@/contexts/MainContext";
import { addRecord, useHistory, useSubject, useTimers, useTranslation } from "@/hooks";
import type { GameResult } from "@/hooks/useTimers";
import { useTheme } from "@/hooks/useColorScheme";
import { PlayerColors } from "@/constants/Colors";
import { headToHead, playerStats } from "@/utils/gameStats";

export default function TimersGame() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useTranslation();

  const { playerNames, gameTimer } = useContext(MainContext);
  const { subject, nextSubject } = useSubject();
  const history = useHistory();
  const wins = headToHead(history, playerNames);

  const [lastRecordId, setLastRecordId] = useState<string | null>(null);
  const onGameEnd = (result: GameResult) => {
    const id = `${result.endedAt}-${Math.random().toString(36).slice(2, 7)}`;
    addRecord({ id, players: playerNames, topic: subject, gameTimer, ...result });
    setLastRecordId(id);
  };

  const {
    playerTimers,
    handleStartPlayer,
    handleReset,
    togglePause,
    startPlayer,
    paused,
    winner,
  } = useTimers({ onGameEnd });

  const newRound = () => {
    handleReset();
    nextSubject();
  };

  // Let the ball land on the loser before the result covers the board.
  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    if (winner === null) return setShowResult(false);
    const id = setTimeout(() => setShowResult(true), 1100);
    return () => clearTimeout(id);
  }, [winner]);

  const running = startPlayer !== null && !paused;
  const hint = startPlayer === null ? t.tapToStart : paused ? t.paused : undefined;
  const winnerColor = winner === 0 ? PlayerColors.blue.main : PlayerColors.red.main;
  const lastRecord = history.find((r) => r.id === lastRecordId);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />
      {/* Safe-area strips in each player's colour so the halves reach the screen edges. */}
      <View style={{ height: insets.top, backgroundColor: running && startPlayer === 0 ? PlayerColors.red.dim : PlayerColors.red.main }} />
      <PlayerSection
        color="red"
        playerName={playerNames[1]}
        subject={subject}
        playerTimer={playerTimers[1]}
        gameTimer={gameTimer}
        wins={wins[1]}
        playerPress={() => handleStartPlayer(1)}
        hint={hint}
        myTurn={running && startPlayer === 1}
        waiting={running && startPlayer === 0}
        hit={winner === 0}
        flipped
      />

      <View style={[styles.controls, { backgroundColor: theme.surface }]}>
        <IconButton
          icon={paused ? "play" : "pause"}
          label={paused ? t.resume : t.pause}
          disabled={startPlayer === null}
          onPress={togglePause}
          size={40}
        />
        <View style={styles.row}>
          <IconButton
            icon="shuffle"
            label={t.newTopic}
            disabled={startPlayer !== null}
            onPress={nextSubject}
            size={40}
          />
          <IconButton icon="refresh" label={t.reset} onPress={newRound} size={40} />
          <IconButton icon="close" label={t.exit} onPress={() => router.back()} size={40} />
        </View>
      </View>

      <PlayerSection
        color="blue"
        playerName={playerNames[0]}
        subject={subject}
        playerTimer={playerTimers[0]}
        gameTimer={gameTimer}
        wins={wins[0]}
        playerPress={() => handleStartPlayer(0)}
        hint={hint}
        myTurn={running && startPlayer === 0}
        waiting={running && startPlayer === 1}
        hit={winner === 1}
      />
      <View style={{ height: insets.bottom, backgroundColor: running && startPlayer === 1 ? PlayerColors.blue.dim : PlayerColors.blue.main }} />

      {/* Positive = blue (bottom) has less time, so the ball rolls down onto them. */}
      <Ball offset={(playerTimers[1] - playerTimers[0]) / gameTimer} landed={winner !== null} />

      <Modal visible={showResult} transparent animationType="fade" onRequestClose={newRound}>
        <View style={styles.overlay}>
          <View style={[styles.card, { backgroundColor: theme.background, borderColor: winnerColor }]}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={[styles.winnerText, { color: winnerColor, writingDirection: isRTL ? "rtl" : "ltr" }]}>
              {winner !== null && t.wins(playerNames[winner])}
            </Text>

            <View style={[styles.scoreBox, { backgroundColor: theme.surface }]}>
              {([0, 1] as const).map((p) => (
                <View key={p} style={styles.scoreCol}>
                  <Text style={[styles.scoreNum, { color: p === 0 ? PlayerColors.blue.main : PlayerColors.red.main }]}>
                    {wins[p]}
                  </Text>
                  <Text style={[styles.scoreName, { color: theme.text }]} numberOfLines={1}>
                    {playerNames[p]}
                  </Text>
                  {lastRecord && (
                    <Text style={[styles.scoreDetail, { color: theme.icon }]}>
                      {t.answers}: {playerStats(lastRecord, p).answers}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            <PrimaryButton label={t.playAgain} icon="refresh" color={winnerColor} onPress={newRound} />
            <View style={styles.row}>
              {lastRecordId && (
                <IconButton
                  icon="stats-chart"
                  label={t.viewDetails}
                  onPress={() => {
                    // The modal belongs to this screen and would cover the details page.
                    newRound();
                    router.push(`/history/${lastRecordId}`);
                  }}
                />
              )}
              <IconButton icon="home" label={t.menu} onPress={() => router.back()} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: { flexDirection: "row", gap: 10 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "86%",
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 3,
    padding: 22,
    alignItems: "center",
    gap: 14,
  },
  trophy: { fontSize: 64 },
  winnerText: { fontSize: 28, fontWeight: "800", textAlign: "center" },
  scoreBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 12,
  },
  scoreCol: { alignItems: "center", flex: 1, gap: 2 },
  scoreNum: { fontSize: 34, fontWeight: "800" },
  scoreName: { fontSize: 14, fontWeight: "700" },
  scoreDetail: { fontSize: 12 },
});
