import { useCallback, useContext, useEffect, useRef, useState } from "react";
import MainContext from "@/contexts/MainContext";
import { useFocusEffect } from "@react-navigation/native";
import useSelectWinner from "./useSelectWinner";
import PlayerHelpers from "@/utils/PlayerHelpers";
import { PlayerTimers, PlayerType } from "@/types";

export default function useTimers() {
  const { gameTimer, playerNames } = useContext(MainContext);
  const playerTime = gameTimer / 2;

  const defaultPlayerTimer: PlayerTimers = [playerTime, playerTime];
  // Player1's first score, Player2's second score
  const [playerTimers, setPlayerTimers] =
    useState<PlayerTimers>(defaultPlayerTimer);
  // Who is the player that will start?
  const [startPlayer, setStartPlayer] = useState<PlayerType | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout>();

  const handleStartPlayer = (player: PlayerType) => {
    const oppositePlayer = PlayerHelpers.getOppositePlayer(player);
    setStartPlayer(startPlayer === null ? player : oppositePlayer);
  };

  const handleReset = () => {
    setStartPlayer(null);
    setPlayerTimers(defaultPlayerTimer);
  };

  const handleWinner = (winner: PlayerType) => {
    handleReset();
    alert(`The Winner is ${playerNames[winner]}`);
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
    if (startPlayer !== null) {
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
  }, [startPlayer]);

  return { handleStartPlayer, startPlayer, playerTimers };
}
