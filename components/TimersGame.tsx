import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import PlayerSection from "./PlayerSection";
import AppButton from "./button/AppButton";
import { useContext } from "react";
import MainContext from "@/contexts/MainContext";
import { useSubject, useTimers, useTranslation } from "@/hooks";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors, PlayerColors } from "@/constants/Colors";

export default function TimersGame() {
  const theme = Colors[useColorScheme() ?? "light"];
  const { t } = useTranslation();

  const { playerNames, gameTimer } = useContext(MainContext);

  const {
    playerTimers,
    handleStartPlayer,
    handleReset,
    togglePause,
    startPlayer,
    paused,
    winner,
    wins,
  } = useTimers();
  const { subject, nextSubject } = useSubject();

  const newRound = () => {
    handleReset();
    nextSubject();
  };

  const running = startPlayer !== null && !paused;
  const status = startPlayer === null ? t.tapToStart : paused ? t.paused : t.go;
  const winnerColor = winner === 0 ? PlayerColors.blue.main : PlayerColors.red.main;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <PlayerSection
        color="red"
        playerName={playerNames[1]}
        subject={subject}
        playerTimer={playerTimers[1]}
        gameTimer={gameTimer}
        wins={wins[1]}
        playerPress={() => handleStartPlayer(1)}
        myTurn={running && startPlayer === 1}
        waiting={running && startPlayer === 0}
        flipped
      />

      <View style={[styles.controls, { backgroundColor: theme.surface }]}>
        <ControlButton
          icon={paused ? "play" : "pause"}
          label={paused ? t.resume : t.pause}
          color={theme.text}
          disabled={startPlayer === null}
          onPress={togglePause}
        />
        <Text style={[styles.status, { color: theme.text }]}>{status}</Text>
        <View style={styles.row}>
          <ControlButton
            icon="shuffle"
            label={t.newTopic}
            color={theme.text}
            disabled={startPlayer !== null}
            onPress={nextSubject}
          />
          <ControlButton icon="refresh" label={t.reset} color={theme.text} onPress={newRound} />
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
        myTurn={running && startPlayer === 0}
        waiting={running && startPlayer === 1}
      />

      <Modal visible={winner !== null} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.card, { backgroundColor: theme.background, borderColor: winnerColor }]}>
            <Text style={styles.trophy}>🏆</Text>
            <Text style={[styles.winnerText, { color: winnerColor }]}>
              {winner !== null && t.wins(playerNames[winner])}
            </Text>
            <View style={[styles.scoreBox, { backgroundColor: theme.surface }]}>
              <Score name={playerNames[0]} wins={wins[0]} color={PlayerColors.blue.main} />
              <Text style={[styles.scoreDash, { color: theme.icon }]}>–</Text>
              <Score name={playerNames[1]} wins={wins[1]} color={PlayerColors.red.main} />
            </View>
            <AppButton
              color={winnerColor}
              onPress={newRound}
              style={styles.again}
              textProps={{ style: { fontSize: 18, fontWeight: "bold" } }}
            >
              {t.playAgain}
            </AppButton>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Score(props: { name: string; wins: number; color: string }) {
  return (
    <View style={styles.scoreCol}>
      <Text style={[styles.scoreNum, { color: props.color }]}>{props.wins}</Text>
      <Text style={[styles.scoreName, { color: props.color }]} numberOfLines={1}>
        {props.name}
      </Text>
    </View>
  );
}

function ControlButton(props: {
  icon: "play" | "pause" | "refresh" | "shuffle";
  label: string;
  color: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  const { icon, label, color, disabled, onPress } = props;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [
        styles.iconBtn,
        { borderColor: color, opacity: disabled ? 0.3 : pressed ? 0.5 : 1 },
      ]}
    >
      <Ionicons name={icon} size={22} color={color} />
    </Pressable>
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
  status: { fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  row: { flexDirection: "row", gap: 12 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "82%",
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 3,
    padding: 24,
    alignItems: "center",
    gap: 14,
  },
  trophy: { fontSize: 72 },
  winnerText: { fontSize: 30, fontWeight: "800", textAlign: "center" },
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    borderRadius: 16,
    paddingVertical: 12,
  },
  scoreCol: { alignItems: "center", flex: 1 },
  scoreNum: { fontSize: 36, fontWeight: "800" },
  scoreName: { fontSize: 14, fontWeight: "600" },
  scoreDash: { fontSize: 28 },
  again: { width: "100%", paddingVertical: 14, borderRadius: 14 },
});
