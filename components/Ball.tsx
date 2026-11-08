import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const SIZE = 44;

type BallProps = {
  /** -1 = fully on the top player, 1 = fully on the bottom player, 0 = middle */
  offset: number;
  /** Game over: the ball has landed on the loser, play the impact bounce */
  landed: boolean;
};

// Rolls toward whoever is losing; draws over the game but never blocks taps.
export default function Ball({ offset, landed }: BallProps) {
  const [height, setHeight] = useState(0);
  const bounce = useRef(new Animated.Value(0)).current;
  const squash = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!landed) {
      bounce.setValue(0);
      squash.setValue(1);
      return;
    }
    const hop = (to: number, ms: number) =>
      Animated.timing(bounce, { toValue: to, duration: ms, easing: Easing.out(Easing.quad), useNativeDriver: true });
    const fall = (ms: number) =>
      Animated.timing(bounce, { toValue: 0, duration: ms, easing: Easing.in(Easing.quad), useNativeDriver: true });
    const impact = Animated.sequence([
      Animated.timing(squash, { toValue: 0.7, duration: 70, useNativeDriver: true }),
      Animated.spring(squash, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]);
    Animated.parallel([
      impact,
      Animated.sequence([hop(90, 220), fall(220), hop(35, 150), fall(150), hop(10, 90), fall(90)]),
    ]).start();
  }, [landed]);

  // Stop ~80% of the way so the ball lands inside the loser's half, not on the edge.
  const range = Math.max(0, (height / 2) * 0.8 - SIZE / 2);
  const clamped = Math.max(-1, Math.min(1, offset));
  const y = clamped * range;
  const away = clamped >= 0 ? -1 : 1; // bounce back toward the middle

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      {height > 0 && (
        <Animated.View
          style={[
            styles.ball,
            {
              top: height / 2 - SIZE / 2,
              transform: [
                { translateY: y },
                { translateY: Animated.multiply(bounce, away) },
                { scaleY: squash },
                { scaleX: Animated.subtract(2, squash) },
              ],
            },
          ]}
        >
          {/* Seams rotate with distance travelled, so the ball visibly rolls. */}
          <View style={[styles.seams, { transform: [{ rotate: `${y * 4}deg` }] }]}>
            <View style={styles.seamH} />
            <View style={styles.seamV} />
          </View>
          <View style={styles.shine} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ball: {
    position: "absolute",
    left: "50%", // centre of the control bar, between the pause and right-hand buttons
    marginLeft: -SIZE / 2,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: "#F97316",
    borderWidth: 2,
    borderColor: "#7C2D12",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  seams: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" },
  seamH: { position: "absolute", width: "100%", height: 2, backgroundColor: "#7C2D12" },
  seamV: { position: "absolute", height: "100%", width: 2, backgroundColor: "#7C2D12" },
  shine: {
    position: "absolute",
    top: 8,
    left: 10,
    width: 14,
    height: 9,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
});
