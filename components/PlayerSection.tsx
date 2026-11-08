import { Pressable, StyleSheet, Text, View } from "react-native";
import { PlayerColors } from "@/constants/Colors";
import Timer from "./Timer";
import useTranslation from "@/hooks/useTranslation";

type PlayerSectionProps = {
  playerName?: string;
  subject?: string;
  playerTimer?: number;
  gameTimer?: number;
  wins?: number;
  myTurn?: boolean;
  /** The other player is on turn: draw this half dimmed */
  waiting?: boolean;
  playerPress?: () => void;
  color?: "red" | "blue";
  /** Rotate 180° so a player sitting across the device can read it */
  flipped?: boolean;
};

// The whole half is the button, so it is easy to hit without looking.
export default function PlayerSection(props: PlayerSectionProps) {
  const {
    playerName = "Player",
    subject,
    playerTimer = 0,
    gameTimer = 1,
    wins = 0,
    myTurn = false,
    waiting = false,
    playerPress = () => {},
    color = "red",
    flipped = false,
  } = props;

  const palette = PlayerColors[color];
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={playerPress}
      accessibilityRole="button"
      accessibilityLabel={`${playerName}, ${t.seconds(playerTimer.toFixed(1))}`}
      style={({ pressed }) => [
        styles.section,
        {
          backgroundColor: waiting ? palette.dim : palette.main,
          opacity: pressed ? 0.9 : 1,
          transform: [{ rotate: flipped ? "180deg" : "0deg" }],
        },
        myTurn && styles.activeBorder,
      ]}
    >
      {subject && (
        <View style={styles.topicPill}>
          <Text style={styles.topicLabel}>{t.topic}</Text>
          <Text style={styles.topic}>{subject}</Text>
        </View>
      )}

      <Timer timer={playerTimer} myTurn={myTurn} progress={playerTimer / gameTimer} />

      <View style={styles.nameRow}>
        <Text style={styles.name} numberOfLines={1}>
          {playerName}
        </Text>
        <View style={styles.winsPill}>
          <Text style={styles.wins}>🏆 {wins}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeBorder: { borderWidth: 4, borderColor: "#FDE047" },
  topicPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 8,
    maxWidth: "100%",
  },
  topicLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" },
  topic: { color: "#fff", fontSize: 28, fontWeight: "800", writingDirection: "rtl", textAlign: "center" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 10, maxWidth: "100%" },
  name: { color: "#fff", fontSize: 24, fontWeight: "700", flexShrink: 1 },
  winsPill: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  wins: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
