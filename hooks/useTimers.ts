import { useCallback, useContext, useEffect, useRef, useState } from "react";
import MainContext from "@/contexts/MainContext";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import useSelectWinner from "./useSelectWinner";
import PlayerHelpers from "@/utils/PlayerHelpers";
import { PlayerTimers, PlayerType } from "@/types";

// Haptics are unavailable on web; ignore the rejection there.
const buzz = (style = Haptics.ImpactFeedbackStyle.Light) =>
  Haptics.impactAsync(style).catch(() => {});

export default function useTimers() {
  const { gameTimer } = useContext(MainContext);
  const playerTime = gameTimer / 2;

  const defaultPlayerTimer: PlayerTimers = [playerTime, playerTime];
  // Player1's first score, Player2's second score
  const [playerTimers, setPlayerTimers] =
    useState<PlayerTimers>(defaultPlayerTimer);
  // Who is the player that will start?
  const [startPlayer, setStartPlayer] = useState<PlayerType | null>(null);
  const [paused, setPaused] = useState(false);
  const [winner, setWinner] = useState<PlayerType | null>(null);
  const [wins, setWins] = useState<[number, number]>([0, 0]);
  const intervalIdRef = useRef<NodeJS.Timeout>();

  const handleStartPlayer = (player: PlayerType) => {
    if (paused || winner !== null) return;
    buzz();
    const oppositePlayer = PlayerHelpers.getOppositePlayer(player);
    setStartPlayer(startPlayer === null ? player : oppositePlayer);
  };

  const handleReset = () => {
    setStartPlayer(null);
    setPaused(false);
    setWinner(null);
    setPlayerTimers(defaultPlayerTimer);
  };

  const togglePause = () => {
    if (startPlayer === null || winner !== null) return;
    buzz();
    setPaused((p) => !p);
  };

  const handleWinner = (player: PlayerType) => {
    setStartPlayer(null);
    setWinner(player);
    setWins((w) => (player === 0 ? [w[0] + 1, w[1]] : [w[0], w[1] + 1]));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
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
      intervalIdRef.current = setInterval(() => {
        setPlayerTimers((playerTimers) =>
          new PlayerHelpers(
            playerTimers,
            startPlayer,
            gameTimer
          ).getPlayerTimer()
        );
      }, 10);
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
    wins,
  };
}
