import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import useTranslation from "@/hooks/useTranslation";

export type TimerProps = {
  timer: number;
  myTurn?: boolean;
  /** 0..1 share of the total game time this player holds */
  progress?: number;
  hint?: string;
};

// Drawn on top of the player's coloured half, so it is always white (yellow when low).
export default function Timer(props: TimerProps) {
  const { timer, myTurn, progress = 0.5, hint } = props;
  const { t, isRTL } = useTranslation();
  const pulse = useRef(new Animated.Value(1)).current;
  const color = progress < 0.2 ? "#FDE047" : "#fff";

  useEffect(() => {
    if (!myTurn) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [myTurn]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.time, { color, transform: [{ scale: pulse }] }]}>
        {timer.toFixed(2)}
      </Animated.Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.min(progress, 1) * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
      {/* letterSpacing breaks Arabic letter joining */}
      <Text style={[styles.hint, isRTL && styles.noSpacing]}>{myTurn ? t.sayOneThenTap : hint ?? " "}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", width: "100%", gap: 10 },
  time: {
    fontSize: 64,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  track: {
    width: "75%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 5 },
  hint: { color: "#fff", fontSize: 13, fontWeight: "700", letterSpacing: 1.5 },
  noSpacing: { letterSpacing: 0, fontSize: 15 },
});
