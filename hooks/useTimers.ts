import { useCallback, useContext, useEffect, useRef, useState } from "react";
import MainContext from "@/contexts/MainContext";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import useSelectWinner from "./useSelectWinner";
import { getPreferences } from "./usePreferences";
import type { Turn } from "./useHistory";
import PlayerHelpers from "@/utils/PlayerHelpers";
import { PlayerTimers, PlayerType } from "@/types";

// Haptics are unavailable on web; ignore the rejection there.
const buzz = (style = Haptics.ImpactFeedbackStyle.Light) => {
  if (getPreferences().vibration === "on") Haptics.impactAsync(style).catch(() => {});
};
const buzzWin = () => {
  if (getPreferences().vibration === "on")
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
};

export type GameResult = {
  winner: PlayerType;
  startedAt: number;
  endedAt: number;
  finalTimers: PlayerTimers;
  turns: Turn[];
};

export default function useTimers(options: { onGameEnd?: (result: GameResult) => void } = {}) {
  const { gameTimer } = useContext(MainContext);
  const playerTime = gameTimer / 2;

  const defaultPlayerTimer: PlayerTimers = [playerTime, playerTime];
  // Player1's first score, Player2's second score
  const [playerTimers, setPlayerTimers] =
    useState<PlayerTimers>(defaultPlayerTimer);
  // Whose time is currently draining
  const [startPlayer, setStartPlayer] = useState<PlayerType | null>(null);
  const [paused, setPaused] = useState(false);
  const [winner, setWinner] = useState<PlayerType | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout>();
  // Turn log for the history screen; a ref because it changes every tick.
  const turnsRef = useRef<Turn[]>([]);
  const startedAtRef = useRef(0);

  const handleStartPlayer = (player: PlayerType) => {
    if (paused || winner !== null) return;
    if (startPlayer === null) {
      startedAtRef.current = Date.now();
      turnsRef.current = [{ player, duration: 0 }];
      setStartPlayer(player);
      buzz();
      return;
    }
    // Only the player whose time is draining can pass the turn.
    if (player !== startPlayer) return;
    const next = PlayerHelpers.getOppositePlayer(player);
    turnsRef.current.push({ player: next, duration: 0 });
    setStartPlayer(next);
    buzz();
  };

  const handleReset = () => {
    setStartPlayer(null);
    setPaused(false);
    setWinner(null);
    setPlayerTimers(defaultPlayerTimer);
    turnsRef.current = [];
  };

  const togglePause = () => {
    if (startPlayer === null || winner !== null) return;
    buzz();
    setPaused((p) => !p);
  };

  const handleWinner = (player: PlayerType) => {
    setStartPlayer(null);
    setWinner(player);
    buzzWin();
    options.onGameEnd?.({
      winner: player,
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      finalTimers: playerTimers,
      turns: turnsRef.current.map((t) => ({ ...t, duration: PlayerHelpers.parseTimer(t.duration) })),
    });
  };

  useFocusEffect(
    useCallback(() => {
      handleReset();
    }, [gameTimer])
  );

  useSelectWinner({
    playerTimers,
    onWinner: handleWinner,
  });

  useEffect(() => {
    if (startPlayer !== null && !paused) {
      // Use real elapsed time: intervals run late on busy devices.
      let last = Date.now();
      intervalIdRef.current = setInterval(() => {
        const now = Date.now();
        const step = (now - last) / 1000;
        last = now;
        const turn = turnsRef.current[turnsRef.current.length - 1];
        if (turn) turn.duration += step;
        setPlayerTimers((playerTimers) =>
          new PlayerHelpers(
            playerTimers,
            startPlayer,
            gameTimer,
            step
          ).getPlayerTimer()
        );
      }, 30);
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [startPlayer, paused]);

  return {
    handleStartPlayer,
    handleReset,
    togglePause,
    startPlayer,
    playerTimers,
    paused,
    winner,
  };
}
